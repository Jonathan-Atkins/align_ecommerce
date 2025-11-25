"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from 'next/navigation';

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Disable on touch/coarse pointer devices (mobile/tablet)
    const isCoarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse || 'ontouchstart' in window) {
      el.style.display = 'none';
      return;
    }
    // Respect prefers-reduced-motion: hide glow for users who prefer reduced motion
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.display = 'none';
      return;
    }

    // Ensure element is visible (CSS keeps it off-screen until pointer moves)
    el.style.display = '';

    function onPointerMove(e: PointerEvent) {
      if (!el) return;
      // exact tracking: position the center of the glow at pointer
      const x = e.clientX;
      const y = e.clientY;
      // element uses transform translate to center; update with no smoothing for zero lag
      el.style.transform = `translate(${x - 50}px, ${y - 50}px)`; // -50 depends on half of glow size (see CSS)
      // No requestAnimationFrame smoothing — user requested exact tracking
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [pathname]);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
