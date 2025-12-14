# Troubleshooting Guide

## Google OAuth Configuration Error

If you see "Server error - There is a problem with the server configuration" when trying to sign in with Google:

### Solution 1: Set up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - For local: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### Solution 2: Add to .env file

```env
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
AUTH_URL="http://localhost:3000"  # For local development
```

### Solution 3: Disable Google OAuth (Optional)

If you don't want to use Google OAuth, you can disable it by adding to your `.env`:

```env
NEXT_PUBLIC_GOOGLE_ENABLED="false"
```

Or simply don't set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` - the Google sign-in button will be hidden automatically.

### Solution 4: Check AUTH_SECRET

Make sure `AUTH_SECRET` is set in your `.env` file:

```env
AUTH_SECRET="your-generated-secret"
```

Generate one with:
```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Other Common Issues

### Prisma Client Errors
- Make sure `DATABASE_URL` is set correctly
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync schema to database

### Missing Environment Variables
Check that all required variables are in your `.env` file:
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL` (for local: `http://localhost:3000`)

