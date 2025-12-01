"use client";
import HeroSection from "./HeroSection";
import Timeline from "./Timeline";
import OverlayLoader from '../components/OverlayLoader';
import { useEffect, useState } from 'react';
export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleLoad() {
      setLoading(false);
    }
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <>
      <OverlayLoader show={loading} />
      <HeroSection />
      <Timeline />
      {/* ...other homepage sections... */}
    </>
  );
}
