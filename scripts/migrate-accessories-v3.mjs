import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  console.log('🚀 Starting accessories migration...\n')
  
  const sqlPath = path.join(__dirname, '../supabase/accessories-table.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')
  
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s.length > 10)
  
  console.log(`📝 Found ${statements.length} SQL statements to execute\n`)
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'
    const preview = statement.substring(0, 60).replace(/\n/g, ' ')
    
    console.log(`[${i + 1}/${statements.length}] ${preview}...`)
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ sql: statement })
      })
      
      if (response.ok) {
        console.log(`  ✅ Success\n`)
        successCount++
      } else {
        const errorText = await response.text()
        console.log(`  ⚠️  Warning: ${errorText.substring(0, 100)}\n`)
        errorCount++
      }
    } catch (err) {
      console.log(`  ⚠️  Error: ${err.message}\n`)
      errorCount++
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`✅ Completed: ${successCount} successful, ${errorCount} errors`)
  console.log('='.repeat(50))
  
  if (errorCount === statements.length) {
    console.log('\n❌ All statements failed. Running SQL manually in Supabase Dashboard:')
    console.log('   https://supabase.com/dashboard/project/somtxvjnjjeyrgbyszos/sql/new')
    console.log('\n📋 Copy and paste this SQL:\n')
    console.log(sql)
  }
}

runMigration().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
