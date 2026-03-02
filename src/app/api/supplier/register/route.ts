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

    // Admin supplier: auto-approve so they can manage all catalog items
    const ADMIN_SUPPLIER_EMAIL = 'admin@tengri-yurt.kz';
    let isApproved = false;
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    if (authUser?.user?.email?.toLowerCase() === ADMIN_SUPPLIER_EMAIL.toLowerCase()) {
      isApproved = true;
    }

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
    await (supabase as any).from('profiles').upsert({
      id: userId,
      role: 'supplier',
      full_name: companyName,
    });
    
    // 3. Create/update supplier record (admin@tengri-yurt.kz is auto-approved)
    const { error } = await (supabase as any).from('suppliers').upsert(
      {
        user_id: userId,
        company_name: companyName,
        description: description ?? null,
        is_approved: isApproved,
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
