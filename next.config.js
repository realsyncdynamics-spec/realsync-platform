/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow production builds to complete even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  // Enable standalone output for optimal deployment
  output: 'standalone',
  // Optimize images
  images: {
    domains: ['realsyncdynamics.de', 'supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  // Experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', 'realsyncdynamics.de'],
    },
  },
};

module.exports = nextConfig;
