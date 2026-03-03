'use client';

/**
 * Глобальные фоновые эффекты: мягкое свечение и декоративные линии.
 * Адаптивно на ПК и мобильных, не перекрывают контент (pointer-events: none).
 */
export function BackgroundEffects() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* ——— Световые орбы (мягкое свечение) ——— */}
      <div
        className="bg-glow-orb"
        style={{
          width: 'clamp(200px, 45vw, 480px)',
          height: 'clamp(200px, 45vw, 480px)',
          top: '-10%',
          left: '-5%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)',
          animation: 'glowPulseSoft 8s ease-in-out infinite',
        }}
      />
      <div
        className="bg-glow-orb"
        style={{
          width: 'clamp(180px, 38vw, 420px)',
          height: 'clamp(180px, 38vw, 420px)',
          top: '15%',
          right: '-8%',
          background: 'radial-gradient(circle, rgba(255,230,200,0.1) 0%, rgba(255,255,255,0.03) 50%, transparent 70%)',
          animation: 'glowPulseSoft 10s ease-in-out 1s infinite',
        }}
      />
      <div
        className="bg-glow-orb"
        style={{
          width: 'clamp(220px, 42vw, 460px)',
          height: 'clamp(220px, 42vw, 460px)',
          bottom: '-12%',
          left: '20%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,248,240,0.04) 45%, transparent 75%)',
          animation: 'glowPulseSoft 9s ease-in-out 2s infinite',
        }}
      />
      <div
        className="bg-glow-orb"
        style={{
          width: 'clamp(120px, 25vw, 280px)',
          height: 'clamp(120px, 25vw, 280px)',
          bottom: '25%',
          right: '10%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 65%)',
          animation: 'glowPulseSoft 11s ease-in-out 0.5s infinite',
        }}
      />
      {/* Центральный мягкий ореол — только на десктопе, чтобы не отвлекать на мобилке */}
      <div
        className="bg-glow-orb hidden md:block"
        style={{
          width: 'clamp(300px, 55vw, 600px)',
          height: 'clamp(300px, 55vw, 600px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)',
          animation: 'glowPulseSoft 12s ease-in-out 3s infinite',
        }}
      />

      {/* ——— Декоративные линии ——— */}
      {/* Верхняя горизонтальная линия с лёгким мерцанием */}
      <div
        className="bg-glow-line"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          animation: 'lineShimmerSlow 6s ease-in-out infinite',
        }}
      />
      {/* Нижняя линия */}
      <div
        className="bg-glow-line"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          animation: 'lineShimmerSlow 7s ease-in-out 1s infinite',
        }}
      />
      {/* Вертикальная левая — тонкая полоска свечения */}
      <div
        className="bg-glow-line-vertical"
        style={{
          top: 0,
          bottom: 0,
          left: 0,
          width: '1px',
          maxWidth: '2px',
          animation: 'lineShimmerSlow 8s ease-in-out 2s infinite',
        }}
      />
      <div
        className="bg-glow-line-vertical"
        style={{
          top: 0,
          bottom: 0,
          right: 0,
          width: '1px',
          maxWidth: '2px',
          animation: 'lineShimmerSlow 7.5s ease-in-out 0.5s infinite',
        }}
      />

      {/* Дополнительные тонкие линии по центру экрана (десктоп) — создают глубину */}
      <div
        className="hidden lg:block bg-glow-line"
        style={{
          top: '30%',
          left: '10%',
          width: '30%',
          height: '1px',
          animation: 'lineShimmer 10s ease-in-out 2s infinite',
        }}
      />
      <div
        className="hidden lg:block bg-glow-line"
        style={{
          bottom: '20%',
          right: '15%',
          width: '25%',
          height: '1px',
          animation: 'lineShimmer 9s ease-in-out 4s infinite',
        }}
      />
    </div>
  );
}
