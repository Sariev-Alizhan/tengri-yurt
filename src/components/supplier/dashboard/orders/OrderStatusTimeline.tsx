'use client';

const ORDER_STEPS = [
  { key: 'pending',       label: 'Pending',       icon: '◌' },
  { key: 'confirmed',     label: 'Confirmed',     icon: '◉' },
  { key: 'in_production', label: 'Production',    icon: '⬡' },
  { key: 'ready',         label: 'Ready',         icon: '◈' },
  { key: 'shipped',       label: 'Shipped',       icon: '▷' },
  { key: 'delivered',     label: 'Delivered',     icon: '✓' },
];

export function OrderStatusTimeline({
  status,
  statusLabels,
}: {
  status: string;
  statusLabels?: Record<string, string>;
}) {
  const isCancelled = status === 'cancelled';
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === status);

  if (isCancelled) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: 'rgba(248,113,113,0.06)',
        border: '1px solid rgba(248,113,113,0.2)',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <span style={{ fontSize: '16px', color: '#f87171' }}>✕</span>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#f87171',
        }}>
          {statusLabels?.cancelled ?? 'Cancelled'}
        </span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        minWidth: '480px',
        padding: '16px 4px 4px',
      }}>
        {ORDER_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          const dotColor = isDone
            ? '#a89578'
            : isCurrent
            ? '#ffffff'
            : 'rgba(168,149,120,0.2)';

          const dotBorder = isDone
            ? '2px solid #a89578'
            : isCurrent
            ? '2px solid rgba(255,255,255,0.9)'
            : '2px solid rgba(168,149,120,0.2)';

          const dotBg = isDone
            ? 'rgba(168,149,120,0.2)'
            : isCurrent
            ? 'rgba(255,255,255,0.12)'
            : 'transparent';

          const labelColor = isDone
            ? 'rgba(168,149,120,0.85)'
            : isCurrent
            ? 'rgba(255,255,255,0.95)'
            : 'rgba(255,255,255,0.2)';

          const lineColor = isDone
            ? 'rgba(168,149,120,0.6)'
            : 'rgba(168,149,120,0.1)';

          const label = statusLabels?.[step.key] ?? step.label;

          return (
            <div
              key={step.key}
              style={{ display: 'flex', alignItems: 'center', flex: index < ORDER_STEPS.length - 1 ? 1 : 0 }}
            >
              {/* Step node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: isCurrent ? '32px' : '26px',
                  height: isCurrent ? '32px' : '26px',
                  borderRadius: '50%',
                  border: dotBorder,
                  background: dotBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(255,255,255,0.06)' : 'none',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: isCurrent ? '13px' : '11px',
                    color: dotColor,
                    lineHeight: 1,
                  }}>
                    {isDone ? '✓' : step.icon}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  fontWeight: isCurrent ? 600 : 400,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: labelColor,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                }}>
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {index < ORDER_STEPS.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: lineColor,
                  margin: '0 4px',
                  marginBottom: '18px',
                  transition: 'background 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {isDone && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, rgba(168,149,120,0.8), rgba(168,149,120,0.4))',
                    }} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
