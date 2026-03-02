import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    
    if (secret !== 'migrate-accessories-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceRoleClient()
    const results = []

    console.log('Creating accessories table...')
    const { error: createTableError } = await (supabase.rpc as any)('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS accessories (
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
        );
      `
    })

    if (createTableError) {
      results.push({ step: 'create_accessories_table', error: createTableError.message })
    } else {
      results.push({ step: 'create_accessories_table', success: true })
    }

    console.log('Creating order_items table...')
    const { error: createOrderItemsError } = await (supabase.rpc as any)('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
          item_type TEXT CHECK (item_type IN ('yurt', 'accessory')) NOT NULL,
          yurt_id UUID REFERENCES yurts(id) ON DELETE SET NULL,
          accessory_id UUID REFERENCES accessories(id) ON DELETE SET NULL,
          quantity INTEGER DEFAULT 1,
          unit_price_usd INTEGER NOT NULL,
          total_price_usd INTEGER NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (createOrderItemsError) {
      results.push({ step: 'create_order_items_table', error: createOrderItemsError.message })
    } else {
      results.push({ step: 'create_order_items_table', success: true })
    }

    console.log('Testing accessories table...')
    const { data: testData, error: testError } = await supabase
      .from('accessories')
      .select('count')
      .limit(0)

    if (testError) {
      results.push({ step: 'test_accessories_table', error: testError.message })
    } else {
      results.push({ step: 'test_accessories_table', success: true })
    }

    const successCount = results.filter(r => r.success).length
    const totalSteps = results.length

    return NextResponse.json({
      message: `Migration completed: ${successCount}/${totalSteps} steps successful`,
      results,
      sql_file: 'supabase/accessories-table.sql',
      manual_steps: successCount < totalSteps ? [
        'Some steps failed. Please run the SQL manually:',
        '1. Go to https://supabase.com/dashboard/project/somtxvjnjjeyrgbyszos/sql/new',
        '2. Copy SQL from: supabase/accessories-table.sql',
        '3. Paste and execute'
      ] : null
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    )
  }
}
