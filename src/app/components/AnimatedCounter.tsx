import React, { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  start: number;
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  loop?: boolean;
  loopDelay?: number;
}

function formatValue(num: number, suffix?: string) {
  if (suffix === "auto") {
    if (num < 1000) return `${num} M`;
    if (num === 1000) return `1 B`;
  }
  if (suffix === "B") return `${num}B`;
  if (suffix === "K") return `${num}K`;
  if (suffix === "M") return `${num} M`;
  return `${num}`;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ start, end, duration = 1800, delay = 0, suffix = "", loop = false, loopDelay = 6000 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(start);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let animationFrame: number;
    let delayTimeout: NodeJS.Timeout;
    let loopTimeout: NodeJS.Timeout;
    function startAnimation() {
      const startTime = performance.now();
      function animate(now: number) {
        const elapsed = now - startTime;
        if (elapsed >= duration) {
          setValue(end);
          if (loop) {
            loopTimeout = setTimeout(() => {
              setValue(start);
              startAnimation();
            }, loopDelay);
          }
          return;
        }
        const progress = elapsed / duration;
        const current = Math.floor(start + (end - start) * progress);
        setValue(current);
        animationFrame = requestAnimationFrame(animate);
      }
      animationFrame = requestAnimationFrame(animate);
    }
    if (delay > 0) {
      delayTimeout = setTimeout(() => {
        setValue(start);
        startAnimation();
      }, delay);
    } else {
      setValue(start);
      startAnimation();
    }
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(delayTimeout);
      clearTimeout(loopTimeout);
    };
  }, [visible, start, end, duration, delay, loop, loopDelay]);

  return (
    <span ref={ref}>{formatValue(value, suffix)}</span>
  );
};

export default AnimatedCounter;
