# Google OAuth Setup Guide

## Step-by-Step Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" (unless you have a Google Workspace)
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`
   - Add test users if in testing mode
4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: "PhoneHive" (or your app name)

### 3. Configure Authorized Redirect URIs

**IMPORTANT:** Add these exact URIs:

**For Local Development:**
```
http://localhost:3000/api/auth/callback/google
```

**For Production (replace with your domain):**
```
https://yourdomain.com/api/auth/callback/google
```

### 4. Copy Credentials

After creating, you'll see:
- **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-xxxxxxxxxxxxx`)

### 5. Add to .env File

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
AUTH_SECRET="your-generated-secret"
AUTH_URL="http://localhost:3000"  # For local development
```

### 6. Generate AUTH_SECRET

If you don't have `AUTH_SECRET`, generate it:

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Bash/Terminal:**
```bash
openssl rand -base64 32
```

### 7. Restart Your Dev Server

After adding the credentials:
```bash
npm run dev
```

## Troubleshooting

### Error: "Configuration"

This usually means:
1. ❌ `AUTH_SECRET` is missing or invalid
2. ❌ `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` is missing/incorrect
3. ❌ Redirect URI doesn't match in Google Console
4. ❌ OAuth consent screen not configured

**Check:**
- Verify all environment variables are set in `.env`
- Make sure redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check that OAuth consent screen is published (or add yourself as a test user)
- Restart your dev server after changing `.env`

### Error: "AccessDenied"

- OAuth consent screen is in testing mode and your email is not added as a test user
- Solution: Add your email as a test user in OAuth consent screen settings

### Error: "OAuthAccountNotLinked"

- You're trying to sign in with Google but an account with that email already exists with email/password
- Solution: Sign in with email/password instead, or delete the existing account

## Quick Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created (Web application)
- [ ] Redirect URI added: `http://localhost:3000/api/auth/callback/google`
- [ ] Client ID and Secret copied
- [ ] Added to `.env` file
- [ ] `AUTH_SECRET` generated and added to `.env`
- [ ] `AUTH_URL` set to `http://localhost:3000` in `.env`
- [ ] Dev server restarted

## Testing

1. Go to http://localhost:3000/auth/signin
2. Click "Sign in with Google"
3. You should be redirected to Google sign-in
4. After signing in, you should be redirected back to the dashboard

## Production Setup

For production, update:
1. Redirect URI in Google Console: `https://yourdomain.com/api/auth/callback/google`
2. `AUTH_URL` in environment variables: `https://yourdomain.com`
3. Make sure OAuth consent screen is published (not in testing mode)



