/**
 * Script to update all yurt photos to use the same image
 * Run: node scripts/update-yurt-photos.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Main yurt photo to use for all yurts
const mainPhoto = '/images/picture/yurt_dubai.jpeg'

async function updateYurtPhotos() {
  try {
    console.log('🔍 Fetching all yurts...')
    
    const { data: yurts, error: fetchError } = await supabase
      .from('yurts')
      .select('id, name, slug, photos')

    if (fetchError) {
      console.error('❌ Error fetching yurts:', fetchError)
      process.exit(1)
    }

    if (!yurts || yurts.length === 0) {
      console.log('⚠️  No yurts found in database')
      process.exit(0)
    }

    console.log(`✅ Found ${yurts.length} yurts\n`)
    console.log(`📸 Updating all yurts to use: ${mainPhoto}\n`)

    for (const yurt of yurts) {
      const { error: updateError } = await supabase
        .from('yurts')
        .update({ 
          photos: [mainPhoto]
        })
        .eq('id', yurt.id)

      if (updateError) {
        console.error(`❌ ${yurt.name} - error:`, updateError.message)
      } else {
        console.log(`✅ ${yurt.name} - photo updated`)
      }
    }

    console.log('\n🎉 Done! All yurts now use the same photo.')
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

updateYurtPhotos()
