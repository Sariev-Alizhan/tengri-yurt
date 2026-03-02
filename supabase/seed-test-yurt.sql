-- Test yurt for catalog. Run in Supabase SQL Editor.
-- 1) Get your supplier_id (replace with your auth user id if needed):
-- SELECT id FROM suppliers LIMIT 1;
-- Or: SELECT id FROM suppliers WHERE user_id = 'YOUR_AUTH_USER_UUID';

-- 2) Insert test yurt (replace SUPPLIER_ID with result from above):
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
  is_available,
  created_at
) VALUES (
  'SUPPLIER_ID',
  'Traditional Kazakh Yurt',
  'traditional-kazakh-yurt',
  'Handcrafted traditional yurt made by master artisans from Kazakhstan. Premium natural materials — sustainable wood, hand-pressed felt, and weather-resistant canvas.',
  6.0,
  6,
  10,
  20,
  4500,
  45,
  60,
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;
