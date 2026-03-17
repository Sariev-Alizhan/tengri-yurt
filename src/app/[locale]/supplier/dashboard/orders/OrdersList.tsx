'use client';

import { useState } from 'react';

// Format number consistently on server and client
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
    price_kzt: number | null;
    photos: string[];
  } | null;
};

export type OrderOptionsStored = {
  interior?: { title?: string; lines?: string[] };
  logistics?: { title?: string; lines?: string[] };
  selectedAccessories?: string[];
  freeMessage?: string;
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

function getOrderProductLabel(order: Order): string {
  const yurtName = (order.yurts as { name: string } | null)?.name;
  if (yurtName) return yurtName;
  const m = order.message ?? '';
  const match = m.match(/\[Accessory[^\]]*:\s*([^\]]+)\]/);
  return match ? match[1].trim() : 'Accessories';
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
        padding: '48px 24px',
        textAlign: 'center',
        border: '1px solid rgba(168,149,120,0.15)',
        background: 'rgba(168,149,120,0.03)',
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.05em',
        }}>
          {noOrdersLabel}
        </p>
      </div>
    );
  }

  const listStyle = { display: 'flex', flexDirection: 'column', gap: '16px' } as const;
  return (
    <div style={listStyle}>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: 'rgba(168,149,120,0.04)',
            border: '1px solid rgba(168,149,120,0.15)',
            padding: '24px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(168,149,120,0.06)'
            e.currentTarget.style.borderColor = 'rgba(168,149,120,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(168,149,120,0.04)'
            e.currentTarget.style.borderColor = 'rgba(168,149,120,0.15)'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h2 style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: '24px',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
                marginBottom: '12px',
              }}>
                #{order.order_number}
              </h2>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px',
              }}>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                }}>
                  {getOrderProductLabel(order)} × {order.quantity}
                </p>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(168,149,120,0.1)',
                }}>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}>
                    {order.buyer_name}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.5)',
                  }}>
                    {order.buyer_email}
                  </p>
                  {order.buyer_phone && (
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)',
                    }}>
                      {order.buyer_phone}
                    </p>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(168,149,120,0.1)',
                }}>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(168,149,120,0.7)',
                    letterSpacing: '0.05em',
                  }}>
                    {order.delivery_city && `${order.delivery_city}, `}{order.delivery_country}
                  </p>
                  {order.delivery_address && (
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      {order.delivery_address}
                    </p>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(168,149,120,0.1)',
                }}>
                  <p style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: '20px',
                    color: 'rgba(168,149,120,0.9)',
                    fontWeight: 500,
                  }}>
                    ${formatNumber(order.total_price_usd)}
                  </p>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: order.payment_status === 'paid' ? 'rgba(100,255,150,0.7)' : 'rgba(255,200,100,0.7)',
                    padding: '4px 8px',
                    border: `1px solid ${order.payment_status === 'paid' ? 'rgba(100,255,150,0.3)' : 'rgba(255,200,100,0.3)'}`,
                    background: order.payment_status === 'paid' ? 'rgba(100,255,150,0.08)' : 'rgba(255,200,100,0.08)',
                  }}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'flex-end',
              minWidth: '200px',
            }}>
              <a
                href={`/api/orders/pdf?orderNumber=${encodeURIComponent(order.order_number)}&type=store`}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(168,149,120,0.85)',
                  marginBottom: '8px',
                  textDecoration: 'none',
                  border: '1px solid rgba(168,149,120,0.35)',
                  padding: '6px 12px',
                  borderRadius: '6px',
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
                {downloadPdfLabel}
              </a>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(168,149,120,0.5)',
                marginBottom: '4px',
              }}>
                {updateStatusLabel}
              </p>
              <select
                value={order.status}
                disabled={!!updatingId}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  padding: '10px 16px',
                  background: 'rgba(168,149,120,0.08)',
                  border: '1px solid rgba(168,149,120,0.3)',
                  color: 'rgba(255,255,255,0.85)',
                  cursor: updatingId ? 'not-allowed' : 'pointer',
                  opacity: updatingId ? 0.5 : 1,
                  outline: 'none',
                  width: '100%',
                  minWidth: '180px',
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

          {order.orderItems && order.orderItems.length > 0 && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(168,149,120,0.15)',
            }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(168,149,120,0.5)',
                marginBottom: '12px',
              }}>
                {accessoriesLabel}:
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {order.orderItems.map((item) => {
                  const accessory = item.accessories;
                  if (!accessory) return null;
                  
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'rgba(168,149,120,0.06)',
                        border: '1px solid rgba(168,149,120,0.1)',
                        borderRadius: '4px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.85)',
                          fontWeight: 500,
                        }}>
                          {accessory.name}
                        </p>
                        <p style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.5)',
                          marginTop: '2px',
                        }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div style={{
                        textAlign: 'right',
                      }}>
                        <p style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          color: 'rgba(168,149,120,0.9)',
                          fontWeight: 500,
                        }}>
                          ${item.unit_price_usd}
                        </p>
                        {accessory.price_kzt && (
                          <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.5)',
                            marginTop: '2px',
                          }}>
                            {formatNumber(accessory.price_kzt)} ₸
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(order.order_options != null || order.message) && (
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(168,149,120,0.15)',
            }}>
              {order.order_options != null ? (
                <>
                  {order.order_options.interior?.lines?.length ? (
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(168,149,120,0.6)',
                        marginBottom: '6px',
                      }}>
                        {order.order_options.interior?.title ?? 'Interior'}
                      </p>
                      <ul style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6,
                        margin: 0,
                        paddingLeft: '18px',
                      }}>
                        {order.order_options.interior?.lines?.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {order.order_options.logistics?.lines?.length ? (
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(168,149,120,0.6)',
                        marginBottom: '6px',
                      }}>
                        {order.order_options.logistics?.title ?? 'Logistics'}
                      </p>
                      <ul style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.8)',
                        lineHeight: 1.6,
                        margin: 0,
                        paddingLeft: '18px',
                      }}>
                        {order.order_options.logistics?.lines?.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {order.order_options.selectedAccessories?.length ? (
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(168,149,120,0.6)',
                        marginBottom: '6px',
                      }}>
                        Selected Accessories
                      </p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.8)',
                        margin: 0,
                      }}>
                        {order.order_options.selectedAccessories.join(', ')}
                      </p>
                    </div>
                  ) : null}
                  {order.order_options.freeMessage ? (
                    <div>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(168,149,120,0.6)',
                        marginBottom: '6px',
                      }}>
                        {messageLabel}
                      </p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                        margin: 0,
                      }}>
                        {order.order_options.freeMessage}
                      </p>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(168,149,120,0.5)',
                    marginBottom: '8px',
                  }}>
                    {messageLabel}:
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                  }}>
                    {order.message}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
