import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local assets only; the Sanity CDN host is added here when the CMS is connected.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
