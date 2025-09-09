import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /meta/post/:slug - returns an HTML page with OG/Twitter meta for crawlers
router.get('/post/:slug', async (req, res) => {
  try {
    const slug = req.params.slug
    const post = await prisma.post.findUnique({
      where: { slug },
      select: {
        title: true,
        excerpt: true,
        coverImageUrl: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
    })

    if (!post) {
      return res.status(404).send(`<!doctype html><html><head><meta charset="utf-8"><title>Not Found</title></head><body>Post not found</body></html>`)
    }

    const siteName = 'Torkait'
    const origin = `${req.protocol}://${req.get('host')}`
    const url = `${origin}/post/${encodeURIComponent(slug)}`
    const title = `${post.title} • ${siteName}`
    const desc = post.excerpt || ''
    let img = post.coverImageUrl || '/favicon.ico'
    if (!/^https?:\/\//i.test(img)) {
      // make it absolute if relative
      img = `${origin}${img.startsWith('/') ? '' : '/'}${img}`
    }

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:site_name" content="${escapeHtml(siteName)}" />
  <meta property="og:image" content="${escapeHtml(img)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${escapeHtml(img)}" />
  <link rel="canonical" href="${escapeHtml(url)}" />
</head>
<body>
  <p>Redirecting to the article...</p>
  <script>location.replace(${JSON.stringify(url)})</script>
</body>
</html>`

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(200).send(html)
  } catch (e) {
    console.error(e)
    return res.status(500).send('<!doctype html><html><head><meta charset="utf-8"><title>Error</title></head><body>Server error</body></html>')
  }
})

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export default router
