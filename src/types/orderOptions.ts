/**
 * Structured order options stored in orders.order_options JSONB.
 * `message` field stays for free-text only.
 */

export interface OrderOptionsInterior {
  keregeColor: 'natural' | 'blue' | 'red' | 'silver';
  exclusiveCustom: boolean;
  coverCustom: boolean;
}

export interface OrderOptionsLogistics {
  method: 'air' | 'sea';
}

export interface OrderOptionsAddon {
  id: string;
  name: string;
  slug: string;
  quantity: number;
  price_usd: number;
}

export interface OrderOptionsDelivery {
  address?: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderOptions {
  interior?: OrderOptionsInterior;
  logistics?: OrderOptionsLogistics;
  addons?: OrderOptionsAddon[];
  delivery?: OrderOptionsDelivery;
  selectedAccessories?: string[];
}
