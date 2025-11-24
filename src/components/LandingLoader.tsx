"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    __alignPageLoaderShown?: boolean;
  }
}

// This component mirrors the show/hide/timing behavior of PageLoader but
// is intended to be mounted directly on the landing page (`/`). It keeps the
// same session flag and timing behavior (window load + promo video readiness)
// and renders the same triangle + words inside an overlay that uses the
// `.loading-screen` background you provided.

const INITIAL_POST_LOAD_MS = 10_000;
const FADE_DURATION = 700;
const FAILSAFE_BUFFER_MS = 7_000;

export default function LandingLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const loadTimerRef = useRef<number | null>(null);
  const failSafeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const MIN_ACTIVE_MS = 6_500;

  const queueHide = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    try {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (startTimeRef.current === null) {
        setIsLoading(false);
        return;
      }
      const elapsed = now - startTimeRef.current;
      if (elapsed >= MIN_ACTIVE_MS) {
        setIsLoading(false);
      } else {
        const remaining = Math.max(0, Math.ceil(MIN_ACTIVE_MS - elapsed));
        hideTimerRef.current = window.setTimeout(() => {
          hideTimerRef.current = null;
          setIsLoading(false);
        }, remaining);
      }
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) startTimeRef.current = performance.now();
  }, [isLoading]);

  useEffect(() => {
    // Only run on initial mount for the landing page. Respect the in-memory
    // session flag so we don't show repeatedly in the same tab.
    if (typeof window === 'undefined') return;
    if (window.__alignPageLoaderShown) return;

    window.__alignPageLoaderShown = true;
    setMounted(true);
    setIsLoading(true);

    let windowLoaded = false;
    let videoReady = false;

    const tryFinish = () => {
      if (!(windowLoaded && videoReady)) return;
      if (loadTimerRef.current) window.clearTimeout(loadTimerRef.current);
      loadTimerRef.current = window.setTimeout(() => queueHide(), INITIAL_POST_LOAD_MS);
    };

    const onWindowLoad = () => {
      windowLoaded = true;
      tryFinish();
    };
    window.addEventListener('load', onWindowLoad, { once: true });

    const videoEl = document.getElementById('promo-video') || document.querySelector('video');
    if (videoEl) {
      const onVideoReady = () => {
        videoReady = true;
        tryFinish();
      };
      videoEl.addEventListener('canplaythrough', onVideoReady, { once: true });
      videoEl.addEventListener('loadeddata', onVideoReady, { once: true });
    } else {
      videoReady = true;
      tryFinish();
    }

    if (failSafeTimerRef.current) window.clearTimeout(failSafeTimerRef.current);
    failSafeTimerRef.current = window.setTimeout(() => queueHide(), INITIAL_POST_LOAD_MS + FAILSAFE_BUFFER_MS);

    return () => {
      window.removeEventListener('load', onWindowLoad);
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
      const fadeTimer = window.setTimeout(() => {
        setMounted(false);
        setFadingOut(false);
      }, FADE_DURATION);
      return () => window.clearTimeout(fadeTimer);
    }
  }, [isLoading, mounted]);

  if (!mounted) return null;

  return (
    <div className={`loading-screen page-loader-overlay ${fadingOut ? 'fade-out' : ''}`} role="status" aria-live="polite">
      <div className="loader-phrase" aria-hidden="true">
        <span className="phrase-word">We</span>
        <span className="phrase-word">Are</span>
      </div>

      <div className="loader-triangle-7" aria-hidden="true">
        <svg width="260px" height="260px" viewBox="0 0 226 200" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <g id="Page-1" fill="none" fillRule="evenodd">
            <g id="Artboard" fillRule="nonzero">
              <g id="white-bg-logo">
                <path d="M113,5.08219117 L4.28393801,197.5 L221.716062,197.5 L113,5.08219117 Z" id="Triangle-3-Copy" className="triangle-path" fill="none" stroke="#39FF14" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div className="loader-centered-label" aria-hidden="true">
        <span className="loader-align">Align</span><span className="loader-ed">ed</span>
      </div>
    </div>
  );
}
