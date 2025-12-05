"use client";
import React from 'react';
import Image from 'next/image';
import './featureCardBg.css';
import MetorBackground from "./components/MetorBackground";
import StatsOverlay from "./components/StatsOverlay";
import IndustryServed from "./components/industryServed";

const features = [
	{
		title: 'Award-winning Customer Support',
		icon: '/customersupporticon.png',
		description: '',
	},
	{
		title: 'Omnichannel Payment Experiences',
		icon: '/omniicon.png',
		description: '',
	},
	{
		title: 'Accept All Forms of Payments',
		icon: '💳',
		description: '',
	},
];

function FeatureCard({ title, icon }: { title: string; icon: string }) {
	// Set unique background image per card
	let bgImage = '/customersupport.png';
	if (title === 'Omnichannel Payment Experiences') bgImage = '/omnichannelbg.png';
	if (title === 'Accept All Forms of Payments') bgImage = '/majorccbg.png';
	return (
		   <div
			   className="rounded-xl bg-[#222] feature-card-bg flex flex-col justify-between"
			   style={{
				   height: 220,
				   position: 'relative',
				   background: `url('${bgImage}') center center/cover no-repeat`,
				   overflow: 'hidden',
			   }}
		   >
			<h3 className="text-lg font-semibold text-white m-0 p-4 w-[80%]">{title}</h3>
			<div style={{ position: 'relative', width: '100%', height: '40px' }}>
				{title === 'Accept All Forms of Payments' ? (
					<>
						<div className="relative w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.32)', height: '40px', borderRadius: '0px', marginTop: '-80px', backdropFilter: 'blur(6px)', overflow: 'hidden', maxWidth: '100%' }}>
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
										{ src: '/gpaylogo.png', alt: 'Google Pay' },
										{ src: '/jcblogo.png', alt: 'JCB' },
										{ src: '/rupaylogo.png', alt: 'RuPay' },
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
						{/* Removed OmniChannel Background image as requested */}
						<span className="bg-[#C3E86B] rounded-full flex items-center justify-center" style={{ position: 'absolute', left: 9, bottom: 15, width: 48, height: 48, zIndex: 10, boxShadow: '0 0 24px 8px #C3E86B, 0 0 48px 16px #C3E86B55' }}>
							<Image src="/ccicon.png" alt="Credit Card Icon" width={28} height={28} style={{ objectFit: 'contain' }} />
						</span>
					</>
				) : (
					<span className="bg-[#C3E86B] rounded-full flex items-center justify-center" style={{ position: 'absolute', left: 9, bottom: 15, width: 48, height: 48, zIndex: 10, boxShadow: '0 0 24px 8px #C3E86B, 0 0 48px 16px #C3E86B55' }}>
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
		<main>
			{/* Landing page content */}
			<section>
				<div className="min-h-screen flex items-center justify-center">
					   <div className="w-full max-w-6xl p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 md:gap-8">
						   {/* Hero card: order-1 on mobile, order-2 on desktop */}
						   <div
							   className="flex flex-col justify-center items-start bg-[#222] rounded-xl p-10 order-1 md:order-2"
							   style={{
								   position: 'relative',
								   background: "url('/align_vegas_logo.png') center center/cover no-repeat",
								   opacity: 1,
								   zIndex: 1,
							   }}
						   >
							   <h1 className="text-5xl font-bold mb-4 pb-8 flex flex-col gap-y-3">
								   <span className="text-white">Seamless</span>
								   <span className="text-white">Payments</span>
								   <span className="text-white">Perfectly</span>
								   <span className="mb-2 leading-[1.3] inline-block"><GlowAlignText>Aligned.</GlowAlignText></span>
							   </h1>
							   <button className="bg-[#C3E86B] text-black font-semibold px-6 py-3 rounded-full mt-4">
								   Schedule a Free Consultation
							   </button>
						   </div>
						   {/* Feature cards: stack first two vertically on mobile, grid on desktop */}
						   <div className="order-2 md:order-1 w-full">
							   <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8">
								   <FeatureCard {...features[0]} />
								   <FeatureCard {...features[1]} />
							   </div>
							   <div className="mt-6 md:mt-8">
								   <FeatureCard {...features[2]} />
							   </div>
						   </div>
					</div>
				</div>
			</section>
			{/* Metor Background as next section below */}
			<section className="w-full relative min-h-[700px] flex items-center justify-center">
				<MetorBackground />
				<StatsOverlay />
			</section>
			{/* IndustryServed section below MetorBackground */}
			<IndustryServed />
		</main>
	);
}
import { GlowAlignText } from "../app/GlowAlignText";
