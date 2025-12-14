# Deployment Guide

## Quick Start

1. **Set up Neon Database**
   - Create a Neon PostgreSQL database
   - Copy your connection strings (DATABASE_URL and DIRECT_URL)

2. **Set up Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in all required variables (see README.md)

3. **Generate Prisma Client**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Deploy to Vercel**
   - Push code to GitHub
   - Import project in Vercel
   - Add all environment variables
   - Deploy!

## Required Environment Variables

- `DATABASE_URL` - Neon PostgreSQL connection string (use the same URL for both regular and direct connections)
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `UPLOADTHING_SECRET` - From UploadThing dashboard
- `UPLOADTHING_APP_ID` - From UploadThing dashboard
- `GEMINI_API_KEY` - From Google AI Studio
- `CRON_SECRET` - Random secret for cron job authentication

## Vercel Cron Setup

The cron job is configured in `vercel.json` and will run daily at midnight UTC.

Make sure to:
1. Set the `CRON_SECRET` environment variable
2. Verify the cron job appears in Vercel dashboard after deployment

## Testing Production Build

Before deploying, test the production build locally:

```bash
npm run build
npm start
```

## Troubleshooting

### Prisma Client Not Generated
Run: `npx prisma generate`

### Database Connection Issues
- Verify DATABASE_URL and DIRECT_URL are correct
- Check Neon dashboard for connection status
- Ensure SSL mode is enabled

### UploadThing Issues
- Verify UPLOADTHING_SECRET and UPLOADTHING_APP_ID
- Check UploadThing dashboard for app status

### Cron Job Not Running
- Verify CRON_SECRET is set
- Check Vercel cron job logs
- Ensure the route is accessible

