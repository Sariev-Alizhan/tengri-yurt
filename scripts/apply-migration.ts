import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

async function applyMigration() {
  console.log('🚀 Applying RLS migration...\n')

  const migrationPath = path.join(process.cwd(), 'supabase', 'fix-rls-recursion.sql')
  const sql = fs.readFileSync(migrationPath, 'utf-8')

  try {
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      console.error('❌ Migration failed:', error)
      
      // Try alternative method: split and execute statements one by one
      console.log('\n⚠️  Trying alternative method...\n')
      
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'))
      
      for (const statement of statements) {
        if (!statement) continue
        
        console.log(`Executing: ${statement.substring(0, 60)}...`)
        
        const { error: stmtError } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        })
        
        if (stmtError) {
          console.error(`❌ Failed:`, stmtError.message)
        } else {
          console.log('✅ Success')
        }
      }
    } else {
      console.log('✅ Migration applied successfully!')
    }

    // Update existing users
    console.log('\n🔄 Updating existing users...\n')
    
    const updateUsersSql = `
      UPDATE auth.users
      SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"supplier"'
      )
      WHERE id IN (
        SELECT user_id FROM suppliers
      );
    `
    
    const { error: updateError } = await supabase.rpc('exec_sql', { 
      sql_query: updateUsersSql 
    })
    
    if (updateError) {
      console.error('❌ Failed to update users:', updateError)
    } else {
      console.log('✅ Users updated successfully!')
    }

    console.log('\n✨ Migration complete!')
    console.log('\n📝 Next steps:')
    console.log('1. Sign out from the app')
    console.log('2. Sign in again')
    console.log('3. You should now be able to access the dashboard\n')

  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

applyMigration()
