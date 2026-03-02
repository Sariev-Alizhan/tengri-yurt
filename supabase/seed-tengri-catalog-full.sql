-- Tengri Yurt catalog: 6 yurts + 6 accessories (as on https://www.tengri-yurt.kz/en/catalog)
-- Run in Supabase SQL Editor.
-- 1) Get supplier_id: SELECT id FROM suppliers WHERE is_approved = true LIMIT 1;
-- 2) Replace YOUR_SUPPLIER_ID below with that UUID.

-- ========== 6 YURTS (Intimate, Cozy, Classic, Spacious, Grand, Monumental) ==========
INSERT INTO yurts (
  supplier_id, name, slug, description, diameter_m, kanat,
  capacity_min, capacity_max, price_usd, production_days_min, production_days_max,
  photos, features, is_available
) VALUES
  ('YOUR_SUPPLIER_ID', 'Intimate', 'intimate',
   'Compact traditional yurt for 4–6 people. Ideal for retreats and small gatherings.',
   4.5, 6, 4, 6, 3200, 30, 45,
   ARRAY[]::TEXT[], ARRAY['Handcrafted wooden frame', 'Natural wool felt', 'Weather-resistant canvas']::TEXT[],
   true),
  ('YOUR_SUPPLIER_ID', 'Cozy', 'cozy',
   'Cozy yurt for 6–10 guests. Perfect for family events and glamping.',
   6, 8, 6, 10, 4500, 35, 50,
   ARRAY[]::TEXT[], ARRAY['Premium wood', 'Double-layer felt', 'Traditional patterns']::TEXT[],
   true),
  ('YOUR_SUPPLIER_ID', 'Classic', 'classic',
   'Classic 9m yurt for 10–15 people. Our most popular model for events and lodges.',
   9, 12, 10, 15, 7800, 40, 55,
   ARRAY[]::TEXT[], ARRAY['Master-crafted lattice', 'Triple-layer felt', 'UV-resistant canvas']::TEXT[],
   true),
  ('YOUR_SUPPLIER_ID', 'Spacious', 'spacious',
   'Spacious 12m yurt for 15–25 people. Ideal for workshops and medium events.',
   12, 16, 15, 25, 12500, 45, 60,
   ARRAY[]::TEXT[], ARRAY['Heavy-duty structure', 'Premium wool felt', 'Commercial-grade canvas']::TEXT[],
   true),
  ('YOUR_SUPPLIER_ID', 'Grand', 'grand',
   'Grand 18m yurt for 30–50 guests. For festivals and large gatherings.',
   18, 24, 30, 50, 24000, 50, 70,
   ARRAY[]::TEXT[], ARRAY['Industrial-strength framework', 'Multi-layer insulation', 'Professional assembly']::TEXT[],
   true),
  ('YOUR_SUPPLIER_ID', 'Monumental', 'monumental',
   'Monumental 27m yurt for 60–100 people. The largest traditional format.',
   27, 36, 60, 100, 45000, 60, 90,
   ARRAY[]::TEXT[], ARRAY['Engineered mega-structure', 'Premium insulation', 'Professional installation']::TEXT[],
   true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  diameter_m = EXCLUDED.diameter_m,
  kanat = EXCLUDED.kanat,
  capacity_min = EXCLUDED.capacity_min,
  capacity_max = EXCLUDED.capacity_max,
  price_usd = EXCLUDED.price_usd,
  production_days_min = EXCLUDED.production_days_min,
  production_days_max = EXCLUDED.production_days_max,
  is_available = EXCLUDED.is_available;

-- ========== 6 ACCESSORIES (with name_i18n en/ru/kk/zh) ==========
-- Felt carpet
INSERT INTO accessories (
  supplier_id, name, slug, category, description,
  price_usd, price_kzt, stock_quantity, production_days_min, production_days_max,
  is_available, name_i18n, description_i18n
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Felt carpet',
  'felt-carpet',
  'carpet',
  'Handmade felt carpet for yurt floor. Natural wool, traditional patterns. Various sizes on request.',
  450, 230000, 0, 30, 45, true,
  '{"en":"Felt carpet","ru":"Войлочный ковёр","kk":"Кілем төсеніш","zh":"毡毯"}'::JSONB,
  '{"en":"Handmade felt carpet for yurt floor. Natural wool, traditional patterns.","ru":"Войлочный ковёр для пола юрты. Натуральная шерсть, традиционные узоры.","kk":"Кілем төсеніш. Табиғи жүн, дәстүрлі үлгілер.","zh":"手工毡毯，适用于蒙古包地面。天然羊毛，传统图案。"}'::JSONB
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  price_kzt = EXCLUDED.price_kzt,
  name_i18n = EXCLUDED.name_i18n,
  description_i18n = EXCLUDED.description_i18n,
  is_available = EXCLUDED.is_available;

-- Low table
INSERT INTO accessories (
  supplier_id, name, slug, category, description,
  price_usd, price_kzt, stock_quantity, production_days_min, production_days_max,
  is_available, name_i18n, description_i18n
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Low table',
  'low-table',
  'furniture',
  'Traditional low wooden table for yurt interior. Fits 4–6 people.',
  380, 195000, 0, 30, 45, true,
  '{"en":"Low table","ru":"Низкий стол","kk":"Төмен үстел","zh":"矮桌"}'::JSONB,
  '{"en":"Traditional low wooden table for yurt interior. Fits 4–6 people.","ru":"Традиционный низкий деревянный стол для юрты. На 4–6 человек.","kk":"Киіз үйге арналған дәстүрлі төмен ағаш үстел. 4–6 адам.","zh":"传统矮木桌，适用于蒙古包内。可坐4–6人。"}'::JSONB
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  price_kzt = EXCLUDED.price_kzt,
  name_i18n = EXCLUDED.name_i18n,
  description_i18n = EXCLUDED.description_i18n,
  is_available = EXCLUDED.is_available;

-- Stools set
INSERT INTO accessories (
  supplier_id, name, slug, category, description,
  price_usd, price_kzt, stock_quantity, production_days_min, production_days_max,
  is_available, name_i18n, description_i18n
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Stools set',
  'stools-set',
  'furniture',
  'Set of 4 wooden stools for yurt. Compact and stackable.',
  320, 165000, 0, 30, 45, true,
  '{"en":"Stools set","ru":"Набор табуретов","kk":"Орындықтар жинағы","zh":"凳子套装"}'::JSONB,
  '{"en":"Set of 4 wooden stools for yurt. Compact and stackable.","ru":"Набор из 4 деревянных табуретов для юрты. Компактные, штабелируемые.","kk":"Киіз үйге 4 ағаш орындық. Ыңғайлы.","zh":"4件木凳套装，适用于蒙古包。紧凑可叠放。"}'::JSONB
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  price_kzt = EXCLUDED.price_kzt,
  name_i18n = EXCLUDED.name_i18n,
  description_i18n = EXCLUDED.description_i18n,
  is_available = EXCLUDED.is_available;

-- White cover
INSERT INTO accessories (
  supplier_id, name, slug, category, description,
  price_usd, price_kzt, stock_quantity, production_days_min, production_days_max,
  is_available, name_i18n, description_i18n
) VALUES (
  'YOUR_SUPPLIER_ID',
  'White cover',
  'white-cover',
  'cover',
  'White outer cover for yurt. Weather-resistant, custom size to order. Production 1 month.',
  NULL, 1000000, 0, 30, 45, true,
  '{"en":"White cover","ru":"Белый чехол","kk":"Ақ жабық","zh":"白色外罩"}'::JSONB,
  '{"en":"White outer cover for yurt. Weather-resistant, custom size to order.","ru":"Белый внешний чехол для юрты. Влагозащита, размер под заказ.","kk":"Киіз үйге ақ сыртқы жабық. Өлшем бойынша тапсырыс.","zh":"蒙古包白色外罩。防风雨，可定制尺寸。"}'::JSONB
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  price_kzt = EXCLUDED.price_kzt,
  name_i18n = EXCLUDED.name_i18n,
  description_i18n = EXCLUDED.description_i18n,
  is_available = EXCLUDED.is_available;

-- Transparent cover
INSERT INTO accessories (
  supplier_id, name, slug, category, description,
  price_usd, price_kzt, stock_quantity, production_days_min, production_days_max,
  is_available, name_i18n, description_i18n
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Transparent cover',
  'transparent-cover',
  'cover',
  'Transparent PVC cover for yurt. Lets light in, protects from rain. Custom order, 1 month production.',
  NULL, 1000000, 0, 30, 45, true,
  '{"en":"Transparent cover","ru":"Прозрачный чехол","kk":"Мөлдір жабық","zh":"透明外罩"}'::JSONB,
  '{"en":"Transparent PVC cover for yurt. Lets light in, protects from rain.","ru":"Прозрачный чехол из ПВХ для юрты. Пропускает свет, защита от дождя.","kk":"Киіз үйге мөлдір жабық. Жарық өтеді, жаңбырдан қорғайды.","zh":"透明PVC外罩。透光防雨。可定制。"}'::JSONB
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  price_kzt = EXCLUDED.price_kzt,
  name_i18n = EXCLUDED.name_i18n,
  description_i18n = EXCLUDED.description_i18n,
  is_available = EXCLUDED.is_available;

-- Furniture set
INSERT INTO accessories (
  supplier_id, name, slug, category, description,
  price_usd, price_kzt, stock_quantity, production_days_min, production_days_max,
  is_available, name_i18n, description_i18n
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Furniture set',
  'furniture-set',
  'furniture',
  'Complete yurt interior: low table, stools, felt carpets. Custom configuration on request.',
  1200, 610000, 0, 30, 60, true,
  '{"en":"Furniture set","ru":"Набор мебели","kk":"Жиһаз жинағы","zh":"家具套装"}'::JSONB,
  '{"en":"Complete yurt interior: low table, stools, felt carpets. Custom configuration on request.","ru":"Полный интерьер юрты: низкий стол, табуреты, войлочные ковры. Конфигурация под заказ.","kk":"Киіз үй интерьері: үстел, орындықтар, кілемдер. Тапсырыс бойынша.","zh":"完整蒙古包内饰：矮桌、凳子、毡毯。可定制配置。"}'::JSONB
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price_usd = EXCLUDED.price_usd,
  price_kzt = EXCLUDED.price_kzt,
  name_i18n = EXCLUDED.name_i18n,
  description_i18n = EXCLUDED.description_i18n,
  is_available = EXCLUDED.is_available;
