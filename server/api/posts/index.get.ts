import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 12
    const category = query.category as string
    const tag = query.tag as string
    const search = query.search as string

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (category) {
      where.categories = {
        some: {
          category: {
            name: category
          }
        }
      }
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag
          }
        }
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Fetch posts with relations
    const posts = await prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    // Get total count for pagination
    const total = await prisma.post.count({ where })

    // Transform the data for response
    const transformedPosts = posts.map(post => ({
      ...post,
      categories: post.categories.map((c: any) => c.category),
      tags: post.tags.map((t: any) => t.tag),
      commentsCount: post._count.comments
    }))

    const totalPages = Math.ceil(total / limit)

    return {
      posts: transformedPosts,
      totalPages,
      currentPage: page,
      totalCount: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
})
