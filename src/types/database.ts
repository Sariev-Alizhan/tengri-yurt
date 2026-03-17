export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileRole = 'buyer' | 'supplier' | 'admin';
export type OrderPaymentStatus = 'awaiting_invoice' | 'invoice_sent' | 'paid' | 'cancelled';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_production'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type AccessoryCategory = 'carpet' | 'furniture' | 'cover' | 'other';
export type OrderItemType = 'yurt' | 'accessory';
export type ShippingMethod = 'air' | 'sea';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: ProfileRole;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'> & {
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      suppliers: {
        Row: {
          id: string;
          user_id: string | null;
          company_name: string;
          description: string | null;
          country: string | null;
          logo_url: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['suppliers']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['suppliers']['Insert']>;
      };
      supplier_delivery_times: {
        Row: {
          id: string;
          supplier_id: string;
          region: string;
          delivery_days: number;
        };
        Insert: Omit<Database['public']['Tables']['supplier_delivery_times']['Row'], 'id'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['supplier_delivery_times']['Insert']>;
      };
      yurts: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          slug: string;
          description: string | null;
          diameter_m: number | null;
          kanat: number | null;
          capacity_min: number | null;
          capacity_max: number | null;
          price_usd: number;
          production_days_min: number;
          production_days_max: number;
          photos: string[];
          features: string[];
          is_available: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['yurts']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
          photos?: string[];
          features?: string[];
        };
        Update: Partial<Database['public']['Tables']['yurts']['Insert']>;
      };
      accessories: {
        Row: {
          id: string;
          supplier_id: string;
          name: string;
          slug: string;
          description: string | null;
          category: AccessoryCategory;
          price_usd: number | null;
          price_kzt: number | null;
          photos: string[];
          is_available: boolean;
          stock_quantity: number;
          production_days_min: number;
          production_days_max: number;
          name_i18n: Json | null;
          description_i18n: Json | null;
          history_i18n: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['accessories']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          photos?: string[];
        };
        Update: Partial<Database['public']['Tables']['accessories']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          buyer_id: string | null;
          yurt_id: string | null;
          supplier_id: string | null;
          buyer_name: string;
          buyer_email: string;
          buyer_phone: string | null;
          delivery_country: string;
          delivery_city: string | null;
          delivery_address: string | null;
          quantity: number;
          message: string | null;
          /** Structured Interior + Logistics; when set, use for display instead of parsing message */
          order_options: Record<string, unknown> | null;
          unit_price_usd: number;
          total_price_usd: number;
          payment_status: OrderPaymentStatus;
          status: OrderStatus;
          estimated_production_days: number | null;
          estimated_delivery_days: number | null;
          shipping_method: ShippingMethod | null;
          estimated_logistics_days_min: number | null;
          estimated_logistics_days_max: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          item_type: OrderItemType;
          yurt_id: string | null;
          accessory_id: string | null;
          quantity: number;
          unit_price_usd: number;
          total_price_usd: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
    };
  };
}
