import { createServiceRoleClient } from './supabase';

const DEFAULT_DELIVERY_DAYS: Record<string, number> = {
  kazakhstan: 7,
  russia: 14,
  europe: 21,
  usa: 30,
  other: 30,
};

const KAZAKHSTAN_COUNTRIES = ['Kazakhstan', 'Казахстан', 'KZ'];
const RUSSIA_COUNTRIES = ['Russia', 'Россия', 'Belarus', 'Ukraine', 'RU', 'BY', 'UA'];
const EUROPE_COUNTRIES = [
  'Germany', 'France', 'UK', 'United Kingdom', 'Italy', 'Spain', 'Netherlands',
  'Poland', 'Belgium', 'Austria', 'Switzerland', 'Sweden', 'Norway', 'Finland',
  'DE', 'FR', 'GB', 'IT', 'ES', 'NL', 'PL', 'BE', 'AT', 'CH', 'SE', 'NO', 'FI',
];
const USA_COUNTRIES = ['USA', 'United States', 'US', 'Canada', 'CA'];

export function getDeliveryRegion(country: string): string {
  const normalized = country.trim();
  if (KAZAKHSTAN_COUNTRIES.some((c) => normalized.toLowerCase().includes(c.toLowerCase())))
    return 'kazakhstan';
  if (RUSSIA_COUNTRIES.some((c) => normalized.toLowerCase().includes(c.toLowerCase())))
    return 'russia';
  if (EUROPE_COUNTRIES.some((c) => normalized.toLowerCase().includes(c.toLowerCase())))
    return 'europe';
  if (USA_COUNTRIES.some((c) => normalized.toLowerCase().includes(c.toLowerCase())))
    return 'usa';
  return 'other';
}

export function getDefaultDeliveryDays(country: string): number {
  return DEFAULT_DELIVERY_DAYS[getDeliveryRegion(country)] ?? DEFAULT_DELIVERY_DAYS.other;
}

export async function getEstimatedDeliveryDays(
  supplierId: string,
  country: string
): Promise<number> {
  const region = getDeliveryRegion(country);
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('supplier_delivery_times')
    .select('delivery_days')
    .eq('supplier_id', supplierId)
    .eq('region', region)
    .maybeSingle();
  return (data as any)?.delivery_days ?? DEFAULT_DELIVERY_DAYS[region] ?? DEFAULT_DELIVERY_DAYS.other;
}
