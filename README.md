# PhoneHive - Phone Buy & Sell Dashboard

A production-ready, mobile-friendly web dashboard for managing your phone buy & sell business. Built with Next.js 14, Prisma, and modern web technologies.

## Features

- ✅ **Authentication** - Credential login and Google OAuth support
- ✅ **Inventory Management** - Add, edit, and track phones with images
- ✅ **Dashboard Analytics** - Revenue, profit, and expense tracking with charts
- ✅ **AI Tools** - Generate captions, tags, and price suggestions using Gemini API
- ✅ **Expense Tracking** - Log and categorize business expenses
- ✅ **Aging Item Notifications** - Automatic alerts for items in stock > 30 days
- ✅ **Export Functionality** - Export inventory, expenses, and sales to Excel
- ✅ **Mobile Responsive** - Fully responsive UI with bottom navigation

## Tech Stack

- **Next.js 14** (App Router, Server Actions, TypeScript)
- **Prisma ORM** with Neon PostgreSQL
- **Prisma Accelerate** (for Vercel compatibility)
- **Auth.js (NextAuth)** for authentication
- **Shadcn UI** + Tailwind CSS
- **UploadThing** for image uploads
- **Gemini API** for AI features
- **Recharts** for dashboard analytics
- **Vercel** for deployment

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Neon PostgreSQL database
- UploadThing account
- Google OAuth credentials (optional)
- Gemini API key

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
```

Edit `.env` and add your credentials:
```env
DATABASE_URL="your-neon-database-url"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
GEMINI_API_KEY="your-gemini-api-key"
GOOGLE_CLIENT_ID="your-google-client-id" # Optional
GOOGLE_CLIENT_SECRET="your-google-client-secret" # Optional
CRON_SECRET="your-cron-secret" # For Vercel cron jobs
```

**Note:** For Neon, you only need one connection string. Copy the connection string from your Neon dashboard and use it for `DATABASE_URL`. The same URL will be used for both regular and direct connections.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step 1: Push Prisma Schema to Neon

1. Make sure your `DATABASE_URL` is set (copy from Neon dashboard)
2. Run migrations:
```bash
npx prisma migrate deploy
```

### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Import your project in Vercel
3. Add all environment variables in Vercel dashboard:
   - `DATABASE_URL` (your Neon connection string)
   - `AUTH_SECRET`
   - `UPLOADTHING_SECRET`
   - `UPLOADTHING_APP_ID`
   - `GEMINI_API_KEY`
   - `GOOGLE_CLIENT_ID` (optional)
   - `GOOGLE_CLIENT_SECRET` (optional)
   - `CRON_SECRET`

4. Deploy!

### Step 3: Configure Vercel Cron

The cron job is already configured in `vercel.json`. After deployment:

1. Go to your Vercel project settings
2. Navigate to "Cron Jobs"
3. The cron job should appear automatically
4. Set the `CRON_SECRET` environment variable
5. The cron will run daily at midnight UTC

### Step 4: Set up UploadThing

1. Create an account at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy your `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`
4. Add them to your Vercel environment variables

## Project Structure

```
phonehive/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/         # Analytics dashboard
│   │   ├── inventory/         # Phone inventory management
│   │   ├── ai-tools/          # AI tools page
│   │   ├── expenses/          # Expense tracking
│   │   ├── notifications/    # Notifications page
│   │   └── settings/          # Settings page
│   ├── api/
│   │   ├── auth/              # NextAuth routes
│   │   ├── uploadthing/       # UploadThing routes
│   │   ├── export/            # Export API routes
│   │   └── cron/              # Cron job routes
│   ├── actions/               # Server actions
│   └── auth/                  # Auth pages
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── inventory/             # Inventory components
│   ├── ai/                    # AI tools components
│   ├── expenses/              # Expense components
│   ├── notifications/         # Notification components
│   └── nav/                   # Navigation components
├── lib/                       # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
└── types/                     # TypeScript types
```

## Database Models

- **User** - User accounts with roles (FREE, PREMIUM, ADMIN)
- **Phone** - Phone inventory items
- **Expense** - Business expenses
- **Notification** - User notifications
- **Account** - OAuth accounts (NextAuth)
- **Session** - User sessions (NextAuth)

## Free Tier Limits

- Maximum 30 phones in stock
- AI tools limited after quota (extendable for premium)

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
