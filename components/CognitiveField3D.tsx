import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  intensity: number; // 0–1
  breakthrough: number; // 0–1
};

export default function CognitiveField3D({ intensity, breakthrough }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uniformsRef = useRef<any>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0.2 },
      uBreakthrough: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        varying vec2 vUv;
        uniform float uTime;
        uniform float uIntensity;
        uniform float uBreakthrough;
        uniform vec2 uResolution;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);

          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));

          vec2 u = f * f * (3.0 - 2.0 * f);

          return mix(a, b, u.x) +
                 (c - a) * u.y * (1.0 - u.x) +
                 (d - b) * u.x * u.y;
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = (uv - 0.5) * 2.0;

          float t = uTime * (0.15 + uIntensity * 0.6);

          float baseScale = mix(1.5, 3.5, uIntensity);
          float n1 = noise(p * baseScale + t);
          float n2 = noise(p * (baseScale * 0.7) - t * 0.6);
          float n3 = noise(p * (baseScale * 1.3) + t * 1.2);

          float field = (n1 * 0.6 + n2 * 0.3 + n3 * 0.5);

          float radial = length(p);
          float vignette = smoothstep(1.4, 0.4, radial);

          float warm = smoothstep(0.3, 0.9, uIntensity);
          float cool = 1.0 - warm;

          vec3 coolColor = vec3(0.10, 0.18, 0.35);
          vec3 midColor  = vec3(0.10, 0.35, 0.55);
          vec3 warmColor = vec3(0.55, 0.18, 0.40);

          vec3 base = mix(coolColor, midColor, field);
          base = mix(base, warmColor, warm * field);

          float glow = smoothstep(0.6, 1.0, field) * (0.3 + uIntensity * 0.7);
          vec3 glowColor = mix(vec3(0.4, 0.7, 1.0), vec3(1.0, 0.5, 0.8), warm);
          base += glowColor * glow * 0.6;

          float pulse = sin(uTime * 2.5) * 0.5 + 0.5;
          float breakthroughWave = uBreakthrough * pulse;
          base += vec3(1.0, 0.9, 0.8) * breakthroughWave * 0.35;

          base *= vignette;

          float brightness = 0.6 + uIntensity * 0.4;
          base *= brightness;

          gl_FragColor = vec4(base, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId: number;
    const animate = (time: number) => {
      uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!uniformsRef.current) return;
    uniformsRef.current.uIntensity.value = Math.min(
      1,
      Math.max(0, intensity || 0)
    );
    uniformsRef.current.uBreakthrough.value = Math.min(
      1,
      Math.max(0, breakthrough || 0)
    );
  }, [intensity, breakthrough]);

  return (
    <canvas
      ref={canvasRef}
      className="cognitive-field-3d"
      aria-hidden="true"
    />
  );
}
