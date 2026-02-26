export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing text" });
  }

  const trimmed = text.trim();

  // Simple heuristic “engine” — dynamic but local.
  const length = trimmed.split(/\s+/).length;
  const mentionsStuck = /stuck|blocked|lost|overwhelmed/i.test(trimmed);
  const mentionsChoice = /decision|choose|direction|path|option/i.test(trimmed);

  let primaryInsight = "You’re carrying more internally than you’ve made explicit in language.";
  if (mentionsStuck && mentionsChoice) {
    primaryInsight =
      "You feel stuck because you’re trying to choose a direction without first clarifying what you honestly want.";
  } else if (mentionsStuck) {
    primaryInsight =
      "You feel stuck because your inner state is undefined, not because you lack options.";
  } else if (mentionsChoice) {
    primaryInsight =
      "Your difficulty choosing comes from unclear priorities, not from a lack of available paths.";
  } else if (length < 8) {
    primaryInsight =
      "There’s more underneath this than you’ve written — your situation needs a fuller articulation.";
  }

  const beliefs = [
    trimmed.includes("I ") || trimmed.includes("I’m")
      ? "I am at the center of this situation."
      : "This situation is happening to me.",
    mentionsStuck ? "I’m stuck." : "Something here isn’t moving the way I want.",
    mentionsChoice ? "I need to make the right choice." : "I need things to change."
  ];

  const patterns = [
    "High internal pressure to get this right.",
    mentionsChoice
      ? "Focus on outcome instead of clarity of desire."
      : "Focus on discomfort instead of structure.",
    "Tendency to think alone instead of externalizing the problem."
  ];

  const contradictions = [
    "Wants clarity but hasn’t fully articulated the situation.",
    mentionsChoice
      ? "Wants a decision but avoids defining what a good outcome actually is."
      : "Wants change but hasn’t defined a concrete next step."
  ];

  const values = [
    "Self‑direction",
    "Coherence between inner and outer life",
    "Avoiding regret or self‑betrayal"
  ];

  const rootCause =
    "The core issue is lack of explicit internal structure — your mind is carrying a complex state that hasn’t been mapped.";

  const reframes = [
    "I don’t need the perfect answer — I need a more honest description of where I am.",
    "Clarity comes from mapping, not from forcing a decision.",
  ];

  const nextSteps = [
    "Write a fuller description of the situation in plain language.",
    "List what you actually want, even if it feels messy.",
    "Define one small, reversible step that moves you toward coherence."
  ];

  const dashboard = {
    beliefGraph: [
      "Overwhelm / tension",
      "Lack of explicit clarity",
      "Fear of wrong move",
      "Desire for self‑aligned direction"
    ],
    emotionalMap: {
      emotion: mentionsStuck ? "Overwhelm" : "Tension",
      intensity: length > 30 ? "High" : "Medium",
      tone: mentionsChoice ? "Uncertain about direction" : "Unresolved pressure"
    },
    contradictionsPanel: contradictions,
    actionsPanel: nextSteps
  };

  const mindMap = {
    nodes: [
      "Overwhelm",
      "Lack of clarity",
      "Fear of wrong choice",
      "Desire for direction",
      "Need for next honest step"
    ],
    edges: [
      ["Overwhelm", "Lack of clarity"],
      ["Lack of clarity", "Fear of wrong choice"],
      ["Fear of wrong choice", "Desire for direction"],
      ["Desire for direction", "Need for next honest step"]
    ]
  };

  return res.status(200).json({
    primaryInsight,
    beliefs,
    patterns,
    contradictions,
    values,
    rootCause,
    reframes,
    nextSteps,
    dashboard,
    mindMap
  });
}
