/**
 * Migration script to insert traditional accessories into the database
 * Run with: npx tsx scripts/migrate-accessories.ts
 */

import { createClient } from '@supabase/supabase-js';
import { TRADITIONAL_ACCESSORIES } from '../src/data/accessories';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Make sure .env.local file exists with these variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Map of traditional accessory categories to database categories
const categoryMap: Record<string, string> = {
  'structure': 'other',
  'rope': 'other',
  'decoration': 'carpet',
  'cover': 'cover',
};

// Placeholder images for accessories (you can replace these with actual images later)
const getPhotoForAccessory = (id: string): string[] => {
  return [`/images/accessories/${id}.jpg`];
};

async function migrateAccessories() {
  console.log('Starting accessories migration...');
  
  // First, get the default supplier (or create one)
  // We'll use the first approved supplier, or you can specify a specific supplier_id
  const { data: suppliers, error: supplierError } = await supabase
    .from('suppliers')
    .select('id')
    .eq('is_approved', true)
    .limit(1);

  if (supplierError || !suppliers || suppliers.length === 0) {
    console.error('No approved suppliers found. Please create a supplier first.');
    process.exit(1);
  }

  const supplierId = suppliers[0].id;
  console.log(`Using supplier ID: ${supplierId}`);

  // Check if accessories already exist
  const { data: existingAccessories } = await supabase
    .from('accessories')
    .select('slug');

  const existingSlugs = new Set(existingAccessories?.map(a => a.slug) || []);

  let inserted = 0;
  let skipped = 0;

  for (const accessory of TRADITIONAL_ACCESSORIES) {
    const slug = accessory.id;
    
    if (existingSlugs.has(slug)) {
      console.log(`Skipping ${slug} - already exists`);
      skipped++;
      continue;
    }

    // Use English name as primary, store all translations in i18n fields
    const name = accessory.name.en;
    const description = accessory.description.en;

    const { error } = await supabase
      .from('accessories')
      .insert({
        supplier_id: supplierId,
        name,
        slug,
        description,
        name_i18n: accessory.name,
        description_i18n: accessory.description,
        history_i18n: accessory.history,
        category: categoryMap[accessory.category] || 'other',
        price_usd: accessory.price_usd,
        price_kzt: accessory.price_kzt,
        photos: getPhotoForAccessory(accessory.id),
        is_available: true,
        stock_quantity: 100,
        production_days_min: 7,
        production_days_max: 14,
      });

    if (error) {
      console.error(`Error inserting ${slug}:`, error);
    } else {
      console.log(`✓ Inserted ${slug}`);
      inserted++;
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped: ${skipped}`);
}

migrateAccessories()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
