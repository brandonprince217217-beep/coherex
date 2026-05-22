import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function BrainModel() {
  const group = useRef<any>();
  const { scene } = useGLTF("/models/brain.glb");

  // Gentle breathing animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.03;
      group.current.scale.set(scale, scale, scale);
      group.current.rotation.y = t * 0.15;
    }
  });

  return <primitive ref={group} object={scene} position={[0, 0, 0]} />;
}

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
        <React.Suspense fallback={null}>
          <BrainModel />
        </React.Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

// Required for GLTF loading
useGLTF.preload("/models/brain.glb");
