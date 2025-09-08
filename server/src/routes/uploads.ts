import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { requireAuth } from '../middleware/auth'

// Configure Cloudinary from env
const CLOUD_NAME = 'builder-blog'
const API_KEY = '945642268655577'
const API_SECRET = 'egITWRxlmoaa-fodA-Y5Q3DYiyg'
const FOLDER = 'builder-blog'

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn('[uploads] Missing CLOUDINARY_* env; upload endpoints will fail until configured')
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
})

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// POST /api/uploads/cover - upload cover image, returns { url }
router.post('/cover', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' })

    const folder = FOLDER

    // Upload buffer via stream to Cloudinary
    const streamUpload = () =>
      new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
          (error, result) => {
            if (error || !result) return reject(error)
            resolve(result)
          },
        )
        streamifier.createReadStream(req.file!.buffer).pipe(stream)
      })

    const result = await streamUpload()
    return res.json({ url: result.secure_url || result.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

export default router
