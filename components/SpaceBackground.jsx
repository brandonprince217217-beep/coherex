import { useEffect, useRef, useState } from 'react';

// ── Shaders ──────────────────────────────────────────────────────────────────

const VS_BG = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FS_BG = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;

void main() {
  float y = v_uv.y;
  const float WATER = 0.38;

  vec3 nightTop    = vec3(0.01, 0.03, 0.13);
  vec3 duskHorizon = vec3(0.07, 0.12, 0.30);
  vec3 glowColor   = vec3(0.48, 0.26, 0.07);
  vec3 waterBase   = vec3(0.02, 0.07, 0.11);

  if (y >= WATER) {
    float t   = (y - WATER) / (1.0 - WATER);
    vec3 sky  = mix(duskHorizon, nightTop, pow(t, 0.6));
    float glow = exp(-abs(y - WATER) * 11.0);
    sky += glowColor * glow * 0.28;
    gl_FragColor = vec4(sky, 1.0);
  } else {
    float t = y / WATER;
    float r = sin(v_uv.x * 18.0 + u_time * 1.8) * 0.013
            + sin(v_uv.x * 32.0 - u_time * 2.4 + v_uv.y * 5.0) * 0.007;
    float reflT  = clamp(((1.0 - t) * r + WATER * 0.01) / (1.0 - WATER), 0.0, 1.0);
    vec3 reflSky = mix(duskHorizon, nightTop, pow(reflT, 0.6));
    vec3 water   = mix(waterBase, reflSky, 0.28 * t * t + 0.05);
    float glow   = exp(-abs(y - WATER) * 14.0);
    water += glowColor * glow * 0.10;
    gl_FragColor = vec4(water, 1.0);
  }
}`;

const VS_BIRD = `
attribute vec2 a_pos;
uniform vec2 u_bird;
uniform vec2 u_scale;
uniform mat2 u_rot;
void main() {
  vec2 p = u_rot * (a_pos * u_scale) + u_bird;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FS_BIRD = `
precision mediump float;
void main() {
  gl_FragColor = vec4(0.0, 0.02, 0.06, 0.90);
}`;

// ── WebGL helpers ─────────────────────────────────────────────────────────────

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('[SpaceBackground] shader error:', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function createProgram(gl, vsSrc, fsSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('[SpaceBackground] program link error:', gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

// ── Bird geometry ─────────────────────────────────────────────────────────────
// Two triangles forming a "W" wing silhouette in local space (normalised ≈ ±1).
// flapY: y-position of the wing tips (positive = up).
function birdVerts(flapY) {
  return new Float32Array([
    // left wing
    -1.0,  flapY,   -0.35, -0.20,   0.0,  0.0,
    // right wing
     0.0,  0.0,      0.35, -0.20,   1.0,  flapY,
  ]);
}

// ── Boid initialisation ───────────────────────────────────────────────────────
const NUM_BIRDS  = 14;
const WATER_CLIP = 0.38 * 2.0 - 1.0; // UV water-line → clip-space y

function initBirds() {
  return Array.from({ length: NUM_BIRDS }, () => {
    const dir = Math.random() < 0.5 ? 1 : -1;
    return {
      x:         (Math.random() * 2 - 1) * 0.92,
      y:         WATER_CLIP + 0.15 + Math.random() * (0.80 - WATER_CLIP),
      vx:        dir * (0.005 + Math.random() * 0.006),
      vy:        (Math.random() - 0.5) * 0.001,
      flapSpeed: 1.6 + Math.random() * 2.4,
      flapPhase: Math.random() * Math.PI * 2,
      scale:     0.018 + Math.random() * 0.014,
    };
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

const FALLBACK_STYLE = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100vw', height: '100vh',
  zIndex: -1,
  pointerEvents: 'none',
  background: 'radial-gradient(ellipse at 20% 50%, rgba(0,20,60,0.8) 0%, rgba(2,6,23,1) 60%)',
  backgroundColor: '#020617',
};

export default function SpaceBackground() {
  const canvasRef   = useRef(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      setUseFallback(true);
      return;
    }

    // Resize handler
    const resize = () => {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    // Build shader programs
    const bgProg   = createProgram(gl, VS_BG,   FS_BG);
    const birdProg = createProgram(gl, VS_BIRD,  FS_BIRD);
    if (!bgProg || !birdProg) { setUseFallback(true); return; }

    window.addEventListener('resize', resize);

    // Background quad (two triangles covering clip space)
    const bgBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bgBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,   1, -1,  -1,  1,
       1, -1,   1,  1,  -1,  1,
    ]), gl.STATIC_DRAW);

    // Bird buffer (reused each frame with DYNAMIC_DRAW)
    const birdBuf = gl.createBuffer();

    // Cache uniform / attribute locations
    const bgA  = gl.getAttribLocation(bgProg,   'a_pos');
    const bgUT = gl.getUniformLocation(bgProg,  'u_time');

    const bA   = gl.getAttribLocation(birdProg, 'a_pos');
    const bUB  = gl.getUniformLocation(birdProg, 'u_bird');
    const bUS  = gl.getUniformLocation(birdProg, 'u_scale');
    const bUR  = gl.getUniformLocation(birdProg, 'u_rot');

    const birds   = initBirds();
    const start   = performance.now();
    let raf;

    function updateBirds() {
      const skyBottom = WATER_CLIP + 0.10;
      const skyTop    = 0.90;
      for (const b of birds) {
        // Soft vertical steering to keep birds inside sky band
        if (b.y < skyBottom + 0.08) b.vy += 0.0004;
        if (b.y > skyTop   - 0.08) b.vy -= 0.0004;
        b.vy = Math.max(-0.002, Math.min(0.002, b.vy));

        b.x += b.vx;
        b.y += b.vy;

        // Wrap horizontally
        if (b.x >  1.08) b.x = -1.08;
        if (b.x < -1.08) b.x =  1.08;
        b.y = Math.max(skyBottom, Math.min(skyTop, b.y));
      }
    }

    function render() {
      const now = performance.now();
      const t   = (now - start) / 1000;

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // ── Background ──────────────────────────────────────────────────────────
      gl.useProgram(bgProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, bgBuf);
      gl.enableVertexAttribArray(bgA);
      gl.vertexAttribPointer(bgA, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(bgUT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // ── Birds ───────────────────────────────────────────────────────────────
      updateBirds();
      gl.useProgram(birdProg);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindBuffer(gl.ARRAY_BUFFER, birdBuf);
      gl.enableVertexAttribArray(bA);
      gl.vertexAttribPointer(bA, 2, gl.FLOAT, false, 0, 0);

      const aspect = canvas.width / canvas.height;
      for (const b of birds) {
        const flapY = Math.sin(t * b.flapSpeed + b.flapPhase) * 0.45;
        gl.bufferData(gl.ARRAY_BUFFER, birdVerts(flapY), gl.DYNAMIC_DRAW);

        gl.uniform2f(bUS, b.scale / aspect, b.scale);
        const ang = Math.atan2(b.vy, b.vx);
        const c   = Math.cos(ang), s = Math.sin(ang);
        gl.uniformMatrix2fv(bUR, false, [c, s, -s, c]);
        gl.uniform2f(bUB, b.x, b.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      gl.disable(gl.BLEND);

      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(bgBuf);
      gl.deleteBuffer(birdBuf);
      gl.deleteProgram(bgProg);
      gl.deleteProgram(birdProg);
    };
  }, []);

  if (useFallback) {
    return <div style={FALLBACK_STYLE} />;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
