# Миграция аксессуаров в базу данных

## Обзор изменений

Аксессуары теперь хранятся в базе данных вместо хардкода. Это позволяет:
- Динамически управлять аксессуарами через админ-панель
- Отслеживать заказы аксессуаров отдельно
- Показывать поставщикам детальную информацию о заказанных аксессуарах

## Шаги для миграции

### 1. Обновить схему базы данных

Выполните SQL миграцию для добавления мультиязычных полей:

```bash
# В Supabase SQL Editor выполните:
cat supabase/migrations/add-multilingual-accessories.sql
```

Или выполните SQL напрямую:

```sql
ALTER TABLE accessories 
ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS history_i18n JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_accessories_slug ON accessories(slug);
CREATE INDEX IF NOT EXISTS idx_accessories_category ON accessories(category);
CREATE INDEX IF NOT EXISTS idx_accessories_available ON accessories(is_available);
```

### 2. Запустить миграцию данных

Убедитесь, что в `.env.local` есть переменные:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Затем выполните:

```bash
cd tengri-yurt
npx tsx scripts/migrate-accessories.ts
```

Скрипт:
- Найдет первого одобренного поставщика
- Вставит все 20 традиционных аксессуаров в таблицу `accessories`
- Пропустит уже существующие записи

### 3. Добавить фотографии аксессуаров

#### Вариант А: Использовать placeholder изображения

```bash
# Требует ImageMagick
brew install imagemagick

# Создать placeholder изображения
./scripts/create-placeholder-images.sh
```

#### Вариант Б: Добавить реальные фотографии

Поместите фотографии в `public/images/accessories/` с названиями:
- `shanyrak.jpg`
- `uyk.jpg`
- `kerege.jpg`
- и т.д.

См. `public/images/accessories/README.md` для полного списка.

### 4. Проверить работу

1. Откройте страницу заказа юрты: `/order/[yurtId]`
2. Должна появиться модалка с аксессуарами из базы данных
3. Выберите несколько аксессуаров и создайте заказ
4. Перейдите в панель поставщика: `/supplier/dashboard/orders`
5. Проверьте, что аксессуары отображаются в отдельной секции

## Структура базы данных

### Таблица `accessories`

```
- id (UUID)
- supplier_id (UUID) - ссылка на поставщика
- name (TEXT) - основное название (англ.)
- slug (TEXT) - уникальный идентификатор
- description (TEXT) - описание (англ.)
- name_i18n (JSONB) - {"ru": "...", "en": "...", "kk": "..."}
- description_i18n (JSONB) - мультиязычные описания
- history_i18n (JSONB) - история на всех языках
- category (TEXT) - carpet, furniture, cover, other
- price_usd (INTEGER)
- price_kzt (INTEGER)
- photos (TEXT[]) - массив путей к фото
- is_available (BOOLEAN)
- stock_quantity (INTEGER)
- production_days_min (INTEGER)
- production_days_max (INTEGER)
```

### Таблица `order_items`

Теперь используется для хранения аксессуаров в заказах:

```
- id (UUID)
- order_id (UUID) - ссылка на заказ
- item_type (TEXT) - 'yurt' или 'accessory'
- yurt_id (UUID, nullable)
- accessory_id (UUID, nullable)
- quantity (INTEGER)
- unit_price_usd (INTEGER)
- total_price_usd (INTEGER)
```

## API Endpoints

### GET `/api/accessories`

Получить список аксессуаров:

```
GET /api/accessories?locale=ru&category=carpet
```

Параметры:
- `locale` (optional) - ru, en, kk
- `category` (optional) - carpet, furniture, cover, other

Ответ:
```json
{
  "accessories": [
    {
      "id": "shanyrak",
      "name": "Шаңырақ",
      "description": "...",
      "history": "...",
      "price_kzt": 850000,
      "price_usd": 1900,
      "category": "other",
      "photos": ["/images/accessories/shanyrak.jpg"]
    }
  ]
}
```

## Изменения в коде

### 1. `AccessoryModal.tsx`
- Теперь загружает аксессуары из API вместо хардкода
- Использует `useEffect` для загрузки данных при открытии

### 2. `OrderForm.tsx`
- Отправляет `selectedAccessories` в API заказов
- Аксессуары сохраняются в `order_items`

### 3. `OrdersList.tsx` (Supplier Dashboard)
- Показывает аксессуары в отдельной секции
- Отображает название, количество и цену каждого аксессуара
- Исправлена проблема с гидратацией (использует `formatNumber` вместо `toLocaleString`)

### 4. API `/api/orders/route.ts`
- Создает записи в `order_items` для юрты
- Создает записи в `order_items` для каждого выбранного аксессуара

## Откат изменений

Если нужно вернуться к хардкоду:

1. В `AccessoryModal.tsx` импортируйте обратно:
```typescript
import { TRADITIONAL_ACCESSORIES } from '@/data/accessories';
```

2. Удалите `useEffect` и `fetchAccessories`

3. Замените `accessories` на `TRADITIONAL_ACCESSORIES`

Файл `src/data/accessories.ts` остался без изменений для совместимости.

## Troubleshooting

### Ошибка: "No approved suppliers found"
Создайте поставщика через админ-панель и одобрите его.

### Аксессуары не загружаются
Проверьте:
1. Выполнена ли миграция SQL
2. Запущен ли скрипт `migrate-accessories.ts`
3. Есть ли записи в таблице `accessories`

### Hydration error с числами
Убедитесь, что используется функция `formatNumber` вместо `toLocaleString()` во всех клиентских компонентах.

## Дальнейшие улучшения

- [ ] Админ-панель для управления аксессуарами
- [ ] Загрузка фотографий через UI
- [ ] Фильтрация аксессуаров по категориям
- [ ] Поиск аксессуаров
- [ ] Управление наличием и количеством на складе
- [ ] Статистика по популярности аксессуаров
