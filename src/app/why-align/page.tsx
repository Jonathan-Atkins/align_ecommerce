"use client";
import React, { useRef, useState, useEffect } from "react";
import type { Swiper as SwiperType } from 'swiper';
import ScrambleHover from "./ScrambleHover";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperRef } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./swiper.module.css";
import imgStyles from "./slideshow-images.module.css";
const slides = [
   {
	   title: "Why Choose Align eCommerce",
	   subtitle: "Premium Payment Solutions for High-Risk Merchants",
	imageAlt: "slide1.jpg",
	imageSrc: "/slide1.jpg",
	   bgAlt: "hero-bg.png",
	   list: [],
   },
   {
	   title: "Easy-to-Use Payment Gateway",
	   subtitle: "Secure, seamless online payment processing",
	imageAlt: "slide2.jpg",
	imageSrc: "/slide2.jpg",
	   list: [
		   "Works with your website or without one",
		   "Smooth, mobile-friendly checkout",
	   ],
   },
   {
	   title: "Fast Approvals & Quick Funding",
	   subtitle: "High acceptance rates for high-risk industries",
	imageAlt: "slide3.jpg",
	imageSrc: "/slide3.jpg",
	   list: [
		   "Quick access to funds",
		   "Strong cash-flow support",
	   ],
   },
   {
	   title: "Dedicated Support for High-Risk Merchants",
	   subtitle: "Online, retail, and hybrid merchant support",
	imageAlt: "slide4.jpg",
	imageSrc: "/slide4.jpg",
	   list: [
		   "Chargeback mitigation tools",
		   "Strong customer service",
	   ],
   },
   {
	   title: "Secure & Flexible Payment Solutions",
	   subtitle: "Safe handling of sensitive payment data",
	imageAlt: "slide5.jpg",
	imageSrc: "/slide5.jpg",
	   list: [
		   "POS + web integration",
		   "Scalable, adaptive solutions",
	   ],
   },
   {
	   title: "Ready to Get Started?",
	   subtitle: "Contact Us Today",
	imageAlt: "slide6.jpg",
	imageSrc: "/slide6.jpg",
	   list: ["Align eCommerce — Payment Solutions That Work"],
   },
];
export default function WhyAlignPage() {
		const swiperRef = useRef<SwiperRef | null>(null);
		const [isMobile, setIsMobile] = useState(false);

		useEffect(() => {
			const checkMobile = () => setIsMobile(window.innerWidth <= 600);
			checkMobile();
			window.addEventListener("resize", checkMobile);
			return () => window.removeEventListener("resize", checkMobile);
		}, []);

		return (
		<main
			className="w-full min-h-screen flex flex-col items-center justify-center"
			style={{
				background: 'linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)',
				minHeight: '100vh',
				width: '100vw',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "2rem" }}>
				<ScrambleHover text="Why Align?" maxIterations={23} className="text-4xl font-bold text-white" scrambledClassName="text-primary" />
			</div>
			<div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
				<div style={{ maxWidth: "900px", width: "100%", margin: "0 auto", overflow: "hidden" }}>
					<div style={{ position: "relative" }}>
						<Swiper
							modules={[Navigation, Autoplay]}
							navigation={!isMobile}
							pagination={{ clickable: true }}
							autoplay={{ delay: 5000 }}
							loop={true}
							className={styles.swiper}
							style={{
								'--swiper-navigation-size': 'min(36px, 8vw)',
								'--swiper-navigation-color': '#A6C07A',
								zIndex: 10,
							} as React.CSSProperties}
							ref={swiperRef}
						>
							{slides.map((slide, idx) => (
								<SwiperSlide
									key={idx}
									className={styles["swiper-slide"]}
									style={{
										backgroundImage: `url(${slide.imageSrc})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
										position: "relative",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										overflow: "hidden",
									}}
								>
									<div style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: "100%",
										background: "rgba(0,0,0,0.45)",
										opacity: .99,
										zIndex: 1,
									}} />
									<div
										style={{
											background: "transparent",
											border: "none",
											padding: isMobile ? "0.5rem 0.2rem" : "2rem 2.5rem",
											maxWidth: isMobile ? "98vw" : "80%",
											color: "#fff",
											textAlign: "center",
											position: "relative",
											zIndex: 2,
											fontSize: isMobile ? '0.95rem' : '2.1rem',
											wordBreak: 'break-word',
											overflowWrap: 'break-word',
										}}
										className={styles.slideText}
									>
										<div className={styles["slide-title"] + " text-white"} style={{fontSize: isMobile ? '1.1rem' : undefined}}>{slide.title}</div>
										<div className={styles["slide-subtitle"] + " text-white"} style={{fontSize: isMobile ? '1rem' : undefined}}>{slide.subtitle}</div>
										{slide.list.length > 0 && (
											<ul className={styles["slide-list"] + " text-white"}>
												{slide.list.map((item, i) => (
													<li key={i} style={{fontSize: isMobile ? '0.95rem' : undefined}}>{item}</li>
												))}
											</ul>
										)}
									</div>
								</SwiperSlide>
							))}
						</Swiper>
						{isMobile && (
							<>
								<button
									style={{
										position: "absolute",
										top: "50%",
										left: "10px",
										transform: "translateY(-50%)",
										zIndex: 100,
										background: "rgba(163,198,74,0.18)",
										borderRadius: "50%",
										border: "2px solid #A6C07A",
										boxShadow: "0 2px 8px rgba(163,198,74,0.18)",
										width: "40px",
										height: "40px",
										fontSize: "2em",
										color: "#A6C07A",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
									aria-label="Previous Slide"
									onClick={() => swiperRef.current?.swiper?.slidePrev()}
								>
									&#8592;
								</button>
								<button
									style={{
										position: "absolute",
										top: "50%",
										right: "10px",
										transform: "translateY(-50%)",
										zIndex: 100,
										background: "rgba(163,198,74,0.18)",
										borderRadius: "50%",
										border: "2px solid #A6C07A",
										boxShadow: "0 2px 8px rgba(163,198,74,0.18)",
										width: "40px",
										height: "40px",
										fontSize: "2em",
										color: "#A6C07A",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
									aria-label="Next Slide"
									onClick={() => swiperRef.current?.swiper?.slideNext()}
								>
									&#8594;
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
