import React, { useEffect, useRef } from 'react';

/**
 * FirefliesCanvas — Warm amber glowing firefly particles that float
 * upward and pulse gently. Great for cozy night/forest vibes.
 */
const FirefliesCanvas = ({ intensity = 0.7 }) => {
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

    const count = Math.floor(28 * intensity);
    const flies = Array.from({ length: count }, () => ({
      x:        Math.random() * window.innerWidth,
      y:        Math.random() * window.innerHeight,
      r:        2 + Math.random() * 3,
      speedY:   -(0.3 + Math.random() * 0.6),
      sway:     Math.random() * Math.PI * 2,
      swaySpd:  0.012 + Math.random() * 0.02,
      phase:    Math.random() * Math.PI * 2,
      phaseSpd: 0.04 + Math.random() * 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flies.forEach((f) => {
        f.sway  += f.swaySpd;
        f.phase += f.phaseSpd;
        f.y     += f.speedY;
        f.x     += Math.sin(f.sway) * 0.5;

        const glow   = Math.abs(Math.sin(f.phase));
        const alpha  = 0.3 + glow * 0.65;
        const radius = f.r + glow * 2;

        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius * 3);
        grad.addColorStop(0,   `rgba(233, 196, 106, ${alpha})`);
        grad.addColorStop(0.4, `rgba(248, 176, 136, ${alpha * 0.5})`);
        grad.addColorStop(1,   'rgba(233, 196, 106, 0)');

        ctx.beginPath();
        ctx.arc(f.x, f.y, radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 180, ${alpha})`;
        ctx.fill();

        if (f.y < -20) {
          f.y = canvas.height + 20;
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

export default FirefliesCanvas;
