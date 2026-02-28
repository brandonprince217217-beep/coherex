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

export type EnvironmentParams = {
  nebula: NebulaParams;
  constellation: ConstellationParams;
  vortex: VortexParams;
  glow: GlowParams;
  sound: SoundParams;
};

export type CognitiveAnalysis = {
  coreBelief: string;
  impliedMeaning: string;
  emotionalTone: string;
  emotionalIntensity: number;
  coreNeed: string;
  hiddenAssumptions: string[];
  contradictions: string[];
  breakthroughLikelihood: number;
  identityShift: string;
  nextQuestion: string;
  beliefGraph: any;
  summary: string;
  insights: string[];
  confidence: number;
};
