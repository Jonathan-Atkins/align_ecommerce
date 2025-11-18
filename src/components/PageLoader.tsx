"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

function findAnchor(el: Element | null): HTMLAnchorElement | null {
  while (el) {
    if (el instanceof HTMLAnchorElement) return el;
    // traverse up to find anchor
    el = el.parentElement;
  }
  return null;
}

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  // Mounted state controls whether the overlay remains in the DOM so we can animate
  const [mounted, setMounted] = useState(false);
  // fadingOut indicates the overlay is currently fading out
  const [fadingOut, setFadingOut] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const loadTimerRef = useRef<number | null>(null);
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  // Configurable timing constants (easy to tune)
  const POST_LOAD_MS = 3000; // wait 3s after page+video ready before hiding overlay
  const FADE_DURATION = 700; // ms - fade duration (matches CSS)
  const FAILSAFE_BUFFER_MS = 7000; // additional buffer added to POST_LOAD_MS for a safety timeout

  // Keep overlay mounted so we can animate its fade-out.
  useEffect(() => {
    // Initial-page load behavior for root path: keep the overlay until
    // both the window 'load' event and the background video are ready.
    if (pathname === '/' && typeof window !== 'undefined' && document.readyState !== 'complete') {
      setMounted(true);
      setIsLoading(true);

      let windowLoaded = false;
      let videoReady = false;

      const tryFinish = () => {
        if (windowLoaded && videoReady) {
          // After both signals, wait the configured post-load delay, then hide overlay
          if (loadTimerRef.current) window.clearTimeout(loadTimerRef.current);
          loadTimerRef.current = window.setTimeout(() => setIsLoading(false), POST_LOAD_MS);
        }
      };

      const onWindowLoad = () => {
        windowLoaded = true;
        tryFinish();
      };

      window.addEventListener('load', onWindowLoad, { once: true });

      // Listen for the page background video readiness. Query the page video element.
      // Prefer an explicitly identified promo video element to avoid ambiguity
      const videoEl = document.getElementById('promo-video') || document.querySelector('video');
      if (videoEl) {
        const onVideoReady = () => {
          videoReady = true;
          tryFinish();
        };
        // canplaythrough is a good indicator the video can play without buffering
        videoEl.addEventListener('canplaythrough', onVideoReady, { once: true });
        // fallback: loadeddata
        videoEl.addEventListener('loadeddata', onVideoReady, { once: true });
      } else {
        // If no video element found, treat video as ready so loader relies solely on window load
        videoReady = true;
      }

      return () => {
        window.removeEventListener('load', onWindowLoad);
        if (loadTimerRef.current) {
          window.clearTimeout(loadTimerRef.current);
          loadTimerRef.current = null;
        }
      };
    }
    const root = typeof document !== "undefined" ? document.getElementById("page-cloak") : null;
    if (isLoading) {
      // show overlay and hide content immediately
      setFadingOut(false);
      setMounted(true);
      if (root) root.classList.add("page-loader-hidden");
      return;
    }

    // when not loading, if overlay was mounted - start fade-out and reveal content
    if (mounted) {
      if (root) root.classList.remove("page-loader-hidden");
      setFadingOut(true);
      const t = window.setTimeout(() => {
        setMounted(false);
        setFadingOut(false);
      }, FADE_DURATION);
      return () => window.clearTimeout(t);
    }
  }, [isLoading, mounted, pathname]);

  useEffect(() => {
    // Hide loader when pathname changes (client navigation finished)
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      // On initial mount we normally ensure the loader is not stuck. However,
      // if this is the home page and the document hasn't finished loading yet,
      // we want the loader to remain visible until the window 'load' event.
      if (pathname === '/' && typeof document !== 'undefined' && document.readyState !== 'complete') {
        // keep loader visible until load event (handled below)
        return;
      }
      // otherwise ensure not stuck on initial mount
      setIsLoading(false);
      return;
    }
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // small fade-out delay
      setTimeout(() => setIsLoading(false), 80);
    }
  }, [pathname]);

  useEffect(() => {
    // When links are clicked, set loading. This catches <a> clicks and next/link clicks.
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const anchor = findAnchor(target);
      if (!anchor) return;
      // Ignore external links, hashes, downloads, or new-tab links
      try {
        const href = anchor.getAttribute("href");
        if (!href || (href.startsWith("http") && !href.startsWith(window.location.origin))) return;
        if (anchor.target === "_blank") return;
        if (anchor.hasAttribute("download")) return;
        if (href.startsWith("#")) return;
      } catch {
        return;
      }

      // Show loader after a tiny debounce to avoid flicker on very fast navigations
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsLoading(true), 80);
    };

    // When navigation completes, hide loader. 'popstate' fires for back/forward; 'pageshow' for visits.
    const hide = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // small fade-out delay
      setTimeout(() => setIsLoading(false), 120);
    };

    // Patch history methods to detect programmatic navigations (router.push)
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    const dispatchHistoryEvent = (name: string) => {
      try {
        window.dispatchEvent(new Event(name));
      } catch {
        // ignore
      }
    };
    // Create a typed wrapper to avoid using `any` and satisfy linters
    const h = history as unknown as {
      pushState: (...args: Parameters<typeof history.pushState>) => unknown;
      replaceState: (...args: Parameters<typeof history.replaceState>) => unknown;
    };
    h.pushState = function (...args: Parameters<typeof history.pushState>) {
      const res = (origPush as unknown as (...u: unknown[]) => unknown).apply(this, args as unknown as unknown[]);
      dispatchHistoryEvent("next-route-start");
      return res;
    };
    h.replaceState = function (...args: Parameters<typeof history.replaceState>) {
      const res = (origReplace as unknown as (...u: unknown[]) => unknown).apply(this, args as unknown as unknown[]);
      dispatchHistoryEvent("next-route-start");
      return res;
    };

    const onHistoryStart = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsLoading(true), 40);
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("popstate", hide);
    window.addEventListener("pageshow", hide);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") hide();
    });
    window.addEventListener("next-route-start", onHistoryStart);

    // Failsafe: ensure loader doesn't stay forever. Use a single timeout at
    // POST_LOAD_MS + FAILSAFE_BUFFER_MS so it won't prematurely hide the initial overlay.
    const FAILSAFE_MS = POST_LOAD_MS + FAILSAFE_BUFFER_MS;
    let failTimeout: number | null = null;
    failTimeout = window.setTimeout(() => setIsLoading(false), FAILSAFE_MS);

    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", hide);
      window.removeEventListener("pageshow", hide);
    window.removeEventListener("visibilitychange", hide as EventListener);
      window.removeEventListener("next-route-start", onHistoryStart);
      // restore history methods
      const hRestore = history as unknown as {
        pushState: (...args: Parameters<typeof history.pushState>) => unknown;
        replaceState: (...args: Parameters<typeof history.replaceState>) => unknown;
      };
      hRestore.pushState = origPush;
      hRestore.replaceState = origReplace;
  if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  if (failTimeout) window.clearTimeout(failTimeout);
    };
    
  }, []);

  // Keep overlay mounted while we animate fade-out. When not mounted, render nothing.
  if (!mounted) return null;

  return (
    <div
      className={`page-loader-overlay ${fadingOut ? "fade-out" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="loader-triangle-7" aria-hidden="true">
        <svg width="56px" height="50px" viewBox="0 0 226 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <g id="Page-1" stroke="none" strokeWidth="2" fill="none" fillRule="evenodd">
            <g id="Artboard" fillRule="nonzero" stroke="#39FF14" strokeWidth="10">
              <g id="white-bg-logo">
                <path d="M113,5.08219117 L4.28393801,197.5 L221.716062,197.5 L113,5.08219117 Z" id="Triangle-3-Copy" />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
