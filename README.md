# PhoneHive

A comprehensive phone inventory and sales management system with PWA support.

## Features

- 📱 **Phone Inventory Management** - Track phones, conditions, prices, and sales
- 💰 **Expense Tracking** - Monitor business expenses by category
- 🤖 **AI Tools** - Generate captions, tags, and price suggestions using Google Gemini
- 📊 **Analytics Dashboard** - View sales statistics and insights
- 🔐 **Authentication** - Secure email/password authentication
- 📱 **PWA Support** - Install and use on mobile devices
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon, Supabase, or any PostgreSQL provider)
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd phonehive
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-key-min-32-characters"
AUTH_URL="http://localhost:3000"  # Update for production

# UploadThing (optional, for image uploads)
UPLOADTHING_SECRET="your-secret"
UPLOADTHING_APP_ID="your-app-id"

# Google Gemini API (optional, for AI features)
GEMINI_API_KEY="your-api-key"
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## PWA Installation

After deployment, you can install PhoneHive as a Progressive Web App:

### Android (Chrome)
1. Open the site in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Confirm installation

### iOS (Safari)
1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js v5
- **UI:** Tailwind CSS, Radix UI
- **PWA:** next-pwa
- **AI:** Google Gemini API
- **File Upload:** UploadThing

## Project Structure

```
phonehive/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # React components
├── lib/                   # Utilities and configurations
├── prisma/                # Database schema
└── public/                # Static assets
```

## Development

### Build for Production

```bash
npm run build
npm start
```

### Database Migrations

```bash
# Push schema changes
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

## License

Private - All rights reserved

## Support

For issues or questions, please check the deployment guide or open an issue.
