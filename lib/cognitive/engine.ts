import { soundStateSwell, updateSoundscape } from "./sound";

export function setCognitiveState(state: string) {
  // Update CSS variable for visual layers
  document.documentElement.style.setProperty("--cognitive-state", state);

  // Trigger audio swell for this state
  soundStateSwell(state);

  // Sync soundscape with CSS variables
  const styles = getComputedStyle(document.documentElement);

  updateSoundscape({
    low: parseFloat(styles.getPropertyValue("--sound-low")),
    high: parseFloat(styles.getPropertyValue("--sound-high")),
    width: parseFloat(styles.getPropertyValue("--sound-width")),
    tension: parseFloat(styles.getPropertyValue("--sound-tension")),
  });
}
