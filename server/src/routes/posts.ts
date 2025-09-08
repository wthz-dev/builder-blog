import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// GET /api/posts - list posts
router.get('/', async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
        comments: true,
      },
      orderBy: { publishedAt: 'desc' },
    })
    res.json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// GET /api/posts/id/:id - get a single post by id
router.get('/id/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
        comments: { include: { author: { select: { id: true, name: true } } } },
      },
    })

    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// GET /api/posts/exists/:slug - check if a slug already exists
router.get('/exists/:slug', async (req, res) => {
  try {
    const found = await prisma.post.findUnique({ where: { slug: req.params.slug } })
    res.json({ exists: !!found })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to check slug' })
  }
})

// GET /api/posts/:slug - get a single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
        categories: { include: { category: true } },
        comments: { include: { author: { select: { id: true, name: true } } } },
      },
    })

    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// POST /api/posts - create a post (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { slug, title, excerpt, content, tags, categories, coverImageUrl } = req.body as {
      slug: string
      title: string
      excerpt: string
      content: string
      tags?: string[]
      categories?: string[]
      coverImageUrl?: string
    }

    if (!slug || !title || !excerpt || !content) {
      return res.status(400).json({ error: 'slug, title, excerpt, content are required' })
    }

    const result = await prisma.$transaction(async (tx) => {
      // ensure unique slug
      const existing = await tx.post.findUnique({ where: { slug } })
      if (existing) throw Object.assign(new Error('Slug already exists'), { status: 409 })

      // upsert tags/categories if provided
      const tagRecords = tags && tags.length
        ? await Promise.all(
            tags.map((name) =>
              tx.tag.upsert({
                where: { name },
                update: {},
                create: { name },
              })
            )
          )
        : []

      const categoryRecords = categories && categories.length
        ? await Promise.all(
            categories.map((name) =>
              tx.category.upsert({
                where: { name },
                update: {},
                create: { name },
              })
            )
          )
        : []

      const created = await tx.post.create({
        data: {
          slug,
          title,
          excerpt,
          content,
          coverImageUrl: coverImageUrl ?? null,
          authorId: req.auth!.userId,
        },
      })

      if (tagRecords.length) {
        await tx.postTag.createMany({
          data: tagRecords.map((t) => ({ postId: created.id, tagId: t.id })),
          skipDuplicates: true,
        })
      }

      if (categoryRecords.length) {
        await tx.postCategory.createMany({
          data: categoryRecords.map((c) => ({ postId: created.id, categoryId: c.id })),
          skipDuplicates: true,
        })
      }

      return created
    })

    return res.status(201).json(result)
  } catch (err: any) {
    console.error(err)
    const status = err?.status ?? 500
    const message = status === 409 ? 'Slug already exists' : 'Failed to create post'
    res.status(status).json({ error: message })
  }
})

// PUT /api/posts/:id - update a post (protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { slug, title, excerpt, content, tags, categories, coverImageUrl } = req.body as {
      slug?: string
      title?: string
      excerpt?: string
      content?: string
      tags?: string[]
      categories?: string[]
      coverImageUrl?: string | null
    }

    const exists = await prisma.post.findUnique({ where: { id } })
    if (!exists) return res.status(404).json({ error: 'Post not found' })

    const result = await prisma.$transaction(async (tx) => {
      // ensure slug uniqueness if changed
      if (slug && slug !== exists.slug) {
        const dup = await tx.post.findUnique({ where: { slug } })
        if (dup) throw Object.assign(new Error('Slug already exists'), { status: 409 })
      }

      const updated = await tx.post.update({
        where: { id },
        data: {
          slug: slug ?? exists.slug,
          title: title ?? exists.title,
          excerpt: excerpt ?? exists.excerpt,
          content: content ?? exists.content,
          coverImageUrl: typeof coverImageUrl === 'undefined' ? exists.coverImageUrl : coverImageUrl,
        },
      })

      // replace tags if provided
      if (Array.isArray(tags)) {
        await tx.postTag.deleteMany({ where: { postId: id } })
        if (tags.length) {
          const tagRecords = await Promise.all(
            tags.map((name) =>
              tx.tag.upsert({ where: { name }, update: {}, create: { name } })
            )
          )
          await tx.postTag.createMany({
            data: tagRecords.map((t) => ({ postId: id, tagId: t.id })),
            skipDuplicates: true,
          })
        }
      }

      // replace categories if provided
      if (Array.isArray(categories)) {
        await tx.postCategory.deleteMany({ where: { postId: id } })
        if (categories.length) {
          const catRecords = await Promise.all(
            categories.map((name) =>
              tx.category.upsert({ where: { name }, update: {}, create: { name } })
            )
          )
          await tx.postCategory.createMany({
            data: catRecords.map((c) => ({ postId: id, categoryId: c.id })),
            skipDuplicates: true,
          })
        }
      }

      return updated
    })

    return res.json(result)
  } catch (err: any) {
    console.error(err)
    const status = err?.status ?? 500
    const message = status === 409 ? 'Slug already exists' : 'Failed to update post'
    res.status(status).json({ error: message })
  }
})

// DELETE /api/posts/:id - delete a post (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const exists = await prisma.post.findUnique({ where: { id } })
    if (!exists) return res.status(404).json({ error: 'Post not found' })

    await prisma.$transaction(async (tx) => {
      await tx.postTag.deleteMany({ where: { postId: id } })
      await tx.postCategory.deleteMany({ where: { postId: id } })
      await tx.comment.deleteMany({ where: { postId: id } })
      await tx.post.delete({ where: { id } })
    })

    return res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

export default router
