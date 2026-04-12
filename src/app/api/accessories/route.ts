import { NextResponse } from 'next/server';
import { DEFAULT_ACCESSORIES } from '@/lib/defaultCatalog';
import type { Database } from '@/types/database';

type Accessory = Database['public']['Tables']['accessories']['Row'];

function getDefaults(category: string | null) {
  return DEFAULT_ACCESSORIES
    .filter((a) => !category || a.category === category)
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      description: a.description,
      history: a.history || '',
      price_kzt: a.price_kzt,
      price_usd: a.price_usd,
      category: a.category,
      photos: a.photos,
      name_i18n: a.name_i18n,
    }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'en';

    let supabase;
    try {
      const { createServiceRoleClient } = await import('@/lib/supabase');
      supabase = createServiceRoleClient();
    } catch {
      return NextResponse.json({ accessories: getDefaults(category) });
    }

    let query = supabase
      .from('accessories')
      .select('*')
      .eq('is_available', true)
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ accessories: getDefaults(category) });
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
