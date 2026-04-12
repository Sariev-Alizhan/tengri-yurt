import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

// Transliterate Cyrillic → Latin so pdf-lib standard fonts don't crash
const CYR_MAP: Record<string, string> = {
  // Russian
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',
  к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
  х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:"'",ы:'y',ь:"'",э:'e',ю:'yu',я:'ya',
  А:'A',Б:'B',В:'V',Г:'G',Д:'D',Е:'E',Ё:'Yo',Ж:'Zh',З:'Z',И:'I',Й:'Y',
  К:'K',Л:'L',М:'M',Н:'N',О:'O',П:'P',Р:'R',С:'S',Т:'T',У:'U',Ф:'F',
  Х:'Kh',Ц:'Ts',Ч:'Ch',Ш:'Sh',Щ:'Sch',Ъ:"'",Ы:'Y',Ь:"'",Э:'E',Ю:'Yu',Я:'Ya',
  // Kazakh specific
  ә:'a',Ә:'A',ғ:'g',Ғ:'G',қ:'q',Қ:'Q',ң:'ng',Ң:'Ng',
  ө:'o',Ө:'O',ұ:'u',Ұ:'U',ү:'u',Ү:'U',һ:'h',Һ:'H',і:'i',І:'I',
  // Latin diacritics → ASCII
  'ö':'o','Ö':'O','ü':'u','Ü':'U','ä':'a','Ä':'A','é':'e','É':'E',
  'è':'e','ê':'e','ë':'e','à':'a','â':'a','ñ':'n','ç':'c','ß':'ss',
  'í':'i','ó':'o','ú':'u','ý':'y',
  // Common punctuation → safe ASCII
  '\u2014':'-','\u2013':'-','\u00AB':'"','\u00BB':'"','\u2018':"'",'\u2019':"'",'\u201C':'"','\u201D':'"','\u2026':'...',
};
function safe(text: string): string {
  return (text ?? '')
    .split('')
    .map((c) => CYR_MAP[c] ?? (c.charCodeAt(0) > 127 ? '?' : c))
    .join('');
}

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
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber.trim())
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { data: items } = await supabase
      .from('order_items')
      .select('id, item_type, yurt_id, accessory_id, quantity, unit_price_usd, total_price_usd')
      .eq('order_id', (order as { id: string }).id);

    const yurtIds = (items || [])
      .map((i) => (i as { yurt_id?: string }).yurt_id)
      .filter(Boolean) as string[];
    const accessoryIds = (items || [])
      .map((i) => (i as { accessory_id?: string }).accessory_id)
      .filter(Boolean) as string[];

    const [yurtsRes, accessoriesRes] = await Promise.all([
      yurtIds.length ? supabase.from('yurts').select('id, name').in('id', yurtIds) : { data: [] as { id: string; name: string }[] },
      accessoryIds.length ? supabase.from('accessories').select('id, name').in('id', accessoryIds) : { data: [] as { id: string; name: string }[] },
    ]);

    const yurtNames: Record<string, string> = {};
    (yurtsRes.data || []).forEach((y: { id: string; name: string }) => { yurtNames[y.id] = y.name; });
    const accessoryNames: Record<string, string> = {};
    (accessoriesRes.data || []).forEach((a: { id: string; name: string }) => { accessoryNames[a.id] = a.name; });

    type OrderOptions = {
      interior?: { keregeColor?: string; exclusiveCustom?: boolean; coverCustom?: boolean };
      logistics?: { method?: string };
      addons?: { id: string; name: string; quantity: number; price_usd: number }[];
      delivery?: { address?: string; postalCode?: string; notes?: string };
      selectedAccessories?: string[];
    };
    const orderRow = order as {
      order_number: string;
      buyer_name: string;
      buyer_email: string;
      buyer_phone: string | null;
      delivery_country: string;
      delivery_city: string | null;
      delivery_address: string | null;
      quantity: number;
      message: string | null;
      order_options: OrderOptions | null;
      unit_price_usd: number;
      total_price_usd: number;
      shipping_method: string | null;
      created_at: string;
    };

    const lineItems = (items || []).map((item: Record<string, unknown>) => {
      const name =
        item.item_type === 'yurt' && item.yurt_id
          ? yurtNames[item.yurt_id as string] || 'Yurt'
          : item.item_type === 'accessory' && item.accessory_id
            ? accessoryNames[item.accessory_id as string] || 'Accessory'
            : 'Item';
      return {
        name,
        quantity: item.quantity as number,
        unitPrice: item.unit_price_usd as number,
        total: item.total_price_usd as number,
      };
    });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    let y = height - 50;

    // Logo at top center (with band so white logo is visible on PDF)
    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'logo_white.png');
      const logoBytes = await fs.readFile(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoW = 140;
      const logoH = (logoImage.height / logoImage.width) * logoW;
      const logoX = (width - logoW) / 2;
      const logoY = height - 24 - logoH;
      const bandPadding = 16;
      page.drawRectangle({
        x: 0,
        y: logoY - bandPadding,
        width,
        height: logoH + bandPadding * 2,
        color: rgb(0.11, 0.1, 0.08),
      });
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoW,
        height: logoH,
      });
      page.drawLine({
        start: { x: 80, y: logoY - bandPadding - 1 },
        end: { x: width - 80, y: logoY - bandPadding - 1 },
        thickness: 0.4,
        color: rgb(0.2, 0.18, 0.16),
      });
      y = logoY - bandPadding - 24;
    } catch {
      // No logo file — start as before
    }

    const drawText = (text: string, x: number, size: number, bold = false) => {
      const f = bold ? fontBold : font;
      page.drawText(text, { x, y, size, font: f, color: rgb(0.1, 0.1, 0.1) });
      y -= size + 2;
    };

    const title = type === 'store' ? `Order (Store) #${orderRow.order_number}` : type === 'supplier' ? `Production Order #${orderRow.order_number}` : `Order Receipt #${orderRow.order_number}`;
    drawText(safe(title), 50, 18, true);
    y -= 8;

    drawText(`Date: ${new Date(orderRow.created_at).toLocaleString()}`, 50, 10);
    drawText(safe(`Buyer: ${orderRow.buyer_name}`), 50, 10);
    drawText(safe(`Email: ${orderRow.buyer_email}`), 50, 10);
    if (orderRow.buyer_phone) drawText(safe(`Phone: ${orderRow.buyer_phone}`), 50, 10);
    drawText(safe(`Delivery: ${orderRow.delivery_country}, ${orderRow.delivery_city || ''}${orderRow.delivery_address ? ', ' + orderRow.delivery_address : ''}`), 50, 10);
    drawText(`Shipping: ${orderRow.shipping_method === 'air' ? 'Air' : 'Sea'}`, 50, 10);
    y -= 12;

    drawText('Items', 50, 12, true);
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.2, 0.2, 0.2) });
    y -= 10;

    for (const line of lineItems) {
      const lineText = type === 'supplier'
        ? safe(`${line.name} x ${line.quantity}`)
        : safe(`${line.name} x ${line.quantity} — $${line.unitPrice.toFixed(2)} = $${line.total.toFixed(2)}`);
      page.drawText(lineText.substring(0, 80), { x: 50, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 12;
    }

    // also list addons from order_options inline (they're not in order_items)
    const opts = orderRow.order_options as OrderOptions | null | undefined;
    if (opts?.addons?.length) {
      for (const a of opts.addons) {
        const addonTotal = (a.price_usd * a.quantity).toFixed(2);
        const addonText = type === 'supplier'
          ? safe(`  + ${a.name} x ${a.quantity}`)
          : safe(`  + ${a.name} x ${a.quantity} — $${a.price_usd} = $${addonTotal}`);
        page.drawText(addonText.substring(0, 80), { x: 50, y, size: 10, font, color: rgb(0.35, 0.25, 0.1) });
        y -= 12;
      }
    }
    if (opts?.selectedAccessories?.length) {
      for (const accName of opts.selectedAccessories) {
        const accText = safe(`  + ${accName}`);
        page.drawText(accText.substring(0, 80), { x: 50, y, size: 10, font, color: rgb(0.35, 0.25, 0.1) });
        y -= 12;
      }
    }

    y -= 6;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.2, 0.2, 0.2) });
    y -= 12;
    if (type !== 'supplier') {
      drawText(`Total: $${orderRow.total_price_usd.toFixed(2)}`, 50, 12, true);
    }

    // Order details section — shown for both client and store
    const drawDetail = (text: string) => {
      page.drawText(safe(text).slice(0, 90), { x: 50, y, size: 9, font, color: rgb(0.25, 0.25, 0.25) });
      y -= 13;
    };

    if (opts) {
      y -= 16;
      page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.3, color: rgb(0.75, 0.7, 0.65) });
      y -= 12;
      drawText('Order Details', 50, 11, true);
      y -= 6;

      if (opts.interior) {
        drawText('Interior', 50, 10, true); y -= 2;
        const keregeMap: Record<string, string> = { natural: 'Natural wood', blue: 'Blue', red: 'Red', silver: 'Silver' };
        drawDetail(`Kerege Color: ${keregeMap[opts.interior.keregeColor ?? 'natural'] ?? 'Natural wood'}`);
        if (opts.interior.exclusiveCustom) drawDetail('  Exclusive custom interior (on order)');
        if (opts.interior.coverCustom) drawDetail('  Cover (custom order)');
        y -= 4;
      }

      if (opts.logistics) {
        drawText('Shipping method', 50, 10, true); y -= 2;
        drawDetail(opts.logistics.method === 'sea' ? 'Sea freight — 30-60 days' : 'Air freight — 3-10 days');
        y -= 4;
      }

      if (opts.addons?.length) {
        drawText('Add-ons & accessories', 50, 10, true); y -= 2;
        for (const a of opts.addons) {
          drawDetail(type === 'supplier' ? `${a.name}  x${a.quantity}` : `${a.name}  x${a.quantity}  — $${(a.price_usd * a.quantity).toFixed(2)}`);
        }
        y -= 4;
      }

      if (opts.selectedAccessories?.length) {
        drawText('Selected traditional accessories', 50, 10, true); y -= 2;
        for (const name of opts.selectedAccessories) drawDetail(`  ${name}`);
        y -= 4;
      }

      if (opts.delivery && (opts.delivery.address || opts.delivery.postalCode || opts.delivery.notes)) {
        drawText('Delivery details', 50, 10, true); y -= 2;
        if (opts.delivery.address) drawDetail(`Address: ${opts.delivery.address}`);
        if (opts.delivery.postalCode) drawDetail(`Postal code: ${opts.delivery.postalCode}`);
        if (opts.delivery.notes) drawDetail(`Notes: ${opts.delivery.notes}`);
        y -= 4;
      }
    }

    if (orderRow.message) {
      y -= 8;
      drawText('Note from customer', 50, 10, true); y -= 2;
      const msg = safe(orderRow.message.slice(0, 400).replace(/\n/g, ' '));
      page.drawText(msg.slice(0, 90), { x: 50, y, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
      y -= 14;
    }

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
      { status: 500 }
    );
  }
}
