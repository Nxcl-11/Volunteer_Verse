# Email Confirmation Troubleshooting Guide

## The Problem
You're getting "Confirmation Failed - Invalid or expired confirmation link" when clicking the email confirmation link.

## Quick Fixes to Try First

### 1. Check Your Supabase Configuration
Go to your Supabase dashboard → **Authentication** → **Settings** and verify:

- **Site URL**: Should include `http://localhost:3000` (for development)
- **Redirect URLs**: Should include `http://localhost:3000/auth/callback`
- **Enable email confirmations**: Should be **ON**
- **Enable auto-confirm**: Should be **OFF** (for testing)

### 2. Verify Environment Variables
Check your `.env.local` file has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Test Your Connection
Visit `/test-supabase` in your app to verify the connection is working.

## Detailed Troubleshooting Steps

### Step 1: Check the Email Link
1. Open the confirmation email
2. Right-click the confirmation link and "Copy link address"
3. Look at the URL structure - it should look like:
   ```
   https://your-project.supabase.co/auth/v1/verify?token_hash=...&type=signup&next=http://localhost:3000/auth/callback
   ```

### Step 2: Verify Supabase Auth Settings
In your Supabase dashboard:

1. **Authentication** → **Settings**
2. **Site URL**: `http://localhost:3000`
3. **Redirect URLs**: `http://localhost:3000/auth/callback`
4. **Additional Redirect URLs**: Add `http://localhost:3000` if not present

### Step 3: Check Database Tables
Ensure you've run the database schema:

1. Go to **SQL Editor** in Supabase
2. Copy and paste the contents of `database-schema.sql`
3. Click **Run**

### Step 4: Test the Registration Flow
1. Clear your browser cookies/local storage
2. Try registering a new account
3. Check the browser console for any errors
4. Check the Network tab to see what requests are being made

### Step 5: Check Supabase Logs
In your Supabase dashboard:

1. **Logs** → **Auth logs**
2. Look for any failed authentication attempts
3. Check for any error messages

## Common Issues and Solutions

### Issue 1: "Invalid redirect URL"
**Solution**: Add your redirect URL to Supabase Auth settings

### Issue 2: "Token expired"
**Solution**: Request a new confirmation email (wait a few minutes between attempts)

### Issue 3: "User not found"
**Solution**: Check if the user was created in Supabase Auth → Users

### Issue 4: "Database table doesn't exist"
**Solution**: Run the database schema SQL

### Issue 5: "RLS policy violation"
**Solution**: Ensure RLS policies are properly set up

## Debug Mode

The updated auth callback page now includes debug information. When you get an error:

1. Check the browser console for detailed logs
2. Look at the debug info displayed on the error page
3. Note any specific error messages

## Testing Steps

1. **Test Connection**: Visit `/test-supabase`
2. **Test Registration**: Try creating a new account
3. **Check Email**: Verify the confirmation email format
4. **Test Confirmation**: Click the confirmation link
5. **Check Logs**: Review browser console and Supabase logs

## Still Having Issues?

If none of the above works:

1. **Check Supabase Status**: Visit [status.supabase.com](https://status.supabase.com)
2. **Verify Project Settings**: Ensure your project is active and not paused
3. **Check Billing**: Ensure your project hasn't hit usage limits
4. **Contact Support**: Use the debug information to get help

## Production Deployment

When deploying to production:

1. Update environment variables with production URLs
2. Update Supabase redirect URLs to include your production domain
3. Test the complete flow in production environment
4. Ensure your production domain is added to Supabase allowed origins
