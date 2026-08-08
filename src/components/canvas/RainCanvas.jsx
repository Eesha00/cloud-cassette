import React, { useEffect, useRef } from 'react';

/**
 * RainCanvas — Soft warm rain particle effect (60fps canvas).
 * Renders warm cocoa-tinted rain drops over any background.
 */
const RainCanvas = ({ intensity = 0.6, color = 'rgba(74,46,43,0.18)' }) => {
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

    // Drop pool
    const count = Math.floor(80 * intensity);
    const drops = Array.from({ length: count }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      len:   8 + Math.random() * 14,
      speed: 4 + Math.random() * 6,
      opacity: 0.08 + Math.random() * 0.18,
      width:  0.6 + Math.random() * 0.8,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.1, d.y + d.len);
        ctx.strokeStyle = color.replace('0.18)', `${d.opacity})`);
        ctx.lineWidth   = d.width;
        ctx.stroke();
        d.y += d.speed;
        d.x -= d.speed * 0.08;
        if (d.y > canvas.height + d.len) {
          d.y = -d.len;
          d.x = Math.random() * canvas.width;
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  );
};

export default RainCanvas;
