import { NextApiRequest, NextApiResponse } from 'next';

type MindState = 'confused' | 'comparing' | 'ready_to_act' | 'curious' | 'neutral';

interface MindEvent {
  type: string;
  target?: string;
  depth?: number;
  section?: string;
  dwellMs?: number;
  ts: number;
}

interface InferRequest {
  recentEvents?: MindEvent[];
  context?: { path?: string; referrer?: string };
  localInference?: { mindState: MindState; confidence: number; intents: string[] };
}

interface InferResponse {
  mindState: MindState;
  confidence: number;
  intents: string[];
}

function heuristicInfer(body: InferRequest): InferResponse {
  const events = body.recentEvents ?? [];

  const clicks = events.filter(e => e.type === 'click').length;
  const scrollEvents = events.filter(e => e.type === 'scroll');
  const hesitations = events.filter(e => e.type === 'hesitation').length;
  const maxDepth = scrollEvents.reduce((max, e) => Math.max(max, e.depth ?? 0), 0);
  const sectionExits = events.filter(e => e.type === 'section_exit');
  const avgDwell =
    sectionExits.length
      ? sectionExits.reduce((s, e) => s + (e.dwellMs ?? 0), 0) / sectionExits.length
      : 0;

  if (hesitations >= 3 || (clicks > 5 && maxDepth < 25)) {
    return { mindState: 'confused', confidence: 0.7, intents: ['needs_clarity'] };
  }

  if (maxDepth >= 75 || (clicks >= 5 && maxDepth >= 50)) {
    if (avgDwell > 5000 || clicks >= 7) {
      return { mindState: 'ready_to_act', confidence: 0.78, intents: ['converting'] };
    }
    return { mindState: 'comparing', confidence: 0.7, intents: ['evaluating', 'comparing_options'] };
  }

  if (maxDepth >= 30 || events.length >= 6 || avgDwell > 2000) {
    return { mindState: 'curious', confidence: 0.62, intents: ['exploring'] };
  }

  if (body.localInference) {
    return body.localInference;
  }

  return { mindState: 'neutral', confidence: 0.5, intents: [] };
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const result = heuristicInfer(req.body as InferRequest);
  return res.status(200).json(result);
}
