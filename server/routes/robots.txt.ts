import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  // คุณสามารถแก้ไขเนื้อหา robots.txt ได้ที่นี่ตามต้องการ
  const robotsTxt = `# Global allow
User-agent: *
Allow: /

# Disallow admin and auth pages
Disallow: /admin/
Disallow: /login
Disallow: /register

# Sitemap
Sitemap: https://whitebikevibes.space/sitemap.xml`

  setHeader(event, 'Content-Type', 'text/plain')
  return robotsTxt
})
