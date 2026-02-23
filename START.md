# 🚀 Быстрый запуск Tengri Yurt

## Откройте обычный Terminal (не Cursor) и выполните:

```bash
cd /Users/nuraliserikbay/tengri-yurt/tengri-yurt

# Установка зависимостей
npm install

# Создание .env.local (если нужно)
cp .env.example .env.local

# Запуск на порту 3003
npm run dev -- -p 3003
```

## Или одной командой:

```bash
cd /Users/nuraliserikbay/tengri-yurt/tengri-yurt && npm install && npm run dev -- -p 3003
```

## После запуска откройте:
**http://localhost:3003/en**

---

## Проблема с npm install?

Если npm install зависает, попробуйте:

```bash
# Очистка
rm -rf node_modules package-lock.json

# Установка с --legacy-peer-deps
npm install --legacy-peer-deps

# Запуск
npm run dev -- -p 3003
```

---

## Настройка .env.local

Отредактируйте `.env.local` и добавьте ваши ключи:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
EMAIL_FROM=orders@tengri-camp.kz
NEXT_PUBLIC_BASE_URL=http://localhost:3003
```
