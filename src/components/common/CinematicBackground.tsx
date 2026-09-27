import React, { useEffect, useRef } from 'react';

export const CinematicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle floating dust/light particles
    const particleCount = Math.min(width > 768 ? 45 : 20, 50);
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3 - 0.1,
      alpha: Math.random() * 0.5 + 0.15,
      color: Math.random() > 0.6 ? '#65E6EA' : Math.random() > 0.3 ? '#8B7CFF' : '#FFFFFF',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle particle specks
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep atmospheric base */}
      <div className="absolute inset-0 bg-[#080B0D]" />

      {/* Slow-moving blurred cyan orb */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-20 bg-gradient-to-br from-[#65E6EA] to-transparent animate-orb-1"
      />

      {/* Slow-moving blurred electric purple & magenta orb */}
      <div
        className="absolute top-[45%] -right-[15%] w-[750px] h-[750px] rounded-full blur-[160px] opacity-25 bg-gradient-to-bl from-[#8B7CFF] via-[#C56CFF] to-transparent animate-orb-2"
      />

      {/* Deep subtle bottom center cyan accent */}
      <div
        className="absolute -bottom-[20%] left-[25%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 bg-[#65E6EA]"
      />

      {/* Subtle fine digital grid mesh */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Canvas for cinematic floating motes */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Cinematic Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(8, 11, 13, 0.85) 95%)',
        }}
      />
    </div>
  );
};
