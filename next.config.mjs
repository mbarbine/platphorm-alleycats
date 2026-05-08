/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
