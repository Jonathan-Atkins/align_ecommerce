"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MissionHighlight: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [highlightStyle, setHighlightStyle] =
    useState<"background" | "half" | "underline">("background");
  const [darkMode, setDarkMode] = useState(false);

  // Sync highlight mode to body data-attribute
  useEffect(() => {
    document.body.setAttribute("data-highlight", highlightStyle);
  }, [highlightStyle]);

  // Sync dark mode to body class
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // GSAP scroll-triggered highlight + unhighlight on scroll up
  useEffect(() => {
    if (!containerRef.current) return;

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(".text-highlight")
    );

    const triggers = elements.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        onEnter: () => el.classList.add("active"),
        onLeaveBack: () => el.classList.remove("active"), // ← NEW: unhighlight when scrolling up
      })
    );

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="-mt-1 text-white">
      <main className="mission-main -mt-8">
        {/* Section 1 */}
        <div className="title-wrap">
          <h2 className="mt-0">Putting You First</h2>
          <div className="horizontal-line" aria-hidden="true" />
        </div>
        <p>
          <mark className="text-highlight">
            Our service is unmatched in the industry
          </mark>{" "}
          — our dedicated team works closely with clients to understand their
          specific needs, allowing us to custom-make solutions that are a
          perfect match for their requirements. Once we are provided with the
          application and supporting documents, our team begins working on them
          immediately to ensure the process is completed without hassle.
        </p>
        <p>No more repeatedly applying for approval!</p>

        {/* Section 2 */}
        <div className="title-wrap">
          <h2>Building Together</h2>
          <div className="horizontal-line" aria-hidden="true" />
        </div>
        <p>
          Whether you are a high-risk merchant expanding, or a small local
          business trying to compete —{" "}
          <mark className="text-highlight">we are here for you!</mark>
        </p>
        <p>
          Give us a call today and let us show you how we can help grow your
          bottom line.
        </p>

        {/* Section 3 */}
        <div className="title-wrap">
          <h2>Driving Success</h2>
          <div className="horizontal-line" aria-hidden="true" />
        </div>
        <p>
          Since we are passionate about helping businesses reach their goals,
          our mission is to give our customers the power to prosper in the
          digital age. We provide A+ customer service, cutting-edge technology,
          and secure payment solutions — all the tools needed to grow.
        </p>
        <p>
          <mark className="text-highlight">
            We are devoted to making sure your business becomes the most
            profitable and efficient it can be
          </mark>
          .
        </p>

        {/* Section 4 */}
        <div className="title-wrap">
          <h2>Leading the Industry</h2>
          <div className="horizontal-line" aria-hidden="true" />
        </div>
        <p>
          Because of our dedication to providing customers with the latest
          integrations and tools needed to thrive, we are proud to be considered
          one of the leading eCommerce companies in the industry.
        </p>
        <p>
          <mark className="text-highlight">
            Our commitment to excellence is second-to-none
          </mark>
          , and our promise of helping businesses succeed will never waiver.
        </p>
      </main>
    </div>
  );
};

export default MissionHighlight;
