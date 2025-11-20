"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VideoBackground() {
  const pathname = usePathname();

  // Do not render the promo video on the josh-success page so it appears black.
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const videoEl = document.getElementById('promo-video') as HTMLVideoElement | null;
    if (!videoEl) return;

    // Ensure loop is set (defensive) and attempt to play on mobile devices.
    videoEl.loop = true;

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    if (!isMobile) return;

    // Try to programmatically play. If autoplay is blocked, wait for the first touch to play.
    const tryPlay = async () => {
      try {
        await videoEl.play();
      } catch (err) {
        const onFirstTouch = () => {
          videoEl.play().catch(() => {});
          window.removeEventListener('touchstart', onFirstTouch);
        };
        window.addEventListener('touchstart', onFirstTouch, { passive: true, once: true });
      }
    };

    tryPlay();
  }, [pathname]);

  // Do not render the promo video on the josh-success page so it appears black.
  if (pathname && pathname.startsWith("/auth/josh-success")) return null;
  const srcUrl = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_PROMO_URL || '/promo2.mp4') : '/promo2.mp4';


  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
      <video
        id="promo-video"
        src={srcUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  );
}
