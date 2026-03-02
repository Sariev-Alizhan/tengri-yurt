/**
 * Format price consistently on server and client
 * Uses space as thousand separator to avoid hydration mismatch
 */
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
