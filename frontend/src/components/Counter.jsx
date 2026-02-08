import { useEffect, useRef, useState } from "react";

/**
 * Counter Component - Animated number counter for stats
 * Animates from 0 to target value when component enters viewport
 * Deshabilitado en tablets/móviles para mejor rendimiento
 */
const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Detectar si NO es tablet (animar en desktop y móviles, no en tablets)
  useEffect(() => {
    const checkShouldAnimate = () => {
      const width = window.innerWidth;
      const isTablet = width >= 768 && width < 1024;
      setShouldAnimate(!isTablet); // Animar en todo EXCEPTO tablets
    };

    checkShouldAnimate();
    window.addEventListener("resize", checkShouldAnimate);
    return () => window.removeEventListener("resize", checkShouldAnimate);
  }, []);

  // Si no debe animar, mostrar el valor final directamente
  useEffect(() => {
    if (!shouldAnimate) {
      const endValue =
        typeof end === "string" ? parseInt(end.replace(/\D/g, "")) : end;
      setCount(endValue);
    }
  }, [shouldAnimate, end]);

  useEffect(() => {
    if (!shouldAnimate) return; // No observar si no debe animar

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateCount();
          }
        });
      },
      { threshold: 0.5 },
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [shouldAnimate]);

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
