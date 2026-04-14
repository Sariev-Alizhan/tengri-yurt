'use client';

import { useState } from 'react';
import { OrderStatusTimeline } from './OrderStatusTimeline';

const formatNumber = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export type OrderItem = {
  id: string;
  order_id: string;
  item_type: string;
  quantity: number;
  unit_price_usd: number;
  total_price_usd: number;
  accessories: {
    id: string;
    name: string;
    slug: string;
    name_i18n?: { ru: string; en: string; kk: string };
    price_usd: number | null;
    photos: string[];
  } | null;
};

export type OrderOptionsStored = {
  interior?: { keregeColor?: string; exclusiveCustom?: boolean; coverCustom?: boolean };
  logistics?: { method?: string };
  addons?: { id: string; name: string; slug?: string; quantity: number; price_usd: number }[];
  delivery?: { address?: string; postalCode?: string; notes?: string };
  selectedAccessories?: string[];
};

export type Order = {
  id: string;
  order_number: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  delivery_country: string;
  delivery_city: string | null;
  delivery_address: string | null;
  quantity: number;
  message: string | null;
  order_options?: OrderOptionsStored | null;
  total_price_usd: number;
  payment_status: string;
  status: string;
  created_at: string;
  yurts: { name: string } | null;
  orderItems?: OrderItem[];
};

const STATUSES = ['pending', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled'];

const label: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'rgba(168,149,120,0.65)', marginBottom: '4px',
};
const value: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.8)',
  lineHeight: 1.6,
};

function OrderOptionsBlock({ opts, message, messageLabel }: {
  opts: OrderOptionsStored; message?: string | null; messageLabel: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {opts.interior && (
        <div>
          <p style={label}>Interior</p>
          <ul style={{ ...value, paddingLeft: '16px', margin: 0 }}>
            <li>Kerege: {{ natural: 'Natural wood', blue: 'Blue', red: 'Red', silver: 'Silver' }[opts.interior.keregeColor ?? 'natural'] ?? 'Natural wood'}</li>
            {opts.interior.exclusiveCustom && <li>Exclusive custom interior</li>}
            {opts.interior.coverCustom && <li>Cover (custom order)</li>}
          </ul>
        </div>
      )}
      {opts.logistics && (
        <div>
          <p style={label}>Logistics</p>
          <p style={value}>{opts.logistics.method === 'sea' ? 'Sea freight — 30–60 days' : 'Air freight — 3–10 days'}</p>
        </div>
      )}
      {opts.addons && opts.addons.length > 0 && (
        <div>
          <p style={label}>Add-ons</p>
          <ul style={{ ...value, paddingLeft: '16px', margin: 0 }}>
            {opts.addons.map((a) => (
              <li key={a.id}>{a.name} × {a.quantity} — ${a.price_usd}</li>
            ))}
          </ul>
        </div>
      )}
      {opts.delivery && (
        <div>
          <p style={label}>Delivery details</p>
          <p style={value}>{[opts.delivery.address, opts.delivery.postalCode, opts.delivery.notes].filter(Boolean).join(' · ')}</p>
        </div>
      )}
      {message && (
        <div>
          <p style={label}>{messageLabel}</p>
          <p style={{ ...value, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>{message}</p>
        </div>
      )}
    </div>
  );
}

function getOrderProductLabel(order: Order): string {
  const yurtName = (order.yurts as { name: string } | null)?.name;
  if (yurtName) return yurtName;
  const m = order.message ?? '';
  const match = m.match(/\[Accessory[^\]]*:\s*([^\]]+)\]/);
  return match ? match[1].trim() : 'Accessories';
}

function PaymentBadge({ status }: { status: string }) {
  const isPaid = status === 'paid';
  return (
    <span style={{
      fontFamily: 'Inter, sans-serif',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: isPaid ? 'rgba(52,211,153,0.9)' : 'rgba(251,191,36,0.9)',
      padding: '3px 8px',
      border: `1px solid ${isPaid ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
      background: isPaid ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.08)',
      borderRadius: '4px',
    }}>
      {status}
    </span>
  );
}

export function OrdersList({
  orders,
  statusLabels,
  updateStatusLabel,
  downloadPdfLabel = 'Download PDF',
  noOrdersLabel,
  messageLabel = 'Message',
  accessoriesLabel = 'Accessories',
}: {
  orders: Order[];
  statusLabels: Record<string, string>;
  updateStatusLabel: string;
  downloadPdfLabel?: string;
  noOrdersLabel: string;
  messageLabel?: string;
  accessoriesLabel?: string;
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      window.location.reload();
    } catch {
      setUpdatingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div style={{
        padding: '64px 24px',
        textAlign: 'center',
        border: '1px solid rgba(168,149,120,0.1)',
        background: 'rgba(168,149,120,0.02)',
        borderRadius: '12px',
      }}>
        <p style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: '20px',
          color: 'rgba(168,149,120,0.3)',
        }}>
          {noOrdersLabel}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {orders.map((order) => {
        const isExpanded = expandedId === order.id;
        const hasDetails = !!(order.order_options || order.message ||
          (order.orderItems && order.orderItems.length > 0));

        return (
          <div
            key={order.id}
            style={{
              background: 'rgba(168,149,120,0.03)',
              border: '1px solid rgba(168,149,120,0.12)',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(168,149,120,0.22)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(168,149,120,0.12)'; }}
          >
            {/* ── Header ── */}
            <div style={{ padding: '20px 24px 0' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px',
              }}>
                {/* Left: order info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'EB Garamond, serif',
                      fontSize: '22px',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400,
                    }}>
                      #{order.order_number}
                    </span>
                    <PaymentBadge status={order.payment_status} />
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(168,149,120,0.5)',
                      letterSpacing: '0.05em',
                    }}>
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.85)',
                    marginBottom: '2px',
                  }}>
                    {getOrderProductLabel(order)} × {order.quantity}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(168,149,120,0.7)',
                  }}>
                    {order.buyer_name} · {order.delivery_city && `${order.delivery_city}, `}{order.delivery_country}
                  </p>
                </div>

                {/* Right: price + status update */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: '26px',
                    color: 'rgba(168,149,120,0.95)',
                    fontWeight: 500,
                    lineHeight: 1,
                  }}>
                    ${formatNumber(order.total_price_usd)}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(168,149,120,0.55)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      {updateStatusLabel}:
                    </span>
                    <select
                      value={order.status}
                      disabled={!!updatingId}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        padding: '6px 10px',
                        background: 'rgba(168,149,120,0.08)',
                        border: '1px solid rgba(168,149,120,0.25)',
                        color: 'rgba(255,255,255,0.85)',
                        cursor: updatingId ? 'not-allowed' : 'pointer',
                        opacity: updatingId ? 0.5 : 1,
                        outline: 'none',
                        borderRadius: '6px',
                        minWidth: '150px',
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} style={{ background: '#0f0d0a', color: 'rgba(255,255,255,0.85)' }}>
                          {statusLabels[s] ?? s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Status Timeline ── */}
              <OrderStatusTimeline status={order.status} statusLabels={statusLabels} />
            </div>

            {/* ── Expandable details ── */}
            {hasDetails && (
              <div style={{ borderTop: '1px solid rgba(168,149,120,0.08)' }}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  style={{
                    width: '100%',
                    padding: '10px 24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'rgba(168,149,120,0.65)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s',
                    minHeight: '40px',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(168,149,120,0.9)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(168,149,120,0.65)'; }}
                >
                  <span>{isExpanded ? 'Hide details' : 'Show details'}</span>
                  <span style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    fontSize: '10px',
                  }}>▼</span>
                </button>
              </div>
            )}

            {isExpanded && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(168,149,120,0.08)' }}>
                {/* Buyer contact */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px',
                  padding: '16px',
                  background: 'rgba(168,149,120,0.04)',
                  borderRadius: '8px',
                  border: '1px solid rgba(168,149,120,0.08)',
                }}>
                  <div>
                    <p style={label}>Buyer</p>
                    <p style={value}>{order.buyer_name}</p>
                  </div>
                  <div>
                    <p style={label}>Email</p>
                    <p style={value}>{order.buyer_email}</p>
                  </div>
                  {order.buyer_phone && (
                    <div>
                      <p style={label}>Phone</p>
                      <p style={value}>{order.buyer_phone}</p>
                    </div>
                  )}
                  {order.delivery_address && (
                    <div>
                      <p style={label}>Address</p>
                      <p style={value}>{order.delivery_address}</p>
                    </div>
                  )}
                </div>

                {/* Accessories */}
                {order.orderItems && order.orderItems.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ ...label, marginBottom: '10px' }}>{accessoriesLabel}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {order.orderItems.map((item) => {
                        const acc = item.accessories;
                        if (!acc) return null;
                        return (
                          <div key={item.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: 'rgba(168,149,120,0.05)',
                            border: '1px solid rgba(168,149,120,0.1)',
                            borderRadius: '6px',
                          }}>
                            <div>
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{acc.name}</p>
                              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Qty: {item.quantity}</p>
                            </div>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(168,149,120,0.85)', fontWeight: 500 }}>${item.unit_price_usd}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order options */}
                {order.order_options != null ? (
                  <OrderOptionsBlock
                    opts={order.order_options}
                    message={order.message}
                    messageLabel={messageLabel}
                  />
                ) : order.message ? (
                  <div>
                    <p style={label}>{messageLabel}</p>
                    <p style={{ ...value, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>{order.message}</p>
                  </div>
                ) : null}

                {/* PDF download buttons */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(168,149,120,0.08)',
                  flexWrap: 'wrap',
                }}>
                  <a
                    href={`/api/orders/pdf?orderNumber=${encodeURIComponent(order.order_number)}&type=store`}
                    download
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(168,149,120,0.9)',
                      textDecoration: 'none',
                      border: '1px solid rgba(168,149,120,0.35)',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(168,149,120,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(168,149,120,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(168,149,120,0.35)';
                    }}
                  >
                    ↓ {downloadPdfLabel}
                  </a>
                  <a
                    href={`/api/orders/pdf?orderNumber=${encodeURIComponent(order.order_number)}&type=supplier`}
                    download
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.4)',
                      textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    }}
                  >
                    ↓ PDF for Supplier
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
