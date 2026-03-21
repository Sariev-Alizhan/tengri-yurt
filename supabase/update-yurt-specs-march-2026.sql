-- Обновление данных юрт по прайс-листу от марта 2026
-- Запустить в Supabase SQL Editor

-- 6-канатная (slug: intimate)
UPDATE yurts SET
  name             = 'Казахская 6-канатная',
  diameter_m       = 5.5,
  kanat            = 6,
  capacity_min     = 15,
  capacity_max     = 20,
  price_usd        = 7647,
  description      = 'Традиционная казахская 6-канатная юрта. Диаметр: 5,5 м, площадь: 23,7 м², высота: 3,6 м, вес: ~600 кг. Вместимость: 15–20 человек.'
WHERE slug = 'intimate';

-- 8-канатная (slug: cozy)
UPDATE yurts SET
  name             = 'Казахская 8-канатная',
  diameter_m       = 6.0,
  kanat            = 8,
  capacity_min     = 25,
  capacity_max     = 30,
  price_usd        = 9412,
  description      = 'Традиционная казахская 8-канатная юрта. Диаметр: 6 м, площадь: 28,3 м², высота: 4 м, вес: ~700 кг. Вместимость: 25–30 человек.'
WHERE slug = 'cozy';

-- 12-канатная (slug: classic)
UPDATE yurts SET
  name             = 'Казахская 12-канатная',
  diameter_m       = 8.0,
  kanat            = 12,
  capacity_min     = 35,
  capacity_max     = 55,
  price_usd        = 14706,
  description      = 'Традиционная казахская 12-канатная юрта. Диаметр: 8 м, площадь: 50 м², высота: 4,7 м, вес: ~800 кг. Вместимость: 35–55 человек.'
WHERE slug = 'classic';

-- 16-канатная (slug: spacious)
UPDATE yurts SET
  name             = 'Казахская 16-канатная',
  diameter_m       = 9.0,
  kanat            = 16,
  capacity_min     = 60,
  capacity_max     = 80,
  price_usd        = 17451,
  description      = 'Традиционная казахская 16-канатная юрта. Диаметр: 9 м, площадь: 63 м², высота: 4,8 м, вес: ~1500 кг. Вместимость: 60–80 человек.'
WHERE slug = 'spacious';

-- Проверка результата
SELECT slug, name, diameter_m, kanat, capacity_min, capacity_max, price_usd
FROM yurts
WHERE slug IN ('intimate', 'cozy', 'classic', 'spacious')
ORDER BY kanat;
