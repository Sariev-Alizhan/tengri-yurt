/**
 * Cleanup script — deletes ALL test orders and rental inquiries from Supabase.
 * Run with:  node scripts/cleanup-test-data.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envPath = resolve(__dirname, '../.env.local')
const env = {}
try {
  const raw = readFileSync(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const [k, ...rest] = line.split('=')
    if (k && rest.length) env[k.trim()] = rest.join('=').trim()
  }
} catch {
  console.error('❌  Could not read .env.local')
  process.exit(1)
}

const SUPABASE_URL       = env['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_ROLE_KEY   = env['SUPABASE_SERVICE_ROLE_KEY']

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function deleteTable(table, label) {
  // Count first
  const { count } = await supabase.from(table).select('id', { count: 'exact', head: true })
  if (!count) { console.log(`  ${label}: 0 records — skipping`) ; return }

  const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) {
    console.error(`  ❌  ${label}: ${error.message}`)
  } else {
    console.log(`  ✓  ${label}: deleted ${count} record${count !== 1 ? 's' : ''}`)
  }
}

console.log('\n🧹  Tengri Yurt — test data cleanup\n')
console.log('Connecting to:', SUPABASE_URL, '\n')

await deleteTable('order_items',       'Order items')
await deleteTable('orders',            'Orders')
await deleteTable('rental_inquiries',  'Rental inquiries')

console.log('\n✅  Done. Database is clean.\n')
