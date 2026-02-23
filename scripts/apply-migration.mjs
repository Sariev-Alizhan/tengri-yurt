import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://somtxvjnjjeyrgbyszos.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvbXR4dmpuampleXJnYnlzem9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc2ODYxOSwiZXhwIjoyMDg3MzQ0NjE5fQ.SVAtgcvRF9TbK0I8t9fktCovkx2849YJL1511H-rbAA'

async function runSQL(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({ sql })
  })
  
  return { ok: response.ok, status: response.status, text: await response.text() }
}

async function migrate() {
  console.log('🚀 Applying accessories migration...\n')
  
  const sqlPath = path.join(__dirname, '../supabase/accessories-table.sql')
  const fullSQL = fs.readFileSync(sqlPath, 'utf8')
  
  const statements = [
    `CREATE TABLE IF NOT EXISTS accessories (
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
    )`,
    
    `DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'accessories_updated_at') THEN
        CREATE TRIGGER accessories_updated_at
        BEFORE UPDATE ON accessories
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
      END IF;
    END $$`,
    
    `ALTER TABLE accessories ENABLE ROW LEVEL SECURITY`,
    
    `DROP POLICY IF EXISTS "Public can read available accessories" ON accessories`,
    `CREATE POLICY "Public can read available accessories" ON accessories
      FOR SELECT USING (
        is_available = TRUE
        OR EXISTS (SELECT 1 FROM suppliers s WHERE s.id = accessories.supplier_id AND s.user_id = auth.uid())
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
      )`,
    
    `DROP POLICY IF EXISTS "Supplier can insert own accessories" ON accessories`,
    `CREATE POLICY "Supplier can insert own accessories" ON accessories
      FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM suppliers s WHERE s.id = supplier_id AND s.user_id = auth.uid() AND s.is_approved = TRUE)
      )`,
    
    `DROP POLICY IF EXISTS "Supplier can update own accessories" ON accessories`,
    `CREATE POLICY "Supplier can update own accessories" ON accessories
      FOR UPDATE USING (
        EXISTS (SELECT 1 FROM suppliers s WHERE s.id = accessories.supplier_id AND s.user_id = auth.uid())
      )`,
    
    `DROP POLICY IF EXISTS "Supplier can delete own accessories" ON accessories`,
    `CREATE POLICY "Supplier can delete own accessories" ON accessories
      FOR DELETE USING (
        EXISTS (SELECT 1 FROM suppliers s WHERE s.id = accessories.supplier_id AND s.user_id = auth.uid())
      )`,
    
    `DROP POLICY IF EXISTS "Admins can do anything on accessories" ON accessories`,
    `CREATE POLICY "Admins can do anything on accessories" ON accessories
      FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')`,
    
    `CREATE TABLE IF NOT EXISTS order_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
      item_type TEXT CHECK (item_type IN ('yurt', 'accessory')) NOT NULL,
      yurt_id UUID REFERENCES yurts(id) ON DELETE SET NULL,
      accessory_id UUID REFERENCES accessories(id) ON DELETE SET NULL,
      quantity INTEGER DEFAULT 1,
      unit_price_usd INTEGER NOT NULL,
      total_price_usd INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    `ALTER TABLE order_items ENABLE ROW LEVEL SECURITY`,
    
    `DROP POLICY IF EXISTS "Users can read own order items" ON order_items`,
    `CREATE POLICY "Users can read own order items" ON order_items
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
      )`,
    
    `DROP POLICY IF EXISTS "Users can insert order items" ON order_items`,
    `CREATE POLICY "Users can insert order items" ON order_items
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM orders o 
          WHERE o.id = order_id 
          AND (o.buyer_id = auth.uid() OR o.buyer_id IS NULL)
        )
      )`,
  ]
  
  let success = 0
  let failed = 0
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    const preview = stmt.substring(0, 70).replace(/\n/g, ' ').replace(/\s+/g, ' ')
    console.log(`[${i + 1}/${statements.length}] ${preview}...`)
    
    const result = await runSQL(stmt)
    
    if (result.ok || result.status === 200 || result.status === 204) {
      console.log(`  ✅\n`)
      success++
    } else {
      console.log(`  ⚠️  ${result.text.substring(0, 100)}\n`)
      failed++
    }
    
    await new Promise(r => setTimeout(r, 300))
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`🎉 Migration complete: ${success} successful, ${failed} failed`)
  console.log('='.repeat(60))
  
  if (success > 0) {
    console.log('\n✅ Accessories system is ready!')
    console.log('   - Table: accessories')
    console.log('   - Table: order_items')
    console.log('   - RLS policies configured')
  }
}

migrate().catch(err => {
  console.error('❌ Fatal:', err.message)
  process.exit(1)
})
