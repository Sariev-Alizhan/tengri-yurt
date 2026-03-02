-- Accessories table for Tengri Yurt
-- Run in Supabase SQL Editor

-- Accessories (felt carpets, furniture, covers, etc.)
CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('carpet', 'furniture', 'cover', 'other')) NOT NULL,
  price_usd INTEGER,
  price_kzt INTEGER,
  photos TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  production_days_min INTEGER DEFAULT 0,
  production_days_max INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-update updated_at
CREATE TRIGGER accessories_updated_at
BEFORE UPDATE ON accessories
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for accessories
-- Public can read available accessories
CREATE POLICY "Public can read available accessories" ON accessories
  FOR SELECT USING (
    is_available = TRUE
    OR EXISTS (SELECT 1 FROM suppliers s WHERE s.id = accessories.supplier_id AND s.user_id = auth.uid())
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Supplier can insert own accessories
CREATE POLICY "Supplier can insert own accessories" ON accessories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid() AND s.is_approved = TRUE)
  );

-- Supplier can update own accessories
CREATE POLICY "Supplier can update own accessories" ON accessories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = accessories.supplier_id AND s.user_id = auth.uid())
  );

-- Supplier can delete own accessories
CREATE POLICY "Supplier can delete own accessories" ON accessories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = accessories.supplier_id AND s.user_id = auth.uid())
  );

-- Admins can do anything on accessories
CREATE POLICY "Admins can do anything on accessories" ON accessories
  FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Order items (to support ordering multiple items: yurts + accessories)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT CHECK (item_type IN ('yurt', 'accessory')) NOT NULL,
  yurt_id UUID REFERENCES yurts(id) ON DELETE SET NULL,
  accessory_id UUID REFERENCES accessories(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  unit_price_usd INTEGER NOT NULL,
  total_price_usd INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS for order_items (same as orders)
CREATE POLICY "Users can read own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o 
      WHERE o.id = order_items.order_id 
      AND (
        o.buyer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM suppliers s WHERE s.id = o.supplier_id AND s.user_id = auth.uid())
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
      )
    )
  );

CREATE POLICY "Users can insert order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o 
      WHERE o.id = order_id 
      AND (o.buyer_id = auth.uid() OR o.buyer_id IS NULL)
    )
  );

-- Storage bucket for accessory photos (run in Supabase Dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('accessory-photos', 'accessory-photos', true);
-- CREATE POLICY "Public read accessory photos" ON storage.objects FOR SELECT USING (bucket_id = 'accessory-photos');
-- CREATE POLICY "Supplier upload accessory photos" ON storage.objects FOR INSERT WITH CHECK (
--   bucket_id = 'accessory-photos' AND auth.role() = 'authenticated'
-- );
-- CREATE POLICY "Supplier update own accessory photos" ON storage.objects FOR UPDATE USING (bucket_id = 'accessory-photos');
-- CREATE POLICY "Supplier delete own accessory photos" ON storage.objects FOR DELETE USING (bucket_id = 'accessory-photos');
