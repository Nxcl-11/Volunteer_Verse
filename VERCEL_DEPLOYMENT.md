# Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, make sure you have:

1. A Supabase project set up
2. Your Supabase project URL and anonymous key
3. A Vercel account

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 2: Set Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |

5. Click **Save**

## Step 3: Deploy

1. Push your code to GitHub
2. Vercel will automatically detect the changes and start building
3. The build should now succeed with the environment variables set

## Troubleshooting

### Build Fails with "Missing Environment Variables"

If you see this error:
```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

**Solution**: Make sure you've added the environment variables in Vercel as described in Step 2.

### Environment Variables Not Available

If your app can't access the environment variables at runtime:

1. Check that the variables are set for all environments (Production, Preview, Development)
2. Redeploy after adding the variables
3. Clear Vercel's build cache if needed

### Still Having Issues?

1. Check the Vercel build logs for specific error messages
2. Verify your Supabase credentials are correct
3. Make sure your Supabase project is active and accessible

## Local Development

For local development, create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Security Notes

- The `NEXT_PUBLIC_` prefix means these variables are exposed to the browser
- This is safe for Supabase anonymous keys as they're designed to be public
- Never expose your Supabase service role key (it starts with `eyJ...` but is different from the anon key)
