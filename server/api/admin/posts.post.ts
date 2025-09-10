import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'
import { readFormData, sendRedirect } from 'h3'
import { createHash } from 'crypto'

export default defineEventHandler(async (event) => {
  // 1) AuthN: verify JWT from cookie
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const secret = config.jwtSecret as string | undefined
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' })
  }
  let decoded: any
  try {
    decoded = jwt.verify(token, secret) as any
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  // 2) AuthZ: make sure role is ADMIN
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  // 3) Parse classic web form data
  const form = await readFormData(event)
  const title = String(form.get('title') || '').trim()
  const slug = String(form.get('slug') || '').trim()
  const excerpt = String(form.get('excerpt') || '').trim()
  const content = String(form.get('content') || '').trim()
  let coverImageUrl = String(form.get('coverImageUrl') || '') || null
  const publishNow = form.get('publishNow') !== null
  // New: tags & categories from form (comma-separated names)
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

  // 3.1) Optional: Upload file to Cloudinary if provided (field name: coverImage)
  const coverImageFile = form.get('coverImage') as File | null
  if (coverImageFile && coverImageFile.size > 0) {
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
    body.append('file', coverImageFile)
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

  // 4) Create post + relations within a transaction
  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        coverImageUrl,
        authorId: user.id,
        publishedAt: publishNow ? new Date() : null,
      },
    })

    // Upsert Categories and Tags by name, then create relations
    if (categoryNames.length > 0) {
      const categories = await Promise.all(
        categoryNames.map((name) =>
          tx.category.upsert({
            where: { name },
            update: {},
            create: { name }
          })
        )
      )
      await tx.postCategory.createMany({
        data: categories.map((c) => ({ postId: created.id, categoryId: c.id })),
        skipDuplicates: true
      })
    }

    if (tagNames.length > 0) {
      const tags = await Promise.all(
        tagNames.map((name) =>
          tx.tag.upsert({
            where: { name },
            update: {},
            create: { name }
          })
        )
      )
      await tx.postTag.createMany({
        data: tags.map((t) => ({ postId: created.id, tagId: t.id })),
        skipDuplicates: true
      })
    }

    return created
  })

  // 5) Redirect to the new post page (fallback to home)
  try {
    return await sendRedirect(event, `/post/${post.slug}`, 302)
  } catch {
    return { ok: true, postId: post.id, slug: post.slug }
  }
})
