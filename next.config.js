/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['arcticum.yanao.ru'],
  },
  // Explicitly set to use Pages Router
  experimental: {
    appDir: false
  }
}

module.exports = nextConfig 