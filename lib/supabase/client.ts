import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/types/database';

/**
 * Supabase client for use in Client Components.
 * Stores the session in cookies (handled by `@supabase/ssr` automatically).
 */
export function createClient() {
  return createBrowserClient<Database>(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
  );
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
