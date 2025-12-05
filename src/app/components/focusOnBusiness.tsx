import React from 'react';
import Image from 'next/image';
import styles from './focusOnBusiness.module.css';

const FocusOnBusiness: React.FC = () => {
  return (
    <section
      className="w-full py-5"
      style={{ background: "linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)" }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between min-h-[400px]">
        {/* Left Side: Centered h1 */}
        <div className="flex-1 flex items-center justify-center md:justify-start h-full">
          <h1
            className="text-2xl font-bold text-white mt-16 md:mt-0 w-full"
            style={{
              fontSize: 'clamp(1.2rem, 6vw, 2.6rem)',
              textAlign: typeof window !== 'undefined' && window.innerWidth < 768 ? 'center' : 'left',
              paddingLeft: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : '2rem',
              paddingRight: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : '2rem',
              lineHeight: 1.15,
              wordBreak: 'break-word',
              margin: 0,
              marginTop: 5
            }}
          >
            Focus on your business,<br />
            Let us do the rest.
          </h1>
        </div>
        {/* Right Side: Placeholder for card */}
        <div className="flex-1 flex items-center justify-center h-full mt-10 md:mt-0" style={ {marginRight: 90 }}>
          <div
            className="w-full max-w-5xl h-60 rounded-2xl shadow-md flex flex-col items-center justify-center"
            style={{
              background: 'rgba(120,130,140,0.25)',
              marginTop: typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : undefined,
              marginLeft: typeof window !== 'undefined' && window.innerWidth < 768 ? 'auto' : undefined,
              marginRight: typeof window !== 'undefined' && window.innerWidth < 768 ? 'auto' : undefined
            }}
          >
            {/* Placeholder for icon, title, and description */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              {/* Icon placeholder */}
              <span className="text-2xl text-green-500">⚡</span>
            </div>
              <div className={`text-white font-semibold text-2xl mb-2 ${styles['fast-approvals-letters']}`}>
                <span>Fast</span>
                <span style={{ marginLeft: '0.5em' }}>Approvals</span>
              </div>
            <div
              className="text-white text-center px-2 text-lg md:text-lg sm:text-base break-words"
              style={{ marginBottom: 80, fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', wordBreak: 'break-word', lineHeight: 1.4 }}
            >
              Align Ecommerce excels in fast merchant approvals, even for &quot;high risk&quot; businesses. Our expertise ensures quick, accurate evaluations, speeding up the setup process so you can get started without delay. With Align, fast and reliable approvals are a standard, not an exception.
            </div>
          </div>
        </div>
      </div>
      {/* Our Trusted Partners text and marquee */}
      <div className="w-full mt-16 flex flex-col items-center px-9"style={ {marginBottom: 30}}>
        <div className="text-center text-4xl font-semibold tracking-wide mb-10 text-[#E46A5A]" style={ {marginBottom: 70}}>Our Trusted Partners</div>
        <div className="relative w-full overflow-hidden" style={{height: '120px'}}>
          <div
            className="logo-marquee flex items-center gap-8 md:gap-12"
            style={{
              whiteSpace: 'nowrap',
              animation: 'marquee 18s linear infinite',
              willChange: 'transform',
              height: '120px',
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
              const partners = [
                { src: '/partners/NMI.png', alt: 'NMI White Logo' },
                { src: '/partners/cyber_source.png', alt: 'CyberSource' },
                { src: '/partners/logo_authroize.png', alt: 'Authorize.Net' },
                { src: '/partners/HighLevel.png', alt: 'HighLevel' },
                { src: '/partners/valor_pay.png', alt: 'Valor Pay' },
                { src: '/partners/zouk_logo.png', alt: 'Zouk Logo' },
              ];
              return [...partners, ...partners].map((partner, i) => (
                <Image
                  key={partner.src + '-' + i}
                  src={partner.src}
                  alt={partner.alt}
                  width={180}
                  height={100}
                  style={{
                    height: '100px',
                    width: 'auto',
                    maxWidth: '180px',
                    marginRight: '2rem',
                    objectFit: 'contain',
                    display: 'inline-block',
                  }}
                  priority={i < partners.length}
                  unoptimized
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
              margin-right: 2rem;
              height: 100px;
              max-width: 180px;
              width: auto;
            }
            @media (max-width: 768px) {
              .logo-marquee img {
                height: 48px;
                max-width: 90px;
                margin-right: 0.5rem;
              }
              .logo-marquee {
                gap: 4px;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default FocusOnBusiness;
