import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl

  const robotsTxt = `# Global allow
User-agent: *
Allow: /

# Explicit allow for Facebook crawlers
User-agent: facebookexternalhit
Allow: /
User-agent: Facebot
Allow: /

# Disallow admin and auth pages
Disallow: /admin/
Disallow: /login
Disallow: /register

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`

  setHeader(event, 'Content-Type', 'text/plain')
  return robotsTxt
})
