-- Structured order options (Interior + Logistics) for clean display in PDF and dashboard
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_options JSONB DEFAULT NULL;
