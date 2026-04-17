import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Enables `forbidden()` and `unauthorized()` from `next/navigation` so
    // server-side authZ can short-circuit into the matching `forbidden.tsx` /
    // `unauthorized.tsx` pages. Required as of Next 15+.
    authInterrupts: true,
  },
};

export default nextConfig;
