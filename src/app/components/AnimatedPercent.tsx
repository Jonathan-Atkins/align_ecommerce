import React, { useRef, useEffect, useState } from "react";

function formatPercent(num: number): string {
  if (num >= 99.9) return "99.9%";
  return `${num.toFixed(1)}%`;
}

const AnimatedPercent: React.FC = () => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(70.2);

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
    const start = 70.2;
    const end = 99.9;
    const duration = 3000; // ms
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      if (elapsed >= duration) {
        setValue(end);
        return;
      }
      const progress = elapsed / duration;
      // Smooth increment
      const current = start + (end - start) * progress;
      setValue(current);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [visible]);

  return (
    <span ref={ref}>{formatPercent(value)}</span>
  );
};

export default AnimatedPercent;
