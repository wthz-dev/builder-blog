import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'
import { readFormData, sendRedirect } from 'h3'
import { createHash } from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Auth: read token
  const token = getCookie(event, 'auth-token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const secret = config.jwtSecret as string | undefined
  if (!secret) throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' })

  let decoded: any
  try {
    decoded = jwt.verify(token, secret) as any
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  // AuthZ: admin only
  const me = await prisma.user.findUnique({ where: { id: decoded.userId } })
  if (!me || me.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const id = getRouterParam(event, 'id') as string

  const form = await readFormData(event)
  const title = String(form.get('title') || '').trim()
  const slug = String(form.get('slug') || '').trim()
  const excerpt = String(form.get('excerpt') || '').trim()
  const content = String(form.get('content') || '').trim()
  let coverImageUrl = String(form.get('coverImageUrl') || '') || undefined
  const publishNow = form.get('publishNow') !== null
  const removeCover = form.get('removeCover') !== null
  // New: tags & categories
  const categoryNamesRaw = String(form.get('categoryNames') || '').trim()
  const tagNamesRaw = String(form.get('tagNames') || '').trim()
  const categoryNames = categoryNamesRaw
    ? categoryNamesRaw.split(',').map(s => s.trim()).filter(Boolean)
    : []
  const tagNames = tagNamesRaw
    ? tagNamesRaw.split(',').map(s => s.trim()).filter(Boolean)
    : []

  if (!title || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'Title and slug are required' })
  }

  // Load current post to know existing cover (for potential deletion)
  const current = await prisma.post.findUnique({ where: { id }, select: { coverImageUrl: true } })

  // Optional Cloudinary upload if file provided
  const file = form.get('coverImage') as File | null
  if (file && file.size > 0) {
    const cloudName = config.cloudinaryCloudName as string | undefined
    const apiKey = config.cloudinaryApiKey as string | undefined
    const apiSecret = config.cloudinaryApiSecret as string | undefined
    if (!cloudName || !apiKey || !apiSecret) {
      throw createError({ statusCode: 500, statusMessage: 'Cloudinary config not set' })
    }
    const timestamp = Math.floor(Date.now() / 1000)
    const signatureBase = `timestamp=${timestamp}`
    const signature = createHash('sha1').update(signatureBase + apiSecret).digest('hex')

    const body = new FormData()
    body.append('file', file)
    body.append('api_key', apiKey)
    body.append('timestamp', String(timestamp))
    body.append('signature', signature)

    try {
      const uploadRes: any = await $fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body
      })
      if (uploadRes?.secure_url) {
        coverImageUrl = uploadRes.secure_url as string
      }
    } catch (e) {
      console.error('Cloudinary upload failed:', e)
      throw createError({ statusCode: 500, statusMessage: 'Image upload failed' })
    }
  }

  // If user asked to remove old cover (or uploaded a new one), attempt to delete old Cloudinary image
  async function tryDeleteOldCloudinary(url?: string) {
    if (!url) return
    try {
      const cloudName = config.cloudinaryCloudName as string | undefined
      const apiKey = config.cloudinaryApiKey as string | undefined
      const apiSecret = config.cloudinaryApiSecret as string | undefined
      if (!cloudName || !apiKey || !apiSecret) return
      // Only proceed if URL seems to be Cloudinary
      if (!/res\.cloudinary\.com\//.test(url)) return
      // Extract public_id from URL
      const m = url.match(/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/)
      const publicId = m?.[1]
      if (!publicId) return
      const timestamp = Math.floor(Date.now() / 1000)
      const signatureBase = `public_id=${publicId}&timestamp=${timestamp}`
      const signature = createHash('sha1').update(signatureBase + apiSecret).digest('hex')
      const body = new FormData()
      body.append('public_id', publicId)
      body.append('api_key', apiKey)
      body.append('timestamp', String(timestamp))
      body.append('signature', signature)
      await $fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body
      })
    } catch (e) {
      console.warn('Cloudinary destroy failed (ignored):', e)
    }
  }

  // Build update data (do not overwrite coverImageUrl unless needed)
  const data: any = {
    title,
    slug,
    excerpt: excerpt || null,
    content: content || null,
    publishedAt: publishNow ? new Date() : null,
  }

  // Decide how to set coverImageUrl based on removeCover and provided/new URL
  if (removeCover) {
    // Delete old (if any) and set to new URL if provided, else null
    await tryDeleteOldCloudinary(current?.coverImageUrl || undefined)
    if (typeof coverImageUrl === 'string' && coverImageUrl !== '') {
      data.coverImageUrl = coverImageUrl
    } else {
      data.coverImageUrl = null
    }
  } else if (typeof coverImageUrl === 'string' && coverImageUrl !== '') {
    // Replacing without explicit remove; delete old if different
    if (current?.coverImageUrl && current.coverImageUrl !== coverImageUrl) {
      await tryDeleteOldCloudinary(current.coverImageUrl)
    }
    data.coverImageUrl = coverImageUrl
  }

  // Update post and replace relations in a transaction
  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.post.update({ where: { id }, data })

    // Replace categories
    await tx.postCategory.deleteMany({ where: { postId: id } })
    if (categoryNames.length > 0) {
      const cats = await Promise.all(
        categoryNames.map((name) =>
          tx.category.upsert({ where: { name }, update: {}, create: { name } })
        )
      )
      await tx.postCategory.createMany({
        data: cats.map((c) => ({ postId: id, categoryId: c.id })),
        skipDuplicates: true
      })
    }

    // Replace tags
    await tx.postTag.deleteMany({ where: { postId: id } })
    if (tagNames.length > 0) {
      const ts = await Promise.all(
        tagNames.map((name) =>
          tx.tag.upsert({ where: { name }, update: {}, create: { name } })
        )
      )
      await tx.postTag.createMany({
        data: ts.map((t) => ({ postId: id, tagId: t.id })),
        skipDuplicates: true
      })
    }

    return p
  })
  try {
    return await sendRedirect(event, `/admin/posts/${updated.id}/edit?updated=1`, 302)
  } catch {
    return { ok: true, id: updated.id, slug: updated.slug }
  }
})
