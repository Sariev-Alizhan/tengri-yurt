import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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
      features,
      is_available,
    } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: supplier } = await supabase
      .from('suppliers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    const { data: existingYurt } = await supabase
      .from('yurts')
      .select('id')
      .eq('id', id)
      .eq('supplier_id', (supplier as { id: string }).id)
      .single();

    if (!existingYurt) {
      return NextResponse.json({ error: 'Yurt not found or access denied' }, { status: 404 });
    }

    const serviceSupabase = createServiceRoleClient();
    
    const updateData: Record<string, unknown> = {
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
      features: Array.isArray(features) ? features : [],
      is_available: Boolean(is_available),
    };

    if (body.photos !== undefined) {
      updateData.photos = Array.isArray(body.photos) ? body.photos : [];
    }

    const { data, error } = await (serviceSupabase as any)
      .from('yurts')
      .update(updateData)
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: supplier } = await supabase
      .from('suppliers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    const { data: existingYurt } = await supabase
      .from('yurts')
      .select('id')
      .eq('id', id)
      .eq('supplier_id', (supplier as { id: string }).id)
      .single();

    if (!existingYurt) {
      return NextResponse.json({ error: 'Yurt not found or access denied' }, { status: 404 });
    }

    const serviceSupabase = createServiceRoleClient();
    const { error } = await serviceSupabase
      .from('yurts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
