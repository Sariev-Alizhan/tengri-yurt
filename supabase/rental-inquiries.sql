-- Таблица заявок на аренду юрт
-- Запустить в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS rental_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  yurt_slug TEXT NOT NULL,
  yurt_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'confirmed', 'cancelled')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rental_inquiries ENABLE ROW LEVEL SECURITY;

-- Анонимные пользователи могут создавать заявки
CREATE POLICY "Anyone can insert rental inquiries" ON rental_inquiries
  FOR INSERT WITH CHECK (true);

-- Только админы могут читать и обновлять
CREATE POLICY "Admins can read rental inquiries" ON rental_inquiries
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update rental inquiries" ON rental_inquiries
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
