#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

// Simple script to check if required environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

const missing = requiredEnvVars.filter(varName => !process.env[varName]);

if (missing.length > 0) {
  console.error('Missing required environment variables:');
  missing.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease set these variables in your .env.local file or Vercel environment variables.');
  process.exit(1);
} else {
  console.log('All required environment variables are set');
}