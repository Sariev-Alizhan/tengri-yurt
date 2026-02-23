# Аудит проекта Tengri Yurt (дата проверки)

## Результаты проверки

### Сборка и типы
- **Линтер (ESLint):** ошибок в `src` не обнаружено.
- **Сборка:** выполните локально `npm run build` перед пушем в git (в среде с кириллицей в пути команда из IDE может не выполниться — запускайте из корня проекта в терминале).

### Удалено как лишнее
- `src/lib/supabase-server.ts` — не использовался (везде используются `@/utils/supabase/server` и `@/lib/supabase`).

### Структура проекта (актуальная)

```
src/
├── app/
│   ├── api/                    # API routes (auth, orders, supplier)
│   ├── [locale]/               # Локализованные страницы (en, ru, kk, zh)
│   │   ├── catalog/
│   │   ├── order/
│   │   ├── supplier/           # Логин, регистрация, дашборд
│   │   │   ├── dashboard/      # Панель: главная, юрты, заказы, настройки, аксессуары
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── yurt/[slug]/
│   │   └── page.tsx (главная)
│   ├── layout.tsx
│   └── globals.css
├── components/                 # Navbar, секции главной, SupplierSidebar
├── lib/                        # supabase (service role), delivery, orders, resend
├── utils/supabase/            # client, server, middleware (сессия и cookie)
├── i18n.ts, routing.ts, middleware.ts
└── types/database.ts
```

### Безопасность и git
- В `.gitignore` добавлены: `.env`, `.env.local`, все `.env.*.local` — ключи не попадут в репозиторий.
- Не коммитьте файлы с ключами API (Supabase, Resend и т.д.).

### Перед загрузкой в git

1. Убедитесь, что в репозиторий не попадают:
   - папка `.next/` (уже в .gitignore);
   - файлы `.env*` (уже в .gitignore);
   - `node_modules/` (уже в .gitignore).

2. В корне проекта выполните:
   ```bash
   npm run build
   npm run lint
   ```
   Если обе команды проходят без ошибок — можно коммитить и пушить.

3. Рекомендуемый коммит:
   ```bash
   git add .
   git status   # проверьте список файлов
   git commit -m "Project audit: cleanup, types fix, ready for deploy"
   git push
   ```

### Зависимости (package.json)
- Next.js 14, next-intl, Supabase SSR, Resend, React 18, Tailwind — без лишних пакетов.

### Известные ограничения
- Сборка из скрипта в среде с кириллицей в пути может падать из-за кодировки PowerShell; в таком случае запускайте `npm run build` и `npm run lint` вручную из корня проекта.
