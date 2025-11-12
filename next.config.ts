import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  
  // ⚡ ОПТИМІЗАЦІЯ: Performance & Production optimizations
  reactStrictMode: true, // Виявлення потенційних проблем
  
  // Компресія та оптимізація
  compress: true, // Gzip compression
  
  // Оптимізація зображень
  images: {
    formats: ['image/avif', 'image/webp'], // Сучасні формати
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 рік кешування
  },
  
  // Experimental features для кращої продуктивності
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'], // Tree-shaking для іконок
  },
  
  // Production only: виключити source maps
  productionBrowserSourceMaps: false,
  
  // Ensure proper host binding for Safari
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          // ⚡ ОПТИМІЗАЦІЯ: Cache headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
