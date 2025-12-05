import React, { useRef, useEffect, useState } from "react";

function formatShorthand(num: number): string {
  if (num >= 1_000_000_000) return "$1B";
  if (num >= 1_000_000) return `$${Math.round(num / 1_000_000)}M`;
  return `$${num}`;
}

const AnimatedCounter: React.FC = () => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(70_200_000); // $70.2M

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
    let timeoutId: NodeJS.Timeout;
    const start = 70_200_000;
    const end = 1_000_000_000;
    const duration = 3000; // ms
    const loopDelay = 70000; // ms (wait 1s after animation before looping)

    function startAnimation() {
      const startTime = performance.now();
      function animate(now: number) {
        const elapsed = now - startTime;
        if (elapsed >= duration) {
          setValue(end);
          timeoutId = setTimeout(() => {
            setValue(start);
            startAnimation();
          }, loopDelay);
          return;
        }
        const progress = elapsed / duration;
        const current = Math.floor(start + (end - start) * progress);
        setValue(current);
        animationFrame = requestAnimationFrame(animate);
      }
      animationFrame = requestAnimationFrame(animate);
    }
    setValue(start);
    startAnimation();
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeoutId);
    };
  }, [visible]);

  return (
    <span ref={ref}>{formatShorthand(value)}</span>
  );
};

export default AnimatedCounter;
