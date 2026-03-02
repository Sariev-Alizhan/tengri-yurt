'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export function revealStyle(visible: boolean, delay = 0): React.CSSProperties {
  /* Контент всегда виден (opacity: 1); при появлении в зоне видимости — лёгкая анимация */
  return {
    opacity: 1,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  };
}
