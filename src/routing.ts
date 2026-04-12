import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'kk', 'zh', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // Только префикс в URL определяет язык — иначе cookie / Accept-Language дают «случайные» переключения (напр. kk на мобилке).
  localeDetection: false,
});
