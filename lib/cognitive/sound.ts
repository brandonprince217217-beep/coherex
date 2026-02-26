import * as Tone from "tone";

// Core reactive nodes
let pulseSynth: Tone.MembraneSynth | null = null;
let swellSynth: Tone.Synth | null = null;
let bed: Tone.Noise | null = null;
let bedFilter: Tone.Filter | null = null;
let bedGain: Tone.Gain | null = null;

let initialized = false;

export async function initSoundEngine() {
  if (initialized) return;
  initialized = true;

  await Tone.start();

  // Typing micro-pulses
  pulseSynth = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 3,
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0.0,
      release: 0.1,
    },
  }).toDestination();

  // State-triggered swells
  swellSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.2,
      decay: 0.6,
      sustain: 0.0,
      release: 0.8,
    },
  }).toDestination();

  // Continuous reactive bed
  bed = new Tone.Noise("pink");
  bedFilter = new Tone.Filter(200, "lowpass").toDestination();
  bedGain = new Tone.Gain(0.15).connect(bedFilter);

  bed.connect(bedGain);
  bed.start();
}

// Triggered on every keystroke
export function soundTypingPulse(intensity = 1) {
  if (!pulseSynth) return;

  const pitch = 40 + intensity * 20; // reacts to typing speed
  pulseSynth.triggerAttackRelease(pitch, "16n");
}

// Triggered when cognitive state changes
export function soundStateSwell(state: string) {
  if (!swellSynth) return;

  const map: Record<string, number> = {
    CREATIVE_FLOW: 440,
    BREAKTHROUGH: 660,
    INSIGHT: 520,
    EXPLORATION: 350,
    EMOTIONAL_DETACHMENT: 180,
    NEUTRAL: 260,
  };

  const freq = map[state] ?? 300;
  swellSynth.triggerAttackRelease(freq, "8n");
}

// Continuous bed reacts to CSS variables
export function updateSoundscape(vars: {
  low: number;
  high: number;
  width: number;
  tension: number;
}) {
  if (!bedFilter || !bedGain) return;

  const { low, high, width, tension } = vars;

  // Low frequencies deepen
  bedFilter.frequency.value = 100 + low * 300;

  // High frequencies brighten
  bedFilter.Q.value = high * 10;

  // Stereo width (Tone.js auto-handles)
  Tone.Destination.channelCount = 2;

  // Tension tightens the envelope
  bedGain.gain.value = 0.1 + tension * 0.1;
}
