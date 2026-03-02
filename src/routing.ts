import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'kk', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
