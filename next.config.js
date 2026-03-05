/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
