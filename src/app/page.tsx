"use client";
import React from 'react';
import Image from 'next/image';
import './featureCardBg.css';

const features = [
  {
    title: 'Award-winning Customer Support',
    icon: '/customersupporticon.png',
    description: '',
  },
  {
    title: 'Omnichannel Payment Experiences',
    icon: '🏦',
    description: '',
  },
  {
    title: 'Accept All Forms of Payments',
    icon: '💳',
    description: '',
  },
];

function FeatureCard({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="rounded-xl bg-[#222] feature-card-bg flex flex-col justify-between" style={{ height: 220, position: 'relative' }}>
      <h3 className="text-lg font-semibold text-white m-0 p-4 w-[80%]">{title}</h3>
      <div style={{ position: 'relative', width: '100%', height: '40px' }}>
        {title === 'Accept All Forms of Payments' ? (
          <div className="relative w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.32)', height: '40px', borderRadius: '0px', marginTop: '0px', backdropFilter: 'blur(6px)', overflow: 'hidden', maxWidth: '100%' }}>
            <div
              className="logo-marquee flex items-center gap-6 md:gap-8 justify-center"
              style={{
                whiteSpace: 'nowrap',
                animation: 'marquee 18s linear infinite',
                willChange: 'transform',
                height: '40px',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
              }}
            >
              {(() => {
                const cards = [
                  { src: '/visa.png', alt: 'Visa' },
                  { src: '/amex.png', alt: 'Amex' },
                  { src: '/mastercard.png', alt: 'Mastercard' },
                  { src: '/discover.png', alt: 'Discover' },
                  { src: '/applepay.png', alt: 'Apple Pay' },
                ];
                return [...cards, ...cards].map((card, i) => (
                  <Image
                    key={card.src + '-' + i}
                    src={card.src}
                    alt={card.alt}
                    width={60}
                    height={32}
                    style={{
                      height: '32px',
                      width: 'auto',
                      maxWidth: '60px',
                      marginRight: '1rem',
                      objectFit: 'contain',
                      display: 'inline-block',
                    }}
                  />
                ));
              })()}
            </div>
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .logo-marquee img {
                display: inline-block;
                margin-right: 1rem;
                height: 32px;
                max-width: 60px;
                width: auto;
              }
              @media (max-width: 768px) {
                .logo-marquee img {
                  height: 20px;
                  max-width: 36px;
                  margin-right: 0.5rem;
                }
              }
            `}</style>
          </div>
        ) : (
          <span className="bg-[#C3E86B] rounded-full flex items-center justify-center" style={{ position: 'absolute', left: 9, bottom: 15, width: 48, height: 48, zIndex: 10 }}>
            {icon.startsWith('/') ? (
              <Image src={icon} alt="Feature Icon" width={28} height={22} style={{ objectFit: 'contain' }} />
            ) : (
              <span className="text-2xl">{icon}</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Homepage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 md:gap-8">
        {/* Hero card: order-1 on mobile, order-2 on desktop */}
        <div
          className="flex flex-col justify-center items-start bg-[#222] rounded-xl p-10 order-1 md:order-2"
          style={{ position: 'relative' }}
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-white">Seamless</span> <span className="text-white">Payments</span>,<br />
            <span className="text-white">Perfectly</span> <GlowAlignText>Aligned.</GlowAlignText>
          </h1>
          <button className="bg-[#C3E86B] text-black font-semibold px-6 py-3 rounded-full mt-4">
            Schedule a Free Consultation
          </button>
        </div>
        {/* Feature cards: order-2 on mobile, order-1 on desktop */}
        <div className="grid grid-rows-2 gap-8 order-2 md:order-1">
          <div className="grid grid-cols-2 gap-8">
            <FeatureCard {...features[0]} />
            <FeatureCard {...features[1]} />
          </div>
          <FeatureCard {...features[2]} />
        </div>
      </div>
    </div>
  );
}
import { GlowAlignText } from "../app/GlowAlignText";
