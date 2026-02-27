// Core parameter types for each visual/sensory subsystem of the Coherex field

export type NebulaParams = {
  brightness: number;
  motionSpeed: number;
  contrast: number;
  warmth: number;
};

export type ConstellationParams = {
  rotationSpeed: number;
  pulseIntensity: number;
  spread: number;
  symmetry: number;
};

export type VortexParams = {
  intensity: number;
  turbulence: number;
  depth: number;
};

export type GlowParams = {
  strength: number;
  colorShift: number;
  pulseSpeed: number;
};

export type SoundParams = {
  reverb: number;
  bass: number;
  clarity: number;
};

// This MUST be exported exactly like this.
// environment.ts imports this type.
export type EnvironmentParams = {
  nebula: NebulaParams;
  constellation: ConstellationParams;
  vortex: VortexParams;
  glow: GlowParams;
  sound: SoundParams;
};
