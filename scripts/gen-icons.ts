import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import path from 'path'

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const ICONS_DIR = path.join(process.cwd(), 'public', 'icons')

async function generateIcons() {
  try {
    // Ensure icons directory exists
    await mkdir(ICONS_DIR, { recursive: true })

    // Create a simple heart icon using SVG
    const heartSvg = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#1a1a1a" rx="64"/>
        <path d="M256 448l-30.164-27.211C118.718 322.442 64 267.85 64 201.333 64 149.333 105.333 108 157.333 108c27.138 0 53.308 14.083 68.667 37.083C241.359 122.083 267.529 108 294.667 108 346.667 108 388 149.333 388 201.333c0 66.517-54.718 121.109-161.836 219.456L256 448z" fill="#ef4444"/>
      </svg>
    `

    // Generate icons for each size
    for (const size of ICON_SIZES) {
      const filename = `icon-${size}x${size}.png`
      const outputPath = path.join(ICONS_DIR, filename)

      await sharp(Buffer.from(heartSvg))
        .resize(size, size)
        .png()
        .toFile(outputPath)

      console.log(`Generated ${filename}`)
    }

    console.log('All icons generated successfully!')
  } catch (error) {
    console.error('Error generating icons:', error)
    process.exit(1)
  }
}

generateIcons()
