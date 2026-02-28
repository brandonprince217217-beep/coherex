import { useEffect, useRef } from "react";

export default function Vortex() {
  const canvasRef = useRef(null);
  const tendrils = [];
  const tendrilCount = 8;

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
      };
    };

    for (let i = 0; i < tendrilCount; i++) {
      tendrils.push({
        angle: (Math.PI * 2 * i) / tendrilCount,
        radius: 120 + Math.random() * 80,
        width: 1.5 + Math.random() * 1.5,
        speed: 0.001 + Math.random() * 0.002,
      });
    }

    const animate = () => {
      const { pulse, tension, rotation } = getVars();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      tendrils.forEach((t) => {
        t.angle += t.speed + tension * 0.002;

        const x = Math.cos(t.angle) * (t.radius + pulse * 40);
        const y = Math.sin(t.angle) * (t.radius + pulse * 40);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);

        ctx.strokeStyle = `rgba(0, 180, 255, ${0.15 + tension * 0.2})`;
        ctx.lineWidth = t.width + pulse * 0.5;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        zIndex: 2,
      }}
    />
  );
}
