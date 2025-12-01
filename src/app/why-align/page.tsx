"use client";
import React from "react";
import ScrambleHover from "./ScrambleHover";
import { Swiper, SwiperSlide } from "swiper/react";
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
					<Swiper
						modules={[Navigation, Autoplay]}
						navigation
						autoplay={{ delay: 3500, disableOnInteraction: false }}
						loop={true}
						className={styles.swiper}
						style={{
							'--swiper-navigation-size': '36px',
							'--swiper-navigation-color': '#A6C07A',
						} as React.CSSProperties}
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
										padding: "2rem 2.5rem",
										maxWidth: "80%",
										color: "#fff",
										textAlign: "center",
										position: "relative",
										zIndex: 2,
									}}
								>
									<div className={styles["slide-title"] + " text-white"}>{slide.title}</div>
									<div className={styles["slide-subtitle"] + " text-white"}>{slide.subtitle}</div>
									{slide.list.length > 0 && (
										<ul className={styles["slide-list"] + " text-white"}>
											{slide.list.map((item, i) => (
												<li key={i}>{item}</li>
											))}
										</ul>
									)}
								</div>
								{/* Swiper navigation arrows for mobile */}
								<div className="swiper-button-prev" style={{ display: 'block' }} />
								<div className="swiper-button-next" style={{ display: 'block' }} />
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</main>
	);
}
