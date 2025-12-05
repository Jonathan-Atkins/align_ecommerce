import React, { useRef, useState, useEffect } from "react";
// import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperRef } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./swiper.module.css";

const slides = [
  {
    title: "Omni Channel Payment Solutions",
    subtitle: "Pay your way.\nWe offer tailored payment solutions that cover everything from POS systems for retail to online platforms for e-commerce, catering to both low and high-risk businesses. Our customized approach ensures a seamless payment process, optimized for your specific operational needs and business objectives, whether you're in-store or online.",
    imageAlt: "Omni",
    imageSrc: "/omnichannelslide.png",
    list: [],
  },
  {
    title: "Chargeback & Fraud Prevention",
    subtitle: "",
    imageAlt: "Fraud Prevention",
    imageSrc: "/Fraud.jpg",
    list: [],
  },
  {
    title: "Processing Analytics & Integrations",
    subtitle: "",
    imageAlt: "Analytics",
    imageSrc: "/Analytics.jpg",
    list: [],
  },
];

export default function AlignSlideshow() {
    const swiperRef = useRef<SwiperRef | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 600);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "-3rem" }}>
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
                                        background: "rgba(0,0,0,0.8)",
                                        opacity: 1,
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
        </div>
    );
}
