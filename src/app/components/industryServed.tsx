"use client";
import React, { useMemo, useEffect, useState } from "react";

const images = [
  "/WebDesign1.jpg",
  "/OnlineCoach.jpg",
  "/Multi-Level Marketing.png",
  "/Online Gambline.jpg",
  "/Adult and Dating.jpg",
  "/gadgets.jpg",
  "/Nutra.jpg",
  "/market.jpg",
  "/pistol.jpg",
  "/golf.jpg",
];

const labels = [
  "Web Design",
  "Online Coaching",
  "Multi-Level Marketing",
  "Online Gambling",
  "Adult & Dating",
  "Gadget",
  "Nutraceuticals",
  "Marketing",
  "Firearms",
  "Golf Equipment",
];

// REQUIRED VALUES
const PANEL_WIDTH = 260;
const PANEL_HEIGHT = 187;
const GAP = 20; // FIXED gap between faces

export default function IndustryServed() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
  const total = images.length;

  // Angle per face
  const angle = 360 / total;

  // AUTO-RADIUS:
  // We include the panel width + the visible gap.
  // This creates a perfect circle with a fixed gap.
  const radius = useMemo(() => {
    const fullFace = PANEL_WIDTH + GAP;
    const theta = (2 * Math.PI) / total; // radians
    return fullFace / (2 * Math.tan(theta / 2));
  }, [total]);

  if (!mounted) return null;
  return (
    <div>
          <div className="title-wrap"style={{ marginLeft: '8px', marginBottom: '100px', marginTop: '60px' }}>
            <h2 className="text-3xl font-bold text-center mt-0 mb-0 text-white" style={{ marginLeft: '40px', marginBottom: '200px' }}>Industries Served</h2>
            <div className="horizontal-line" aria-hidden="true" style={{ marginLeft: '40px' }} />
          </div>
      <div className="carousel-container mx-auto " style={{ marginRight: '450px', marginLeft: '450px', marginBottom: '80px' }}>
        <div
          className="carousel"
          style={{
            "--radius": `${radius}px`,
            "--angle": `${angle}deg`
          } as React.CSSProperties}
        >
          {images.map((src, i) => (
            <div
              className="carousel-face"
              key={`${labels[i]}-${i}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <img src={src} alt={labels[i]} />
              <div className="carousel-label">{labels[i]}</div>
            </div>
          ))}
        </div>
        <style>{`
/* Outer container */
.carousel-container {
  width: ${PANEL_WIDTH + 100}px;
  height: ${PANEL_HEIGHT + 100}px;
  margin: 60px auto;
  perspective: 1200px;
  margin-top: 130px;
  margin-bottom: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

/* Rotating ring */
.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: rotate360 50s linear infinite;
}

/* One face */
.carousel-face {
  position: absolute;
  width: ${PANEL_WIDTH}px;
  height: ${PANEL_HEIGHT}px;
  top: 20px;
  left: 20px;

  /* CRITICAL — uses angle + REAL radius */
  transform:
    rotateY(calc(var(--i) * var(--angle)))
    translateZ(var(--radius));

  border-radius: 18px;
  overflow: hidden;
  box-shadow: inset 0 0 0 2000px rgba(0,0,0,0.40);
}

/* Image held at fixed size */
.carousel-face img {
  width: ${PANEL_WIDTH}px;
  height: ${PANEL_HEIGHT}px;
  object-fit: cover;
}

/* Label overlay */
.carousel-label {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 12px;
  color: white;
  font-size: 1.3rem;
  text-align: center;
  background: rgba(0,0,0,0.45);
}

/* Animation */
@keyframes rotate360 {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(-360deg); }
}

/* Optional scaling for mobile */
@media (max-width: 600px) {
  .carousel-container {
    transform: scale(0.75);
  }
}
      `}</style>
      </div>
    </div>
  );
}
