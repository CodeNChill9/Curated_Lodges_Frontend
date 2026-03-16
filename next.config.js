/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prevent Next.js from bundling server-only packages
  serverExternalPackages: ["mongoose", "googleapis", "google-auth-library"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'junglore.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
