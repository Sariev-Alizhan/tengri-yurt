/**
 * Script to add 6 new yurts to the catalog
 * Run: node scripts/add-6-yurts.js
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

const yurts = [
  {
    name: 'Intimate',
    slug: 'intimate',
    description: 'Perfect for meditation and private retreats. Compact yet comfortable, this yurt offers an intimate space for personal reflection and relaxation. Ideal for solo travelers or couples seeking a peaceful sanctuary.',
    diameter_m: 4.5,
    kanat: 6,
    capacity_min: 4,
    capacity_max: 6,
    price_usd: 3200,
    production_days_min: 30,
    production_days_max: 45,
    photos: ['/images/picture/yurt_intimate_cozy_classic.png', '/images/picture/yurt_kazakhstan.jpeg'],
    features: [
      'Handcrafted wooden frame',
      'Natural wool felt insulation',
      'Weather-resistant canvas cover',
      'Traditional Kazakh ornaments',
      'Wooden door with lock',
      'Smoke ring ventilation'
    ]
  },
  {
    name: 'Cozy',
    slug: 'cozy',
    description: 'Ideal for workshops and gatherings. This versatile yurt provides a warm and inviting atmosphere for small groups. Perfect for yoga sessions, creative workshops, or intimate family gatherings.',
    diameter_m: 6.0,
    kanat: 8,
    capacity_min: 6,
    capacity_max: 10,
    price_usd: 4500,
    production_days_min: 35,
    production_days_max: 50,
    photos: ['/images/picture/yurt_intimate_cozy_classic.png', '/images/picture/yurt_shanyraq.jpeg'],
    features: [
      'Premium wood construction',
      'Double-layer felt insulation',
      'Waterproof canvas exterior',
      'Hand-painted traditional patterns',
      'Reinforced door frame',
      'Adjustable roof ventilation',
      'Interior rope system'
    ]
  },
  {
    name: 'Classic',
    slug: 'classic',
    description: 'Popular for glamping and eco-resorts. The most versatile size for hospitality businesses. Combines authentic nomadic aesthetics with modern comfort standards. Perfect for boutique camping sites and eco-tourism.',
    diameter_m: 9.0,
    kanat: 12,
    capacity_min: 10,
    capacity_max: 15,
    price_usd: 7800,
    production_days_min: 40,
    production_days_max: 55,
    photos: ['/images/picture/yurt_intimate_cozy_classic.png', '/images/picture/yurt_dubai.jpeg'],
    features: [
      'Master-crafted wooden lattice',
      'Triple-layer felt insulation',
      'UV-resistant canvas',
      'Authentic Kazakh designs',
      'Double door system',
      'Crown wheel with adjustable cover',
      'Interior support poles',
      'Tension bands'
    ]
  },
  {
    name: 'Spacious',
    slug: 'spacious',
    description: 'For wellness retreats and dining. Generous interior space perfect for group activities, dining experiences, or wellness programs. Can accommodate comfortable seating arrangements and activity zones.',
    diameter_m: 12.0,
    kanat: 16,
    capacity_min: 15,
    capacity_max: 25,
    price_usd: 12500,
    production_days_min: 45,
    production_days_max: 60,
    photos: ['/images/picture/yurt_spacious_grand_monumental.png', '/images/picture/in_the_yurt.jpeg'],
    features: [
      'Heavy-duty wooden structure',
      'Premium wool felt layers',
      'Commercial-grade canvas',
      'Decorative felt bands',
      'Wide entrance door',
      'Central support system',
      'Enhanced ventilation system',
      'Reinforced tension cables'
    ]
  },
  {
    name: 'Grand',
    slug: 'grand',
    description: 'Grand scale for events and festivals. Impressive structure designed for large gatherings, corporate events, and festival venues. Provides ample space for entertainment, dining, and social activities.',
    diameter_m: 18.0,
    kanat: 24,
    capacity_min: 30,
    capacity_max: 50,
    price_usd: 24000,
    production_days_min: 50,
    production_days_max: 70,
    photos: ['/images/picture/yurt_spacious_grand_monumental.png', '/images/picture/yurt_lovebern.jpeg'],
    features: [
      'Industrial-strength framework',
      'Multi-layer insulation system',
      'Heavy-duty weatherproof canvas',
      'Traditional ornamental designs',
      'Double-width entrance',
      'Advanced structural support',
      'Multiple ventilation points',
      'Professional-grade assembly system'
    ]
  },
  {
    name: 'Monumental',
    slug: 'monumental',
    description: 'For ceremonies and conferences. The ultimate statement piece for major events. This extraordinary structure can host large-scale ceremonies, conferences, and prestigious gatherings. A true architectural marvel of nomadic tradition.',
    diameter_m: 27.0,
    kanat: 36,
    capacity_min: 60,
    capacity_max: 100,
    price_usd: 45000,
    production_days_min: 60,
    production_days_max: 90,
    photos: ['/images/picture/yurt_spacious_grand_monumental.png', '/images/picture/yurt_maiyami.jpeg'],
    features: [
      'Engineered wooden mega-structure',
      'Premium multi-layer insulation',
      'Commercial-grade weatherproof materials',
      'Elaborate traditional artwork',
      'Grand ceremonial entrance',
      'Complex support architecture',
      'Advanced climate control compatibility',
      'Professional installation team required',
      'Modular assembly system'
    ]
  }
]

async function addYurts() {
  try {
    console.log('🔍 Finding approved supplier...')
    
    const { data: suppliers, error: supplierError } = await supabase
      .from('suppliers')
      .select('id, company_name')
      .eq('is_approved', true)
      .limit(1)

    if (supplierError) {
      console.error('❌ Error fetching supplier:', supplierError)
      process.exit(1)
    }

    if (!suppliers || suppliers.length === 0) {
      console.error('❌ No approved suppliers found. Please create and approve a supplier first.')
      process.exit(1)
    }

    const supplierId = suppliers[0].id
    console.log(`✅ Found supplier: ${suppliers[0].company_name} (${supplierId})`)

    console.log('\n📦 Adding 6 yurts to catalog...\n')

    for (const yurt of yurts) {
      const yurtData = {
        supplier_id: supplierId,
        ...yurt,
        is_available: true
      }

      const { data, error } = await supabase
        .from('yurts')
        .insert(yurtData)
        .select()

      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️  ${yurt.name} - already exists (skipped)`)
        } else {
          console.error(`❌ ${yurt.name} - error:`, error.message)
        }
      } else {
        console.log(`✅ ${yurt.name} - added successfully (Ø${yurt.diameter_m}m, ${yurt.kanat} kanat, $${yurt.price_usd})`)
      }
    }

    console.log('\n🎉 Done! Check your catalog at /catalog')
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

addYurts()
