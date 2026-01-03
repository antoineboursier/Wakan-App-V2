import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mmrqlfijwfbkvutaaxid.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  env: {
    // Get latest commit hash and date during build time
    NEXT_PUBLIC_APP_VERSION: require('child_process')
      .execSync('git log -1 --format="%h - %cd" --date=short')
      .toString()
      .trim(),
  },
};

export default nextConfig;
