-- Add 6 new yurts to catalog
-- Run in Supabase SQL Editor
-- First, get your supplier_id: SELECT id FROM suppliers WHERE is_approved = true LIMIT 1;
-- Then replace 'YOUR_SUPPLIER_ID' below with the actual supplier_id

-- 1. Intimate Yurt
INSERT INTO yurts (
  supplier_id,
  name,
  slug,
  description,
  diameter_m,
  kanat,
  capacity_min,
  capacity_max,
  price_usd,
  production_days_min,
  production_days_max,
  photos,
  features,
  is_available,
  created_at
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Intimate',
  'intimate',
  'Perfect for meditation and private retreats. Compact yet comfortable, this yurt offers an intimate space for personal reflection and relaxation. Ideal for solo travelers or couples seeking a peaceful sanctuary.',
  4.5,
  6,
  4,
  6,
  3200,
  30,
  45,
  ARRAY['/images/picture/yurt_intimate_cozy_classic.png', '/images/picture/yurt_kazakhstan.jpeg'],
  ARRAY['Handcrafted wooden frame', 'Natural wool felt insulation', 'Weather-resistant canvas cover', 'Traditional Kazakh ornaments', 'Wooden door with lock', 'Smoke ring ventilation'],
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Cozy Yurt
INSERT INTO yurts (
  supplier_id,
  name,
  slug,
  description,
  diameter_m,
  kanat,
  capacity_min,
  capacity_max,
  price_usd,
  production_days_min,
  production_days_max,
  photos,
  features,
  is_available,
  created_at
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Cozy',
  'cozy',
  'Ideal for workshops and gatherings. This versatile yurt provides a warm and inviting atmosphere for small groups. Perfect for yoga sessions, creative workshops, or intimate family gatherings.',
  6.0,
  8,
  6,
  10,
  4500,
  35,
  50,
  ARRAY['/images/picture/yurt_intimate_cozy_classic.png', '/images/picture/yurt_shanyraq.jpeg'],
  ARRAY['Premium wood construction', 'Double-layer felt insulation', 'Waterproof canvas exterior', 'Hand-painted traditional patterns', 'Reinforced door frame', 'Adjustable roof ventilation', 'Interior rope system'],
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Classic Yurt
INSERT INTO yurts (
  supplier_id,
  name,
  slug,
  description,
  diameter_m,
  kanat,
  capacity_min,
  capacity_max,
  price_usd,
  production_days_min,
  production_days_max,
  photos,
  features,
  is_available,
  created_at
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Classic',
  'classic',
  'Popular for glamping and eco-resorts. The most versatile size for hospitality businesses. Combines authentic nomadic aesthetics with modern comfort standards. Perfect for boutique camping sites and eco-tourism.',
  9.0,
  12,
  10,
  15,
  7800,
  40,
  55,
  ARRAY['/images/picture/yurt_intimate_cozy_classic.png', '/images/picture/yurt_dubai.jpeg'],
  ARRAY['Master-crafted wooden lattice', 'Triple-layer felt insulation', 'UV-resistant canvas', 'Authentic Kazakh designs', 'Double door system', 'Crown wheel with adjustable cover', 'Interior support poles', 'Tension bands'],
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Spacious Yurt
INSERT INTO yurts (
  supplier_id,
  name,
  slug,
  description,
  diameter_m,
  kanat,
  capacity_min,
  capacity_max,
  price_usd,
  production_days_min,
  production_days_max,
  photos,
  features,
  is_available,
  created_at
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Spacious',
  'spacious',
  'For wellness retreats and dining. Generous interior space perfect for group activities, dining experiences, or wellness programs. Can accommodate comfortable seating arrangements and activity zones.',
  12.0,
  16,
  15,
  25,
  12500,
  45,
  60,
  ARRAY['/images/picture/yurt_spacious_grand_monumental.png', '/images/picture/in_the_yurt.jpeg'],
  ARRAY['Heavy-duty wooden structure', 'Premium wool felt layers', 'Commercial-grade canvas', 'Decorative felt bands', 'Wide entrance door', 'Central support system', 'Enhanced ventilation system', 'Reinforced tension cables'],
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Grand Yurt
INSERT INTO yurts (
  supplier_id,
  name,
  slug,
  description,
  diameter_m,
  kanat,
  capacity_min,
  capacity_max,
  price_usd,
  production_days_min,
  production_days_max,
  photos,
  features,
  is_available,
  created_at
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Grand',
  'grand',
  'Grand scale for events and festivals. Impressive structure designed for large gatherings, corporate events, and festival venues. Provides ample space for entertainment, dining, and social activities.',
  18.0,
  24,
  30,
  50,
  24000,
  50,
  70,
  ARRAY['/images/picture/yurt_spacious_grand_monumental.png', '/images/picture/yurt_lovebern.jpeg'],
  ARRAY['Industrial-strength framework', 'Multi-layer insulation system', 'Heavy-duty weatherproof canvas', 'Traditional ornamental designs', 'Double-width entrance', 'Advanced structural support', 'Multiple ventilation points', 'Professional-grade assembly system'],
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;

-- 6. Monumental Yurt
INSERT INTO yurts (
  supplier_id,
  name,
  slug,
  description,
  diameter_m,
  kanat,
  capacity_min,
  capacity_max,
  price_usd,
  production_days_min,
  production_days_max,
  photos,
  features,
  is_available,
  created_at
) VALUES (
  'YOUR_SUPPLIER_ID',
  'Monumental',
  'monumental',
  'For ceremonies and conferences. The ultimate statement piece for major events. This extraordinary structure can host large-scale ceremonies, conferences, and prestigious gatherings. A true architectural marvel of nomadic tradition.',
  27.0,
  36,
  60,
  100,
  45000,
  60,
  90,
  ARRAY['/images/picture/yurt_spacious_grand_monumental.png', '/images/picture/yurt_maiyami.jpeg'],
  ARRAY['Engineered wooden mega-structure', 'Premium multi-layer insulation', 'Commercial-grade weatherproof materials', 'Elaborate traditional artwork', 'Grand ceremonial entrance', 'Complex support architecture', 'Advanced climate control compatibility', 'Professional installation team required', 'Modular assembly system'],
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;
