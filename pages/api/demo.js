export default function handler(req, res) {
  const q = req.query.q || "";

  const answer = `
🔍 **Search Results for:** "${q}"

Here’s a structured breakdown based on your query:

• Key Insight:
  "${q}" is a topic people search when they want clarity, structure, or deeper understanding.

• What it means:
  This concept usually connects to decision‑making, mental models, and cognitive precision.

• Why it matters:
  People want to reduce confusion, think clearly, and make better choices.

• Next Steps:
  Try asking:
  - "Explain this step‑by‑step"
  - "Give me a mental model for this"
  - "Break this down simply"
  - "Show me the core principles"

Coherex Demo is running in lightweight mode — full intelligence unlocks with Pro.
`;

  res.status(200).json({ answer });
}
