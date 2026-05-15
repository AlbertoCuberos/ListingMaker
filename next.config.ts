import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['playwright-core', '@sparticuz/chromium-min', 'firebase-admin', 'firebase'],
};

export default nextConfig;
