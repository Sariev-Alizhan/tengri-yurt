import { Resend } from 'resend';
import type { OrderStatus } from '@/types/database';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'orders@tengri-camp.kz';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tengri-camp.kz';

function canSend() {
  return resend !== null && EMAIL_FROM;
}

export interface OrderInquiryConfirmationData {
  order_number: string;
  buyer_name: string;
  buyer_email: string;
  yurt_name: string;
  supplier_name: string;
  quantity: number;
  production_days_min: number;
  production_days_max: number;
  delivery_country: string;
  estimated_delivery_days: number;
  total_days: number;
}

export async function sendOrderInquiryConfirmation(to: string, data: OrderInquiryConfirmationData) {
  const subject = `Your Tengri Yurt Inquiry #${data.order_number}`;
  const text = `
Hello ${data.buyer_name},

We have received your inquiry and will contact you within 24 hours
to confirm details and provide pricing.

ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━
Order number:  #${data.order_number}
Yurt:          ${data.yurt_name}
Supplier:      ${data.supplier_name}
Quantity:      ${data.quantity}

ESTIMATED TIMELINE
Production:    ${data.production_days_min}–${data.production_days_max} days
Delivery to ${data.delivery_country}: ${data.estimated_delivery_days} days
Total:         ~${data.total_days} days from order confirmation

NEXT STEPS
Our manager will reach out to you at ${data.buyer_email} within 24 hours.

Tengri Yurt | tengri-camp.kz
`.trim();

  if (!canSend()) return;
  const { error } = await resend!.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    text,
  });
  if (error) throw new Error(`Resend: ${JSON.stringify(error)}`);
}

export interface NewOrderToSupplierData {
  order_number: string;
  yurt_name: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  delivery_city: string | null;
  delivery_country: string;
  quantity: number;
  message: string | null;
  dashboard_url: string;
}

export async function sendNewOrderToSupplier(to: string, data: NewOrderToSupplierData) {
  const subject = `New Inquiry #${data.order_number} — ${data.yurt_name}`;
  const text = `
You have a new inquiry!

Order:    #${data.order_number}
Yurt:     ${data.yurt_name}
Buyer:    ${data.buyer_name}
Email:    ${data.buyer_email}
Phone:    ${data.buyer_phone ?? '—'}
Ship to:  ${data.delivery_city ?? ''}, ${data.delivery_country}
Qty:      ${data.quantity}
Message:  ${data.message ?? '—'}

→ Go to dashboard: ${data.dashboard_url}
`.trim();

  if (!canSend()) return;
  const { error } = await resend!.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    text,
  });
  if (error) throw new Error(`Resend: ${JSON.stringify(error)}`);
}

export interface StatusUpdateData {
  order_number: string;
  buyer_name: string;
  old_status: OrderStatus;
  new_status: OrderStatus;
  order_tracking_url: string;
  delivery_date?: string;
}

export async function sendOrderStatusUpdate(to: string, data: StatusUpdateData) {
  const subject = `Order #${data.order_number} update: ${data.new_status}`;
  let body = `
Hello ${data.buyer_name},

Your order #${data.order_number} status has been updated:

${data.old_status} → ${data.new_status}
`;
  if (data.new_status === 'shipped' && data.delivery_date) {
    body += `\nYour yurt is on its way! Estimated arrival: ${data.delivery_date}\n`;
  }
  body += `
Track your order: ${data.order_tracking_url}

Tengri Yurt
`;

  if (!canSend()) return;
  const { error } = await resend!.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    text: body.trim(),
  });
  if (error) throw new Error(`Resend: ${JSON.stringify(error)}`);
}
