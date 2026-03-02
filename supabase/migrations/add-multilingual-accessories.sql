-- Add multilingual support for accessories
-- This adds JSON columns for storing translations

ALTER TABLE accessories 
ADD COLUMN IF NOT EXISTS name_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description_i18n JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS history_i18n JSONB DEFAULT '{}';

-- Add comment to explain the structure
COMMENT ON COLUMN accessories.name_i18n IS 'Multilingual names: {"en": "...", "ru": "...", "kk": "..."}';
COMMENT ON COLUMN accessories.description_i18n IS 'Multilingual descriptions: {"en": "...", "ru": "...", "kk": "..."}';
COMMENT ON COLUMN accessories.history_i18n IS 'Multilingual history/background: {"en": "...", "ru": "...", "kk": "..."}';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_accessories_slug ON accessories(slug);
CREATE INDEX IF NOT EXISTS idx_accessories_category ON accessories(category);
CREATE INDEX IF NOT EXISTS idx_accessories_available ON accessories(is_available);
