# DigitalOcean Deployment Setup

## Prerequisites

1. **DigitalOcean Account** with App Platform access
2. **GitHub Repository** with your code
3. **Database Schema Created** in your PostgreSQL instance

## Database URL Configuration

Your `DATABASE_URL` should now include the `twodo` schema:

### Local Development
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/twodo?schema=twodo"
```

### Production (DigitalOcean Managed Database)
```env
DATABASE_URL="postgresql://doadmin:password@db-postgresql-nyc3-12345-do-user-67890-0.db.ondigitalocean.com:25060/twodo?sslmode=require&schema=twodo"
```

## Deployment Steps

### 1. Create the Schema in Your Database

First, connect to your PostgreSQL database and create the `twodo` schema:

```sql
-- Connect to your database
\c twodo

-- Create the schema
CREATE SCHEMA IF NOT EXISTS twodo;

-- Verify schema exists
\dn
```

### 2. Update Your Environment Variables

Update your `.env.local` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/twodo?schema=twodo"
```

### 3. Push Schema Changes

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables in twodo schema)
npm run db:push

# Optional: Seed with sample data
npm run db:seed
```

### 4. Deploy to DigitalOcean

1. **Fork/Upload to GitHub**: Make sure your code is in a GitHub repository

2. **Update app.yaml**: Edit the `github.repo` field in `app.yaml`:
   ```yaml
   github:
     repo: your-username/two-do  # Replace with your repo
     branch: main
   ```

3. **Create App on DigitalOcean**:
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Choose "GitHub" as source
   - Select your repository
   - Choose "Use existing app spec" and upload `app.yaml`

4. **Set Environment Variables**:
   - `NEXTAUTH_SECRET`: Generate a strong secret (32+ characters)
   - Database will be automatically connected via `${twodo-db.DATABASE_URL}`

5. **Deploy**: Click "Create Resources"

## Environment Variables for Production

Set these in DigitalOcean App Platform:

```env
NODE_ENV=production
APP_URL=https://your-app-name.ondigitalocean.app
NEXTAUTH_URL=https://your-app-name.ondigitalocean.app
NEXTAUTH_SECRET=your-super-secret-key-here-32-chars-min
BCRYPT_ROUNDS=12
```

## Database Migration

The app.yaml includes a pre-deploy job that will:
1. Run `prisma db push` to create/update tables in the `twodo` schema
2. Ensure the database schema matches your Prisma schema

## Health Check

The app includes a health check endpoint at `/api/health` that:
- Tests database connectivity
- Returns app status
- Used by DigitalOcean for health monitoring

## Troubleshooting

### Schema Issues
If you get schema-related errors:
```bash
# Reset and recreate schema
npm run db:push -- --reset
```

### Connection Issues
- Verify your DATABASE_URL includes `?schema=twodo`
- For production, ensure `sslmode=require` is included
- Check that the `twodo` schema exists in your database

### Build Issues
- Ensure all environment variables are set
- Check that Node.js version is compatible (20+)
- Verify Prisma client is generated during build
