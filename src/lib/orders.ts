import { createServiceRoleClient } from './supabase';

export async function getNextOrderNumber(): Promise<string> {
  const supabase = createServiceRoleClient();
  const year = new Date().getFullYear();
  const { data } = await supabase
    .from('orders')
    .select('order_number')
    .like('order_number', `TY-${year}-%`)
    .order('order_number', { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = data
    ? parseInt(String(data.order_number).replace(`TY-${year}-`, ''), 10) + 1
    : 1;
  return `TY-${year}-${String(next).padStart(5, '0')}`;
}
