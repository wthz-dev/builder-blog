import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  try {
    // Get all published posts
    const posts = await prisma.post.findMany({
      select: {
        slug: true,
        publishedAt: true
      },
      orderBy: { publishedAt: 'desc' }
    })

    // Static pages
    const staticPages = [
      { url: '/', lastmod: new Date().toISOString(), priority: '1.0' },
      { url: '/about', lastmod: new Date().toISOString(), priority: '0.8' },
      { url: '/contact', lastmod: new Date().toISOString(), priority: '0.7' }
    ]

    // Dynamic post pages
    const postPages = posts.map(post => ({
      url: `/post/${post.slug}`,
      lastmod: post.publishedAt?.toISOString() || new Date().toISOString(),
      priority: '0.9'
    }))

    const allPages = [...staticPages, ...postPages]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    setHeader(event, 'Content-Type', 'application/xml')
    return sitemap
  } catch (error) {
    console.error('Sitemap generation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate sitemap'
    })
  }
})
