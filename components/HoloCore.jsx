import { useEffect, useRef } from "react";

export default function HoloCore() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const getVars = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        pulse: parseFloat(styles.getPropertyValue("--global-pulse")),
        tension: parseFloat(styles.getPropertyValue("--sound-tension")),
        rotation: parseFloat(styles.getPropertyValue("--global-rotation")),
        brightness: parseFloat(styles.getPropertyValue("--nebula-brightness")),
      };
    };

    const animate = () => {
      const { pulse, tension, rotation, brightness } = getVars();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const radius = 80 + pulse * 40;
      const glow = 0.2 + tension * 0.4;

      const gradient = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      gradient.addColorStop(0, `rgba(0, 200, 255, ${0.35 + glow})`);
      gradient.addColorStop(0.5, `rgba(0, 120, 255, ${0.15 + glow * 0.5})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      const ringRadius = radius + 20 + tension * 20;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 180, 255, ${0.25 + glow})`;
      ctx.lineWidth = 2 + pulse * 2;
      ctx.stroke();

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
        zIndex: 3,
      }}
    />
  );
}
