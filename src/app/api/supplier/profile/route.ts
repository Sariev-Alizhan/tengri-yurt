import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { company_name, description } = body;

    if (!company_name || company_name.trim() === '') {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('suppliers')
      .update({
        company_name: company_name.trim(),
        description: description?.trim() || null,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating supplier:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH /api/supplier/profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
