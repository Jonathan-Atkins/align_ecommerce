"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from 'next/navigation';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only enable on the landing page (root path)
    if (pathname !== '/') {
      el.style.display = 'none';
      return;
    }

    // Disable on touch/coarse pointer devices (mobile/tablet)
    const isCoarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse || 'ontouchstart' in window) {
      el.style.display = 'none';
      return;
    }

    // Respect prefers-reduced-motion (no motion changes if user prefers reduced motion)
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function onPointerMove(e: PointerEvent) {
      if (!el) return;
      // exact tracking: position the center of the glow at pointer
      const x = e.clientX;
      const y = e.clientY;
      // element uses transform translate to center; update with no smoothing for zero lag
      el.style.transform = `translate(${x - 50}px, ${y - 50}px)`; // -50 depends on half of glow size (see CSS)
      // No requestAnimationFrame smoothing — user requested exact tracking
    }

    // If reduced motion is requested we still track but avoid any CSS transitions (none are set)
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [pathname]);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
