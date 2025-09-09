/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Removido output: 'export' para permitir APIs no Vercel
  // Removido trailingSlash: true
  // Removido distDir: 'out'
  serverExternalPackages: ['firebase-admin']
}

export default nextConfig
