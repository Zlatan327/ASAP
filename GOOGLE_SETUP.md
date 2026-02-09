# Google Sign-in Setup Guide

## Required: Get Google OAuth Client ID

To enable Google Sign-in, you need to create a Google OAuth Client ID.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name it: `ASAP Prompt Tool`
4. Click **"Create"**

### Step 2: Enable Google Identity Services

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in:
   - App name: `ASAP`
   - User support email: Your email
   - Developer contact: Your email
4. Click **"Save and Continue"** (skip scopes)
5. Click **"Save and Continue"** (skip test users)

### Step 3: Create OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Application type: **Web application**
4. Name: `ASAP Web Client`
5. **Authorized JavaScript origins**: Add:
   - `http://localhost:5500` (for local testing)
   - Your GitHub Pages URL (if deploying, e.g., `https://zlatan327.github.io`)
6. Click **"Create"**
7. **Copy the Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

### Step 4: Add Client ID to auth.js

1. Open `auth.js`
2. Find line 7:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
   ```
3. Replace with your actual Client ID:
   ```javascript
   const GOOGLE_CLIENT_ID = '123456789-abc.apps.googleusercontent.com';
   ```
4. Save the file

### Step 5: Test Locally

1. Open `index.html` with Live Server (or similar)
2. You should see a "Sign in with Google" button in the navbar
3. Click it and sign in
4. Your profile should appear
5. Generate a prompt
6. Check the history panel (slides in from right)

## Troubleshooting

**"Popup closed" error**:
- Make sure your domain is in "Authorized JavaScript origins"
- Check browser allows popups

**Button doesn't appear**:
- Open DevTools Console
- Check for errors loading `https://accounts.google.com/gsi/client`

**History not saving**:
- Sign in first (only signed-in users can save history)
- Check browser console for localStorage errors

## Security Notes

- Never commit `auth.js` with your real Client ID to public repos
- Use environment variables or `.gitignore` for production
- Client ID is safe for frontend (it's meant to be public)
