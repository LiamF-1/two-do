#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Two-Do PWA...\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...')
  
  const envContent = `# App Configuration
APP_URL=http://localhost:3000
NODE_ENV=development

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${generateRandomString(32)}

# Database Configuration
# Update with your PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/twodo_dev"

# Password Hashing
BCRYPT_ROUNDS=12
`
  
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env.local')
} else {
  console.log('⚠️  .env.local already exists, skipping...')
}

// Create uploads directory
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('📁 Created uploads directory')
}

console.log('\n🎉 Setup complete! Next steps:')
console.log('1. Update DATABASE_URL in .env.local with your PostgreSQL connection')
console.log('2. Run: npm install')
console.log('3. Run: npm run db:push')
console.log('4. Run: npx tsx scripts/gen-icons.ts')
console.log('5. Run: npm run db:seed (optional - adds sample data)')
console.log('6. Run: npm run dev')
console.log('\nVisit http://localhost:3000 to see your app! 🚀')

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
