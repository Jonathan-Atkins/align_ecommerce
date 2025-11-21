"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function VideoBackground() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const initialSrc = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_PROMO_URL || '/promo2.mp4') : '/promo2.mp4';
  const [srcUrlState, setSrcUrlState] = useState(initialSrc);

  // Do not render the promo video on the josh-success page so it appears black.
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    setOverlayActive(mq.matches);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      setOverlayActive(e.matches);
    };
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
      return () => { try { mq.removeEventListener('change', onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void); } catch {} };
    }
    type LegacyMQL = { addListener: (l: (e: MediaQueryListEvent) => void) => void; removeListener: (l: (e: MediaQueryListEvent) => void) => void };
    const legacy = mq as unknown as LegacyMQL;
    if (typeof legacy.addListener === 'function') {
      legacy.addListener(onChange);
      return () => { try { if (legacy.removeListener) legacy.removeListener(onChange); } catch {} };
    }
    const videoEl = document.getElementById('promo-video') as HTMLVideoElement | null;
    if (!videoEl) return;

    // Try to prefer a silent promo video if present in `public/` to improve autoplay success on mobile.
    (async () => {
      try {
        const silentPath = '/promo2-silent.mp4';
        // Only attempt once on client; HEAD request to check existence
        const res = await fetch(silentPath, { method: 'HEAD', cache: 'no-store' });
        if (res.ok) {
          setSrcUrlState(silentPath);
          // update element src if already present
          try {
            const el = document.getElementById('promo-video') as HTMLVideoElement | null;
            if (el) {
              el.src = silentPath;
              try { el.load(); } catch {}
            }
          } catch {}
        }
      } catch {
        // ignore network errors
      }
    })();

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
    try { videoEl.load(); } catch {
      // ignore
    }

    let mounted = true;
    let touchHandler: (() => void) | null = null;

    const resumeAudioContext = async () => {
      try {
        type WinWithAudio = Window & { webkitAudioContext?: typeof AudioContext };
        const win = window as WinWithAudio;
        const globalWithAudio = globalThis as unknown as { AudioContext?: typeof AudioContext };
        const Ctx = globalWithAudio.AudioContext || win.webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
            // Try a silent oscillator to unlock audio/video autoplay on some mobile browsers.
            try {
              const gain = ctx.createGain();
              gain.gain.value = 0;
              const osc = ctx.createOscillator();
              osc.connect(gain);
              gain.connect(ctx.destination);
              // start and stop quickly
              osc.start();
              osc.stop(ctx.currentTime + 0.05);
            } catch {
              // if oscillator isn't allowed, ignore
            }
            await ctx.resume();
          }
        }
      } catch {
        // ignore
      }
    };

    const attemptPlay = async (): Promise<boolean> => {
      try {
        await resumeAudioContext();
        await videoEl.play();
        return true;
      } catch {
        return false;
      }
    };

    // Try a few times with short delays (helps if network/load timing is the issue)
    (async () => {
      const maxAttempts = 10;
      for (let i = 0; i < maxAttempts && mounted; i++) {
        // reset to start in case buffering left it paused
        try { videoEl.currentTime = 0; } catch {
          /* ignore */
        }
        const ok = await attemptPlay();
        if (ok) return;
        // wait a bit before retrying
        await new Promise((res) => setTimeout(res, 200 + i * 100));
      }
    })();

    // Also try when video is ready to play
    const onCanPlay = () => {
      attemptPlay().catch(() => {
        // ignore
      });
      videoEl.removeEventListener('canplay', onCanPlay);
    };
    videoEl.addEventListener('canplay', onCanPlay);

    // If still blocked, fallback to first touch
    touchHandler = () => {
      attemptPlay().catch(() => {
        // ignore
      });
      if (touchHandler) {
        window.removeEventListener('touchstart', touchHandler);
        touchHandler = null;
      }
    };
    window.addEventListener('touchstart', touchHandler, { passive: true, once: true });

    // If autoplay succeeded remove mobile overlay
    (async () => {
      const ok = await attemptPlay();
      if (ok) setOverlayActive(false);
    })();

    return () => {
      mounted = false;
      try { videoEl.removeEventListener('canplay', onCanPlay); } catch {
        // ignore
      }
      if (touchHandler) {
        window.removeEventListener('touchstart', touchHandler);
        touchHandler = null;
      }
    };
  }, [pathname]);

  // Do not render the promo video on the josh-success page so it appears black.
  if (pathname && pathname.startsWith("/auth/josh-success")) return null;
  const srcUrl = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_PROMO_URL || '/promo2.mp4') : '/promo2.mp4';


  const handleOverlayStart = async () => {
    try {
      const videoEl = document.getElementById('promo-video') as HTMLVideoElement | null;
      if (!videoEl) return;
      // try to resume audio context as a best-effort unlock
      try {
        type WinWithAudio = Window & { webkitAudioContext?: typeof AudioContext };
        const win = window as WinWithAudio;
        const globalWithAudio = globalThis as unknown as { AudioContext?: typeof AudioContext };
        const Ctx = globalWithAudio.AudioContext || win.webkitAudioContext;
        if (Ctx) {
          const ctx = new Ctx();
          try {
            const gain = ctx.createGain();
            gain.gain.value = 0;
            const osc = ctx.createOscillator();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          } catch {
            // ignore
          }
          try { await ctx.resume(); } catch {}
        }
      } catch {
        // ignore
      }
      await videoEl.play().catch(() => {});
    } catch {
      // ignore
    }
    setOverlayActive(false);
  };

  return (
    <div className={`fixed inset-0 w-full h-full -z-10 ${isMobile ? '' : 'pointer-events-none'}`}>
      <video
        id="promo-video"
        src={srcUrlState}
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{ position: 'absolute', inset: 0 }}
      />
      {isMobile && overlayActive ? (
        <button
          aria-label="Start background video"
          onTouchStart={handleOverlayStart}
          onClick={handleOverlayStart}
          className="absolute inset-0"
          style={{ background: 'transparent', border: 0, padding: 0, margin: 0, cursor: 'pointer' }}
        />
      ) : null}
    </div>
  );
}
