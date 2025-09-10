// NOTE:
// This file previously generated sitemap via Prisma under `pages/`, which caused
// Prisma to be bundled into the client build and failed on Vercel.
// Sitemap generation is now handled exclusively by `server/routes/sitemap.xml.ts`.
// We keep this stub to avoid accidental Prisma imports at pages-level.

export default defineEventHandler((event) => {
  // Delegate to server route (same pathname) to serve sitemap.
  // Returning empty string here ensures no Prisma is loaded in pages/ during build.
  setHeader(event, 'Content-Type', 'application/xml')
  return ''
})
