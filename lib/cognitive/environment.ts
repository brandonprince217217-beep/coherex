import { CognitiveState } from "./states";
import { EnvironmentParams } from "./model";

// Allow missing presets (so you don't need every CognitiveState defined here yet)
export const ENV_PRESETS: Partial<Record<CognitiveState, EnvironmentParams>> = {
  NEUTRAL: {
    nebula: {
      brightness: 0.5,
      motionSpeed: 0.4,
      contrast: 0.5,
      warmth: 0.5,
    },
    constellation: {
      rotationSpeed: 0.4,
      pulseIntensity: 0.1,
      spread: 0.5,
      symmetry: 0.5,
    },
    vortex: {
      intensity: 0.3,
      turbulence: 0.4,
      depth: 0.5,
    },
    glow: {
      strength: 0.4,
      colorShift: 0.5,
      pulseSpeed: 0.3,
    },
    sound: {
      reverb: 0.3,
      bass: 0.4,
      clarity: 0.5,
    },
  },
};

/**
 * Always returns an EnvironmentParams.
 * If a state preset doesn't exist yet, it falls back to NEUTRAL.
 */
export function getEnvironmentPreset(state: CognitiveState): EnvironmentParams {
  const neutral = ENV_PRESETS.NEUTRAL;
  if (!neutral) {
    throw new Error("ENV_PRESETS.NEUTRAL is required as a fallback preset.");
  }
  return ENV_PRESETS[state] ?? neutral;
}