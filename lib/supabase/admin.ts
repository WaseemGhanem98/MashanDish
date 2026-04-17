import 'server-only';

import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

/**
 * Secret-key Supabase client. BYPASSES RLS.
 *
 * Uses the Supabase "secret" key (formerly "service_role"). Either naming
 * works at the API level; we use the newer "secret" terminology in env vars.
 *
 * SERVER-ONLY. Never import from a Client Component, never expose the returned
 * client to the browser. The `server-only` import causes a build-time error
 * if this module is pulled into a client bundle.
 *
 * Use only for:
 *   - Scheduled jobs (vendor email cron)
 *   - Admin bootstrap migrations
 *   - Other code paths where RLS would be incorrect (rare)
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!secretKey) {
    throw new Error('Missing required environment variable: SUPABASE_SECRET_KEY');
  }

  return createClient<Database>(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
