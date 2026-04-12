import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      supplierId,
      name,
      slug,
      description,
      category,
      price_usd,
      price_kzt,
      stock_quantity,
      production_days_min,
      production_days_max,
      photos,
      is_available,
    } = body;

    if (!supplierId || !name || !slug || !category) {
      return NextResponse.json(
        { error: 'Missing supplierId, name, slug, or category' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await (supabase as any)
      .from('accessories')
      .insert({
        supplier_id: supplierId,
        name,
        slug,
        description: description ?? null,
        category,
        price_usd: price_usd != null ? Number(price_usd) : null,
        price_kzt: price_kzt != null ? Number(price_kzt) : null,
        stock_quantity: Number(stock_quantity) || 0,
        production_days_min: Number(production_days_min) || 0,
        production_days_max: Number(production_days_max) || 0,
        photos: Array.isArray(photos) ? photos : [],
        is_available: Boolean(is_available),
      })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
