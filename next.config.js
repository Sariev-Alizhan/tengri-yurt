const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-intl', 'use-intl'],
  async rewrites() {
    return [
      // Чтобы в поиске (Google и др.) отображался логотип: запрос favicon.ico отдаёт logo
      { source: '/favicon.ico', destination: '/images/logo_white.png' },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/**' },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
