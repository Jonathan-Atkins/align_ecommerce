
"use client";
import React from "react";
import IndustryServed from "../components/industryServed";

export default function Page() {
  return (
    <main
      className="w-full min-h-screen flex flex-col"
      style={{ paddingTop: '40px', background: 'linear-gradient(90deg, #0B132B 0%, #1B3A2D 100%)' }}
    >
      <style>{`
        @keyframes fadeInUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }

        .fadeInUp-animation {
          animation-name: fadeInUp;
          animation-duration: 1.5s;
          animation-fill-mode: both;
        }

        .fadeInUp-delay {
          animation-delay: 0.5s;
        }

        /* underline-style horizontal line that grows from center */
        .title-wrap { position: relative; display: inline-block; }

        .horizontal-line {
          position: absolute;
          left: -12px; /* extend slightly past the text start */
          right: -12px; /* extend slightly past the text end */
          bottom: -8px; /* a few pixels underneath the header */
          height: 3px; /* thickness */
          background: linear-gradient(to right, transparent 0%, #A6C07A 30%, #A6C07A 70%, transparent 100%);
          opacity: 0;
          transform: scaleX(0);
          transform-origin: center;
          animation: fadeInLine 600ms ease-out forwards;
          animation-delay: 1.65s; /* start shortly after header animation (1.5s) */
        }

        @keyframes fadeInLine {
          0% {
            opacity: 0;
            transform: scaleX(0);
          }
          100% {
            opacity: 1;
            transform: scaleX(1);
          }
        }
      `}</style>

      <div className="text-center text-white p-8">
        <div className="title-wrap">
          <h1 className="text-4xl font-bold fadeInUp-animation">About Us</h1>
          <div className="horizontal-line" aria-hidden="true" />
        </div>

        <p className="mt-12 text-lg opacity-80 fadeInUp-animation fadeInUp-delay max-w-2xl mx-auto">
          Align eCommerce is an omni-channel, multi solutions, payment provider specializing in card non present, higher risk merchant services. With over 10 years of experience, and 8 different unique banking relationships, partnering with Align has proven to increase sales and revenue. Our One-on-One Success Plans will not only ensure you have enough processing capacity to operate comfortably but will also ensure you have the proper procedures in place to protect your day-to-day business operations.
        </p>
      </div>
      <div className="flex justify-center mt-16">
        <IndustryServed />
      </div>
    </main>
  );
}
