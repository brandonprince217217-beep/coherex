import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function BrainBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at center, #0a0a14 70%, #24244a 100%)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 6, 5]} intensity={1.2} />

        {/* Removed BrainModel completely */}

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
