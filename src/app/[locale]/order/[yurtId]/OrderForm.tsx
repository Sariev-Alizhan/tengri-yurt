'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { TRADITIONAL_ACCESSORIES } from '@/data/accessories';
import { Spinner } from '@/components/Spinner';

const WHATSAPP = '77477777888';
const GMAIL = 'info@tengri-camp.kz';

type Props = {
  yurtId: string;
  yurtName: string;
  yurtPrice: number;
  translations: Record<string, string>;
};

type KeregeColor = 'natural' | 'blue' | 'red' | 'silver';
type ShippingMethod = 'air' | 'sea';

interface OrderResult {
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  date: string;
}

const KEREGE_COLORS: { key: KeregeColor; hex: string }[] = [
  { key: 'natural', hex: '#c4b5a0' },
  { key: 'blue',    hex: '#2a4a6b' },
  { key: 'red',     hex: '#8b2020' },
  { key: 'silver',  hex: '#c8d0da' }, // true pearl-silver, not beige
];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  structure:  { en: 'Structure',        ru: 'Конструкция',         kk: 'Құрылым',         zh: '结构',     ar: 'هيكل' },
  cover:      { en: 'Covers',           ru: 'Покрытия',            kk: 'Жабындылар',      zh: '覆盖物',   ar: 'أغطية' },
  decoration: { en: 'Decoration',       ru: 'Декор',               kk: 'Безендіру',       zh: '装饰',     ar: 'ديكور' },
  rope:       { en: 'Ropes & Bindings', ru: 'Верёвки и обвязки',   kk: 'Арқандар',        zh: '绳索',     ar: 'حبال' },
};

const L: Record<string, Record<string, string>> = {
  accessories: { en: 'Accessories', ru: 'Аксессуары', kk: 'Аксессуарлар', zh: '配件', ar: 'إكسسوارات' },
  accSub:      { en: 'Select authentic pieces for your yurt', ru: 'Выберите аутентичные элементы', kk: 'Аутентикалық бөлшектерді таңдаңыз', zh: '为您的毡房选择正宗配件', ar: 'اختر قطعًا أصيلة لخيمتك' },
  yourDetails: { en: 'Your Details', ru: 'Ваши данные', kk: 'Сіздің деректеріңіз', zh: '您的信息', ar: 'تفاصيلك' },
  estTotal:    { en: 'Estimated Total', ru: 'Ориентировочная сумма', kk: 'Болжамды сома', zh: '预计总额', ar: 'الإجمالي التقديري' },
  selected:    { en: 'Selected', ru: 'Выбрано', kk: 'Таңдалды', zh: '已选', ar: 'محدد' },
  yurt:        { en: 'Yurt', ru: 'Юрта', kk: 'Киіз үй', zh: '毡房', ar: 'خيمة' },
  options:     { en: 'Options', ru: 'Доп. опции', kk: 'Қосымша', zh: '选项', ar: 'خيارات' },
  tbd:         { en: 'TBD', ru: 'Уточняется', kk: 'Анықталады', zh: '待定', ar: 'يحدد لاحقًا' },
  from:        { en: 'From', ru: 'Итого от', kk: 'Бастап', zh: '起', ar: 'ابتداءً من' },
  priceNote:   { en: 'Final price confirmed after consultation', ru: 'Окончательная цена подтверждается после консультации', kk: 'Соңғы баға кеңесуден кейін расталады', zh: '最终价格在咨询后确认', ar: 'السعر النهائي يُؤكد بعد الاستشارة' },
  fillFields:  { en: 'Please fill all required fields', ru: 'Заполните все обязательные поля', kk: 'Барлық міндетті өрістерді толтырыңыз', zh: '请填写所有必填字段', ar: 'يرجى ملء جميع الحقول المطلوبة' },
  wa:          { en: 'Continue on WhatsApp', ru: 'Написать в WhatsApp', kk: 'WhatsApp-та жазу', zh: '在WhatsApp上继续', ar: 'تواصل عبر واتساب' },
  gmail:       { en: 'Send Email', ru: 'Написать на email', kk: 'Email жіберу', zh: '发送邮件', ar: 'إرسال بريد' },
  dlPdf:       { en: 'Download PDF Receipt', ru: 'Скачать PDF', kk: 'PDF жүктеу', zh: '下载PDF收据', ar: 'تحميل إيصال PDF' },
  orderConf:   { en: 'Order Submitted', ru: 'Заявка отправлена', kk: 'Өтінім жіберілді', zh: '订单已提交', ar: 'تم تقديم الطلب' },
  confSub:     { en: "We'll be in touch within 24 hours", ru: 'Мы свяжемся с вами в течение 24 часов', kk: 'Біз 24 сағат ішінде хабарласамыз', zh: '我们将在24小时内与您联系', ar: 'سنتواصل معك خلال 24 ساعة' },
  orderNum:    { en: 'Order', ru: 'Заявка', kk: 'Тапсырыс', zh: '订单', ar: 'طلب' },
  history:     { en: 'About this piece', ru: 'Об этом элементе', kk: 'Бұл бөлше туралы', zh: '关于这个配件', ar: 'عن هذه القطعة' },
};

function t(key: string, locale: string): string {
  return L[key]?.[locale] ?? L[key]?.en ?? key;
}

// ─── PDF generation ────────────────────────────────────────────────────────
function generatePDF(params: {
  orderNumber: string;
  yurtName: string;
  yurtPrice: number;
  quantity: number;
  accessories: typeof TRADITIONAL_ACCESSORIES;
  keregeColor: KeregeColor;
  shippingMethod: ShippingMethod;
  exclusiveCustom: boolean;
  coverCustom: boolean;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  locale: string;
}) {
  const accTotal = params.accessories.reduce((s, a) => s + a.price_usd, 0);
  const total = params.yurtPrice * params.quantity + accTotal;
  const date = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  const accRows = params.accessories.map(a =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #f0ebe3;">${a.name.en}</td><td style="padding:8px 0;border-bottom:1px solid #f0ebe3;text-align:right;">$${a.price_usd.toLocaleString()}</td></tr>`
  ).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Tengri Yurt — Order ${params.orderNumber}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', serif; color: #1a1510; background: #fff; padding: 48px; max-width: 680px; margin: 0 auto; }
  .logo { font-size: 28px; letter-spacing: -0.02em; color: #1a1510; margin-bottom: 4px; }
  .tagline { font-family: 'Arial', sans-serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #a89578; }
  .divider { height: 1px; background: #e8e0d5; margin: 24px 0; }
  .gold { color: #c9a86e; }
  h2 { font-size: 20px; font-weight: 400; margin-bottom: 4px; }
  .label { font-family: 'Arial', sans-serif; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #a89578; margin-bottom: 6px; }
  .value { font-size: 15px; color: #1a1510; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-family: 'Arial', sans-serif; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #a89578; padding-bottom: 8px; border-bottom: 1px solid #e8e0d5; }
  .total-row td { font-size: 17px; font-weight: 700; padding-top: 16px; }
  .footer { margin-top: 48px; font-family: 'Arial', sans-serif; font-size: 11px; color: #a89578; text-align: center; }
  @media print { body { padding: 32px; } }
</style>
</head>
<body>
  <div class="logo">Tengri Yurt</div>
  <div class="tagline">Handcrafted Kazakh Yurts Since 2010</div>
  <div class="divider"></div>

  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
    <div>
      <div class="label">Order Reference</div>
      <div style="font-size:20px;color:#c9a86e;">${params.orderNumber}</div>
    </div>
    <div style="text-align:right;">
      <div class="label">Date</div>
      <div class="value" style="margin-bottom:0;">${date}</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;">
    <div>
      <div class="label">Customer</div>
      <div class="value">${params.name}</div>
      <div class="label">Email</div>
      <div class="value">${params.email}</div>
    </div>
    <div>
      <div class="label">Phone</div>
      <div class="value">${params.phone}</div>
      <div class="label">Delivery</div>
      <div class="value">${params.city}, ${params.country}</div>
    </div>
  </div>

  <div class="divider"></div>
  <h2 style="margin-bottom:20px;">Order Summary</h2>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:right;">Price (USD)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;">
          ${params.yurtName} × ${params.quantity}
          <div style="font-size:12px;color:#a89578;margin-top:2px;">Kerege: ${params.keregeColor} · Shipping: ${params.shippingMethod}${params.exclusiveCustom ? ' · Exclusive custom interior' : ''}${params.coverCustom ? ' · Custom cover' : ''}</div>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe3;text-align:right;">$${(params.yurtPrice * params.quantity).toLocaleString()}+</td>
      </tr>
      ${accRows}
      <tr class="total-row">
        <td style="padding-top:16px;">Total (from)</td>
        <td style="padding-top:16px;text-align:right;color:#c9a86e;">$${total.toLocaleString()}+</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top:16px;padding:12px 16px;background:#faf7f2;border-left:3px solid #c9a86e;">
    <div style="font-family:Arial,sans-serif;font-size:11px;color:#a89578;">Note: Final pricing is confirmed after consultation. This document is an inquiry receipt, not a final invoice.</div>
  </div>

  <div class="divider"></div>
  <div class="footer">
    Tengri-Yurt.kz · info@tengri-camp.kz · +7 747 777 78 88 · Almaty, Kazakhstan
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=800,height=900');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

// ─── Component ─────────────────────────────────────────────────────────────
export function OrderForm({ yurtId, yurtName, yurtPrice, translations }: Props) {
  const locale = useLocale();
  const loc = locale as string;

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<{
    name: string; email: string; phone: string;
    country: string; city: string; address: string | null; msg: string; qty: number;
  } | null>(null);
  const [keregeColor, setKeregeColor] = useState<KeregeColor>('natural');
  const [exclusiveCustom, setExclusiveCustom] = useState(false);
  const [coverCustom, setCoverCustom] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('air');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [agreement, setAgreement] = useState(false);
  const [expandedAcc, setExpandedAcc] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, string>>({});

  const localeKey = (loc === 'ru' || loc === 'kk' || loc === 'zh' || loc === 'ar') ? loc : 'en';

  const toggleAccessory = useCallback((id: string) => {
    setSelectedAccessories(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  }, []);

  const selectedAccItems = TRADITIONAL_ACCESSORIES.filter(a => selectedAccessories.includes(a.id));
  const accTotal = selectedAccItems.reduce((s, a) => s + a.price_usd, 0);
  const estimatedTotal = yurtPrice * quantity + accTotal;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const name    = (fd.get('name') as string)?.trim();
    const email   = (fd.get('email') as string)?.trim();
    const phone   = (fd.get('phone') as string)?.trim();
    const country = (fd.get('country') as string)?.trim();
    const city    = (fd.get('city') as string)?.trim();
    const address = (fd.get('address') as string)?.trim() || null;
    const msg     = (fd.get('message') as string)?.trim() || '';
    const qty     = Number(fd.get('quantity')) || 1;

    if (!name || !email || !phone || !country || !city) {
      setError(t('fillFields', loc));
      return;
    }

    setPendingData({ name, email, phone, country, city, address, msg, qty });
    setShowConfirm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = async () => {
    if (!pendingData) return;
    const { name, email, phone, country, city, address, msg, qty } = pendingData;
    setFormSnapshot({ name, email, phone, country, city });
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yurtId, buyerName: name, buyerEmail: email, buyerPhone: phone,
          deliveryCountry: country, deliveryCity: city, deliveryAddress: address,
          quantity: qty, message: msg || undefined,
          orderOptions: { interior: { keregeColor, exclusiveCustom, coverCustom }, logistics: { method: shippingMethod }, selectedAccessories: selectedAccessories.length > 0 ? selectedAccessories : undefined },
          shippingMethod, locale: loc, selectedAccessories,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setOrderResult({ orderNumber: data.orderNumber, buyerName: name, buyerEmail: email, date: new Date().toLocaleDateString() });
      setShowConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!orderResult) return;
    generatePDF({
      orderNumber: orderResult.orderNumber,
      yurtName,
      yurtPrice,
      quantity,
      accessories: selectedAccItems,
      keregeColor,
      shippingMethod,
      exclusiveCustom,
      coverCustom,
      name: formSnapshot.name ?? '',
      email: formSnapshot.email ?? '',
      phone: formSnapshot.phone ?? '',
      country: formSnapshot.country ?? '',
      city: formSnapshot.city ?? '',
      locale: loc,
    });
  };

  const categories = ['structure', 'cover', 'decoration', 'rope'] as const;
  const grouped = categories.map(cat => ({
    key: cat,
    label: CATEGORY_LABELS[cat]?.[localeKey] ?? CATEGORY_LABELS[cat]?.en ?? cat,
    items: TRADITIONAL_ACCESSORIES.filter(a => a.category === cat),
  })).filter(g => g.items.length > 0);

  const GOLD = '#c9a86e';
  const GOLD_BG = 'rgba(201,168,110,0.10)';
  const GOLD_BG_ACTIVE = 'rgba(201,168,110,0.15)';
  const GOLD_BORDER = 'rgba(201,168,110,0.40)';

  // ── Confirmation step ──────────────────────────────────────────────────
  if (showConfirm && pendingData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '48px' }}>
        <OFCard style={{ borderColor: 'rgba(201,168,110,0.3)' }}>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.55)', marginBottom: '8px' }}>Review your order</p>
            <h3 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 400, color: 'var(--of-text-1)', margin: 0 }}>Confirm your inquiry</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--of-text-3)', margin: '6px 0 0' }}>Please review the details below before submitting</p>
          </div>

          {/* Yurt + options */}
          <div style={{ padding: '16px', background: 'rgba(201,168,110,0.05)', border: '1px solid rgba(201,168,110,0.15)', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.55)', margin: '0 0 4px' }}>Yurt</p>
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '20px', color: 'var(--of-text-1)', margin: 0 }}>{yurtName} × {pendingData.qty}</p>
              </div>
              <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '22px', color: 'rgba(201,168,110,0.95)' }}>${estimatedTotal.toLocaleString()}+</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <ConfirmTag label={`Kerege: ${translations[`kerege_${keregeColor}`] ?? keregeColor}`} />
              <ConfirmTag label={shippingMethod === 'air' ? '✈ Air freight' : '🚢 Sea freight'} />
              {exclusiveCustom && <ConfirmTag label="Exclusive interior" />}
              {coverCustom && <ConfirmTag label="Custom cover" />}
            </div>
          </div>

          {/* Accessories */}
          {selectedAccItems.length > 0 && (
            <div style={{ padding: '14px 16px', background: 'var(--of-surface)', border: '1px solid var(--of-border-soft)', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--of-text-4)', margin: '0 0 10px' }}>
                Accessories ({selectedAccItems.length}) — ${accTotal.toLocaleString()}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedAccItems.map(a => (
                  <span key={a.id} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', padding: '4px 12px', background: 'rgba(201,168,110,0.08)', border: '1px solid rgba(201,168,110,0.2)', borderRadius: '20px', color: GOLD }}>
                    {a.name[localeKey as 'en' | 'ru' | 'kk'] ?? a.name.en}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Customer */}
          <div style={{ padding: '14px 16px', background: 'var(--of-surface)', border: '1px solid var(--of-border-soft)', borderRadius: '8px', marginBottom: '24px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--of-text-4)', margin: '0 0 12px' }}>Your details</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '12px' }}>
              {[
                { label: 'Name', value: pendingData.name },
                { label: 'Email', value: pendingData.email },
                { label: 'Phone', value: pendingData.phone },
                { label: 'Delivery', value: `${pendingData.city}, ${pendingData.country}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--of-text-4)', margin: '0 0 3px' }}>{label}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--of-text-1)', margin: 0, fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(220,80,80,0.85)', marginBottom: '16px' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              style={{
                height: '50px', padding: '0 40px',
                border: 'none', borderRadius: '12px',
                background: '#c9a86e', color: '#1e1408',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? <Spinner /> : 'Confirm & Submit'}
            </button>
            <button
              type="button"
              onClick={() => { setShowConfirm(false); setError(null); }}
              style={{
                height: '50px', padding: '0 24px',
                border: '1px solid var(--of-border)', borderRadius: '12px',
                background: 'transparent', color: 'var(--of-text-3)',
                fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              ← Edit
            </button>
          </div>
        </OFCard>
      </div>
    );
  }

  // ── Success state ───────────────────────────────────────────────────────
  if (orderResult) {
    const waMsg = encodeURIComponent(
      `Hello! I just submitted an order inquiry #${orderResult.orderNumber} for ${yurtName}. I'd like to discuss the details.`
    );
    const gmailSubject = encodeURIComponent(`Order Inquiry #${orderResult.orderNumber} — ${yurtName}`);
    const gmailBody = encodeURIComponent(
      `Hello Tengri Yurt team,\n\nI submitted order inquiry #${orderResult.orderNumber} for ${yurtName}.\n\nPlease contact me to discuss further.\n\nBest regards,\n${orderResult.buyerName}`
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '48px' }}>

        {/* Success hero */}
        <OFCard>
          <div style={{ textAlign: 'center', padding: '32px 16px 24px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(34,197,94,0.12)',
              border: '2px solid rgba(34,197,94,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="28" height="28" fill="none" stroke="rgba(34,197,94,0.9)" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 400, color: 'var(--of-text-1)', margin: '0 0 10px' }}>
              {t('orderConf', loc)}
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--of-text-3)', lineHeight: 1.6, margin: 0 }}>
              {t('confSub', loc)}
            </p>
          </div>

          {/* Order number badge */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(201,168,110,0.08)', border: '1px solid rgba(201,168,110,0.25)',
            borderRadius: '10px', padding: '16px 20px', margin: '4px 0',
          }}>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.7)', margin: '0 0 4px' }}>
                {t('orderNum', loc)}
              </p>
              <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '26px', color: GOLD, margin: 0, lineHeight: 1 }}>
                #{orderResult.orderNumber}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--of-text-4)', margin: '0 0 4px' }}>Date</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--of-text-2)', margin: 0 }}>{orderResult.date}</p>
            </div>
          </div>
        </OFCard>

        {/* Order summary */}
        <OFCard>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--of-text-3)', marginBottom: '16px' }}>Summary</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px 20px', marginBottom: selectedAccItems.length > 0 ? '16px' : 0 }}>
            {[
              { label: t('yurt', loc), value: yurtName },
              { label: 'Kerege', value: translations[`kerege_${keregeColor}`] ?? keregeColor },
              { label: 'Shipping', value: shippingMethod === 'air' ? '✈ Air Freight' : '🚢 Sea Freight' },
              { label: 'Customer', value: orderResult.buyerName },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--of-text-4)', margin: '0 0 3px' }}>{label}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--of-text-1)', margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
          {selectedAccItems.length > 0 && (
            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--of-border-soft)' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--of-text-4)', margin: '0 0 8px' }}>
                {t('accessories', loc)} · {selectedAccItems.length}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedAccItems.map(a => (
                  <span key={a.id} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', padding: '4px 12px', background: 'rgba(201,168,110,0.10)', border: '1px solid rgba(201,168,110,0.22)', borderRadius: '20px', color: GOLD }}>
                    {a.name[localeKey as 'en' | 'ru' | 'kk'] ?? a.name.en}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--of-border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--of-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('from', loc)}</span>
            <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '30px', color: GOLD, lineHeight: 1 }}>${estimatedTotal.toLocaleString()}+</span>
          </div>
        </OFCard>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handleDownloadPDF} style={{
            height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: GOLD, border: 'none', borderRadius: '12px',
            color: '#1e1408', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
            transition: 'opacity 0.18s',
          }} onMouseOver={e => (e.currentTarget.style.opacity = '0.88')} onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {t('dlPdf', loc)}
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <a href={`https://wa.me/${WHATSAPP}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" style={{
              height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'rgba(34,197,94,0.10)', border: '1.5px solid rgba(34,197,94,0.35)', borderRadius: '12px',
              color: 'rgba(34,197,94,0.90)', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase', textDecoration: 'none',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href={`mailto:${GMAIL}?subject=${gmailSubject}&body=${gmailBody}`} style={{
              height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: 'var(--of-card-2)', border: '1.5px solid var(--of-border)', borderRadius: '12px',
              color: 'var(--of-text-2)', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase', textDecoration: 'none',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round"/><polyline points="22,6 12,13 2,6"/></svg>
              Email
            </a>
          </div>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--of-text-4)', textAlign: 'center', lineHeight: 1.6, margin: '4px 0 0' }}>
          Confirmation sent to {orderResult.buyerEmail}
        </p>
      </div>
    );
  }

  // ── Order form ─────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '48px' }}>
      {/* ── SECTION 01: Interior ─────────────────────────────── */}
      {translations.interiorTitle && (
        <OFCard>
          <SectionHeader num="01" title={translations.interiorTitle} />

          {/* Kerege color swatches */}
          <div style={{ marginBottom: '28px' }}>
            <FieldLabel>{translations.keregeColor}</FieldLabel>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {KEREGE_COLORS.map(({ key, hex }) => {
                const active = keregeColor === key;
                return (
                  <button key={key} type="button" onClick={() => setKeregeColor(key)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    background: active ? GOLD_BG_ACTIVE : 'var(--of-card-2)',
                    border: `1.5px solid ${active ? GOLD_BORDER : 'var(--of-border-soft)'}`,
                    borderRadius: '12px', padding: '14px 16px',
                    cursor: 'pointer', transition: 'all 0.18s', minWidth: '72px',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      backgroundColor: hex,
                      boxShadow: active ? `0 0 0 2.5px ${GOLD}` : '0 0 0 1px rgba(0,0,0,0.12)',
                      transition: 'box-shadow 0.2s',
                    }} />
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 500,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: active ? GOLD : 'var(--of-text-3)',
                    }}>
                      {translations[`kerege_${key}`]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <ToggleRow active={exclusiveCustom} onClick={() => setExclusiveCustom(v => !v)}
              label={translations.exclusiveCustom} sub={translations.assemblyNote} />
            <ToggleRow active={coverCustom} onClick={() => setCoverCustom(v => !v)}
              label={translations.coverOption} sub={translations.coverPrice} />
          </div>
        </OFCard>
      )}

      {/* ── SECTION 02: Accessories ──────────────────────────── */}
      <OFCard>
        <SectionHeader num="02" title={t('accessories', loc)} sub={t('accSub', loc)} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {grouped.map(({ key, label, items }) => (
                <div key={key}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--of-text-4)', marginBottom: '12px' }}>
                    {label}
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                    gap: '12px',
                  }}>
                    {items.map(acc => {
                      const selected = selectedAccessories.includes(acc.id);
                      const expanded = expandedAcc === acc.id;
                      const name = acc.name[localeKey as 'en' | 'ru' | 'kk'] ?? acc.name.en;
                      const desc = acc.description[localeKey as 'en' | 'ru' | 'kk'] ?? acc.description.en;
                      const hist = acc.history[localeKey as 'en' | 'ru' | 'kk'] ?? acc.history.en;

                      return (
                        <div key={acc.id} style={{ display: 'flex', flexDirection: 'column' }}>
                          <button
                            type="button"
                            onClick={() => toggleAccessory(acc.id)}
                            style={{
                              textAlign: 'left', background: 'none',
                              border: `1px solid ${selected ? 'rgba(201,168,110,0.5)' : 'var(--of-border)'}`,
                              cursor: 'pointer', padding: 0, overflow: 'hidden',
                              transition: 'border-color 0.2s',
                              position: 'relative',
                            }}
                          >
                            {/* Image */}
                            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--of-surface)' }}>
                              <Image
                                src={acc.photo}
                                alt={name}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                style={{ objectFit: 'cover', transition: 'transform 0.4s', transform: selected ? 'scale(1.04)' : 'scale(1)' }}
                              />
                              {/* Selected overlay */}
                              <div style={{
                                position: 'absolute', inset: 0,
                                background: selected ? 'rgba(201,168,110,0.12)' : 'transparent',
                                transition: 'background 0.2s',
                              }} />
                              {/* Check mark */}
                              <div style={{
                                position: 'absolute', top: '10px', right: '10px',
                                width: '22px', height: '22px', borderRadius: '50%',
                                background: selected ? '#C9A86E' : 'rgba(0,0,0,0.35)',
                                border: selected ? 'none' : '1px solid rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transform: selected ? 'scale(1)' : 'scale(0.85)',
                                transition: 'all 0.2s',
                              }}>
                                {selected && (
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '12px 14px 14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '16px', color: 'var(--of-text-1)', lineHeight: 1.2 }}>
                                  {name}
                                </span>
                                {acc.price_usd > 0 && (
                                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(201,168,110,0.85)', flexShrink: 0, fontWeight: 500 }}>
                                    ${acc.price_usd.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--of-text-3)', lineHeight: 1.5, margin: 0 }}>
                                {desc}
                              </p>
                            </div>
                          </button>

                          {/* History expand toggle */}
                          <button
                            type="button"
                            onClick={() => setExpandedAcc(expanded ? null : acc.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '8px 14px',
                              background: 'var(--of-surface)',
                              border: '1px solid var(--of-border-soft)',
                              borderTop: 'none',
                              cursor: 'pointer',
                              fontFamily: 'Inter, sans-serif', fontSize: '9px',
                              letterSpacing: '0.12em', textTransform: 'uppercase',
                              color: 'rgba(201,168,110,0.5)',
                              transition: 'color 0.2s',
                              textAlign: 'left',
                            }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {t('history', loc)}
                          </button>

                          {expanded && (
                            <div style={{
                              padding: '14px 14px 16px',
                              background: 'var(--of-surface)',
                              border: '1px solid var(--of-border-soft)',
                              borderTop: 'none',
                            }}>
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--of-text-3)', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
                                {hist}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {selectedAccessories.length > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--of-border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--of-text-3)' }}>
                  {t('selected', loc)}: {selectedAccessories.length}
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--of-text-2)' }}>
                  ${accTotal.toLocaleString()}
                </span>
              </div>
            )}
        </OFCard>

      {/* ── SECTION 03: Logistics ────────────────────────────── */}
      {translations.logisticsTitle && (
        <OFCard>
          <SectionHeader num="03" title={translations.logisticsTitle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <ShippingCard
                  active={shippingMethod === 'air'}
                  onClick={() => setShippingMethod('air')}
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>}
                  label={translations.airShipping?.split('—')[0]?.trim() ?? 'Air'}
                  sub={translations.airShipping?.split('—')[1]?.trim() ?? ''}
                />
                <ShippingCard
                  active={shippingMethod === 'sea'}
                  onClick={() => setShippingMethod('sea')}
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a6 6 0 0012 0 6 6 0 008 0"/><path d="M12 12V2l4 4-4 4"/><path d="M12 6H4"/></svg>}
                  label={translations.seaShipping?.split('—')[0]?.trim() ?? 'Sea'}
                  sub={translations.seaShipping?.split('—')[1]?.trim() ?? ''}
                />
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--of-text-4)', lineHeight: 1.7 }}>
                {translations.installationNote}
              </p>
        </OFCard>
      )}

      {/* ── SECTION 04: Your Details ─────────────────────────── */}
      <OFCard>
        <SectionHeader num="04" title={t('yourDetails', loc)} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '24px', marginBottom: '24px' }}>
              <FormField label={translations.name} name="name" required />
              <FormField label={translations.email} name="email" type="email" required />
              <FormField label={translations.phone} name="phone" type="tel" required />
              <FormField label={translations.country} name="country" required placeholder="Kazakhstan, UAE, Germany…" />
              <FormField label={translations.city} name="city" required />
              <FormField label={translations.address} name="address" />
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '24px' }}>
              <FieldLabel>{translations.quantity}</FieldLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {[
                  { action: () => setQuantity(q => Math.max(1, q - 1)), icon: '−' },
                ].map(({ action, icon }) => (
                  <button key={icon} type="button" onClick={action} style={qBtnStyle}>{icon}</button>
                ))}
                <input name="quantity" type="number" min={1} value={quantity}
                  onChange={e => setQuantity(Number(e.target.value) || 1)}
                  style={{ width: '52px', textAlign: 'center', background: 'transparent', border: 'none', borderBottom: '1px solid var(--of-border)', color: 'var(--of-text-1)', fontFamily: 'Inter, sans-serif', fontSize: '18px', outline: 'none', padding: '4px 0' }}
                />
                <button type="button" onClick={() => setQuantity(q => q + 1)} style={qBtnStyle}>+</button>
              </div>
            </div>

            {/* Message */}
            <div>
              <FieldLabel>{translations.message}</FieldLabel>
              <textarea
                name="message" rows={4}
                style={{
                  width: '100%', background: 'var(--of-surface)',
                  border: '1.5px solid var(--of-border)',
                  borderRadius: '8px',
                  color: 'var(--of-text-1)', fontFamily: 'Inter, sans-serif', fontSize: '13px',
                  lineHeight: 1.6, padding: '12px 14px', resize: 'vertical', minHeight: '100px',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,168,110,0.50)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--of-border)'; }}
                placeholder={loc === 'ru' ? 'Дополнительные пожелания…' : loc === 'kk' ? 'Қосымша тілектер…' : 'Additional requirements or questions…'}
              />
            </div>
      </OFCard>

      {/* ── Estimated Total ──────────────────────────────────── */}
      <OFCard style={{ background: 'rgba(201,168,110,0.05)', border: '1px solid rgba(201,168,110,0.2)' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,110,0.5)', marginBottom: '16px' }}>
              {t('estTotal', loc)}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--of-text-2)' }}>
                <span>{t('yurt', loc)} × {quantity}</span>
                <span>${(yurtPrice * quantity).toLocaleString()}+</span>
              </div>
              {accTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--of-text-2)' }}>
                  <span>{t('accessories', loc)} ({selectedAccessories.length})</span>
                  <span>${accTotal.toLocaleString()}</span>
                </div>
              )}
              {(exclusiveCustom || coverCustom) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--of-text-2)' }}>
                  <span>{t('options', loc)}</span>
                  <span>{t('tbd', loc)}</span>
                </div>
              )}
              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--of-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--of-text-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('from', loc)}</span>
                <span style={{ fontFamily: 'EB Garamond, serif', fontSize: '28px', color: 'rgba(201,168,110,0.95)' }}>${estimatedTotal.toLocaleString()}+</span>
              </div>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'var(--of-text-4)', lineHeight: 1.6 }}>
              {t('priceNote', loc)}
            </p>
      </OFCard>

      {/* ── Agreement + Submit ───────────────────────────────── */}
      <OFCard>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '28px' }}>
              <button
                type="button"
                onClick={() => setAgreement(v => !v)}
                style={{
                  marginTop: '2px', width: '20px', height: '20px', flexShrink: 0,
                  border: `1.5px solid ${agreement ? 'rgba(201,168,110,0.6)' : 'var(--of-border)'}`,
                  borderRadius: '5px',
                  background: agreement ? 'rgba(201,168,110,0.18)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {agreement && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,110,0.9)" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--of-text-3)', lineHeight: 1.6 }}>
                {translations.agreement}
              </span>
            </label>

            {error && (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(220,80,80,0.85)', marginBottom: '20px' }}>
                {error}
              </p>
            )}

            {/* Submit + contact alternatives */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              <button
                type="submit"
                disabled={loading || !agreement}
                style={{
                  height: '50px', padding: '0 40px',
                  border: 'none',
                  borderRadius: '12px',
                  background: !agreement ? 'var(--of-surface)' : '#c9a86e',
                  color: !agreement ? 'var(--of-text-4)' : '#1e1408',
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  cursor: !agreement ? 'not-allowed' : 'pointer',
                  opacity: !agreement ? 0.6 : 1,
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                {loading ? <Spinner /> : translations.submitInquiry}
              </button>

              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--of-text-4)' }}>or</span>

              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hello! I'm interested in ordering ${yurtName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(37,211,102,0.75)', textDecoration: 'none',
                  border: '1px solid rgba(37,211,102,0.2)', padding: '8px 16px',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              <a
                href={`mailto:${GMAIL}?subject=${encodeURIComponent(`Inquiry: ${yurtName}`)}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--of-text-3)', textDecoration: 'none',
                  border: '1px solid var(--of-border-soft)', padding: '8px 16px',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </a>
            </div>
      </OFCard>

      <style>{`
        @media (max-width: 600px) {
          .acc-grid { grid-template-columns: 1fr 1fr !important; }
        }
        form input::placeholder, form textarea::placeholder {
          color: var(--of-text-3) !important;
          opacity: 1;
        }
      `}</style>
    </form>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ConfirmTag({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: 'Inter, sans-serif', fontSize: '11px',
      padding: '4px 12px',
      background: 'rgba(201,168,110,0.08)',
      border: '1px solid rgba(201,168,110,0.2)',
      borderRadius: '20px',
      color: 'rgba(201,168,110,0.85)',
    }}>{label}</span>
  );
}

function OFCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--of-card)',
      border: '1px solid var(--of-border)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: 'var(--of-shadow)',
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ num, title, sub }: { num: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.28em',
          color: 'rgba(201,168,110,0.55)', flexShrink: 0, textTransform: 'uppercase',
        }}>{num}</span>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(201,168,110,0.20), transparent)' }} />
      </div>
      <h3 style={{
        fontFamily: 'EB Garamond, serif', fontSize: 'clamp(20px, 3.5vw, 26px)',
        fontWeight: 400, color: 'var(--of-text-1)', margin: 0, lineHeight: 1.2,
      }}>{title}</h3>
      {sub && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'var(--of-text-3)', margin: '5px 0 0' }}>{sub}</p>}
    </div>
  );
}

const qBtnStyle: React.CSSProperties = {
  width: '36px', height: '36px',
  border: '1px solid var(--of-border)',
  borderRadius: '8px',
  background: 'var(--of-surface)', color: 'var(--of-text-2)',
  fontFamily: 'Inter, sans-serif', fontSize: '18px',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'border-color 0.15s, color 0.15s',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--of-text-3)', marginBottom: '10px' }}>
      {children}
    </p>
  );
}

function ToggleRow({ active, onClick, label, sub }: { active: boolean; onClick: () => void; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px',
        background: active ? 'rgba(201,168,110,0.08)' : 'var(--of-surface)',
        border: `1.5px solid ${active ? 'rgba(201,168,110,0.40)' : 'var(--of-border-soft)'}`,
        borderRadius: '10px',
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: '18px', height: '18px', flexShrink: 0,
        border: `1px solid ${active ? 'rgba(201,168,110,0.5)' : 'var(--of-border)'}`,
        background: active ? 'rgba(201,168,110,0.15)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        {active && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,110,0.9)" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>}
      </div>
      <div>
        <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'var(--of-text-1)', lineHeight: 1.3 }}>{label}</span>
        <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--of-text-4)', marginTop: '2px' }}>{sub}</span>
      </div>
    </button>
  );
}

function ShippingCard({ active, onClick, icon, label, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '20px', textAlign: 'left', cursor: 'pointer',
        background: active ? 'rgba(201,168,110,0.08)' : 'var(--of-surface)',
        border: `1.5px solid ${active ? 'rgba(201,168,110,0.40)' : 'var(--of-border-soft)'}`,
        borderRadius: '12px',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ color: active ? 'rgba(201,168,110,0.7)' : 'var(--of-text-3)', marginBottom: '12px', transition: 'color 0.2s' }}>
        {icon}
      </div>
      <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: active ? 'var(--of-text-1)' : 'var(--of-text-2)', fontWeight: 500, marginBottom: '4px', transition: 'color 0.2s' }}>
        {label}
      </span>
      <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'var(--of-text-4)' }}>
        {sub}
      </span>
    </button>
  );
}

function FormField({ label, name, type = 'text', required, placeholder }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--of-text-3)', marginBottom: '10px' }}>
        {label}{required && <span style={{ color: 'rgba(201,168,110,0.5)', marginLeft: '4px' }}>*</span>}
      </p>
      <input
        name={name} type={type} required={required} placeholder={placeholder}
        style={{
          width: '100%', background: 'var(--of-surface)',
          border: '1.5px solid var(--of-border)',
          borderRadius: '8px',
          color: 'var(--of-text-1)', fontFamily: 'Inter, sans-serif', fontSize: '14px',
          padding: '10px 14px', outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(201,168,110,0.50)'; }}
        onBlur={e => { e.currentTarget.style.borderColor = 'var(--of-border)'; }}
      />
    </div>
  );
}
