/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['arcticum.yanao.ru'],
  }
}

module.exports = nextConfig 