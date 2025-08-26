import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    const fullPath = path.join(process.cwd(), 'public', 'uploads', imagePath)

    // Check if file exists
    if (!existsSync(fullPath)) {
      // Return a 1x1 transparent pixel as fallback
      const transparentPixel = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        'base64'
      )
      
      return new NextResponse(transparentPixel, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400', // Cache for 1 day
        },
      })
    }

    // Read and serve the actual file
    const fileBuffer = await readFile(fullPath)
    const extension = path.extname(fullPath).toLowerCase()
    
    let contentType = 'image/jpeg'
    if (extension === '.png') contentType = 'image/png'
    else if (extension === '.webp') contentType = 'image/webp'
    else if (extension === '.gif') contentType = 'image/gif'

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Image serving error:', error)
    
    // Return a 1x1 transparent pixel on any error
    const transparentPixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    )
    
    return new NextResponse(transparentPixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }
}
