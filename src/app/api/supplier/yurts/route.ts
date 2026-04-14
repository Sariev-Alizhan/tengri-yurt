import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    // Auth check
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
      price_usd,
      diameter_m,
      kanat,
      capacity_min,
      capacity_max,
      production_days_min,
      production_days_max,
      photos,
      features,
      is_available,
    } = body;

    if (!supplierId || !name || !slug || price_usd == null) {
      return NextResponse.json(
        { error: 'Missing supplierId, name, slug, or price_usd' },
        { status: 400 }
      );
    }

    // Security: verify the supplierId belongs to the authenticated user
    const { data: ownSupplier } = await authClient
      .from('suppliers')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (!ownSupplier || (ownSupplier as { id: string }).id !== supplierId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await (supabase as any)
      .from('yurts')
      .insert({
        supplier_id: supplierId,
        name,
        slug,
        description: description ?? null,
        price_usd: Number(price_usd),
        diameter_m: diameter_m != null ? Number(diameter_m) : null,
        kanat: kanat != null ? Number(kanat) : null,
        capacity_min: capacity_min != null ? Number(capacity_min) : null,
        capacity_max: capacity_max != null ? Number(capacity_max) : null,
        production_days_min: Number(production_days_min) || 30,
        production_days_max: Number(production_days_max) || 60,
        photos: Array.isArray(photos) ? photos : [],
        features: Array.isArray(features) ? features : [],
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
