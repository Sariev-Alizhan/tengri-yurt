-- Добавить колонки price_usd_max и rental_price_usd
ALTER TABLE yurts ADD COLUMN IF NOT EXISTS price_usd_max INTEGER DEFAULT NULL;
ALTER TABLE yurts ADD COLUMN IF NOT EXISTS rental_price_usd INTEGER DEFAULT NULL;

-- Обновить 4 юрты: диапазон цен, размеры, цена аренды

-- 6-канатная: 5x5, $5k–$8k, аренда от $1k
UPDATE yurts SET
  diameter_m       = 5,
  price_usd        = 5000,
  price_usd_max    = 8000,
  rental_price_usd = 1000
WHERE slug = 'intimate';

-- 8-канатная: 6x6, $6k–$10k, аренда от $1k
UPDATE yurts SET
  diameter_m       = 6,
  price_usd        = 6000,
  price_usd_max    = 10000,
  rental_price_usd = 1000
WHERE slug = 'cozy';

-- 12-канатная: 8x8, $14k–$20k, аренда от $1.5k
UPDATE yurts SET
  diameter_m       = 8,
  price_usd        = 14000,
  price_usd_max    = 20000,
  rental_price_usd = 1500
WHERE slug = 'classic';

-- 16-канатная: 9x9, $17k–$25k, аренда от $2k
UPDATE yurts SET
  diameter_m       = 9,
  price_usd        = 17000,
  price_usd_max    = 25000,
  rental_price_usd = 2000
WHERE slug = 'spacious';

-- Проверка
SELECT slug, name, diameter_m, price_usd, price_usd_max, rental_price_usd
FROM yurts
WHERE slug IN ('intimate', 'cozy', 'classic', 'spacious')
ORDER BY kanat;
