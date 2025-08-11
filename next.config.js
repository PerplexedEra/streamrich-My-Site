/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Enable styled-components support with minimal configuration
    styledComponents: true,
  },
  webpack: (config) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
    };
    return config;
  },
  // Remove experimental font loaders as they're not needed in newer Next.js versions
  // Font optimization is handled automatically by Next.js 13+
};

module.exports = nextConfig;
