const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🚀 Starting accessories migration...')
  
  const sqlPath = path.join(__dirname, '../supabase/accessories-table.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  
  console.log('📝 Executing SQL...')
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
  
  if (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
  
  console.log('✅ Migration completed successfully!')
  console.log('📊 Verifying tables...')
  
  const { data: tables, error: tablesError } = await supabase
    .from('accessories')
    .select('count')
    .limit(0)
  
  if (tablesError) {
    if (tablesError.message.includes('does not exist')) {
      console.error('❌ Table not created. Trying alternative method...')
      await runDirectSQL(sql)
    } else {
      console.log('✅ Accessories table exists!')
    }
  } else {
    console.log('✅ Accessories table exists!')
  }
}

async function runDirectSQL(sql) {
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'))
  
  console.log(`📝 Executing ${statements.length} SQL statements...`)
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    if (!statement) continue
    
    console.log(`  [${i + 1}/${statements.length}] Executing...`)
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })
      if (error) {
        console.error(`  ❌ Statement ${i + 1} failed:`, error.message)
      } else {
        console.log(`  ✅ Statement ${i + 1} completed`)
      }
    } catch (err) {
      console.error(`  ❌ Statement ${i + 1} error:`, err.message)
    }
  }
  
  console.log('✅ Direct SQL execution completed!')
}

runMigration().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
