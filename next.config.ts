import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local assets only; the Sanity CDN host is added here when the CMS is connected.
    formats: ['image/avif', 'image/webp'],
    // 75 is the default; 85 is used for large editorial photography (Photo primitive).
    qualities: [75, 85],
  },
};

export default nextConfig;
