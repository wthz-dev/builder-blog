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

  if (!title || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'Title and slug are required' })
  }

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

  // Build update data (do not overwrite coverImageUrl if undefined and no URL given)
  const data: any = {
    title,
    slug,
    excerpt: excerpt || null,
    content: content || null,
    publishedAt: publishNow ? new Date() : null,
  }
  if (typeof coverImageUrl !== 'undefined' && coverImageUrl !== '') {
    data.coverImageUrl = coverImageUrl
  }

  const updated = await prisma.post.update({ where: { id }, data })
  try {
    return await sendRedirect(event, `/admin/posts/${updated.id}/edit?updated=1`, 302)
  } catch {
    return { ok: true, id: updated.id, slug: updated.slug }
  }
})
