-- Tengri Yurt Marketplace — full schema with RLS
-- Run in Supabase SQL Editor

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('buyer', 'supplier', 'admin')) DEFAULT 'buyer',
  full_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  description TEXT,
  country TEXT,
  logo_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier delivery times by region
CREATE TABLE supplier_delivery_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  delivery_days INTEGER NOT NULL,
  UNIQUE(supplier_id, region)
);

-- Yurts
CREATE TABLE yurts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  diameter_m NUMERIC,
  kanat INTEGER,
  capacity_min INTEGER,
  capacity_max INTEGER,
  price_usd INTEGER NOT NULL,
  production_days_min INTEGER DEFAULT 30,
  production_days_max INTEGER DEFAULT 60,
  photos TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (inquiry-based: payment_status awaiting_invoice → invoice_sent → paid; no Stripe)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  yurt_id UUID REFERENCES yurts(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  delivery_country TEXT NOT NULL,
  delivery_city TEXT,
  delivery_address TEXT,
  quantity INTEGER DEFAULT 1,
  message TEXT,
  unit_price_usd INTEGER NOT NULL,
  total_price_usd INTEGER NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('awaiting_invoice', 'invoice_sent', 'paid', 'cancelled')) DEFAULT 'awaiting_invoice',
  status TEXT CHECK (status IN (
    'pending', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled'
  )) DEFAULT 'pending',
  estimated_production_days INTEGER,
  estimated_delivery_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_delivery_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE yurts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Suppliers: public read approved suppliers; own row for supplier; admin full
CREATE POLICY "Anyone can read approved suppliers" ON suppliers
  FOR SELECT USING (is_approved = TRUE OR user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "Supplier can update own row" ON suppliers
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "User can insert supplier (pending approval)" ON suppliers
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update any supplier" ON suppliers
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Supplier delivery times: supplier manages own; admin read
CREATE POLICY "Supplier can manage own delivery times" ON supplier_delivery_times
  FOR ALL USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Admins and supplier read delivery times" ON supplier_delivery_times
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = supplier_id AND (s.user_id = auth.uid() OR s.is_approved = TRUE))
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Yurts: buyers read is_available=true; supplier CRUD own; admin full
CREATE POLICY "Public can read available yurts" ON yurts
  FOR SELECT USING (
    is_available = TRUE
    OR EXISTS (SELECT 1 FROM suppliers s WHERE s.id = yurts.supplier_id AND s.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
CREATE POLICY "Supplier can insert own yurts" ON yurts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid() AND s.is_approved = TRUE)
  );
CREATE POLICY "Supplier can update own yurts" ON yurts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = yurts.supplier_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Supplier can delete own yurts" ON yurts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = yurts.supplier_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Admins can do anything on yurts" ON yurts
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Orders: buyer read/insert own; supplier read/update status for own; admin full
CREATE POLICY "Buyers can read own orders" ON orders
  FOR SELECT USING (
    buyer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM suppliers s WHERE s.id = orders.supplier_id AND s.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
CREATE POLICY "Buyers can insert orders" ON orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid() OR buyer_id IS NULL);
CREATE POLICY "Supplier can update status of own orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = orders.supplier_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Admins can update any order" ON orders
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Storage bucket for yurt photos (run in Supabase Dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('yurt-photos', 'yurt-photos', true);
-- CREATE POLICY "Public read yurt photos" ON storage.objects FOR SELECT USING (bucket_id = 'yurt-photos');
-- CREATE POLICY "Supplier upload yurt photos" ON storage.objects FOR INSERT WITH CHECK (
--   bucket_id = 'yurt-photos' AND auth.role() = 'authenticated'
-- );
-- CREATE POLICY "Supplier update own yurt photos" ON storage.objects FOR UPDATE USING (bucket_id = 'yurt-photos');
-- CREATE POLICY "Supplier delete own yurt photos" ON storage.objects FOR DELETE USING (bucket_id = 'yurt-photos');
