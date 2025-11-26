// Adapter to normalize lovable.dev's custom event into a single event
// our loader logic can listen for. This file runs in the browser when
// imported and re-dispatches a normalized `lovable-ready` event.

declare global {
  interface Window {
    __lovableReady?: boolean;
  }
}

const SOURCE_EVENT = "loadingComplete"; // from the provided LoadingScreen.tsx
const TARGET_EVENT = "lovable-ready";

function onSourceEvent() {
  try {
    window.__lovableReady = true;
    // Dispatch a normalized event consumable by our loaders
    window.dispatchEvent(new Event(TARGET_EVENT));
    // also dispatch a camelCase variant for extra compatibility
    window.dispatchEvent(new Event("lovableReady"));
  } catch {
    // ignore
  }
}

if (typeof window !== "undefined") {
  // If the source event already fired before this module loaded,
  // consumers may set a global flag; check and re-dispatch if set.
  const winAny = window as unknown as { LOADING_COMPLETE_EVENT?: unknown; lovableLoaded?: unknown };
  if (winAny.LOADING_COMPLETE_EVENT || winAny.lovableLoaded) {
    onSourceEvent();
  }

  window.addEventListener(SOURCE_EVENT, onSourceEvent, { once: true });
}

export {};
