'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

const SignInInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignInResult =
  | { ok: true }
  | { ok: false; error: string };

export async function signIn(formData: FormData): Promise<SignInResult> {
  const parsed = SignInInput.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { ok: false, error: 'Please enter a valid email and password.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      // Don't leak whether the email exists; treat all auth failures the same.
      return { ok: false, error: 'Invalid email or password.' };
    }
  } catch (err) {
    console.error('[signIn] unexpected error', err);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }

  // Outside try/catch: `redirect` works by throwing internally and must not be
  // swallowed.
  redirect('/');
}
