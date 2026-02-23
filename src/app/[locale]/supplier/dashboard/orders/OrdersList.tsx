'use client';

import { useState } from 'react';

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
  total_price_usd: number;
  payment_status: string;
  status: string;
  created_at: string;
  yurts: { name: string } | null;
};

const STATUSES = ['pending', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled'];

export function OrdersList({
  orders,
  statusLabels,
  updateStatusLabel,
  noOrdersLabel,
  messageLabel = 'Message',
}: {
  orders: Order[];
  statusLabels: Record<string, string>;
  updateStatusLabel: string;
  noOrdersLabel: string;
  messageLabel?: string;
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
    return <p className="font-inter text-white/70">{noOrdersLabel}</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-white/15 p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-garamond text-xl text-white">#{order.order_number}</h2>
              <p className="font-inter text-white/80 mt-1">
                {(order.yurts as { name: string } | null)?.name ?? 'Yurt'} × {order.quantity}
              </p>
              <p className="font-inter text-sm text-white/70 mt-1">{order.buyer_name} — {order.buyer_email}</p>
              <p className="font-inter text-sm text-white/60">
                {order.delivery_city && `${order.delivery_city}, `}{order.delivery_country}
              </p>
              <p className="font-inter text-sm text-white/60 mt-1">${order.total_price_usd} · {order.payment_status}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-inter text-sm text-white/70">{statusLabels[order.status] ?? order.status}</span>
              <select
                value={order.status}
                disabled={!!updatingId}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border border-white/30 bg-beige text-white px-2 py-1 text-sm font-inter"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s] ?? s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {order.message && (
            <p className="mt-3 font-inter text-sm text-white/70 border-t border-white/10 pt-3">{messageLabel}: {order.message}</p>
          )}
        </div>
      ))}
    </div>
  );
}
