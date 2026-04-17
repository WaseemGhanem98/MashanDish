import 'server-only';

import { cache } from 'react';
import type { User } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/supabase/types';

/**
 * Returns the currently authenticated Supabase user, or `null`.
 *
 * Memoized per-request via `React.cache` so calling it from multiple Server
 * Components in the same render produces a single network round-trip.
 *
 * Uses `getUser()` (NOT `getSession()`) — `getUser()` validates the JWT with
 * the Supabase auth server, which is what we want for authZ decisions.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Returns the profile row for the current user, or `null` if signed out
 * or if the profile row hasn't been created yet (the `handle_new_user`
 * trigger creates it on signup, but this guards against races).
 *
 * Role checks MUST go through this — never trust JWT metadata for authZ
 * (per `.cursor/rules/supabase.mdc`).
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('[auth] failed to load profile', error);
    return null;
  }
  return data;
});
