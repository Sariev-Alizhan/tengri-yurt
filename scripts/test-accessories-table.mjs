import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://somtxvjnjjeyrgbyszos.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvbXR4dmpuampleXJnYnlzem9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTc2ODYxOSwiZXhwIjoyMDg3MzQ0NjE5fQ.SVAtgcvRF9TbK0I8t9fktCovkx2849YJL1511H-rbAA'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testTables() {
  console.log('🧪 Testing accessories table...\n')
  
  console.log('1️⃣  Testing accessories table access...')
  const { data: accessories, error: accError } = await supabase
    .from('accessories')
    .select('count')
    .limit(0)
  
  if (accError) {
    console.log(`   ❌ Accessories table: ${accError.message}`)
    console.log(`   ℹ️  Table does not exist yet. Please run the SQL manually.`)
  } else {
    console.log(`   ✅ Accessories table exists!`)
  }
  
  console.log('\n2️⃣  Testing order_items table access...')
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('count')
    .limit(0)
  
  if (itemsError) {
    console.log(`   ❌ Order_items table: ${itemsError.message}`)
    console.log(`   ℹ️  Table does not exist yet. Please run the SQL manually.`)
  } else {
    console.log(`   ✅ Order_items table exists!`)
  }
  
  console.log('\n' + '='.repeat(60))
  
  if (!accError && !itemsError) {
    console.log('🎉 All tables are ready! Accessories system is operational.')
  } else {
    console.log('⚠️  Tables need to be created. Follow these steps:')
    console.log('   1. SQL is already copied to your clipboard')
    console.log('   2. Go to: https://supabase.com/dashboard/project/somtxvjnjjeyrgbyszos/sql/new')
    console.log('   3. Paste (Cmd+V) and click "Run"')
    console.log('   4. Run this test again: node scripts/test-accessories-table.mjs')
  }
  console.log('='.repeat(60))
}

testTables().catch(err => {
  console.error('❌ Fatal error:', err.message)
  process.exit(1)
})
