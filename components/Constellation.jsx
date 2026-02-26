import { useEffect, useRef } from "react";

export default function Constellation() {
  const canvasRef = useRef(null);
  const particles = [];
  const particleCount = 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Pull reactive variables from CSS
    const getVars = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        rotation: parseFloat(styles.getPropertyValue("--constellation-rotation")),
        pulse: parseFloat(styles.getPropertyValue("--constellation-pulse")),
        spread: parseFloat(styles.getPropertyValue("--constellation-spread")),
      };
    };

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        baseX: 0,
        baseY: 0,
      });
    }

    // Animation loop
    const animate = () => {
      const { rotation, pulse, spread } = getVars();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation * 0.002 * Date.now());
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      particles.forEach((p) => {
        const driftX = (Math.random() - 0.5) * spread * 2;
        const driftY = (Math.random() - 0.5) * spread * 2;

        p.x += driftX;
        p.y += driftY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulseScale = 1 + pulse * 0.5 * Math.sin(Date.now() * 0.002);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();
      });

      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();
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
