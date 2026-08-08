import React, { useEffect, useRef } from 'react';

/**
 * SnowCanvas — Soft white snow flakes falling at 60fps.
 * Subtle size variation and gentle horizontal sway.
 */
const SnowCanvas = ({ intensity = 0.85 }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.floor(65 * intensity);
    const flakes = Array.from({ length: count }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      r:       1.5 + Math.random() * 4,
      speed:   0.5 + Math.random() * 1.8,
      sway:    Math.random() * Math.PI * 2,
      swaySpd: 0.008 + Math.random() * 0.014,
      opacity: 0.45 + Math.random() * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flakes.forEach((f) => {
        f.sway += f.swaySpd;
        f.y    += f.speed;
        f.x    += Math.sin(f.sway) * 0.55;

        // Main flake
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();

        // Inner shimmer
        ctx.beginPath();
        ctx.arc(f.x - f.r * 0.28, f.y - f.r * 0.28, f.r * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity * 0.7})`;
        ctx.fill();

        // Reset when off screen
        if (f.y > canvas.height + 10) {
          f.y = -10;
          f.x = Math.random() * canvas.width;
        }
        if (f.x < -20 || f.x > canvas.width + 20) {
          f.x = Math.random() * canvas.width;
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
};

export default SnowCanvas;
