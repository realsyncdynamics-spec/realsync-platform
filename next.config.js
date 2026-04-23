/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "realsyncdynamics.de", "*.vercel.app"]
    }
  }
};

module.exports = nextConfig;
