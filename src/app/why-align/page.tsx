"use client";
import React from "react";
import ScrambleHover from "./ScrambleHover";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./swiper.module.css";

const slides = [
	{
		title: "Why Choose Align eCommerce",
		subtitle: "Premium Payment Solutions for High-Risk Merchants",
		imageAlt: "logo.png",
		imageSrc: "", // placeholder
		bgAlt: "hero-bg.png",
		list: [],
	},
	{
		title: "Easy-to-Use Payment Gateway",
		subtitle: "Secure, seamless online payment processing",
		imageAlt: "gateway-image.png",
		imageSrc: "",
		list: [
			"Works with your website or without one",
			"Smooth, mobile-friendly checkout",
		],
	},
	{
		title: "Fast Approvals & Quick Funding",
		subtitle: "High acceptance rates for high-risk industries",
		imageAlt: "fast-approvals.png",
		imageSrc: "",
		list: [
			"Quick access to funds",
			"Strong cash-flow support",
		],
	},
	{
		title: "Dedicated Support for High-Risk Merchants",
		subtitle: "Online, retail, and hybrid merchant support",
		imageAlt: "merchant-support.png",
		imageSrc: "",
		list: [
			"Chargeback mitigation tools",
			"Strong customer service",
		],
	},
	{
		title: "Secure & Flexible Payment Solutions",
		subtitle: "Safe handling of sensitive payment data",
		imageAlt: "secure-flexible.png",
		imageSrc: "",
		list: [
			"POS + web integration",
			"Scalable, adaptive solutions",
		],
	},
	{
		title: "Ready to Get Started?",
		subtitle: "Contact Us Today",
		imageAlt: "cta-image.png",
		imageSrc: "",
		list: ["Align eCommerce — Payment Solutions That Work"],
	},
];

export default function WhyAlignPage() {
	return (
		<main
			className="w-full min-h-screen flex flex-col items-center justify-center"
			style={{ background: 'linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)' }}
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
					>
						{slides.map((slide, idx) => (
							<SwiperSlide key={idx} className={styles["swiper-slide"]}>
								<div>
									<div className={styles["slide-title"] + " text-white"}>{slide.title}</div>
									<div className={styles["slide-subtitle"] + " text-white"}>{slide.subtitle}</div>
									{slide.list.length > 0 && (
										<ul className={styles["slide-list"] + " text-white"}>
											{slide.list.map((item, i) => (
												<li key={i}>{item}</li>
											))}
										</ul>
									)}
									<div
										className={styles["slide-image"]}
										style={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											background: "#222",
										}}
									>
										<span style={{ color: "#fff", fontSize: "1rem" }}>
											{slide.imageAlt}
										</span>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</main>
	);
}
