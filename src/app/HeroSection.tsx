'use client';

import React, { useRef, useEffect } from "react";
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

  return (
    <section ref={sectionRef} className="bg-white dark:bg-gray-900 py-12 md:py-24 relative overflow-hidden">
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
          transition: 'opacity 0.3s ease',
          left: 0,
          top: 0,
        }}
      />
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-2 sm:px-4 md:px-8 lg:px-16">
        {/* Hero Content */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Align{' '}
            <span className="glow-text green-pulse">Scales</span>
            {' '}and Processes High Risk Clients{' '}
            <span className="glow-text green-pulse">Securely</span>
            {' '}&{' '}
            <span className="glow-text green-pulse">Seamlessly</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Navigating high-risk industries is challenging, but Align makes it easier with our specialized high-risk merchant account services. Our expert team is dedicated to providing secure and efficient payment processing solutions tailored to your business needs.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-left">
              <span className="font-semibold text-[#7C8F5A] glow-text green-pulse">99% Approval Rate</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Industry-leading acceptance</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-left">
              <span className="font-semibold text-[#7C8F5A] glow-text green-pulse">No Setup Fee</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Start processing immediately</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-left">
              <span className="font-semibold text-[#7C8F5A] glow-text green-pulse">Chargeback Protection</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Advance security features</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-left">
              <span className="font-semibold text-[#7C8F5A] glow-text green-pulse">24 Hour Approval</span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Quick application process</div>
            </div>
          </div>
        </div>
        {/* Form Section */}
        <div className="flex-1 max-w-md w-full min-w-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 md:p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white text-center">Get Started Today!</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Business Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full bg-[#F6A94A] hover:bg-[#e08a1b] text-white font-bold py-3 rounded-lg transition-colors"
              >
                Start Processing Today
              </button>
            </form>
            <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              Already filled out a form? <a href="/auth" className="text-[#7C8F5A] underline">Login</a>
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
            <img src="/partners/first.png" alt="First Logo" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            <img src="/partners/logo_authorize-net.png" alt="Authorize.Net" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            <img src="/partners/logo_valorpay.png" alt="Valor Paytech" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            <img src="/partners/NMI_White_Logo_Small.png" alt="NMI White Logo" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            <img src="/partners/tmpgwb9gjpg.png" alt="Partner Logo" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            {/* Duplicate for seamless loop */}
            <img src="/partners/first.png" alt="First Logo" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            <img src="/partners/logo_authorize-net.png" alt="Authorize.Net" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            <img src="/partners/logo_valorpay.png" alt="Valor Paytech" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            <img src="/partners/NMI_White_Logo_Small.png" alt="NMI White Logo" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
            <img src="/partners/tmpgwb9gjpg.png" alt="Partner Logo" width={200} height={34} style={{height: '34px', width: '200px', objectFit: 'contain'}} />
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