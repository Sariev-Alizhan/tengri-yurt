# Tengri Yurt — отчёт по аудиту проекта (5 этапов)

## Этап 1 — Обзор и фиксация секций

Проведена полная инвентаризация:

- **Маршруты:** корень `/`, локализованные `/[locale]`, каталог, карточки юрт/аксессуаров, корзина, чекаут, заказы, успех заказа, поставщик (логин, регистрация, дашборд, юрты, аксессуары, заказы, настройки).
- **Секции главной:** Hero, CTA, About, Why, Marquee, Process, Gallery, Testimonials, Footer.
- **Файлы локализации:** `messages/en.json`, `ru.json`, `kk.json`, `zh.json` — единая структура по неймспейсам (nav, hero, cta, about, why, process, gallery, testimonials, footer, catalog, order, cartPage, checkout, success, supplier).
- **API:** auth/login, exchange-rate, orders (POST, cart, accessory, accessories, [id]/status), supplier (register, profile, yurts, accessories), admin (run-sql, migrate).
- **Компоненты:** CartLayout, Navbar, CartProvider, ExchangeRateProvider, PriceUsdKzt, YurtDetailAddToCart, AccessoryDetailAddToCart, секции главной и т.д.

## Этап 2 — Проверка секций по очереди

- Сверены ключи переводов между `en` и `ru`, `kk`, `zh`.
- Обнаружено: в `zh` отсутствовал ключ `success.accessoriesButton`.

## Этап 3 — Функция и структура секций

- Главная: секции получают переводы через `getTranslations` в `page.tsx` и пропсы.
- Каталог: `CatalogClient` использует `useTranslations('catalog')`, карточки и кнопки вынесены из `Link` для корректной работы Add to cart.
- Корзина/чекаут/успех: переводы из `cartPage`, `checkout`, `success`.
- Детали юрты/аксессуара: описание и история из каталога/БД, блоки оформлены.
- Поставщик: переводы из неймспейса `supplier`.

## Этап 4 — Исправления по секциям

1. **Локализация**
   - В `messages/zh.json` добавлен ключ `success.accessoriesButton`: `"配件"`.
   - В секции **Why** во всех четырёх локалях добавлен массив `stats` (Years of craft, Countries, Yurts built, Artisans) с переводами для ru, kk, zh.
   - В секции **footer** во всех четырёх локалях добавлен ключ `address` (Almaty, Kazakhstan и переводы).
   - Компонент **WhySection** переведён на использование `t.raw('stats')` вместо захардкоженного массива.
   - Компонент **FooterSection** получает `address` пропсом; в `page.tsx` передаётся `tFooter('address')`.

2. **Структура**
   - Ранее исправлено: кнопки каталога (Add to cart, View Details) вынесены из обёртки `Link`, чтобы Add to cart работал; для деталей товаров добавлены блоки «Описание» и «История» с переводами.

## Этап 5 — Финальная проверка

- Выполнена полная сборка: `npm run build` — **успешно** (17/17 страниц).
- Типы и линт без ошибок.
- Предупреждения только по использованию `<img>` вместо `next/image` в каталоге, дашборде поставщика и Navbar — на работу не влияют, при желании можно постепенно заменить на `next/image`.

## Итог

- Все ключи локализации в `en`, `ru`, `kk`, `zh` приведены к единому набору; недостающий ключ в `zh` и отсутствующая локализация блока статистики (Why) и адреса (Footer) добавлены и подключены.
- Секции главной, каталога, корзины, заказов и панели поставщика используют переводы из соответствующих неймспейсов.
- Проект собирается без ошибок и готов к деплою и дальнейшей проверке в браузере на всех локалях (en, ru, kk, zh).
