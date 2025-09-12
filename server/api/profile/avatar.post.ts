import { prisma } from '~/lib/prisma'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const token = getCookie(event, 'auth-token')
    if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const secret = config.jwtSecret as string | undefined
    if (!secret) throw createError({ statusCode: 500, statusMessage: 'JWT secret not configured' })

    const decoded = jwt.verify(token, secret) as any
    const userId = decoded?.userId as string
    if (!userId) throw createError({ statusCode: 401, statusMessage: 'Invalid token' })

    // Read multipart form data
    const form = await readMultipartFormData(event)
    if (!form || form.length === 0) throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
    const filePart = form.find(p => p.name === 'file')
    if (!filePart || !filePart.data) throw createError({ statusCode: 400, statusMessage: 'Missing file field' })

    // Server-side validation: max 2MB
    const maxBytes = 2 * 1024 * 1024
    if (filePart.data.length > maxBytes) {
      throw createError({ statusCode: 413, statusMessage: 'File too large (max 2MB)' })
    }

    const cloudName = config.cloudinaryCloudName as string | undefined
    const apiKey = config.cloudinaryApiKey as string | undefined
    const apiSecret = config.cloudinaryApiSecret as string | undefined
    let avatarUrl: string | undefined

    if (cloudName && apiKey && apiSecret) {
      // Build signed params for Cloudinary
      const timestamp = Math.floor(Date.now() / 1000)
      const folder = 'wbv_avatars'
      const publicId = `user_${userId}`
      // Cloudinary signature must include ALL params being sent (except file, api_key), sorted alphabetically
      const signParams: Record<string, string> = {
        folder,
        overwrite: 'true',
        public_id: publicId,
        timestamp: String(timestamp),
      }
      const paramsToSign = Object.keys(signParams)
        .sort()
        .map((k) => `${k}=${signParams[k]}`)
        .join('&')
      const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex')

      // Compose form-data for Cloudinary
      const fd = new FormData()
      // Node/FormData supports Buffer via Blob
      const blob = new Blob([filePart.data], { type: (filePart as any).type || 'application/octet-stream' })
      fd.set('file', blob, (filePart as any).filename || 'avatar')
      fd.set('api_key', apiKey)
      fd.set('timestamp', String(timestamp))
      fd.set('signature', signature)
      fd.set('folder', folder)
      fd.set('public_id', publicId)
      fd.set('overwrite', 'true')

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const res = await fetch(uploadUrl, { method: 'POST', body: fd as any })
      if (!res.ok) {
        const text = await res.text()
        console.error('Cloudinary upload failed:', text)
        throw createError({ statusCode: 502, statusMessage: 'Upload failed' })
      }
      const payload = await res.json() as any
      avatarUrl = payload.secure_url as string | undefined
      if (!avatarUrl) throw createError({ statusCode: 502, statusMessage: 'Upload response invalid' })
    } else {
      // Fallback: save to local filesystem under public/uploads/avatars
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars')
      await fs.mkdir(uploadsDir, { recursive: true })
      const original = (filePart as any).filename as string | undefined
      const safeBase = `user_${userId}`
      const ext = original?.includes('.') ? `.${original.split('.').pop()?.toLowerCase()}` : ''
      const filename = `${safeBase}${ext || '.jpg'}`
      const absPath = join(uploadsDir, filename)
      await fs.writeFile(absPath, filePart.data)
      avatarUrl = `/uploads/avatars/${filename}`
    }

    // Save to DB
    const updated = await prisma.user.update({ where: { id: userId }, data: { avatarUrl }, select: { id: true, name: true, email: true, role: true, avatarUrl: true } })

    return { user: updated }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('avatar upload error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to upload avatar' })
  }
})

