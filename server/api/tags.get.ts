import { prisma } from '~/lib/prisma'

export default defineEventHandler(async () => {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { posts: true } }
    }
  })

  return {
    tags: tags.map((t) => ({ id: t.id, name: t.name, count: t._count.posts }))
  }
})
