import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei";

// Simple sphere brain-like placeholder. For full realism, replace with a brain GLTF/GLB model using drei's <Suspense> and <useGLTF> if desired.
function BrainMesh() {
  const mesh = useRef<any>();
  // Animate slight breathing effect
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.scale.x = 1 + Math.sin(clock.getElapsedTime()) * 0.04;
      mesh.current.scale.y = 1 + Math.cos(clock.getElapsedTime() * 0.9) * 0.04;
    }
  });
  return (
    <mesh ref={mesh} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1.7, 64, 64]} />
      <MeshDistortMaterial
        distort={0.47}
        speed={2}
        color="#e6e7ec"
        roughness={0.36}
        metalness={0.15}
        transparent={true}
        opacity={0.97}
      />
    </mesh>
  );
}

export default function BrainBackground() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 0,
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, #0a0a14 70%, #24244a 100%)",
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 9, 5]} intensity={0.7} />
        <Suspense fallback={null}>
          <BrainMesh />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI/1.6} minPolarAngle={Math.PI/2.6} />
      </Canvas>
    </div>
  );
}
