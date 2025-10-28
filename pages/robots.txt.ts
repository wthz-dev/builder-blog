// NOTE:
// Serve robots.txt from server/routes/robots.txt.ts (Nitro route).
// Keep this stub to avoid SSR rendering issues under pages/ (e.g., [object Promise]).
import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain')
  return ''
})
