# Supabase Setup Guide for VolunteerVerse

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon/public key**
3. Create a `.env.local` file in your project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `database-schema.sql` file
3. Click **Run** to execute the SQL

## 4. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. **Enable** "Confirm email" option
5. **Disable** "Enable auto-confirm" (unless you want instant signup)

## 5. Test the Registration

1. Start your development server: `npm run dev`
2. Go to `/register` and try creating an account
3. Check your email for the confirmation link
4. Click the link to confirm your account
5. You should be redirected to the appropriate dashboard

## 6. Troubleshooting

### Common Issues:

**"User already registered" error:**
- Check if the email already exists in your Supabase auth users
- You may need to delete the user from Supabase dashboard

**"Profile creation failed" error:**
- Ensure the database tables were created successfully
- Check the SQL console for any error messages
- Verify RLS policies are in place

**Email not received:**
- Check your spam folder
- Verify the email address is correct
- Check Supabase logs for email delivery issues

**Redirect issues:**
- Ensure the redirect URLs are correctly configured in Supabase
- Check that your `.env.local` file has the correct values

## 7. Production Deployment

When deploying to production:

1. Update your environment variables with production URLs
2. Update Supabase redirect URLs to include your production domain
3. Ensure your production domain is added to Supabase allowed origins
4. Test the complete flow in production environment

## 8. Security Notes

- The current setup includes Row Level Security (RLS) policies
- Users can only access their own profile data
- All database operations are properly secured
- Consider adding additional validation rules as needed
