import React, { useEffect, useRef } from 'react';

/**
 * SakuraPetalsCanvas — Drifting sakura petal particles at 60fps.
 * Soft pink petals that rotate, drift, and sway gently.
 */
const SakuraPetalsCanvas = ({ intensity = 0.8 }) => {
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

    const count = Math.floor(35 * intensity);
    const colors = ['#F4B5C6', '#FFB7C5', '#FADADD', '#F9C3C3', '#FFC0CB'];

    const petals = Array.from({ length: count }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       Math.random() * window.innerHeight,
      size:    5 + Math.random() * 8,
      speed:   0.8 + Math.random() * 1.4,
      sway:    Math.random() * Math.PI * 2,
      swaySpd: 0.015 + Math.random() * 0.025,
      rot:     Math.random() * Math.PI * 2,
      rotSpd:  (Math.random() - 0.5) * 0.04,
      opacity: 0.55 + Math.random() * 0.4,
      color:   colors[Math.floor(Math.random() * colors.length)],
    }));

    // Draw a simple petal shape
    const drawPetal = (ctx, x, y, size, rot, color, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.5, size, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      // Stroke for definition
      ctx.strokeStyle = '#F4B5C6';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.sway  += p.swaySpd;
        p.rot   += p.rotSpd;
        p.y     += p.speed;
        p.x     += Math.sin(p.sway) * 0.9;
        drawPetal(ctx, p.x, p.y, p.size, p.rot, p.color, p.opacity);

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
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

export default SakuraPetalsCanvas;
