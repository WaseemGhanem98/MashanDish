import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error('[sign-out] supabase signOut failed', err);
    // Fall through and redirect anyway — the cookie may have been cleared.
  }

  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl, { status: 303 });
}
