# Setup Checklist

## Initial Setup

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Set up Neon PostgreSQL database
- [ ] Add `DATABASE_URL` and `DIRECT_URL` to `.env`
- [ ] Generate AUTH_SECRET: `openssl rand -base64 32`
- [ ] Set up UploadThing account and add credentials
- [ ] Get Gemini API key from Google AI Studio
- [ ] (Optional) Set up Google OAuth credentials
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Test locally: `npm run dev`

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Vercel project
- [ ] Add all environment variables in Vercel
- [ ] Deploy project
- [ ] Verify cron job is configured
- [ ] Test production build
- [ ] Test authentication
- [ ] Test image uploads
- [ ] Test AI features
- [ ] Test export functionality

## Post-Deployment

- [ ] Create first user account
- [ ] Test adding a phone
- [ ] Test marking phone as sold
- [ ] Test expense tracking
- [ ] Verify notifications work
- [ ] Test mobile responsiveness

