'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const SESSION_KEY = 'align-landing-loaded';

interface LoadingOverlayProps {
  /** Whether the landing experience is ready to reveal. */
  ready: boolean;
  /** Length of the fade animation in ms. */
  fadeDuration?: number;
}

export default function LoadingOverlay({ ready, fadeDuration = 650 }: LoadingOverlayProps) {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem(SESSION_KEY);
  });
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (!ready) return;

    let hideTimer: number | undefined;

    const fadeTimer = window.setTimeout(() => {
      setIsFading(true);
      sessionStorage.setItem(SESSION_KEY, '1');
      hideTimer = window.setTimeout(() => setVisible(false), fadeDuration);
    }, 100);

    return () => {
      window.clearTimeout(fadeTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [ready, visible, fadeDuration]);

  const overlayClassName = useMemo(
    () => `loading-overlay ${isFading || !visible ? 'loading-overlay--fade' : ''}`,
    [isFading, visible],
  );

  if (!visible) return null;

  return (
    <div className={overlayClassName} aria-live="polite" aria-busy={!ready}>
      <div className="loading-overlay__backdrop" />
      <div className="loading-overlay__content" role="status">
        <Image
          src="/align_vegas_logo.png"
          alt="Align Vegas logo"
          width={320}
          height={320}
          className="loading-overlay__logo"
          priority
        />
      </div>
    </div>
  );
}
