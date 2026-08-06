#!/usr/bin/env node
const needed = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'RAZORPAY_WEBHOOK_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SITE_URL',
  'ANTHROPIC_API_KEY'
];

const missing = needed.filter((k) => !process.env[k]);
if (missing.length === 0) {
  console.log('All required env vars are set.');
  process.exit(0);
} else {
  console.log('Missing environment variables (set these in .env.local or your deployment):');
  missing.forEach((m) => console.log(' - ' + m));
  process.exit(2);
}
