'use client';

import React, { useRef, useEffect } from "react";
import Image from 'next/image';
import './globals.css';

export default function HeroSection() {
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cursorGlow = cursorGlowRef.current;
    if (!section || !cursorGlow) return;

    function handleMouseMove(e: MouseEvent) {
      if (!section || !cursorGlow) return;
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursorGlow.style.left = `${x}px`;
      cursorGlow.style.top = `${y}px`;
      cursorGlow.style.opacity = '1';
    }
    function handleMouseLeave() {
      if (!cursorGlow) return;
      cursorGlow.style.opacity = '0';
    }

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Use a single promo video from public/ (no rotation)
  const videoRef = useRef<HTMLVideoElement | null>(null);


  // Remove overlap logic: hero section should not overlap navbar

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
  v.src = '/promo2.mp4';
    v.muted = true;
    v.preload = 'auto';
    v.loop = true;
    try {
      v.currentTime = 0;
    } catch {
      // ignore seek errors (video may not be ready)
    }
    const p = v.play();
    if (p && typeof p.then === 'function') p.catch(() => {});

    // Ensure the video never stops: handle ended, paused, and tab visibility
    const ensurePlay = () => {
      if (!v) return;
      if (v.paused || v.ended) {
        const pp = v.play();
        if (pp && typeof pp.then === 'function') pp.catch(() => {});
      }
    };
    const onEnded = () => {
      if (!v) return;
      v.currentTime = 0;
      ensurePlay();
    };
    const onPause = () => ensurePlay();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') ensurePlay();
    };

    v.addEventListener('ended', onEnded);
    v.addEventListener('pause', onPause);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('pause', onPause);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pb-8 md:pb-16 relative overflow-hidden min-h-[78vh] md:min-h-[85vh] lg:min-h-[90vh] pt-20"
    >

      {/* Cursor Glow Effect */}
      <div
        ref={cursorGlowRef}
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(163,198,74,0.18) 0%, rgba(163,198,74,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          left: 0,
          top: 0,
        }}
      />
      <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-12 px-2 sm:px-4 md:px-8 lg:px-16 relative z-10">
        {/* Hero Content */}
  <div className="flex-1 min-w-0 text-center md:text-left" style={{ marginTop: 10 }}>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Align{' '}
            <span className="glow-text green-pulse">Scales</span>
            {' '}<span style={{ color: '#fff' }}>and Processes High Risk Clients</span>{' '}
            <span className="glow-text green-pulse">Securely</span>
            {' '}<span style={{ color: '#fff' }}>&</span>{' '}
            <span className="glow-text green-pulse">Seamlessly</span>
          </h1>
          <div className="mb-8 max-w-2xl bg-white/5 dark:bg-black/20 border border-gray-200/20 dark:border-white/5 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-none">
            <p className="text-lg text-white m-0" style={{ color: '#fff' }}>
              Navigating high-risk industries is challenging, but <span className="glow-text font-bold" style={{ color: '#A3C64A', textShadow: '0 0 20px #A3C64A, 0 0 30px #7C8F5A' }}>Align</span> makes it easier with our specialized high-risk merchant account services. Our expert team is dedicated to providing secure and efficient payment processing solutions tailored to your business needs.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="rounded-lg shadow border" style={{ background: '#19233a', borderColor: '#2e3a54', padding: '1rem', textAlign: 'left' }}>
              <span className="font-semibold glow-text green-pulse" style={{ color: '#A3C64A' }}>99% Approval Rate</span>
              <div style={{ color: '#fff', fontSize: '0.875rem' }}>Industry-leading acceptance</div>
            </div>
            <div className="rounded-lg shadow border" style={{ background: '#19233a', borderColor: '#2e3a54', padding: '1rem', textAlign: 'left' }}>
              <span className="font-semibold glow-text green-pulse" style={{ color: '#A3C64A' }}>No Setup Fee</span>
              <div style={{ color: '#fff', fontSize: '0.875rem' }}>Start processing immediately</div>
            </div>
            <div className="rounded-lg shadow border" style={{ background: '#19233a', borderColor: '#2e3a54', padding: '1rem', textAlign: 'left' }}>
              <span className="font-semibold glow-text green-pulse" style={{ color: '#A3C64A' }}>Chargeback Protection</span>
              <div style={{ color: '#fff', fontSize: '0.875rem' }}>Advance security features</div>
            </div>
            <div className="rounded-lg shadow border" style={{ background: '#19233a', borderColor: '#2e3a54', padding: '1rem', textAlign: 'left' }}>
              <span className="font-semibold glow-text green-pulse" style={{ color: '#A3C64A' }}>24 Hour Approval</span>
              <div style={{ color: '#fff', fontSize: '0.875rem' }}>Quick application process</div>
            </div>
          </div>
        </div>
        {/* Form Section */}
        <div className="flex-1 max-w-md w-full min-w-0 mt-0 md:mt-12 lg:mt-10">
          <div className="rounded-2xl shadow-xl border" style={{ background: '#19233a', borderColor: '#2e3a54', padding: '1rem 2rem' }}>
            <h2 style={{ color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>Get Started Today!</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Business Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[#23304d] text-white placeholder-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[#23304d] text-white placeholder-white"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[#23304d] text-white placeholder-white"
                />
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[#23304d] text-white placeholder-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[#23304d] text-white placeholder-white"
              />
              <button
                type="submit"
                className="w-full bg-[#F6A94A] hover:bg-[#e08a1b] text-white font-bold py-3 rounded-lg transition-colors"
              >
                Start Processing Today
              </button>
            </form>
            <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              {/* Already filled out a form? <a href="/auth" className="text-[#7C8F5A] underline">Login</a> */}
            </div>
          </div>
        </div>
      </div>
      {/* Logo Marquee */}
      <div className="w-full mt-12 flex flex-col items-center">
        <div className="text-center text-lg font-semibold tracking-wide mb-10 text-[#E46A5A]">Our Trusted Partners</div>
        <div className="relative w-full overflow-hidden" style={{height: '90px'}}>
          <div
            className="logo-marquee flex items-center gap-8 md:gap-12"
            style={{
              whiteSpace: 'nowrap',
              animation: 'marquee 18s linear infinite',
              willChange: 'transform',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
            }}
          >
            {(() => {
              const logos = [
                { src: '/partners/NMI_White_Logo_Small.png', alt: 'NMI White Logo' },
                { src: '/partners/cyber_source.png', alt: 'CyberSource' },
                { src: '/partners/logo_authorize.png', alt: 'Authorize.Net' },
                { src: '/partners/tmpgwb9gjpg.png', alt: 'Partner Logo' },
                { src: '/partners/valor_pay.png', alt: 'Valor Pay' },
                { src: '/partners/zouk_logo.png', alt: 'Zouk Logo' },
              ];
              // Render the list twice for seamless looping
              return [...logos, ...logos].map((logo, i) => (
                <Image key={logo.src + '-' + i} src={logo.src} alt={logo.alt} width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
              ));
            })()}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .logo-marquee img {
            display: inline-block;
            margin-right: 1.25rem;
          }
          @media (max-width: 768px) {
            .logo-marquee img {
              height: 24px;
              width: 100px;
              margin-right: 0.5rem;
            }
          }
        `}</style>
      </div>
    </section>
  );
}