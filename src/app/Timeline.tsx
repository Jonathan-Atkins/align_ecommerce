"use client";

import React, { useState, useEffect, ReactNode, useRef } from "react";
import { GlowAlignText } from "./GlowAlignText";

// FadeContent component for fade-in effect on content change
interface FadeContentProps {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  initialOpacity?: number;
  className?: string;
}

const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = false,
  duration = 1000,
  easing = 'ease-out',
  delay = 0,
  initialOpacity = 0,
  className = ''
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [children, delay]);
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : initialOpacity,
        transition: `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}`,
        filter: blur ? (visible ? 'blur(0px)' : 'blur(10px)') : 'none'
      }}
    >
      {children}
    </div>
  );
};

const steps = [
  {
    label: "Merchant Accounts",
    content:
      "Accepting payments online is essential to running a successful business. Whether you're selling products on your own site, or through marketplaces like Amazon or eBay, Align provides web-based solutions for accepting payments with our eCommerce payment gateway.",
  },
  {
    label: "Mitigation Services",
    content:
      "The ability to monitor, manage, and reduce chargebacks is critical to maintaining healthy merchant accounts. At Align we provide merchants with access to chargeback analytics which provides valuable insight into your chargeback history.",
  },
  {
    label: "Retail & POS Solutions",
    content:
      "Whether you have a brick-and-mortar storefront, an eCommerce website, or both, Align offers Retail point-of-sale solutions that allow you to accept payment from anywhere.",
  },
  {
    label: "Quick Approvals",
    content:
      "Our approval process is quick and easy—giving you more time to focus on your business.",
  },
  {
    label: "Dedicated Team",
    content:
      "You and your business are important to us—that’s why we have a dedicated team ready to help you with any questions or issues you might encounter, 24 hours a day, 7 days a week.",
  },
  {
    label: "Support Services",
    content:
      "Our support services are second to none because of our commitment to providing every client with the best possible experience. We offer a wide range of support services that include technical support, customer service, and fraud prevention.",
  },
];

export default function Timeline() {
  const [selected, setSelected] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const stepsLen = steps.length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 640px)');
    // set initial
    setIsMobile(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    // prefer modern addEventListener API
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', listener);
      return () => { try { mq.removeEventListener('change', listener); } catch {} };
    }
    // fallback for older browsers
    type LegacyMQL = { addListener: (l: (e: MediaQueryListEvent) => void) => void; removeListener: (l: (e: MediaQueryListEvent) => void) => void };
    const legacy = mq as unknown as LegacyMQL;
    if (typeof legacy.addListener === 'function') {
      legacy.addListener(listener);
      return () => { try { legacy.removeListener(listener); } catch {} };
    }
    return undefined;
  }, []);

  const prevIndex = () => (selected - 1 + stepsLen) % stepsLen;
  const nextIndex = () => (selected + 1) % stepsLen;

  const goPrev = () => setSelected(prevIndex());
  const goNext = () => setSelected(nextIndex());

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (touchStartX.current == null) return;
    const delta = touchDeltaX.current;
    const threshold = 30; // swipe threshold px
    if (delta > threshold) {
      goPrev();
    } else if (delta < -threshold) {
      goNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };
  return (
    <section
      className="w-full py-20 px-4 flex flex-col items-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)',
        minHeight: '65vh',
      }}
    >
      <h2 className="text-6xl font-bold text-center text-gray-900 dark:text-white font-[Montserrat] mb-10">
        What <span className="green-pulse">Align</span> Offers
      </h2>
      <div className="flex justify-center items-center mb-6">
        {/* <span className="text-lg text-gray-400 italic">(click dots for more!)</span> */}
      </div>
      {/* Timeline Flexbox */}
      <div className="w-full max-w-5xl flex flex-col items-center">
        {isMobile ? (
          // Mobile simplified timeline: center active dot, show faded partial neighbor, small chevrons, swipe support
          <div className="w-full flex items-center justify-center mb-6" style={{ gap: 12 }}>
            <button
              aria-label="Previous step"
              onClick={goPrev}
              className="text-white bg-transparent p-2 rounded-md"
              style={{ fontSize: 18, opacity: 0.9 }}
            >
              ◀
            </button>

            <div
              className="relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ width: 120, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}
            >
              {/* Previous partial (faded) */}
              <div
                style={{
                  position: 'absolute',
                  left: -26,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#232628',
                  border: '3px solid rgba(255,255,255,0.12)',
                  opacity: 0.6,
                }}
              />

              {/* Active dot */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'ArrowLeft') goPrev(); if (e.key === 'ArrowRight') goNext(); }}
                className="flex items-center justify-center"
                style={{ zIndex: 20 }}
              >
                <span
                  className={`block w-9 h-9 rounded-full bg-[#A3C64A]/70`}
                  style={{ boxShadow: '0 0 8px rgba(163,198,74,0.45)', border: '3px solid #A3C64A' }}
                />
              </div>

              {/* Next partial (faded) */}
              <div
                style={{
                  position: 'absolute',
                  right: -26,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#232628',
                  border: '3px solid rgba(255,255,255,0.12)',
                  opacity: 0.6,
                }}
              />
            </div>

            <button
              aria-label="Next step"
              onClick={goNext}
              className="text-white bg-transparent p-2 rounded-md"
              style={{ fontSize: 18, opacity: 0.9 }}
            >
              ▶
            </button>
          </div>
        ) : null}
        {/* Headers Row */}
        {!isMobile ? (
          <div className="w-full relative" style={{ marginTop: 27, marginBottom: 6, height: 32 }}>
            {steps.map((step, idx) => {
              const percent = (idx) / (steps.length - 1) * 100;
              return (
                <span
                  key={step.label}
                  className={`block font-bold text-center select-none ${selected === idx ? 'text-[#A3C64A]' : 'text-white'}`}
                  style={{
                    fontSize: '16px',
                    position: 'absolute',
                    left: `calc(${percent}%)`,
                    top: 0,
                    transform: 'translateX(-50%)',
                    minWidth: 0,
                    maxWidth: 180,
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    margin: 0,
                    paddingBottom: 0,
                    lineHeight: 1.1,
                  }}
                  onClick={() => setSelected(idx)}
                >
                  {step.label}
                </span>
              );
            })}
          </div>
        ) : (
          // Mobile: show active label only
          <div style={{ marginTop: 18, marginBottom: 6, height: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div className="text-center text-white font-bold" style={{ fontSize: 16, maxWidth: 220 }}>{steps[selected].label}</div>
          </div>
        )}
        <div className="relative w-full flex items-center" style={{ minHeight: 70 }}>
          {/* Base line with faded edges (single gradient line) */}
          <div
            className="absolute left-0 right-0 top-1/2 h-1"
            style={{
              zIndex: 0,
              transform: 'translateY(-50%)',
              background: 'linear-gradient(to right, transparent 0%, #232628 10%, #232628 90%, transparent 100%)'
            }}
          />
          {/* Filling line (green) with faded ends */}
          <div
            className="absolute left-0 top-1/2 h-1 transition-all duration-300"
            style={{
              zIndex: 1,
              transform: 'translateY(-50%)',
              width: `${selected / (steps.length - 1) * 100}%`,
              minWidth: selected === 0 ? 0 : 24,
              maxWidth: '100%',
              background: 'linear-gradient(to right, transparent 0%, #A3C64A 10%, #A3C64A 90%, transparent 100%)'
            }}
          />
          {/* Steps */}
          {steps.map((step, idx) => {
            const percent = (idx) / (steps.length - 1) * 100;
            const isActive = idx <= selected;
            return (
              <div
                key={step.label}
                className="flex flex-col items-center cursor-pointer"
                style={{ position: 'absolute', left: `calc(${percent}%)`, transform: 'translateX(-50%)', zIndex: 10, width: 'max-content', minWidth: 0 }}
                onClick={() => setSelected(idx)}
              >
                <span
                  className={`block w-7 h-7 rounded-full border-3 ${isActive ? 'border-[#A3C64A] bg-[#A3C64A]/30' : 'border-[#444] bg-[#232628]'}`}
                  style={{
                    transition: 'background 0.2s, border 0.2s',
                    zIndex: 20,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 0 4px #232628',
                  }}
                />
              </div>
            );
          })}
        </div>
        {/* Event content below timeline */}
        <div className="mt-14 w-full flex justify-center">
          <FadeContent
            key={selected} // Keyed by selected to retrigger animation
            blur={true}
            duration={1000}
            easing="ease-out"
            initialOpacity={0}
          >
            <div className="bg-[#232628] text-white rounded-xl px-10 py-8 shadow max-w-xl w-full text-center text-xl min-h-[70px]">
              <GlowAlignText>{steps[selected].content}</GlowAlignText>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
