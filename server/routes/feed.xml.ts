import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  const runtime = useRuntimeConfig()
  const siteUrl = (runtime.public as any)?.siteUrl || 'http://localhost:3000'

  // Fetch latest posts
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 50,
    select: { id: true, title: true, excerpt: true, slug: true, publishedAt: true }
  })

  const items = posts.map((p) => {
    const link = `${siteUrl}/post/${encodeURIComponent(p.slug)}`
    const pub = new Date(p.publishedAt as any).toUTCString()
    const description = escapeHtml(p.excerpt || '')
    return `
    <item>
      <title>${escapeHtml(p.title || '')}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`
  }).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>WhiteBikeVibes</title>
      <link>${siteUrl}</link>
      <description>WhiteBikeVibes | Bigbike + Dev Lifestyle</description>
      <language>th-TH</language>
      ${items}
    </channel>
  </rss>`

  return rss
})

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
