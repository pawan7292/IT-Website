/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only recognize TypeScript files as pages/routes — prevents the workspace
  // Vite app (src/pages/*.jsx) from being compiled as Next.js Pages Router routes.
  pageExtensions: ['tsx', 'ts'],
  experimental: {
    // Exclude workspace and binary files from build trace collection to prevent timeout
    outputFileTracingExcludes: {
      '*': ['src/**', 'node_modules/@swc/core-linux-x64-gnu', 'node_modules/@swc/core-linux-x64-musl'],
    },
  },
  images: {
    // Bypass the Next.js image optimization proxy in development.
    // The proxy fetches images server-side using Node.js, which fails when
    // SSL certificates cannot be verified (corporate proxy / antivirus).
    // Browsers handle SSL correctly, so unoptimized loads work fine locally.
    // In production (Vercel / any server with valid certs) this is false,
    // so full optimization (WebP conversion, resizing, caching) is enabled.
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  trailingSlash: false,
}

export default nextConfig
