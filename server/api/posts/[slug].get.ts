import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const slugParam = getRouterParam(event, 'slug')
    const slug = slugParam ? slugParam.normalize('NFC') : ''
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Post slug is required'
      })
    }

    const post = await prisma.post.findFirst({
      where: {
        slug
      },
      include: {
        author: {
          select: { name: true }
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
        comments: {
          include: {
            author: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      })
    }

    // Transform the data for response
    const transformedPost = {
      ...post,
      categories: post.categories.map((c: any) => c.category),
      tags: post.tags.map((t: any) => t.tag),
      comments: post.comments.map((comment: any) => ({
        ...comment,
        author: comment.author
      }))
    }

    return transformedPost
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching post:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post'
    })
  }
})
