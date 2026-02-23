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
    
    // 1. Update user metadata in auth.users (for JWT)
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        user_metadata: { role: 'supplier' }
      }
    );
    if (authError) {
      console.error('Failed to update user metadata:', authError);
    }
    
    // 2. Create/update profile in profiles table
    await supabase.from('profiles').upsert({
      id: userId,
      role: 'supplier',
      full_name: companyName,
    });
    
    // 3. Create/update supplier record
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
