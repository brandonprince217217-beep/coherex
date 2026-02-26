import { CognitiveState } from './states';
import { ENV_PRESETS, EnvironmentParams } from './environment';

let currentState: CognitiveState = 'NEUTRAL';

export function setCognitiveState(next: CognitiveState) {
  currentState = next;
  const env = ENV_PRESETS[next];
  applyEnvironment(env);
}

function applyEnvironment(env: EnvironmentParams) {
  // Example: connect to CSS variables
  document.documentElement.style.setProperty('--nebula-brightness', env.nebula.brightness.toString());
}
