import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Hash / noise helpers
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  // 4D-like distortion by rotating through a 4th dimension approximation
  vec2 distort4d(vec2 p, float t) {
    float angle = t * 0.07;
    float s = sin(angle);
    float c = cos(angle);
    // project a 4d rotation onto 2d
    vec2 q;
    q.x = p.x * c - p.y * s + sin(p.y * 0.4 + t * 0.13) * 0.3;
    q.y = p.x * s + p.y * c + cos(p.x * 0.4 + t * 0.11) * 0.3;
    return q;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 2.0 - 1.0;

    // 4D-like volumetric distortion
    vec2 dp = distort4d(p * 3.0, uTime);

    // Deep space nebula layers
    float n1 = fbm(dp + uTime * 0.04);
    float n2 = fbm(dp * 1.5 - uTime * 0.03 + vec2(5.2, 1.3));
    float n3 = fbm(dp * 0.8 + uTime * 0.02 + vec2(8.7, 2.6));

    // Nebula colours: deep blue/purple + teal + crimson wisps
    vec3 nebulaA = vec3(0.02, 0.06, 0.22) * n1 * 2.5;
    vec3 nebulaB = vec3(0.0, 0.18, 0.28) * n2 * 1.8;
    vec3 nebulaC = vec3(0.22, 0.02, 0.12) * n3 * 1.4;

    // Combine nebulae
    vec3 col = nebulaA + nebulaB + nebulaC;

    // Stardust / fine stars
    vec2 starUv = uv * 400.0;
    float star = hash(floor(starUv));
    float twinkle = 0.5 + 0.5 * sin(uTime * (2.0 + star * 5.0) + star * 6.28);
    float bright = step(0.985, star) * twinkle;
    col += vec3(bright * 0.9, bright * 0.95, bright);

    // Larger, brighter stars with soft glow
    vec2 bigStarUv = uv * 150.0;
    float bigStar = hash(floor(bigStarUv));
    float bigTwinkle = 0.4 + 0.6 * sin(uTime * (1.0 + bigStar * 3.0) + bigStar * 6.28);
    float bigBright = step(0.993, bigStar) * bigTwinkle;
    vec2 frac = fract(bigStarUv) - 0.5;
    float glow = exp(-dot(frac, frac) * 30.0) * bigBright * 2.0;
    col += vec3(glow * 0.8, glow * 0.9, glow);

    // Deep space dark base — never fully black
    col += vec3(0.005, 0.005, 0.012);

    // Vignette for cinematic depth
    float vignette = 1.0 - dot(p * 0.6, p * 0.6);
    col *= clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function SpacePlane() {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function SpaceBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none',
    }}>
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        gl={{ antialias: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <SpacePlane />
      </Canvas>
    </div>
  );
}
