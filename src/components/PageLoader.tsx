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
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const FADE_DURATION = 700; // ms - should match CSS transition duration

  // Keep overlay mounted so we can animate its fade-out.
  useEffect(() => {
    const root = typeof document !== "undefined" ? document.getElementById("__next") : null;
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
  }, [isLoading, mounted]);

  useEffect(() => {
    // Hide loader when pathname changes (client navigation finished)
    if (prevPathRef.current === null) {
      prevPathRef.current = pathname;
      // ensure not stuck on initial mount
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

    // Failsafe: hide after 8s to prevent stuck loader
    const failSafe = window.setInterval(() => {
      setIsLoading(false);
    }, 8000);

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
  window.clearInterval(failSafe);
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
      <ul className="loader" aria-hidden="true">
        <li className="center" />
        <li className="item item-1" />
        <li className="item item-2" />
        <li className="item item-3" />
        <li className="item item-4" />
        <li className="item item-5" />
        <li className="item item-6" />
        <li className="item item-7" />
        <li className="item item-8" />
      </ul>
    </div>
  );
}
