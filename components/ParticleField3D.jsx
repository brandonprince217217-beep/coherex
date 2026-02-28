import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 220;
const SPREAD = 60;
const CONNECTION_DISTANCE = 14;
const MAX_CONNECTIONS = 3;

export default function ParticleField3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 70;

    // ── Particles ──────────────────────────────────────────────
    const positions = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        (Math.random() - 0.5) * SPREAD,
        (Math.random() - 0.5) * SPREAD,
        (Math.random() - 0.5) * SPREAD
      );
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x00b4ff,
      size: 0.55,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(particleGeo, particleMat);
    scene.add(points);

    // ── Connection Lines ───────────────────────────────────────
    const lineGeo = new THREE.BufferGeometry();
    // Pre-allocate a generous float buffer; we'll update it each frame
    const maxLines = PARTICLE_COUNT * MAX_CONNECTIONS;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0080ff,
      transparent: true,
      opacity: 0.22,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ─────────────────────────────────────────
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      points.rotation.y += 0.0008;
      points.rotation.x += 0.0003;
      lines.rotation.y = points.rotation.y;
      lines.rotation.x = points.rotation.x;

      // Rebuild connections
      const pos = particleGeo.attributes.position.array;
      let lineIdx = 0;
      const lp = lineGeo.attributes.position.array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let connections = 0;
        const ix = pos[i * 3], iy = pos[i * 3 + 1], iz = pos[i * 3 + 2];

        for (let j = i + 1; j < PARTICLE_COUNT && connections < MAX_CONNECTIONS; j++) {
          const jx = pos[j * 3], jy = pos[j * 3 + 1], jz = pos[j * 3 + 2];
          const dx = ix - jx, dy = iy - jy, dz = iz - jz;
          if (dx * dx + dy * dy + dz * dz < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            if (lineIdx + 6 <= lp.length) {
              lp[lineIdx++] = ix; lp[lineIdx++] = iy; lp[lineIdx++] = iz;
              lp[lineIdx++] = jx; lp[lineIdx++] = jy; lp[lineIdx++] = jz;
              connections++;
            }
          }
        }
      }

      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx / 3);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      particleGeo.dispose();
      lineGeo.dispose();
      particleMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
