import { CognitiveState } from './states';

export interface EnvironmentParams {
  nebula: { brightness: number; motionSpeed: number; contrast: number; warmth: number };
  constellation: { rotationSpeed: number; pulseIntensity: number; spread: number; symmetry: number };
  vortex: { energy: number; branching: number; stability: number };
  glow: { thickness: number; softness: number; breathing: number };
  sound: { lowFreq: number; highFreq: number; width: number; tension: number };
}

export const ENV_PRESETS: Record<CognitiveState, EnvironmentParams> = {
  NEUTRAL: {
    nebula: { brightness: 0.5, motionSpeed: 0.4, contrast: 0.5, warmth: 0.5 },
    constellation: { rotationSpeed: 0.4, pulseIntensity: 0.1, spread: 0.5, symmetry: 0.5 },
    vortex: { energy: 0.3, branching: 0.1, stability: 0.8 },
    glow: { thickness: 0.4, softness: 0.6, breathing: 0.5 },
    sound: { lowFreq: 0.4, highFreq: 0.2, width: 0.4, tension: 0.2 },
  },
};
