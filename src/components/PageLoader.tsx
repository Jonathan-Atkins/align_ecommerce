"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function findAnchor(el: Element | null): HTMLAnchorElement | null {
  while (el) {
    if (el instanceof HTMLAnchorElement) return el;
    el = el.parentElement;
  }
  return null;
}

const LANDING_PATH = "/";
const INITIAL_POST_LOAD_MS = 10_000; // 10s wait after landing page load + video readiness
const FADE_DURATION = 700;
const FAILSAFE_BUFFER_MS = 7_000; // keep failsafe comfortably beyond the post-load wait

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const loadTimerRef = useRef<number | null>(null);
  const failSafeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const prevPathRef = useRef<string | null>(null);
  const pathname = usePathname();

  const MIN_ACTIVE_MS = 6_500; // ensure loader stays visible at least 5 seconds

  const queueHide = () => {
    // Clear any existing hide timer
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

  // Track when the loader becomes active so we can measure how long it stays
  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = performance.now();
    }
  }, [isLoading]);

  useEffect(() => {
    if (
      pathname !== LANDING_PATH ||
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      document.readyState === "complete"
    ) {
      return;
    }

    setMounted(true);
    setIsLoading(true);

    let windowLoaded = false;
    let videoReady = false;

    const tryFinish = () => {
      if (!(windowLoaded && videoReady)) return;
      if (loadTimerRef.current) {
        window.clearTimeout(loadTimerRef.current);
      }
      loadTimerRef.current = window.setTimeout(() => {
        queueHide();
      }, INITIAL_POST_LOAD_MS);
    };

    const onWindowLoad = () => {
      windowLoaded = true;
      tryFinish();
    };

    window.addEventListener("load", onWindowLoad, { once: true });

    const videoEl = document.getElementById("promo-video") || document.querySelector("video");
    if (videoEl) {
      const onVideoReady = () => {
        videoReady = true;
        tryFinish();
      };
      videoEl.addEventListener("canplaythrough", onVideoReady, { once: true });
      videoEl.addEventListener("loadeddata", onVideoReady, { once: true });
    } else {
      videoReady = true;
      tryFinish();
    }

    if (failSafeTimerRef.current) {
      window.clearTimeout(failSafeTimerRef.current);
    }
    failSafeTimerRef.current = window.setTimeout(
      () => queueHide(),
      INITIAL_POST_LOAD_MS + FAILSAFE_BUFFER_MS,
    );

    return () => {
      window.removeEventListener("load", onWindowLoad);
      if (loadTimerRef.current) {
        window.clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
      if (failSafeTimerRef.current) {
        window.clearTimeout(failSafeTimerRef.current);
        failSafeTimerRef.current = null;
      }
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.getElementById("page-cloak");

    if (isLoading) {
      setFadingOut(false);
      setMounted(true);
      if (root) root.classList.add("page-loader-hidden");
      return;
    }

    if (mounted) {
      if (root) root.classList.remove("page-loader-hidden");
      setFadingOut(true);
      // Log how long the loader was active up until the fade starts
      try {
        if (startTimeRef.current !== null) {
          const durationMs = Math.round(performance.now() - startTimeRef.current);
          console.log(`[PageLoader] active duration before fade: ${durationMs}ms`);
        }
      } catch {
        /* noop */
      }
      const fadeTimer = window.setTimeout(() => {
        setMounted(false);
        setFadingOut(false);
      }, FADE_DURATION);
      return () => window.clearTimeout(fadeTimer);
    }

    return;
  }, [isLoading, mounted]);

  useEffect(() => {
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      if (
        pathname === LANDING_PATH &&
        typeof document !== "undefined" &&
        document.readyState !== "complete"
      ) {
        return;
      }
      queueHide();
      return;
    }

    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      window.setTimeout(() => queueHide(), 80);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const anchor = findAnchor(target);
      if (!anchor) return;

      try {
        const href = anchor.getAttribute("href");
        if (!href) return;
        const isExternal = href.startsWith("http") && !href.startsWith(window.location.origin);
        if (isExternal) return;
        if (anchor.target === "_blank") return;
        if (anchor.hasAttribute("download")) return;
        if (href.startsWith("#")) return;
      } catch {
        return;
      }

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsLoading(true), 80);
    };

    const hide = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      window.setTimeout(() => queueHide(), 120);
    };

    const origPush = history.pushState;
    const origReplace = history.replaceState;

    const dispatchHistoryEvent = (name: string) => {
      try {
        window.dispatchEvent(new Event(name));
      } catch {
        /* noop */
      }
    };

    const historyWrapper = history as unknown as {
      pushState: (...args: Parameters<typeof history.pushState>) => unknown;
      replaceState: (...args: Parameters<typeof history.replaceState>) => unknown;
    };

    historyWrapper.pushState = function (...args: Parameters<typeof history.pushState>) {
      const result = (origPush as unknown as (...inner: unknown[]) => unknown).apply(
        this,
        args as unknown as unknown[],
      );
      dispatchHistoryEvent("next-route-start");
      return result;
    };

    historyWrapper.replaceState = function (...args: Parameters<typeof history.replaceState>) {
      const result = (origReplace as unknown as (...inner: unknown[]) => unknown).apply(
        this,
        args as unknown as unknown[],
      );
      dispatchHistoryEvent("next-route-start");
      return result;
    };

    const onHistoryStart = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsLoading(true), 40);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") hide();
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("popstate", hide);
    window.addEventListener("pageshow", hide);
    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("next-route-start", onHistoryStart);

    if (failSafeTimerRef.current === null) {
      failSafeTimerRef.current = window.setTimeout(
        () => queueHide(),
        INITIAL_POST_LOAD_MS + FAILSAFE_BUFFER_MS,
      );
    }

    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", hide);
      window.removeEventListener("pageshow", hide);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("next-route-start", onHistoryStart);

      const historyRestore = history as unknown as {
        pushState: typeof history.pushState;
        replaceState: typeof history.replaceState;
      };
      historyRestore.pushState = origPush;
      historyRestore.replaceState = origReplace;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (failSafeTimerRef.current) {
        window.clearTimeout(failSafeTimerRef.current);
        failSafeTimerRef.current = null;
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={`page-loader-overlay ${fadingOut ? "fade-out" : ""}`} role="status" aria-live="polite">
      {/* Phrase container: 'We' and 'Are' centered above the triangle */}
      <div className="loader-phrase" aria-hidden="true">
        <span className="phrase-word">We</span>
        <span className="phrase-word">Are</span>
      </div>

      <div className="loader-triangle-7" aria-hidden="true">
        <svg
          width="260px"
          height="260px"
          viewBox="0 0 226 200"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ overflow: "visible" }}
        >
          <g id="Page-1" fill="none" fillRule="evenodd">
            <g id="Artboard" fillRule="nonzero">
              <g id="white-bg-logo">
                <path
                  d="M113,5.08219117 L4.28393801,197.5 L221.716062,197.5 L113,5.08219117 Z"
                  id="Triangle-3-Copy"
                  className="triangle-path"
                  fill="none"
                  stroke="#39FF14"
                  strokeWidth="14"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* Center label: 'Align' visible; the trailing 'ed' appears after 'Are' */}
      <div className="loader-centered-label" aria-hidden="true">
        <span className="loader-align">Align</span><span className="loader-ed">ed</span>
      </div>
    </div>
  );
}
