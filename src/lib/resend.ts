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

export type EmailLocale = 'en' | 'ru' | 'kk' | 'zh';

const CONFIRMATION_EMAIL: Record<
  EmailLocale,
  { subject: (orderNumber: string) => string; body: (d: OrderInquiryConfirmationData) => string }
> = {
  en: {
    subject: (orderNumber) => `Your application has been received #${orderNumber} — Tengri Yurt`,
    body: (d) => `
Hello ${d.buyer_name},

Your application has been received and is under consideration.

We will contact you within 24 hours at ${d.buyer_email} to confirm details and provide pricing.

ORDER DETAILS
Order number:  #${d.order_number}
Yurt:          ${d.yurt_name}
Quantity:      ${d.quantity}

ESTIMATED TIMELINE
Production:    ${d.production_days_min}–${d.production_days_max} days
Delivery to ${d.delivery_country}: ${d.estimated_delivery_days} days
Total:         ~${d.total_days} days from confirmation

Thank you for your interest.

Tengri Yurt | tengri-camp.kz
`.trim(),
  },
  ru: {
    subject: (orderNumber) => `Ваша заявка принята #${orderNumber} — Tengri Yurt`,
    body: (d) => `
Здравствуйте, ${d.buyer_name}!

Ваша заявка принята и находится на рассмотрении.

Мы свяжемся с вами в течение 24 часов по адресу ${d.buyer_email} для уточнения деталей и расчёта стоимости.

ДЕТАЛИ ЗАЯВКИ
Номер заявки:  #${d.order_number}
Юрта:          ${d.yurt_name}
Количество:     ${d.quantity}

СРОКИ
Производство:  ${d.production_days_min}–${d.production_days_max} дней
Доставка в ${d.delivery_country}: ${d.estimated_delivery_days} дней
Итого:         ~${d.total_days} дней с момента подтверждения

Спасибо за ваш интерес.

Tengri Yurt | tengri-camp.kz
`.trim(),
  },
  kk: {
    subject: (orderNumber) => `Сіздің өтініміңіз қабылданды #${orderNumber} — Tengri Yurt`,
    body: (d) => `
Сәлеметсіз бе, ${d.buyer_name}!

Сіздің өтініміңіз қабылданды және қаралып жатыр.

Біз 24 сағат ішінде ${d.buyer_email} мекенжайы бойынша сізбен хабарласып, мәліметтерді нақтылаймыз және бағаны есептейміз.

ӨТІНІМ МӘЛІМЕТТЕРІ
Өтінім нөмірі:  #${d.order_number}
Киіз үй:         ${d.yurt_name}
Саны:            ${d.quantity}

МЕРЗІМДЕР
Өндіріс:         ${d.production_days_min}–${d.production_days_max} күн
${d.delivery_country} жеткізу: ${d.estimated_delivery_days} күн
Барлығы:         ~${d.total_days} күн растаудан кейін

Қызығушылығыңызға рахмет.

Tengri Yurt | tengri-camp.kz
`.trim(),
  },
  zh: {
    subject: (orderNumber) => `您的申请已收到 #${orderNumber} — Tengri Yurt`,
    body: (d) => `
${d.buyer_name}，您好！

您的申请已收到，正在审核中。

我们将在24小时内通过 ${d.buyer_email} 与您联系，确认详情并提供报价。

订单信息
订单编号：  #${d.order_number}
蒙古包：    ${d.yurt_name}
数量：      ${d.quantity}

预计时间
生产：      ${d.production_days_min}–${d.production_days_max} 天
运至 ${d.delivery_country}：${d.estimated_delivery_days} 天
总计：      确认后约 ${d.total_days} 天

感谢您的关注。

Tengri Yurt | tengri-camp.kz
`.trim(),
  },
};

function getEmailLocale(locale: string): EmailLocale {
  if (locale === 'ru' || locale === 'kk' || locale === 'zh') return locale;
  return 'en';
}

export async function sendOrderInquiryConfirmation(
  to: string,
  data: OrderInquiryConfirmationData,
  locale: string = 'en'
) {
  const lang = getEmailLocale(locale);
  const t = CONFIRMATION_EMAIL[lang];
  const subject = t.subject(data.order_number);
  const text = t.body(data);

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
