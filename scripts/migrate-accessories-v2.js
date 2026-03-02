const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

async function runMigration() {
  console.log('🚀 Starting accessories migration...')
  
  const sqlPath = path.join(__dirname, '../supabase/accessories-table.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  
  console.log('📝 Executing SQL via REST API...')
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query: sql })
    })
    
    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Migration failed:', error)
      console.log('\n📋 You need to run this SQL manually in Supabase Dashboard:')
      console.log('   1. Go to https://supabase.com/dashboard/project/somtxvjnjjeyrgbyszos/sql/new')
      console.log('   2. Copy the SQL from: supabase/accessories-table.sql')
      console.log('   3. Paste and run it')
      process.exit(1)
    }
    
    console.log('✅ Migration completed successfully!')
  } catch (err) {
    console.error('❌ Error:', err.message)
    console.log('\n📋 Please run the SQL manually in Supabase Dashboard:')
    console.log('   1. Go to https://supabase.com/dashboard/project/somtxvjnjjeyrgbyszos/sql/new')
    console.log('   2. Copy the SQL from: supabase/accessories-table.sql')
    console.log('   3. Paste and run it')
    process.exit(1)
  }
}

runMigration()
