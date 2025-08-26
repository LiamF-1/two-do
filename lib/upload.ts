import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { nanoid } from 'nanoid'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface ProcessedImage {
  originalPath: string
  thumbnailPath: string
  filename: string
}

export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function processAndSaveImage(
  file: File
): Promise<ProcessedImage> {
  // Validate file
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum size is 10MB.')
  }

  await ensureUploadDir()

  // Generate unique filename
  const fileExtension = path.extname(file.name) || '.jpg'
  const filename = `${nanoid()}-${Date.now()}${fileExtension}`
  const originalPath = path.join(UPLOAD_DIR, filename)
  const thumbnailFilename = `thumb-${filename}`
  const thumbnailPath = path.join(UPLOAD_DIR, thumbnailFilename)

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Process and save original (max 1200px wide)
  await sharp(buffer)
    .resize(1200, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .jpeg({ quality: 85 })
    .toFile(originalPath)

  // Create thumbnail (300px wide)
  await sharp(buffer)
    .resize(300, 300, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath)

  return {
    originalPath: `/uploads/${filename}`,
    thumbnailPath: `/uploads/${thumbnailFilename}`,
    filename
  }
}

export function getImageUrl(imagePath: string): string {
  if (imagePath.startsWith('/uploads/')) {
    return imagePath
  }
  return `/uploads/${imagePath}`
}
