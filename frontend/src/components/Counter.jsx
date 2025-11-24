import { useEffect, useRef, useState } from "react";

/**
 * Counter Component - Animated number counter for stats
 * Animates from 0 to target value when component enters viewport
 */
const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCount();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  const animateCount = () => {
    const startTime = Date.now();
    const endValue =
      typeof end === "string" ? parseInt(end.replace(/\D/g, "")) : end;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * endValue);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCount);
  };

  const formatNumber = (num) => {
    return num.toLocaleString("es-ES");
  };

  return (
    <span ref={countRef} className="counter">
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

export default Counter;
