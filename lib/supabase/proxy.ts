import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import type { Database } from '@/types/database';

/**
 * Refreshes the Supabase auth session cookie on every request.
 *
 * Called from the root `proxy.ts` (formerly `middleware.ts` pre-Next 16).
 *
 * Why this exists: Supabase access tokens are short-lived (~1 hour). Without
 * a server-side refresh, a user who keeps a tab open eventually has their
 * Server Component reads start returning unauthenticated. The proxy reads the
 * refresh token cookie, hits Supabase to get a new access token, and writes
 * the new cookie back on the response so the browser keeps it.
 *
 * IMPORTANT: do not add code between `createServerClient` and `getUser()`,
 * and do not mutate `supabaseResponse` between them — see
 * https://supabase.com/docs/guides/auth/server-side/nextjs for the rationale.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Triggers the refresh side-effect. Result is intentionally unused here;
  // layouts re-fetch the user with their own client.
  await supabase.auth.getUser();

  return supabaseResponse;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
