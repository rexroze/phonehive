# Quick Start Guide

## Setting Up Your .env File

1. **Copy your Neon connection string** from the Neon dashboard. It looks like:
   ```
   postgresql://neondb_owner:user:password@ep-divine-shadow-a1vgudqe-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

2. **Create/Edit your `.env` file** in the root directory:
   ```env
   DATABASE_URL="postgresql://neondb_owner:user:password@ep-divine-shadow-a1vgudqe-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   AUTH_SECRET="your-generated-secret-here"
   AUTH_URL="http://localhost:3000"
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   GEMINI_API_KEY="your-gemini-api-key"
   CRON_SECRET="your-cron-secret"
   GOOGLE_CLIENT_ID="your-google-client-id" # Optional, for Google OAuth
   GOOGLE_CLIENT_SECRET="your-google-client-secret" # Optional, for Google OAuth
   ```

3. **Generate AUTH_SECRET** (run this in PowerShell or Terminal):
   ```powershell
   # PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   
   # Or use OpenSSL if available
   openssl rand -base64 32
   ```

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Push database schema**:
   ```bash
   npx prisma db push
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

## Important Notes

- ✅ **Only one connection string needed** - Use the same Neon connection string for `DATABASE_URL`
- ✅ The connection string from Neon works for both regular queries and migrations
- ✅ Make sure to wrap the connection string in quotes in your `.env` file

## Next Steps

After setting up `.env` and running the commands above:
1. Visit http://localhost:3000
2. Sign up for a new account
3. Start adding phones to your inventory!

