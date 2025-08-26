# Two-Do - Shared Bucket List PWA

A production-ready, mobile-first Progressive Web App (PWA) designed for couples to create and maintain a shared bucket list. Each completed item requires photo confirmation, making it perfect for documenting your adventures together.

## Features

- 🔐 **Secure Authentication** - Email/password with NextAuth
- 💑 **Couple Pairing** - Invite system to connect with your partner
- 📝 **Shared Bucket List** - Create, edit, and reorder items together
- 📸 **Photo Confirmation** - Complete items with required photos
- 📱 **Mobile-First PWA** - Installable on mobile devices
- 🌙 **Dark Mode** - Beautiful dark theme optimized for mobile
- 🔄 **Drag & Drop** - Reorder items with intuitive gestures
- 📴 **Offline Support** - Basic functionality works offline

## Tech Stack

- **Next.js 14** with App Router and TypeScript
- **PostgreSQL** with Prisma ORM
- **NextAuth** for authentication
- **Tailwind CSS** + shadcn/ui for styling
- **Sharp** for image processing
- **React Hook Form** + Zod for forms
- **@hello-pangea/dnd** for drag and drop

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd two-do
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # App
   APP_URL=http://localhost:3000
   NODE_ENV=development

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Database - Local PostgreSQL
   DATABASE_URL="postgresql://username:password@localhost:5432/twodo_dev"

   # Password hashing
   BCRYPT_ROUNDS=12
   ```

4. **Set up the database**
   ```bash
   # Push the schema to your database
   npm run db:push
   
   # Generate Prisma client
   npm run db:generate
   
   # Seed with sample data (optional)
   npm run db:seed
   ```

5. **Generate PWA icons**
   ```bash
   npx tsx scripts/gen-icons.ts
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Visit http://localhost:3000**

### Production Deployment

For production, update your `.env` file with:

```env
NODE_ENV=production
APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
DATABASE_URL="your-production-database-url"
```

#### DigitalOcean Database Example

```env
DATABASE_URL="postgresql://doadmin:password@db-postgresql-nyc3-12345-do-user-67890-0.db.ondigitalocean.com:25060/mindline-db?sslmode=require&schema=twodo"
```

## Usage

### Getting Started

1. **Register** - Create an account with your email
2. **Create or Join** - Either create a new pair or join with an invite code
3. **Add Items** - Start building your shared bucket list
4. **Complete Together** - Mark items as done with photos

### Key Features

- **Invite System** - Share a 6-character code or link with your partner
- **Photo Completion** - Take photos or upload images when completing items
- **Drag & Drop** - Reorder items by dragging them up or down
- **Mobile Optimized** - Works great on phones and can be installed as an app

### PWA Installation

On mobile devices, you'll see an "Add to Home Screen" prompt. Once installed:
- App-like experience with no browser UI
- Faster loading with offline caching
- Push notifications (future feature)

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/users/invite` - Create invite code
- `GET /api/users/invite?code=ABC123` - Get invite details
- `POST /api/pair/accept` - Accept invite and join pair
- `GET|POST|PATCH /api/items` - Manage bucket list items
- `PATCH|DELETE /api/items/[id]` - Update/delete specific items
- `POST /api/items/[id]/complete` - Complete item with photo
- `POST /api/uploads` - Upload and process images

## Database Schema

- **Users** - Authentication and profile data
- **Pairs** - Relationship between two users
- **PairMembers** - Junction table for pair membership
- **Invites** - Temporary invite codes for joining
- **Items** - Bucket list items with ordering
- **Completions** - Photo confirmations for completed items

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
npm run test         # Run Vitest tests
npm run test:e2e     # Run Playwright tests
```

### Testing

The app includes:
- **Vitest** for unit/component tests
- **Playwright** for end-to-end testing
- **Testing Library** for React component testing

Run tests with:
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

### Project Structure

```
app/
  (auth)/           # Authentication pages
  (dashboard)/      # Main app pages
  api/             # API routes
components/
  ui/              # shadcn/ui components
  *.tsx            # Custom components
lib/               # Utilities and configurations
prisma/            # Database schema and migrations
public/            # Static assets
  icons/           # PWA icons
  manifest.webmanifest
  service-worker.js
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

---

Built with ❤️ for couples who love adventures together!