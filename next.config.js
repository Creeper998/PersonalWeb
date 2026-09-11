/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep this zone's JS/CSS/images separate from the Agent frontend at /_next.
  assetPrefix: '/_creeper',
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  images: { path: '/_creeper/_next/image' },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/_creeper/_next/image', destination: '/_next/image' },
        { source: '/_creeper/public/brand/:path*', destination: '/brand/:path*' },
      ],
    }
  },
  experimental: {
    serverActions: {
      // Exact local ingress hosts; no wildcard or arbitrary external origins.
      allowedOrigins: ['localhost:2026', '127.0.0.1:2026'],
    },
  },
  // Next.js 15 中 Server Actions 已经是稳定功能，无需 experimental
  // MDXEditor 需要被 transpile
  transpilePackages: ['@mdxeditor/editor'],
}

module.exports = nextConfig
