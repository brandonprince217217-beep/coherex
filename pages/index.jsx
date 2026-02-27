import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [openCard, setOpenCard] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');

  const detectDomain = (text) => {
    const t = text.toLowerCase();
    if (t.includes('work') || t.includes('job') || t.includes('career')) return 'Work / Career';
    if (t.includes('relationship') || t.includes('love') || t.includes('partner')) return 'Relationships';
    if (t.includes('money') || t.includes('debt') || t.includes('bills')) return 'Money / Stability';
    if (t.includes('health') || t.includes('body') || t.includes('tired')) return 'Health / Energy';
    if (t.includes('family') || t.includes('parent') || t.includes('kids')) return 'Family';
    return 'Identity / General Life';
  };

  const detectBeliefType = (text) => {
    const t = text.toLowerCase();
    if (t.includes("i'm") || t.includes('i am')) return 'Identity belief';
    if (t.includes("can't") || t.includes('cannot')) return 'Limitation / control belief';
    if (t.includes('always') || t.includes('never')) return 'Permanence belief';
    if (t.includes('should') || t.includes('supposed to')) return 'Moral obligation belief';
    if (t.includes('what if') || t.includes('worst case')) return 'Catastrophic / fear prediction';
    if (t.includes('enough') || t.includes('never have') || t.includes('not have')) return 'Scarcity belief';
    return 'General narrative belief';
  };

  const detectEmotionalCharge = (text) => {
    const t = text.toLowerCase();
    let score = 0;
    if (t.includes('always') || t.includes('never')) score += 2;
    if (t.includes("can't") || t.includes('cannot')) score += 2;
    if (t.includes('hate') || t.includes('worthless') || t.includes('failure')) score += 3;
    if (t.includes('scared') || t.includes('terrified') || t.includes('anxious')) score += 3;
    if (t.includes('must') || t.includes('have to')) score += 1;
    if (score >= 6) return 'High';
    if (score >= 3) return 'Medium';
    return 'Low';
  };

  const getAI = async (section, userInput) => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, userInput })
    });

    const data = await res.json();
    return data.output;
  };

  const handleSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const domain = detectDomain(trimmed);
    const beliefType = detectBeliefType(trimmed);
    const emotionalCharge = detectEmotionalCharge(trimmed);

    const hiddenAssumptionFull = await getAI("hiddenAssumption", trimmed);
    const implicationsFull = await getAI("implications", trimmed);
    const contradictionsFull = await getAI("contradictions", trimmed);
    const rewriteFull = await getAI("rewrite", trimmed);
    const nextQuestionFull = await getAI("nextQuestion", trimmed);

    setAnalysis({
      raw: trimmed,
      domain,
      beliefType,
      emotionalCharge,
      hiddenAssumption: {
        preview: "This belief contains an underlying assumption shaping how you interpret the situation.",
        full: hiddenAssumptionFull
      },
      implications: {
        preview: "This belief carries several implications about how you see yourself and the future.",
        fullIntro: "Here are the implications embedded in this belief:",
        bullets: implicationsFull.split("\n").map(x => x.trim()).filter(x => x)
      },
      contradictions: {
        preview: "There may be tensions or gaps between this belief and other things you know.",
        fullIntro: "Here are contradictions or inconsistencies within this belief:",
        bullets: contradictionsFull.split("\n").map(x => x.trim()).filter(x => x)
      },
      rewrite: {
        preview: "A more accurate and flexible version of this belief is possible.",
        full: rewriteFull
      },
      nextQuestion: {
        preview: "A single question can open this belief and create movement.",
        full: nextQuestionFull
      }
    });

    setOpenCard(null);
    setShowResults(false);
    requestAnimationFrame(() => setShowResults(true));
  };

  const handleToggleCard = (key) => {
    setOpenCard(prev => (prev === key ? null : key));
  };

  const handleCopyAll = async () => {
    if (!analysis) return;

    const {
      raw,
      domain,
      beliefType,
      emotionalCharge,
      hiddenAssumption,
      implications,
      contradictions,
      rewrite,
      nextQuestion,
    } = analysis;

    const text = [
      'INPUT:',
      raw,
      '',
      'DOMAIN:',
      domain,
      '',
      'BELIEF TYPE:',
      beliefType,
      '',
      'EMOTIONAL CHARGE:',
      emotionalCharge,
      '',
      'HIDDEN ASSUMPTION:',
      hiddenAssumption.full,
      '',
      'IMPLICATIONS:',
      implications.fullIntro,
      ...implications.bullets.map(b => '- ' + b),
      '',
      'CONTRADICTIONS:',
      contradictions.fullIntro,
      ...contradictions.bullets.map(b => '- ' + b),
      '',
      'REWRITE:',
      rewrite.full,
      '',
      'NEXT QUESTION:',
      nextQuestion.full,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied');
      setTimeout(() => setCopyStatus(''), 1500);
    } catch (e) {
      setCopyStatus('Copy failed');
      setTimeout(() => setCopyStatus(''), 1500);
    }
  };

  const cardBaseStyle = (isOpen) => ({
    marginInline: 'auto',
    maxWidth: '520px',
    textAlign: 'left',
    padding: '16px 18px',
    borderRadius: '14px',
    border: '1px solid rgba(0, 140, 255, 0.7)',
    background:
      'radial-gradient(circle at top left, rgba(0,140,255,0.22), rgba(0,0,0,0.95))',
    boxShadow: isOpen
      ? '0 0 26px rgba(0, 140, 255, 0.75)'
      : '0 0 18px rgba(0, 140, 255, 0.45)',
    marginBottom: '14px',
    cursor: 'pointer',
    transition: 'box-shadow 180ms ease-out, transform 180ms ease-out',
    transform: isOpen ? 'translateY(-1px)' : 'translateY(0)',
  });

  const labelStyle = {
    fontSize: '0.8rem',
    opacity: 0.7,
    marginBottom: '6px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };

  const previewTextStyle = {
    opacity: 0.9,
  };

  const fullTextStyle = {
    marginTop: '8px',
    opacity: 0.95,
    fontSize: '0.92rem',
    lineHeight: 1.5,
  };

  const animatedContainerStyle = {
    marginTop: '26px',
    opacity: showResults ? 1 : 0,
    transform: showResults ? 'translateY(0px)' : 'translateY(10px)',
    transition: 'opacity 220ms ease-out, transform 220ms ease-out',
  };

  const copyButtonStyle = {
    marginTop: '18px',
    marginInline: 'auto',
    display: 'block',
    maxWidth: '520px',
    width: '90%',
    padding: '10px 14px',
    borderRadius: '12px',
    background: 'rgba(0,140,255,0.9)',
    color: 'white',
    border: 'none',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 0 16px rgba(0,140,255,0.7)',
  };

  const copyStatusStyle = {
    marginTop: '8px',
    textAlign: 'center',
    fontSize: '0.85rem',
    opacity: 0.8,
  };

  return (
    <Layout>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'black',
          color: 'white',
          paddingTop: '160px',
          paddingBottom: '60px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '2.4rem', marginBottom: '20px' }}>Coherex</h1>
        <p style={{ opacity: 0.7, marginBottom: '10px' }}>
          Your Cognitive Operating System
        </p>
        <p style={{ opacity: 0.7, marginBottom: '20px' }}>
          Type a thought, fear, belief, or pattern — Coherex will break it down.
        </p>

        <SearchBar onSearch={handleSearch} disabled={false} />

        {analysis && (
          <div style={animatedContainerStyle}>
            <div style={cardBaseStyle(false)}>
              <div style={labelStyle}>Input</div>
              <div>{analysis.raw}</div>
            </div>

            <div
              style={cardBaseStyle(openCard === 'domain')}
              onClick={() => handleToggleCard('domain')}
            >
              <div style={labelStyle}>Domain</div>
              <div style={previewTextStyle}>
                This belief touches: {analysis.domain}.
              </div>
              {openCard === 'domain' && (
                <div style={fullTextStyle}>
                  The domain shows where this belief is most active in your life.
                </div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'beliefType')}
              onClick={() => handleToggleCard('beliefType')}
            >
              <div style={labelStyle}>Belief Type</div>
              <div style={previewTextStyle}>
                This belief is a {analysis.beliefType.toLowerCase()}.
              </div>
              {openCard === 'beliefType' && (
                <div style={fullTextStyle}>
                  The type of belief reveals the lens you’re using to interpret the situation.
                </div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'emotionalCharge')}
              onClick={() => handleToggleCard('emotionalCharge')}
            >
              <div style={labelStyle}>Emotional Charge</div>
              <div style={previewTextStyle}>
                The emotional intensity feels {analysis.emotionalCharge.toLowerCase()}.
              </div>
              {openCard === 'emotionalCharge' && (
                <div style={fullTextStyle}>
                  Emotional charge reflects how strongly this belief grips your attention and body.
                </div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'hiddenAssumption')}
              onClick={() => handleToggleCard('hiddenAssumption')}
            >
              <div style={labelStyle}>Hidden Assumption</div>
              <div style={previewTextStyle}>{analysis.hiddenAssumption.preview}</div>
              {openCard === 'hiddenAssumption' && (
                <div style={fullTextStyle}>{analysis.hiddenAssumption.full}</div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'implications')}
              onClick={() => handleToggleCard('implications')}
            >
              <div style={labelStyle}>Implications</div>
              <div style={previewTextStyle}>{analysis.implications.preview}</div>
              {openCard === 'implications' && (
                <div style={fullTextStyle}>
                  <div>{analysis.implications.fullIntro}</div>
                  {analysis.implications.bullets.map((b, i) => (
                    <div key={i} style={{ marginTop: '6px' }}>• {b}</div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'contradictions')}
              onClick={() => handleToggleCard('contradictions')}
            >
              <div style={labelStyle}>Contradictions</div>
              <div style={previewTextStyle}>{analysis.contradictions.preview}</div>
              {openCard === 'contradictions' && (
                <div style={fullTextStyle}>
                  <div>{analysis.contradictions.fullIntro}</div>
                  {analysis.contradictions.bullets.map((b, i) => (
                    <div key={i} style={{ marginTop: '6px' }}>• {b}</div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'rewrite')}
              onClick={() => handleToggleCard('rewrite')}
            >
              <div style={labelStyle}>Rewrite</div>
              <div style={previewTextStyle}>{analysis.rewrite.preview}</div>
              {openCard === 'rewrite' && (
                <div style={fullTextStyle}>{analysis.rewrite.full}</div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'nextQuestion')}
              onClick={() => handleToggleCard('nextQuestion')}
            >
              <div style={labelStyle}>Next Question</div>
              <div style={previewTextStyle}>{analysis.nextQuestion.preview}</div>
              {openCard === 'nextQuestion' && (
                <div style={fullTextStyle}>{analysis.nextQuestion.full}</div>
              )}
            </div>

            <button style={copyButtonStyle} onClick={handleCopyAll}>
              Copy All
            </button>
            {copyStatus && <div style={copyStatusStyle}>{copyStatus}</div>}
          </div>
        )}
      </div>
    </Layout>
  );
}
