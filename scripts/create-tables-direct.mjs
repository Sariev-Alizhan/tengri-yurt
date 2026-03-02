import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://somtxvjnjjeyrgbyszos.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvbXR4dmpuampleXJnYnlzem9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc2ODYxOSwiZXhwIjoyMDg3MzQ0NjE5fQ.SVAtgcvRF9TbK0I8t9fktCovkx2849YJL1511H-rbAA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('🚀 Creating accessories tables...\n')
  
  console.log('1️⃣  Creating accessories table...')
  try {
    const { data, error } = await supabase
      .from('accessories')
      .select('id')
      .limit(1)
    
    if (error && error.message.includes('does not exist')) {
      console.log('   ⚠️  Table does not exist, creating via INSERT...')
      
      const { error: insertError } = await supabase
        .from('accessories')
        .insert({
          supplier_id: '00000000-0000-0000-0000-000000000000',
          name: 'test',
          slug: 'test-' + Date.now(),
          category: 'other',
          price_usd: 0,
          photos: [],
          is_available: false,
          stock_quantity: 0,
          production_days_min: 0,
          production_days_max: 0
        })
      
      if (insertError) {
        console.log(`   ❌ Cannot create via INSERT: ${insertError.message}`)
        throw new Error('Table needs manual creation')
      }
    } else if (error) {
      console.log(`   ❌ Error: ${error.message}`)
      throw new Error('Table check failed')
    } else {
      console.log('   ✅ Table already exists!')
    }
  } catch (err) {
    console.log(`   ❌ ${err.message}`)
    console.log('\n📋 MANUAL STEPS REQUIRED:')
    console.log('   1. Open: https://supabase.com/dashboard/project/somtxvjnjjeyrgbyszos/sql/new')
    console.log('   2. Paste the SQL (already in clipboard)')
    console.log('   3. Click "Run"')
    console.log('\n   Then run: node scripts/test-accessories-table.mjs')
    process.exit(1)
  }
  
  console.log('\n✅ Done!')
}

createTables()
