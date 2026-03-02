import { useEffect, useRef } from "react";

export default function Constellation() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  const particleCount = 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const getVars = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        rotation: parseFloat(styles.getPropertyValue("--constellation-rotation")) || 0,
        pulse: parseFloat(styles.getPropertyValue("--constellation-pulse")) || 0,
        spread: parseFloat(styles.getPropertyValue("--constellation-spread")) || 0,
      };
    };

    if (particlesRef.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
        });
      }
    }

    const animate = (time) => {
      const { rotation, pulse, spread } = getVars();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation * 0.0002 * time);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      particlesRef.current.forEach((p) => {
        p.x += (Math.random() - 0.5) * spread * 2;
        p.y += (Math.random() - 0.5) * spread * 2;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulseScale = 1 + pulse * 0.5 * Math.sin(time * 0.002);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
