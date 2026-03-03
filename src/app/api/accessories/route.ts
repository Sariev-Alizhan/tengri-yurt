import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Accessory = Database['public']['Tables']['accessories']['Row'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'en';

    const supabase = createServiceRoleClient();
    
    let query = supabase
      .from('accessories')
      .select('*')
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to include localized names and descriptions
    const accessories = (data as Accessory[])?.map((acc) => {
      const nameI18n = acc.name_i18n as Record<string, string> | null;
      const descriptionI18n = acc.description_i18n as Record<string, string> | null;
      const historyI18n = acc.history_i18n as Record<string, string> | null;
      
      return {
        id: acc.id,
        slug: acc.slug,
        name: nameI18n?.[locale] || acc.name,
        description: descriptionI18n?.[locale] || acc.description,
        history: historyI18n?.[locale] || '',
        price_kzt: acc.price_kzt,
        price_usd: acc.price_usd,
        category: acc.category,
        photos: acc.photos,
        // Include full i18n data for flexibility
        name_i18n: acc.name_i18n,
        description_i18n: acc.description_i18n,
        history_i18n: acc.history_i18n,
      };
    }) || [];

    return NextResponse.json({ accessories });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
