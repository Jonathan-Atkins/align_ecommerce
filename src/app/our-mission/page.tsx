"use client";


import React, { useEffect, useRef } from "react";
import MissionHighlight from "../components/MissionHighlight";

const OurMissionPage = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const el = headerRef.current?.querySelector<HTMLElement>(".text-highlight");
        if (el) {
          ScrollTrigger.create({
            trigger: el,
            start: "top 50%",
            onEnter: () => el.classList.add("active"),
            onLeaveBack: () => el.classList.remove("active"),
          });
        }
      });
    });
    document.body.setAttribute("data-highlight", "background");
  }, []);

  return (
    <main
      className="w-full min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)' }}
    >
      <div ref={headerRef} className="text-center text-white p-8 py-16 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          <mark className="text-highlight">Our Mission</mark>
        </h1>
      </div>
      <MissionHighlight />
    </main>
  );
};

export default OurMissionPage;
