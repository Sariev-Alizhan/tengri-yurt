import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const type = searchParams.get('type') || 'client'; // 'client' | 'store'

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

    const title = type === 'store' ? `Order (Store) #${orderRow.order_number}` : `Order Receipt #${orderRow.order_number}`;
    drawText(title, 50, 18, true);
    y -= 8;

    drawText(`Date: ${new Date(orderRow.created_at).toLocaleString()}`, 50, 10);
    drawText(`Buyer: ${orderRow.buyer_name}`, 50, 10);
    drawText(`Email: ${orderRow.buyer_email}`, 50, 10);
    if (orderRow.buyer_phone) drawText(`Phone: ${orderRow.buyer_phone}`, 50, 10);
    drawText(`Delivery: ${orderRow.delivery_country}, ${orderRow.delivery_city || ''}${orderRow.delivery_address ? ', ' + orderRow.delivery_address : ''}`, 50, 10);
    drawText(`Shipping: ${orderRow.shipping_method === 'air' ? 'Air' : 'Sea'}`, 50, 10);
    y -= 12;

    drawText('Items', 50, 12, true);
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.2, 0.2, 0.2) });
    y -= 10;

    for (const line of lineItems) {
      const lineText = `${line.name} × ${line.quantity} — $${line.unitPrice.toFixed(2)} = $${line.total.toFixed(2)}`;
      page.drawText(lineText.substring(0, 80), { x: 50, y, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
      y -= 12;
    }

    y -= 6;
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.2, 0.2, 0.2) });
    y -= 12;
    drawText(`Total: $${orderRow.total_price_usd.toFixed(2)}`, 50, 12, true);

    if (type === 'store' && orderRow.message) {
      y -= 16;
      drawText('Notes (for store)', 50, 10, true);
      const msg = orderRow.message.slice(0, 300).replace(/\n/g, ' ');
      page.drawText(msg, { x: 50, y, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
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
