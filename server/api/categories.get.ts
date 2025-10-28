import { defineEventHandler } from 'h3'
import { prisma } from '~/lib/prisma'

export default defineEventHandler(async () => {
  // Return categories with post counts
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { posts: true } }
    }
  })

  return {
    categories: categories.map((c) => ({ id: c.id, name: c.name, count: c._count.posts }))
  }
})
