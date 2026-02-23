import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, companyName, description } = body;
    if (!userId || !companyName) {
      return NextResponse.json(
        { error: 'Missing userId or companyName' },
        { status: 400 }
      );
    }
    const supabase = createServiceRoleClient();
    await supabase.from('profiles').upsert({
      id: userId,
      role: 'supplier',
      full_name: companyName,
    });
    // upsert: если поставщик с этим user_id уже есть — обновляем название и описание (нет ошибки duplicate key)
    const { error } = await supabase.from('suppliers').upsert(
      {
        user_id: userId,
        company_name: companyName,
        description: description ?? null,
        is_approved: false,
      },
      { onConflict: 'user_id' }
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
