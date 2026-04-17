import type { NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on every path EXCEPT:
     * - _next/static, _next/image (build assets)
     * - favicon, robots, sitemap, manifest, apple-touch-icon (metadata)
     * - any file with an extension under /public (svg/png/jpg/etc.)
     *
     * API routes are intentionally INCLUDED so route handlers also get a
     * refreshed session cookie.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|apple-touch-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
