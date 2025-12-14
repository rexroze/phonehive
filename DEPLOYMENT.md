# Deployment Guide for PhoneHive

This guide will help you deploy PhoneHive to Vercel and set it up as a Progressive Web App (PWA).

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. A Neon PostgreSQL database (or any PostgreSQL database)
4. Environment variables configured

## Step 1: Prepare Your Icons

Before deploying, you need to create PWA icons. Create two icon files:

- `public/icon-192x192.png` (192x192 pixels)
- `public/icon-512x512.png` (512x512 pixels)

### Quick Icon Generation

You can use online tools to generate icons:
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload a square image (at least 512x512)
3. Download the generated icons
4. Place them in the `public` folder

Or use a simple colored square as a placeholder:
- Create a 192x192 PNG with your brand color
- Create a 512x512 PNG with your brand color
- Name them `icon-192x192.png` and `icon-512x512.png`
- Place in the `public` folder

## Step 2: Environment Variables

Make sure you have all required environment variables in your `.env` file:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
AUTH_SECRET="your-secret-key-min-32-characters"
AUTH_URL="https://your-domain.vercel.app"  # Update after deployment

# UploadThing (if using)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Google Gemini API (if using AI features)
GEMINI_API_KEY="your-gemini-api-key"
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/phonehive.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add all your environment variables from `.env`
   - Make sure to set `AUTH_URL` to your Vercel domain (e.g., `https://phonehive.vercel.app`)

4. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add AUTH_SECRET
   vercel env add AUTH_URL
   # Add all other environment variables
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## Step 4: Update AUTH_URL

After deployment, update the `AUTH_URL` environment variable in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Update `AUTH_URL` to your actual Vercel domain
4. Redeploy the application

## Step 5: Database Setup

1. **Run Prisma migrations:**
   ```bash
   npx prisma db push
   ```

   Or if you prefer migrations:
   ```bash
   npx prisma migrate deploy
   ```

2. **Verify database connection:**
   - Check Vercel logs to ensure database connection is successful

## Step 6: Test PWA Functionality

1. **Visit your deployed site** on a mobile device
2. **Open in browser** (Chrome/Safari)
3. **Look for "Add to Home Screen" prompt** or:
   - **Chrome (Android):** Menu → "Add to Home screen"
   - **Safari (iOS):** Share button → "Add to Home Screen"
4. **Install the app** and test offline functionality

## Step 7: Verify PWA Features

- ✅ App can be installed on home screen
- ✅ App works offline (with cached pages)
- ✅ App has app-like experience (no browser UI)
- ✅ Icons display correctly
- ✅ Theme color matches your design

## Troubleshooting

### PWA not working?
- Check that icons exist in `public` folder
- Verify `manifest.json` is accessible at `/manifest.json`
- Check browser console for service worker errors
- Ensure you're using HTTPS (Vercel provides this automatically)

### Build errors?
- Check that all environment variables are set
- Verify `DATABASE_URL` is correct
- Check Vercel build logs for specific errors

### Service worker not registering?
- Clear browser cache
- Check that PWA is not disabled in development mode
- Verify `next-pwa` is properly configured

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connected and migrations run
- [ ] PWA icons created and in `public` folder
- [ ] `AUTH_URL` updated to production domain
- [ ] Test sign-in/sign-up functionality
- [ ] Test PWA installation on mobile device
- [ ] Verify offline functionality
- [ ] Check all features work in production

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `AUTH_URL` to your custom domain

## Support

For issues:
- Check Vercel deployment logs
- Review Next.js documentation
- Check PWA documentation at https://web.dev/progressive-web-apps/
