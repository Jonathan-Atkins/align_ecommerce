import React, { useEffect, useState, useRef } from "react";
import AnimatedCounter from "./AnimatedCounter";

const bubbles = [
  {
    label: "Years of Experience",
    start: 1,
    end: 10,
    suffix: "",
    prefix: "+",
    color: "#A6C07A",
    delay: 0,
  },
  {
    label: "Payments Processed",
    start: 75,
    end: 100,
    suffix: "B",
    prefix: "",
    color: "#A6C07A",
    delay: 500,
  },
  {
    label: "Satisfied Merchants",
    start: 10,
    end: 21,
    suffix: "K",
    prefix: "",
    color: "#A6C07A",
    delay: 1000,
  },
];

export default function Numbers() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="flex flex-col md:flex-row gap-8 md:gap-6 w-full max-w-3xl justify-center">
        {bubbles.map((bubble, idx) => (
          <div
            key={bubble.label}
            className="flex flex-col items-center justify-center rounded-2xl px-8 py-8 bg-[#000] min-w-[180px]"
            style={{ boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)", borderRadius: "32px" }}
          >
            <div className="text-4xl font-bold text-white mb-2 flex items-center">
              {bubble.prefix && <span>{bubble.prefix}</span>}
              <AnimatedCounter
                start={bubble.start}
                end={bubble.end}
                duration={1800}
                delay={bubble.delay}
                suffix={bubble.suffix}
                loop={true}
                loopDelay={6000}
              />
            </div>
            <div className="text-lg font-semibold mt-1" style={{ color: bubble.color }}>
              {bubble.label}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @media (max-width: 700px) {
          .numbers-bubbles {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
