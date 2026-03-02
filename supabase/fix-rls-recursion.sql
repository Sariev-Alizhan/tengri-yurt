-- Fix infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- 1. Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

DROP POLICY IF EXISTS "Anyone can read approved suppliers" ON suppliers;
DROP POLICY IF EXISTS "Supplier can update own row" ON suppliers;
DROP POLICY IF EXISTS "User can insert supplier (pending approval)" ON suppliers;
DROP POLICY IF EXISTS "Admins can update any supplier" ON suppliers;

DROP POLICY IF EXISTS "Supplier can manage own delivery times" ON supplier_delivery_times;
DROP POLICY IF EXISTS "Admins and supplier read delivery times" ON supplier_delivery_times;

DROP POLICY IF EXISTS "Public can read available yurts" ON yurts;
DROP POLICY IF EXISTS "Supplier can insert own yurts" ON yurts;
DROP POLICY IF EXISTS "Supplier can update own yurts" ON yurts;
DROP POLICY IF EXISTS "Supplier can delete own yurts" ON yurts;
DROP POLICY IF EXISTS "Admins can do anything on yurts" ON yurts;

DROP POLICY IF EXISTS "Buyers can read own orders" ON orders;
DROP POLICY IF EXISTS "Buyers can insert orders" ON orders;
DROP POLICY IF EXISTS "Supplier can update status of own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update any order" ON orders;

-- 2. Create new policies without recursion (using JWT instead of profiles table)

-- Profiles: users can read/update own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can read all profiles (using JWT metadata to avoid recursion)
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Suppliers: public read approved suppliers; own row for supplier; admin full
CREATE POLICY "Anyone can read approved suppliers" ON suppliers
  FOR SELECT USING (is_approved = TRUE OR user_id = auth.uid() OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
CREATE POLICY "Supplier can update own row" ON suppliers
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "User can insert supplier (pending approval)" ON suppliers
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update any supplier" ON suppliers
  FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Supplier delivery times: supplier manages own; admin read
CREATE POLICY "Supplier can manage own delivery times" ON supplier_delivery_times
  FOR ALL USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Admins and supplier read delivery times" ON supplier_delivery_times
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = supplier_id AND (s.user_id = auth.uid() OR s.is_approved = TRUE))
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Yurts: buyers read is_available=true; supplier CRUD own; admin full
CREATE POLICY "Public can read available yurts" ON yurts
  FOR SELECT USING (
    is_available = TRUE
    OR EXISTS (SELECT 1 FROM suppliers s WHERE s.id = yurts.supplier_id AND s.user_id = auth.uid())
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
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
  FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Orders: buyer read/insert own; supplier read/update status for own; admin full
CREATE POLICY "Buyers can read own orders" ON orders
  FOR SELECT USING (
    buyer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM suppliers s WHERE s.id = orders.supplier_id AND s.user_id = auth.uid())
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
CREATE POLICY "Buyers can insert orders" ON orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid() OR buyer_id IS NULL);
CREATE POLICY "Supplier can update status of own orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM suppliers s WHERE s.id = orders.supplier_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Admins can update any order" ON orders
  FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
