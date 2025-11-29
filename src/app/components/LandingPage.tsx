'use client';

import { useCallback, useEffect, useState } from 'react';
import LoadingOverlay from '@/components/LoadingOverlay';
import HeroSection from '../HeroSection';
import Timeline from '../Timeline';

export default function LandingPage() {
  const [heroReady, setHeroReady] = useState(false);

  const handleHeroReady = useCallback(() => setHeroReady(true), []);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => {
      setHeroReady(true);
    }, 8000);

    return () => window.clearTimeout(fallbackTimer);
  }, []);

  return (
    <>
      <LoadingOverlay ready={heroReady} />
      <HeroSection onReady={handleHeroReady} />
      <Timeline />
    </>
  );
}
