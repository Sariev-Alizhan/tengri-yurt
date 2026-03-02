-- Add logistics fields to orders table
-- Run in Supabase SQL Editor

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_method TEXT CHECK (shipping_method IN ('air', 'sea')) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS estimated_logistics_days_min INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS estimated_logistics_days_max INTEGER DEFAULT NULL;

-- Add comment for reference
COMMENT ON COLUMN orders.shipping_method IS 'Logistics method: air (3-10 days) or sea (30-60 days)';
COMMENT ON COLUMN orders.estimated_logistics_days_min IS 'Minimum logistics days based on shipping method';
COMMENT ON COLUMN orders.estimated_logistics_days_max IS 'Maximum logistics days based on shipping method';
