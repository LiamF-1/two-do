# Deployment Guide

## Production Database Sync Issue - RESOLVED ✅

The `Pair.name column does not exist` error has been fixed by updating the deployment process to use proper Prisma migrations.

## What Was Wrong

1. **Using `prisma db push --accept-data-loss`** in production deployment
2. **Missing proper migration deployment** for schema changes
3. **Production database out of sync** with the application schema

## What Was Fixed

1. ✅ Updated `app.yaml` to use `prisma migrate deploy` instead of `db push`
2. ✅ Added `prisma generate` to ensure client is properly generated
3. ✅ Created proper migration files for all schema changes

## Deployment Process (Digital Ocean)

### Current Configuration

The app is configured to automatically deploy when you push to the `main` branch. The deployment process now includes:

1. **Pre-Deploy Job** (`db-migrate`):
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Build Process**:
   ```bash
   npm ci --production=false
   npx prisma generate
   npm run build
   ```

### Manual Deployment Steps

If you need to manually deploy or fix production database issues:

1. **Push your changes to main branch**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Monitor the deployment** in your DigitalOcean dashboard

3. **If database issues persist**, you can manually run migrations:
   ```bash
   # Connect to your production environment and run:
   DATABASE_URL="your-production-url" npx prisma migrate deploy
   DATABASE_URL="your-production-url" npx prisma generate
   ```

## Database Management Best Practices

### For Schema Changes

1. **Always create migrations for schema changes**:
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```

2. **Never use `db push` in production** - it can cause data loss

3. **Test migrations locally first**:
   ```bash
   npx prisma migrate reset  # Reset local DB
   npx prisma migrate deploy # Test migration
   ```

### For Production Database

1. **Use `migrate deploy`** for production deployments
2. **Always backup before major changes**
3. **Monitor deployment logs** for migration errors

## Troubleshooting

### "Column does not exist" Errors

This typically means the production database is out of sync:

1. Check if migrations were applied: Look at deployment logs
2. Manually run migrations if needed
3. Verify schema with `prisma db pull` on production

### Migration Failures

1. **Check deployment logs** in DigitalOcean dashboard
2. **Verify DATABASE_URL** is correct in environment variables
3. **Check database permissions** for the user
4. **Look for data conflicts** that prevent migration

## Environment Variables

Ensure these are set in your DigitalOcean app:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=your-app-domain
NEXTAUTH_SECRET=your-production-secret
```

## Monitoring

- **Deployment Status**: DigitalOcean App Platform dashboard
- **Application Logs**: Available in the DigitalOcean dashboard
- **Database Health**: Monitor connection and query performance

## Next Steps

The deployment is now configured correctly. Future deployments will:

1. ✅ Automatically run database migrations
2. ✅ Generate the Prisma client
3. ✅ Keep production database in sync
4. ✅ Prevent "column does not exist" errors

**Your production app should work correctly after the next deployment!**
