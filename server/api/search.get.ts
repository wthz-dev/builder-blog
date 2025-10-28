import { defineEventHandler, getQuery } from 'h3'
import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const q = String(getQuery(event).q || '').trim()
  const page = Math.max(1, parseInt(String(getQuery(event).page || '1')))
  const pageSize = Math.max(1, Math.min(24, parseInt(String(getQuery(event).pageSize || '12'))))

  if (!q) {
    return { posts: [], total: 0, totalPages: 1, page, pageSize }
  }

  // Simple full-text style search across title, content, tags, categories
  // Uses contains (case-insensitive) for demo purposes
  const where = {
    publishedAt: { lte: new Date() },
    OR: [
      { title: { contains: q, mode: 'insensitive' as const } },
      { content: { contains: q, mode: 'insensitive' as const } },
      { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' as const } } } } },
      { categories: { some: { category: { name: { contains: q, mode: 'insensitive' as const } } } } }
    ]
  }

  const [total, items] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: { select: { name: true } },
        categories: { select: { category: { select: { id: true, name: true } } } },
        tags: { select: { tag: { select: { id: true, name: true } } } },
      }
    })
  ])

  const posts = items.map((p: any) => ({
    ...p,
    categories: p.categories.map((c: any) => c.category),
    tags: p.tags.map((t: any) => t.tag),
  }))

  return {
    posts,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    page,
    pageSize,
  }
})
