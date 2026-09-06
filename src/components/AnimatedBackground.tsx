import { useEffect, useRef } from 'react';

// A quiet, tech-styled animated background: a drifting network of glowing
// nodes with connecting lines, reminiscent of data flow / software systems.
// Rendered as a fixed full-viewport canvas so it reads as a subtle "live"
// backdrop behind the site content without using any stock video/imagery.
export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    interface Node { x: number; y: number; vx: number; vy: number; }

    function makeNodes(): Node[] {
      const count = Math.max(28, Math.min(80, Math.floor((width * height) / 24000)));
      return Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    let nodes = makeNodes();
    let raf = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
      nodes = makeNodes();
    }
    window.addEventListener('resize', resize);

    function tick() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = '#050810';
      ctx.fillRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = 'rgba(91,147,255,' + (0.14 * (1 - dist / 150)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = 'rgba(120,163,255,0.65)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-70 pointer-events-none" aria-hidden="true" />;
}
