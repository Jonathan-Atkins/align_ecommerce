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
    // Strengthen autoplay attempt:
    // - Ensure attributes are set (muted, playsInline, autoplay)
    // - Try to resume an AudioContext (may help unlocking playback on some platforms)
    // - Retry play() a few times and also try on 'canplay' event
    // - Keep a touchstart fallback

    videoEl.muted = true;
    videoEl.setAttribute('muted', '');
    videoEl.playsInline = true;
    videoEl.setAttribute('playsinline', '');
    videoEl.autoplay = true;
    videoEl.setAttribute('autoplay', '');
    videoEl.preload = 'auto';
    // reload so attributes take effect if needed
    try { videoEl.load(); } catch (e) {}

    let mounted = true;
    let touchHandler: (() => void) | null = null;

    const resumeAudioContext = async () => {
      try {
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
            await ctx.resume();
          }
        }
      } catch (e) {}
    };

    const attemptPlay = async (): Promise<boolean> => {
      try {
        await resumeAudioContext();
        await videoEl.play();
        return true;
      } catch (err) {
        return false;
      }
    };

    // Try a few times with short delays (helps if network/load timing is the issue)
    (async () => {
      const maxAttempts = 6;
      for (let i = 0; i < maxAttempts && mounted; i++) {
        const ok = await attemptPlay();
        if (ok) return;
        // wait a bit before retrying
        await new Promise((res) => setTimeout(res, 300 + i * 100));
      }
    })();

    // Also try when video is ready to play
    const onCanPlay = () => {
      attemptPlay().catch(() => {});
      videoEl.removeEventListener('canplay', onCanPlay);
    };
    videoEl.addEventListener('canplay', onCanPlay);

    // If still blocked, fallback to first touch
    touchHandler = () => {
      attemptPlay().catch(() => {});
      if (touchHandler) {
        window.removeEventListener('touchstart', touchHandler);
        touchHandler = null;
      }
    };
    window.addEventListener('touchstart', touchHandler, { passive: true, once: true });

    return () => {
      mounted = false;
      try { videoEl.removeEventListener('canplay', onCanPlay); } catch (e) {}
      if (touchHandler) {
        window.removeEventListener('touchstart', touchHandler);
        touchHandler = null;
      }
    };
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
