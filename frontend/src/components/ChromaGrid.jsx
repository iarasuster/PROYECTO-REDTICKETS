import { useEffect, useRef } from 'react';
import './ChromaGrid.css';

export default function ChromaGrid({ 
  children, 
  className = '',
  colors = ['#ff6600', '#ff8833', '#ff9944'],
  intensity = 0.5,
  speed = 0.5 
}) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    let animationId;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      card.classList.add('chroma-active');
    };

    const handleMouseLeave = () => {
      card.classList.remove('chroma-active');
      currentX = 0;
      currentY = 0;
    };

    const animate = () => {
      // Smooth interpolation
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      if (glow) {
        glow.style.background = `radial-gradient(circle 150px at ${currentX}px ${currentY}px, ${colors[0]}${Math.round(intensity * 255).toString(16).padStart(2, '0')}, transparent)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [colors, intensity]);

  return (
    <div ref={cardRef} className={`chroma-grid-card ${className}`}>
      <div ref={glowRef} className="chroma-glow"></div>
      <div className="chroma-content">
        {children}
      </div>
    </div>
  );
}
