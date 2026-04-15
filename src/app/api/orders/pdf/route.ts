import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts } from 'pdf-lib';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

// ── Cyrillic → Latin transliteration for pdf-lib standard fonts ─────────────
const CYR_MAP: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',
  к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
  х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:"'",ы:'y',ь:"'",э:'e',ю:'yu',я:'ya',
  А:'A',Б:'B',В:'V',Г:'G',Д:'D',Е:'E',Ё:'Yo',Ж:'Zh',З:'Z',И:'I',Й:'Y',
  К:'K',Л:'L',М:'M',Н:'N',О:'O',П:'P',Р:'R',С:'S',Т:'T',У:'U',Ф:'F',
  Х:'Kh',Ц:'Ts',Ч:'Ch',Ш:'Sh',Щ:'Sch',Ъ:"'",Ы:'Y',Ь:"'",Э:'E',Ю:'Yu',Я:'Ya',
  ә:'a',Ә:'A',ғ:'g',Ғ:'G',қ:'q',Қ:'Q',ң:'ng',Ң:'Ng',
  ө:'o',Ө:'O',ұ:'u',Ұ:'U',ү:'u',Ү:'U',һ:'h',Һ:'H',і:'i',І:'I',
  'ö':'o','Ö':'O','ü':'u','Ü':'U','ä':'a','Ä':'A','é':'e','É':'E',
  'è':'e','ê':'e','ë':'e','à':'a','â':'a','ñ':'n','ç':'c','ß':'ss',
  'í':'i','ó':'o','ú':'u','ý':'y',
  '\u2014':'-','\u2013':'-','\u00AB':'"','\u00BB':'"',
  '\u2018':"'",'\u2019':"'",'\u201C':'"','\u201D':'"','\u2026':'...',
};
function safe(text: string): string {
  return (text ?? '').split('').map(c => CYR_MAP[c] ?? (c.charCodeAt(0) > 127 ? '?' : c)).join('');
}
function fmtMoney(n: number): string {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function wrapText(text: string, maxW: number, size: number, f: PDFFont): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (cur && f.widthOfTextAtSize(test, size) > maxW) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

// ── Brand palette ─────────────────────────────────────────────────────────────
const C_DARK   = rgb(0.11, 0.086, 0.063);   // #1C1610
const C_GOLD   = rgb(0.788, 0.659, 0.431);  // #C9A86E
const C_MED    = rgb(0.38, 0.33, 0.26);     // ~#615440
const C_GRAY   = rgb(0.55, 0.50, 0.43);     // ~#8C8070
const C_LIGHT  = rgb(0.91, 0.88, 0.84);     // #E8E0D7
const C_TBL_BG = rgb(0.14, 0.11, 0.08);     // dark table header
const C_TBL_TX = rgb(0.72, 0.61, 0.44);     // gold-toned table header text

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const type = searchParams.get('type') || 'client'; // 'client' | 'store' | 'supplier'

    if (!orderNumber || !/^TY-\d{4}-\d{5}$/.test(orderNumber.trim())) {
      return NextResponse.json({ error: 'Invalid order number' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const { data: order, error: orderError } = await supabase
      .from('orders').select('*').eq('order_number', orderNumber.trim()).single();
    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { data: items } = await supabase
      .from('order_items')
      .select('id, item_type, yurt_id, accessory_id, quantity, unit_price_usd, total_price_usd')
      .eq('order_id', (order as { id: string }).id);

    const yurtIds      = (items || []).map(i => (i as Record<string,unknown>).yurt_id).filter(Boolean) as string[];
    const accessoryIds = (items || []).map(i => (i as Record<string,unknown>).accessory_id).filter(Boolean) as string[];
    const [yurtsRes, accRes] = await Promise.all([
      yurtIds.length      ? supabase.from('yurts').select('id, name').in('id', yurtIds)           : { data: [] as { id: string; name: string }[] },
      accessoryIds.length ? supabase.from('accessories').select('id, name').in('id', accessoryIds): { data: [] as { id: string; name: string }[] },
    ]);
    const yurtNames: Record<string,string> = {};
    (yurtsRes.data || []).forEach((y: { id: string; name: string }) => { yurtNames[y.id] = y.name; });
    const accNames: Record<string,string> = {};
    (accRes.data || []).forEach((a: { id: string; name: string }) => { accNames[a.id] = a.name; });

    type OrderOptions = {
      interior?: { keregeColor?: string; exclusiveCustom?: boolean; coverCustom?: boolean };
      logistics?: { method?: string };
      addons?: { id: string; name: string; quantity: number; price_usd: number }[];
      delivery?: { address?: string; postalCode?: string; notes?: string };
      selectedAccessories?: string[];
    };
    const orderRow = order as {
      order_number: string; buyer_name: string; buyer_email: string; buyer_phone: string | null;
      delivery_country: string; delivery_city: string | null; delivery_address: string | null;
      quantity: number; message: string | null; order_options: OrderOptions | null;
      unit_price_usd: number; total_price_usd: number; shipping_method: string | null; created_at: string;
    };
    const opts = orderRow.order_options as OrderOptions | null | undefined;
    const lineItems = (items || []).map((item: Record<string, unknown>) => ({
      name: item.item_type === 'yurt' && item.yurt_id ? yurtNames[item.yurt_id as string] || 'Yurt'
          : item.item_type === 'accessory' && item.accessory_id ? accNames[item.accessory_id as string] || 'Accessory'
          : 'Item',
      quantity: item.quantity as number,
      unitPrice: (item.unit_price_usd as number) || 0,
      total: (item.total_price_usd as number) || 0,
    }));

    // ── PDF layout constants ──────────────────────────────────────────────────
    const W = 595, H = 842;
    const M = 44;                    // left/right margin
    const CW = W - M * 2;            // content width
    const FOOTER_Y = 44;
    const HDR_H = 76;
    const showPrices = type !== 'supplier';

    const pdfDoc   = await PDFDocument.create();
    const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Pre-load logo
    let logoBytes: Uint8Array | null = null;
    try {
      const buf = await fs.readFile(path.join(process.cwd(), 'public', 'images', 'logo_white.png'));
      logoBytes = new Uint8Array(buf);
    } catch { /* no logo — skip */ }

    // Mutable page state (closures update these)
    let pg: PDFPage = pdfDoc.addPage([W, H]);
    let y = H - HDR_H - 28;

    // ── Header band renderer ─────────────────────────────────────────────────
    const drawHeader = async (p: PDFPage) => {
      // Dark background band
      p.drawRectangle({ x: 0, y: H - HDR_H, width: W, height: HDR_H, color: C_DARK });

      // Logo (left)
      if (logoBytes) {
        try {
          const img = await pdfDoc.embedPng(logoBytes);
          const lW = 110, lH = (img.height / img.width) * lW;
          p.drawImage(img, { x: M, y: H - HDR_H / 2 - lH / 2, width: lW, height: lH });
        } catch { /* logo embed failed */ }
      }

      // Doc type label (right, top)
      const typeLabel = type === 'supplier' ? 'PRODUCTION ORDER'
                      : type === 'store'    ? 'ORDER DOCUMENT'
                      :                       'ORDER RECEIPT';
      p.drawText(typeLabel, {
        x: W - M - font.widthOfTextAtSize(typeLabel, 7.5),
        y: H - 30, size: 7.5, font, color: rgb(0.6, 0.5, 0.36),
      });

      // Order number (right, bold gold)
      const numStr = `#${orderRow.order_number}`;
      p.drawText(numStr, {
        x: W - M - fontBold.widthOfTextAtSize(numStr, 17),
        y: H - 52, size: 17, font: fontBold, color: C_GOLD,
      });

      // Gold accent line below header
      p.drawLine({ start: { x: 0, y: H - HDR_H }, end: { x: W, y: H - HDR_H }, thickness: 1.5, color: C_GOLD });
    };

    // ── Footer renderer ───────────────────────────────────────────────────────
    const drawFooter = (p: PDFPage, idx: number, total: number) => {
      p.drawLine({ start: { x: M, y: FOOTER_Y + 14 }, end: { x: W - M, y: FOOTER_Y + 14 }, thickness: 0.5, color: C_LIGHT });
      p.drawText('Tengri-Yurt.kz  ·  info@tengri-camp.kz  ·  +7 747 777 78 88', { x: M, y: FOOTER_Y, size: 7.5, font, color: C_GRAY });
      const copy = '\u00A9 2026 Tengri Yurt';
      p.drawText(copy, { x: W - M - font.widthOfTextAtSize(copy, 7.5), y: FOOTER_Y, size: 7.5, font, color: C_GRAY });
      if (total > 1) {
        const pg = `Page ${idx + 1} / ${total}`;
        p.drawText(pg, { x: (W - font.widthOfTextAtSize(pg, 7)) / 2, y: FOOTER_Y, size: 7, font, color: C_GRAY });
      }
    };

    // ── New page helper ───────────────────────────────────────────────────────
    const newPage = async (): Promise<PDFPage> => {
      const p = pdfDoc.addPage([W, H]);
      await drawHeader(p);
      return p;
    };

    // Ensures enough vertical space; creates new page if needed.
    // Updates outer `pg` and `y` via closure.
    const ensureSpace = async (needed: number) => {
      if (y - needed < FOOTER_Y + 20) {
        pg = await newPage();
        y = H - HDR_H - 28;
      }
    };

    // ── Draw first page header ────────────────────────────────────────────────
    await drawHeader(pg);

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 1 — Two-column customer / order info
    // ─────────────────────────────────────────────────────────────────────────
    const COL1 = M;
    const COL2 = M + 280;
    const COL_W = 245;
    const topY = y;

    // Left column — Customer info
    pg.drawText('CUSTOMER', { x: COL1, y, size: 7, font: fontBold, color: C_GOLD }); y -= 4;
    pg.drawLine({ start: { x: COL1, y }, end: { x: COL1 + COL_W, y }, thickness: 0.5, color: C_GOLD }); y -= 14;
    pg.drawText(safe(orderRow.buyer_name), { x: COL1, y, size: 12, font: fontBold, color: C_DARK }); y -= 17;
    pg.drawText(safe(orderRow.buyer_email), { x: COL1, y, size: 9, font, color: C_GRAY }); y -= 13;
    if (orderRow.buyer_phone) {
      pg.drawText(safe(orderRow.buyer_phone), { x: COL1, y, size: 9, font, color: C_GRAY }); y -= 13;
    }

    y -= 6;
    pg.drawText('DELIVERY ADDRESS', { x: COL1, y, size: 7, font: fontBold, color: C_GOLD }); y -= 4;
    pg.drawLine({ start: { x: COL1, y }, end: { x: COL1 + COL_W, y }, thickness: 0.5, color: C_GOLD }); y -= 13;
    const cityCountry = [orderRow.delivery_city, orderRow.delivery_country].filter(Boolean).join(', ');
    pg.drawText(safe(cityCountry), { x: COL1, y, size: 9, font, color: C_DARK }); y -= 13;
    if (orderRow.delivery_address) {
      const addrLines = wrapText(safe(orderRow.delivery_address), COL_W, 9, font);
      for (const l of addrLines.slice(0, 2)) { pg.drawText(l, { x: COL1, y, size: 9, font, color: C_GRAY }); y -= 12; }
    }

    // Right column — Order details (starts at same topY)
    let y2 = topY;
    pg.drawText('ORDER INFORMATION', { x: COL2, y: y2, size: 7, font: fontBold, color: C_GOLD }); y2 -= 4;
    pg.drawLine({ start: { x: COL2, y: y2 }, end: { x: COL2 + COL_W, y: y2 }, thickness: 0.5, color: C_GOLD }); y2 -= 14;

    const metaRows: [string, string][] = [
      ['Date',       new Date(orderRow.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })],
      ['Order No.',  `#${orderRow.order_number}`],
      ['Status',     'Pending Review'],
      ['Shipping',   orderRow.shipping_method === 'air' ? 'Air freight  (3\u201310 days)' : 'Sea freight  (30\u201360 days)'],
    ];
    for (const [label, value] of metaRows) {
      pg.drawText(`${label}:`,  { x: COL2,      y: y2, size: 9, font: fontBold, color: C_MED  });
      pg.drawText(safe(value),  { x: COL2 + 74, y: y2, size: 9, font,           color: C_GRAY });
      y2 -= 14;
    }

    // Advance y past whichever column is taller
    y = Math.min(y, y2) - 20;

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 2 — Items table
    // ─────────────────────────────────────────────────────────────────────────
    pg.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: C_LIGHT }); y -= 18;
    pg.drawText('ORDER ITEMS', { x: M, y, size: 8, font: fontBold, color: C_GOLD }); y -= 14;

    // Table header row
    pg.drawRectangle({ x: M, y: y - 4, width: CW, height: 22, color: C_TBL_BG });
    const QTY_X  = showPrices ? M + 300 : M + 390;
    const UNIT_X = M + 370;
    const TOT_X  = W - M;        // right-edge for right-aligned totals
    const TH_Y   = y + 5;
    pg.drawText('ITEM', { x: M + 8,  y: TH_Y, size: 7.5, font: fontBold, color: C_TBL_TX });
    pg.drawText('QTY',  { x: QTY_X,  y: TH_Y, size: 7.5, font: fontBold, color: C_TBL_TX });
    if (showPrices) {
      pg.drawText('UNIT PRICE', { x: UNIT_X, y: TH_Y, size: 7.5, font: fontBold, color: C_TBL_TX });
      const totH = 'TOTAL';
      pg.drawText(totH, { x: TOT_X - fontBold.widthOfTextAtSize(totH, 7.5), y: TH_Y, size: 7.5, font: fontBold, color: C_TBL_TX });
    }
    y -= 24;

    // Line items
    for (const item of lineItems) {
      await ensureSpace(22);
      const nameLines = wrapText(safe(item.name), showPrices ? 220 : 360, 10, font);
      let ny = y;
      for (const l of nameLines) { pg.drawText(l, { x: M + 8, y: ny, size: 10, font, color: C_DARK }); ny -= 13; }
      pg.drawText(String(item.quantity), { x: QTY_X, y, size: 10, font, color: C_MED });
      if (showPrices) {
        pg.drawText(fmtMoney(item.unitPrice), { x: UNIT_X, y, size: 10, font, color: C_MED });
        const ts = fmtMoney(item.total);
        pg.drawText(ts, { x: TOT_X - fontBold.widthOfTextAtSize(ts, 10), y, size: 10, font: fontBold, color: C_DARK });
      }
      y = ny - 4;
      pg.drawLine({ start: { x: M, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.3, color: C_LIGHT }); y -= 5;
    }

    // Add-ons (from order_options)
    if (opts?.addons?.length) {
      for (const a of opts.addons) {
        await ensureSpace(20);
        pg.drawText(safe(`+ ${a.name}`), { x: M + 16, y, size: 9, font, color: C_MED });
        pg.drawText(String(a.quantity), { x: QTY_X, y, size: 9, font, color: C_GRAY });
        if (showPrices) {
          pg.drawText(fmtMoney(a.price_usd), { x: UNIT_X, y, size: 9, font, color: C_GRAY });
          const at = fmtMoney(a.price_usd * a.quantity);
          pg.drawText(at, { x: TOT_X - font.widthOfTextAtSize(at, 9), y, size: 9, font, color: C_GRAY });
        }
        y -= 16;
        pg.drawLine({ start: { x: M, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.3, color: C_LIGHT }); y -= 4;
      }
    }

    // Traditional accessories
    if (opts?.selectedAccessories?.length) {
      for (const accName of opts.selectedAccessories) {
        await ensureSpace(20);
        pg.drawText(safe(`+ ${accName}  (traditional accessory)`), { x: M + 16, y, size: 9, font, color: C_MED });
        y -= 16;
        pg.drawLine({ start: { x: M, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.3, color: C_LIGHT }); y -= 4;
      }
    }

    y -= 4;
    pg.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1.5, color: C_GOLD }); y -= 16;

    // Total
    if (showPrices) {
      await ensureSpace(28);
      pg.drawText('TOTAL', { x: M + 8, y, size: 10, font: fontBold, color: C_MED });
      const ts = fmtMoney(orderRow.total_price_usd);
      pg.drawText(ts, { x: TOT_X - fontBold.widthOfTextAtSize(ts, 16), y: y - 2, size: 16, font: fontBold, color: C_DARK });
      y -= 30;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 3 — Specifications & Preferences
    // ─────────────────────────────────────────────────────────────────────────
    const hasSpecs = opts && (opts.interior || opts.logistics?.method || opts.delivery?.postalCode || opts.delivery?.notes);
    if (hasSpecs) {
      await ensureSpace(64);
      pg.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: C_LIGHT }); y -= 16;
      pg.drawText('SPECIFICATIONS & PREFERENCES', { x: M, y, size: 8, font: fontBold, color: C_GOLD }); y -= 14;

      const spec = (label: string, value: string) => {
        pg.drawText(`${label}:`, { x: M,       y, size: 9, font: fontBold, color: C_MED  });
        pg.drawText(safe(value), { x: M + 146, y, size: 9, font,           color: C_GRAY });
        y -= 14;
      };

      if (opts!.interior) {
        const km: Record<string,string> = { natural: 'Natural wood', blue: 'Blue stain', red: 'Red stain', silver: 'Silver finish' };
        spec('Kerege color', km[opts!.interior.keregeColor ?? 'natural'] ?? 'Natural wood');
        if (opts!.interior.exclusiveCustom) spec('Custom interior', 'Exclusive custom interior (on order)');
        if (opts!.interior.coverCustom)     spec('Cover',           'Custom cover (on order)');
      }
      if (opts!.logistics?.method) {
        spec('Shipping', opts!.logistics.method === 'sea' ? 'Sea freight \u2014 30\u201360 days' : 'Air freight \u2014 3\u201310 days');
      }
      if (opts!.delivery?.postalCode) spec('Postal code', opts!.delivery.postalCode!);
      if (opts!.delivery?.notes) {
        const nLines = wrapText(safe(opts!.delivery.notes), CW - 146, 9, font);
        pg.drawText('Delivery notes:', { x: M, y, size: 9, font: fontBold, color: C_MED });
        let ny = y;
        for (const l of nLines.slice(0, 3)) { pg.drawText(l, { x: M + 146, y: ny, size: 9, font, color: C_GRAY }); ny -= 13; }
        y = Math.min(y - 14, ny);
      }
      y -= 4;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SECTION 4 — Message from customer
    // ─────────────────────────────────────────────────────────────────────────
    if (orderRow.message) {
      await ensureSpace(54);
      pg.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: C_LIGHT }); y -= 16;
      pg.drawText('MESSAGE FROM CUSTOMER', { x: M, y, size: 8, font: fontBold, color: C_GOLD }); y -= 13;
      const msgLines = wrapText(safe(orderRow.message.slice(0, 400).replace(/\n/g, ' ')), CW - 8, 9, font);
      for (const l of msgLines.slice(0, 6)) {
        await ensureSpace(16);
        pg.drawText(l, { x: M + 8, y, size: 9, font, color: C_GRAY }); y -= 14;
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FOOTER — drawn on all pages after content is finalized
    // ─────────────────────────────────────────────────────────────────────────
    const pageCount = pdfDoc.getPageCount();
    for (let i = 0; i < pageCount; i++) drawFooter(pdfDoc.getPage(i), i, pageCount);

    const pdfBytes = await pdfDoc.save();
    const filename = `order-${orderRow.order_number}-${type}.pdf`;
    const body = Buffer.from(pdfBytes);
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(body.length),
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate PDF' },
      { status: 500 },
    );
  }
}
