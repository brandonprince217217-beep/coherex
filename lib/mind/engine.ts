/**
 * Mind Engine — adaptive personalization client
 *
 * Tracks on-site behavioral signals, infers a "mind state", and updates
 * page content/ordering/CTA text in real time. Does not add a chat UI.
 *
 * Supported states: confused | comparing | ready_to_act | curious | neutral
 */

type MindState = 'confused' | 'comparing' | 'ready_to_act' | 'curious' | 'neutral';

interface MindEvent {
  type: 'click' | 'scroll' | 'hesitation' | 'section_entry' | 'section_exit';
  target?: string;
  depth?: number;
  section?: string;
  dwellMs?: number;
  ts: number;
}

interface InferResponse {
  mindState: MindState;
  confidence: number;
  intents: string[];
}

const MAX_EVENTS = 50;
const INFER_INTERVAL_MS = 5000;
const HESITATION_WINDOW_MS = 1000;
const MAX_HESITATION_POSITIONS = 10;

const HEADLINE_COPY: Record<MindState, string> = {
  confused: "Let's make this clearer for you.",
  comparing: 'See how Coherex stands apart.',
  ready_to_act: "You're ready — let's begin.",
  curious: 'Discover what Coherex can unlock.',
  neutral: 'Coherex',
};

const CTA_COPY: Record<MindState, string> = {
  confused: 'Show me how it works',
  comparing: 'Compare your options',
  ready_to_act: 'Get started now',
  curious: 'Explore features',
  neutral: 'Search',
};

// Block priority order per state — matches data-block-id values
const BLOCK_ORDER: Record<MindState, string[]> = {
  confused: ['intro', 'how', 'faq'],
  comparing: ['compare', 'pricing', 'features'],
  ready_to_act: ['cta', 'pricing', 'social_proof'],
  curious: ['features', 'demo', 'about'],
  neutral: [],
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let _events: MindEvent[] = [];
let _inferTimer: ReturnType<typeof setInterval> | null = null;
let _sectionEntryTimes: Record<string, number> = {};
let _debugBadge: HTMLElement | null = null;

function pushEvent(event: MindEvent): void {
  _events.push(event);
  if (_events.length > MAX_EVENTS) {
    _events = _events.slice(-MAX_EVENTS);
  }
}

// ---------------------------------------------------------------------------
// Local deterministic fallback inference
// ---------------------------------------------------------------------------
function localInfer(events: MindEvent[]): InferResponse {
  const clicks = events.filter(e => e.type === 'click').length;
  const scrollEvents = events.filter(e => e.type === 'scroll');
  const hesitations = events.filter(e => e.type === 'hesitation').length;
  const maxDepth = scrollEvents.reduce((max, e) => Math.max(max, e.depth ?? 0), 0);

  if (hesitations >= 3 || (clicks > 5 && maxDepth < 30)) {
    return { mindState: 'confused', confidence: 0.65, intents: ['needs_clarity'] };
  }
  if (maxDepth >= 75 || (clicks >= 5 && maxDepth >= 50)) {
    if (clicks >= 7) {
      return { mindState: 'ready_to_act', confidence: 0.75, intents: ['converting'] };
    }
    return { mindState: 'comparing', confidence: 0.7, intents: ['evaluating'] };
  }
  if (maxDepth >= 30 || events.length >= 6) {
    return { mindState: 'curious', confidence: 0.6, intents: ['exploring'] };
  }
  return { mindState: 'neutral', confidence: 0.5, intents: [] };
}

// ---------------------------------------------------------------------------
// DOM updates
// ---------------------------------------------------------------------------
function applyState(result: InferResponse): void {
  document.documentElement.setAttribute('data-mind-state', result.mindState);

  // Update headline elements
  document.querySelectorAll('[data-mind-role="headline"]').forEach(el => {
    if (!el.getAttribute('data-mind-default')) {
      el.setAttribute('data-mind-default', el.textContent ?? '');
    }
    el.textContent = HEADLINE_COPY[result.mindState];
  });

  // Update CTA elements
  document.querySelectorAll('[data-mind-role="cta"]').forEach(el => {
    if (!el.getAttribute('data-mind-default')) {
      el.setAttribute('data-mind-default', el.textContent ?? '');
    }
    el.textContent = CTA_COPY[result.mindState];
  });

  // Reorder block containers
  const blocksContainer = document.querySelector('[data-mind-role="blocks"]');
  if (blocksContainer) {
    const order = BLOCK_ORDER[result.mindState];
    if (order.length > 0) {
      const blocks = Array.from(
        blocksContainer.querySelectorAll('[data-block-id]')
      ) as HTMLElement[];
      if (blocks.length > 1) {
        const sorted = [...blocks].sort((a, b) => {
          const idA = a.getAttribute('data-block-id') ?? '';
          const idB = b.getAttribute('data-block-id') ?? '';
          const iA = order.indexOf(idA);
          const iB = order.indexOf(idB);
          if (iA === -1 && iB === -1) return 0;
          if (iA === -1) return 1;
          if (iB === -1) return -1;
          return iA - iB;
        });
        sorted.forEach(block => blocksContainer.appendChild(block));
      }
    }
  }

  // Update debug badge
  if (_debugBadge) {
    _debugBadge.textContent = `mind: ${result.mindState} (${Math.round(
      result.confidence * 100
    )}%) | ${result.intents.join(', ') || 'none'}`;
  }
}

// ---------------------------------------------------------------------------
// Inference loop
// ---------------------------------------------------------------------------
async function runInference(): Promise<void> {
  const payload = {
    recentEvents: _events.slice(-20),
    context: {
      path: window.location.pathname,
      referrer: document.referrer,
    },
    localInference: localInfer(_events),
  };

  try {
    const resp = await fetch('/api/mind/infer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const result: InferResponse = await resp.json();
    applyState(result);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[mind-engine] inference request failed, using local fallback:', err);
    }
    applyState(localInfer(_events));
  }
}

// ---------------------------------------------------------------------------
// Signal trackers
// ---------------------------------------------------------------------------
function setupClickTracking(): void {
  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const label =
      target.getAttribute('data-mind-label') ||
      target.textContent?.trim().slice(0, 40) ||
      target.tagName.toLowerCase();
    pushEvent({ type: 'click', target: label, ts: Date.now() });
  });
}

function setupScrollTracking(): void {
  const MILESTONES = [25, 50, 75, 90, 100];
  let lastDepth = 0;

  window.addEventListener(
    'scroll',
    () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth =
        docHeight > 0 ? Math.round((window.scrollY / docHeight) * 100) : 0;
      const hit = MILESTONES.find(m => depth >= m && lastDepth < m);
      if (hit !== undefined) {
        lastDepth = hit;
        pushEvent({ type: 'scroll', depth: hit, ts: Date.now() });
      }
    },
    { passive: true }
  );
}

function setupHesitationTracking(): void {
  type Point = { x: number; y: number; t: number };
  let positions: Point[] = [];

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    positions.push({ x: e.clientX, y: e.clientY, t: now });
    // Keep only recent positions within the sliding window
    positions = positions
      .filter(p => now - p.t < HESITATION_WINDOW_MS)
      .slice(-MAX_HESITATION_POSITIONS);

    if (positions.length >= 5) {
      let dirChanges = 0;
      for (let i = 2; i < positions.length; i++) {
        const dx1 = positions[i - 1].x - positions[i - 2].x;
        const dx2 = positions[i].x - positions[i - 1].x;
        const dy1 = positions[i - 1].y - positions[i - 2].y;
        const dy2 = positions[i].y - positions[i - 1].y;
        if (dx1 * dx2 < 0 || dy1 * dy2 < 0) dirChanges++;
      }
      if (dirChanges >= 3) {
        pushEvent({ type: 'hesitation', ts: now });
        positions = []; // reset to avoid repeated triggers
      }
    }
  });
}

function setupSectionTracking(): void {
  const sections = document.querySelectorAll('[data-mind-section]');
  if (!sections.length || typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const section =
          (entry.target as HTMLElement).getAttribute('data-mind-section') ?? 'unknown';
        if (entry.isIntersecting) {
          _sectionEntryTimes[section] = Date.now();
          pushEvent({ type: 'section_entry', section, ts: Date.now() });
        } else {
          const entryTime = _sectionEntryTimes[section];
          if (entryTime) {
            const dwellMs = Date.now() - entryTime;
            pushEvent({ type: 'section_exit', section, dwellMs, ts: Date.now() });
            delete _sectionEntryTimes[section];
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => observer.observe(section));
}

function setupDebugBadge(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.get('mind_debug') !== '1') return;

  _debugBadge = document.createElement('div');
  _debugBadge.id = 'mind-debug-badge';
  Object.assign(_debugBadge.style, {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    background: 'rgba(0,0,0,0.88)',
    color: '#0af',
    fontFamily: 'monospace',
    fontSize: '12px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #0af',
    zIndex: '99999',
    pointerEvents: 'none',
    maxWidth: '360px',
    whiteSpace: 'nowrap',
  });
  _debugBadge.textContent = 'mind: initializing…';
  document.body.appendChild(_debugBadge);
}

// ---------------------------------------------------------------------------
// Public init
// ---------------------------------------------------------------------------
export function initMindEngine(): () => void {
  if (typeof window === 'undefined') return () => {};

  setupClickTracking();
  setupScrollTracking();
  setupHesitationTracking();
  setupSectionTracking();
  setupDebugBadge();

  // Initial inference after a short delay to let the page settle
  const initTimeout = setTimeout(runInference, 2000);
  _inferTimer = setInterval(runInference, INFER_INTERVAL_MS);

  return () => {
    clearTimeout(initTimeout);
    if (_inferTimer) clearInterval(_inferTimer);
  };
}
