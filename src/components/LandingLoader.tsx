"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

declare global {
  interface Window {
    __alignPageLoaderShown?: boolean;
    __lovableReady?: boolean;
  }
}

// This component mirrors the show/hide/timing behavior of PageLoader but
// is intended to be mounted directly on the landing page (`/`). It keeps the
// same session flag and timing behavior (window load + promo video readiness)
// and renders the same triangle + words inside an overlay that uses the
// `.loading-screen` background you provided.

const INITIAL_POST_LOAD_MS = process.env.NODE_ENV === 'development' ? 1000 : 10_000;
const FADE_DURATION = 100; // reduced fade duration (ms)
const DEFAULT_FAILSAFE_MS = 7_000;
const FAILSAFE_BUFFER_MS = process.env.NODE_ENV === 'development' ? 2500 : DEFAULT_FAILSAFE_MS;

export default function LandingLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const loadTimerRef = useRef<number | null>(null);
  const failSafeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const MIN_ACTIVE_MS = 6_500;

  const hideInitialLoader = () => {
    const initial = typeof document !== 'undefined' ? document.getElementById('initial-loader') : null;
    if (!initial) return;

    initial.classList.add('initial-loader-hidden');
    const overlay = initial.querySelector('.page-loader-overlay');
    if (overlay) overlay.classList.add('fade-out');
  };

  const queueHide = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    try {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (startTimeRef.current === null) {
        setIsLoading(false);
        hideInitialLoader();
        return;
      }
      const elapsed = now - startTimeRef.current;
      if (elapsed >= MIN_ACTIVE_MS) {
        setIsLoading(false);
        hideInitialLoader();
      } else {
        const remaining = Math.max(0, Math.ceil(MIN_ACTIVE_MS - elapsed));
        hideTimerRef.current = window.setTimeout(() => {
          hideTimerRef.current = null;
          setIsLoading(false);
          hideInitialLoader();
        }, remaining);
      }
    } catch {
      setIsLoading(false);
      hideInitialLoader();
    }
  };

  useEffect(() => {
    if (isLoading) startTimeRef.current = performance.now();
  }, [isLoading]);

  useEffect(() => {
    // Only run on initial mount for the landing page. Respect the in-memory
    // session flag so we don't show repeatedly in the same tab.
    if (typeof window === 'undefined') return;
    // If we've already shown the loader in this tab/session, skip.
    try {
      if (sessionStorage.getItem('alignPageLoaderShown')) {
        // If the loader was already shown this session, remove the server-
        // rendered initial loader immediately so the page doesn't stay masked.
        try {
          const initial = document.getElementById('initial-loader');
          if (initial) hideInitialLoader();
        } catch {}
        return;
      }
      sessionStorage.setItem('alignPageLoaderShown', '1');
      // keep a quick in-memory flag too for compatibility
      window.__alignPageLoaderShown = true;
    } catch {
      // fall back to in-memory flag if sessionStorage isn't available
      if ((window as Window).__alignPageLoaderShown) return;
      (window as Window).__alignPageLoaderShown = true;
    }
    console.log('I am LandingLoader');
    setMounted(true);
    setIsLoading(true);

    let windowLoaded = false;
    let videoReady = false;
    let lovableReadyHandler: (() => void) | null = null;

    const tryFinish = () => {
      console.debug('[LandingLoader] tryFinish? windowLoaded=', windowLoaded, 'videoReady=', videoReady);
      if (!(windowLoaded && videoReady)) return;
      if (loadTimerRef.current) window.clearTimeout(loadTimerRef.current);
      console.debug('[LandingLoader] scheduling post-load hide in', INITIAL_POST_LOAD_MS, 'ms');
      loadTimerRef.current = window.setTimeout(() => queueHide(), INITIAL_POST_LOAD_MS);
    };

    const onWindowLoad = () => {
      console.debug('[LandingLoader] window.load');
      windowLoaded = true;
      tryFinish();
    };
    window.addEventListener('load', onWindowLoad, { once: true });

    const videoEl = document.getElementById('promo-video') || document.querySelector('video');
    if (videoEl) {
      console.debug('[LandingLoader] found promo video element; attaching listeners');
      const onVideoReady = () => {
        console.debug('[LandingLoader] video ready (canplay/loadeddata)');
        videoReady = true;
        tryFinish();
      };
      const onVideoError = (ev?: Event) => {
        console.warn('[LandingLoader] video error', ev);
        // Treat video error as ready so the loader won't hang waiting for media that failed to load
        videoReady = true;
        tryFinish();
      };
      videoEl.addEventListener('canplaythrough', onVideoReady, { once: true });
      videoEl.addEventListener('loadeddata', onVideoReady, { once: true });
      videoEl.addEventListener('error', onVideoError, { once: true });
      // Also listen for a normalized "lovable-ready" signal if an external
      // provider (lovable.dev) dispatches it. Treat it as equivalent to
      // the promo video being ready so the loader can finish.
      lovableReadyHandler = () => {
        console.debug('[LandingLoader] received lovable-ready');
        videoReady = true;
        tryFinish();
      };
      const winFlag = (window as unknown as { __lovableReady?: boolean }).__lovableReady;
      if (winFlag) {
        // If the adapter already marked the global flag, treat as ready
        lovableReadyHandler();
      } else {
        window.addEventListener('lovable-ready', lovableReadyHandler, { once: true });
        window.addEventListener('lovableReady', lovableReadyHandler, { once: true });
      }
    } else {
      console.debug('[LandingLoader] no promo video element found; marking videoReady');
      videoReady = true;
      tryFinish();
    }

    if (failSafeTimerRef.current) window.clearTimeout(failSafeTimerRef.current);
    console.debug('[LandingLoader] setting failsafe for', INITIAL_POST_LOAD_MS + FAILSAFE_BUFFER_MS, 'ms');
    failSafeTimerRef.current = window.setTimeout(() => {
      console.warn('[LandingLoader] failsafe triggered');
      queueHide();
    }, INITIAL_POST_LOAD_MS + FAILSAFE_BUFFER_MS);

    return () => {
      window.removeEventListener('load', onWindowLoad);
      if (lovableReadyHandler) {
        try { window.removeEventListener('lovable-ready', lovableReadyHandler); } catch {}
        try { window.removeEventListener('lovableReady', lovableReadyHandler); } catch {}
        lovableReadyHandler = null;
      }
      if (loadTimerRef.current) {
        window.clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
      if (failSafeTimerRef.current) {
        window.clearTimeout(failSafeTimerRef.current);
        failSafeTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      setFadingOut(false);
      setMounted(true);
      return;
    }

    if (mounted) {
      setFadingOut(true);

      // Fade out any server-rendered initial loader overlay first (if present),
      // then remove it from the DOM after the fade so the client overlay does
      // not duplicate visuals. Both will use the same fade timing so they
      // disappear simultaneously.
      try {
        const initial = typeof document !== 'undefined' ? document.getElementById('initial-loader') : null;
        if (initial) {
          const overlay = initial.querySelector('.page-loader-overlay');
          if (overlay) overlay.classList.add('fade-out');
          const fadeTimer = window.setTimeout(() => {
            hideInitialLoader();
            setMounted(false);
            setFadingOut(false);
          }, FADE_DURATION + 20);
          return () => {
            window.clearTimeout(fadeTimer);
          };
        }
      } catch {}

      const fadeTimer = window.setTimeout(() => {
        setMounted(false);
        setFadingOut(false);
      }, FADE_DURATION);
      return () => window.clearTimeout(fadeTimer);
    }
  }, [isLoading, mounted]);

  if (!mounted) return null;

  const overlay = (
    <div className={`loading-screen page-loader-overlay ${fadingOut ? 'fade-out' : ''}`} role="status" aria-live="polite">
      {/*
      <div className="loader-phrase" aria-hidden="true">
        <span className="phrase-word">We</span>
        <span className="phrase-word">Are</span>
      </div>
      */}

      <div className="loader-logo-wrapper" aria-hidden="true">
          <img
          src="/align_vegas_logo.png"
          alt="Align Vegas logo"
          width={260}
          height={260}
          className="loader-logo"
          style={{ display: 'block' }}
        />
      </div>

      {/*
      <div className="loader-centered-label" aria-hidden="true">
        <span className="loader-align">Align</span><span className="loader-ed">ed</span>
      </div>
      */}
    </div>
  );

  // Render the overlay as a portal into document.body so it is not
  // affected by the `visibility: hidden` applied to `#page-cloak`.
  if (typeof document !== "undefined" && document.body) {
    return createPortal(overlay, document.body);
  }

  return overlay;
}
