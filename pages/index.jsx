import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import { useState, useEffect } from 'react';

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [trialActive, setTrialActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showPopup, setShowPopup] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Load or create persistent trial end time
  useEffect(() => {
    const savedEnd = localStorage.getItem('trialEnd');

    if (!savedEnd) {
      const endTime = Date.now() + 180000; // 3 minutes
      localStorage.setItem('trialEnd', endTime.toString());
      setTimeLeft(180);
      setTrialActive(true);
      return;
    }

    const endTime = parseInt(savedEnd, 10);
    const remaining = Math.floor((endTime - Date.now()) / 1000);

    if (remaining > 0) {
      setTimeLeft(remaining);
      setTrialActive(true);
    } else {
      setTimeLeft(0);
      setTrialActive(false);
      setShowPopup(true);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!trialActive) return;

    const interval = setInterval(() => {
      const savedEnd = localStorage.getItem('trialEnd');
      if (!savedEnd) {
        clearInterval(interval);
        setTrialActive(false);
        setTimeLeft(0);
        setShowPopup(true);
        return;
      }

      const endTime = parseInt(savedEnd, 10);
      const remaining = Math.floor((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);
        setTrialActive(false);
        setTimeLeft(0);
        setShowPopup(true);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [trialActive]);

  // ---------- ENGINE LOGIC ----------

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

  const generateHiddenAssumption = (text) => {
    const t = text.toLowerCase();

    if (t.includes('always') || t.includes('never'))
      return 'You’re assuming this pattern is permanent rather than situational.';
    if (t.includes("can't") || t.includes('cannot'))
      return 'You’re assuming your current ability defines your permanent capacity.';
    if (t.includes('should') || t.includes('supposed to'))
      return 'You’re assuming there is a strict standard you must meet to be acceptable.';
    if (t.includes('if') && t.includes('then'))
      return 'You’re running a conditional rule about what must happen for you to be okay.';
    if (t.includes('everyone') || t.includes('nobody'))
      return 'You’re assuming other people’s reactions are universal and fixed.';

    return 'You’re assuming this thought is simply true, rather than one possible interpretation.';
  };

  const generateImplications = (text) => {
    const t = text.toLowerCase();
    const implications = [];

    if (t.includes("can't") || t.includes('cannot'))
      implications.push('This implies you see your limitation as fixed, not something that can change.');
    if (t.includes('always') || t.includes('never'))
      implications.push('This implies you believe this pattern defines your reality across all situations.');
    if (t.includes('should') || t.includes('supposed to'))
      implications.push('This implies you believe there is a standard you must meet to be acceptable.');
    if (t.includes('if') && t.includes('then'))
      implications.push('This implies you believe one event automatically leads to another.');
    if (t.includes('want') || t.includes('wish'))
      implications.push('This implies you believe something important is currently missing.');

    if (implications.length === 0)
      implications.push('This belief implies there is something important at stake for you.');

    return implications;
  };

  const generateContradictions = (text) => {
    const t = text.toLowerCase();
    const contradictions = [];

    if (t.includes("can't") && t.includes('want'))
      contradictions.push('You believe you cannot do something you also strongly desire.');
    if (t.includes('always') && t.includes('sometimes'))
      contradictions.push('You’re mixing absolute language with language that admits exceptions.');
    if (t.includes('never') && t.includes('but'))
      contradictions.push('You claim something never happens while also acknowledging a counterexample.');
    if (t.includes("i'm") && t.includes('but'))
      contradictions.push('You’re holding two conflicting views about yourself at the same time.');

    if (contradictions.length === 0)
      contradictions.push('No direct contradiction detected, but the belief may still be incomplete or one-sided.');

    return contradictions;
  };

  const generateRewrite = (text) => {
    const t = text.toLowerCase();

    if (t.includes('always') || t.includes('never'))
      return 'This feels constant right now, but it’s more accurate to say it happens sometimes, not always.';
    if (t.includes("can't") || t.includes('cannot'))
      return 'Right now this feels hard, but it’s more accurate to say you don’t yet know how to do it.';
    if (t.includes('should') || t.includes('supposed to'))
      return 'Instead of “I should,” you might say “I’d prefer” or “I value,” which gives you more freedom.';
    if (t.includes('failure') || t.includes('failed'))
      return 'Instead of “I’m a failure,” it’s more accurate to say “I failed at something specific while learning.”';

    return 'This thought is one possible story. A more accurate version is: “This is challenging, but not the whole truth about me or my future.”';
  };

  const generateNextQuestion = (text) => {
    const t = text.toLowerCase();

    if (t.includes('always') || t.includes('never'))
      return 'If this were 10% less absolute, what would change in how you see it?';
    if (t.includes("can't") || t.includes('cannot'))
      return 'What small version of this could you try, even if you don’t feel fully ready?';
    if (t.includes('should') || t.includes('supposed to'))
      return 'Who taught you this “should,” and do you still agree with them?';
    if (t.includes('scared') || t.includes('afraid') || t.includes('anxious'))
      return 'What specific outcome are you most afraid of, and how likely is it really?';

    return 'If this thought were only partially true, what part would you keep and what part would you soften?';
  };

  const handleSearch = (query) => {
    if (!trialActive) {
      window.location.href = 'https://buy.stripe.com/14A3cn4bXbgCh0t2pvasg04';
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) return;

    const domain = detectDomain(trimmed);
    const beliefType = detectBeliefType(trimmed);
    const emotionalCharge = detectEmotionalCharge(trimmed);
    const hiddenAssumption = generateHiddenAssumption(trimmed);
    const implications = generateImplications(trimmed);
    const contradictions = generateContradictions(trimmed);
    const rewrite = generateRewrite(trimmed);
    const nextQuestion = generateNextQuestion(trimmed);

    setAnalysis({
      raw: trimmed,
      domain,
      beliefType,
      emotionalCharge,
      hiddenAssumption,
      implications,
      contradictions,
      rewrite,
      nextQuestion,
    });

    // trigger animation
    setShowResults(false);
    requestAnimationFrame(() => {
      setShowResults(true);
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ---------- STYLES ----------

  const cardBaseStyle = {
    marginInline: 'auto',
    maxWidth: '520px',
    textAlign: 'left',
    padding: '16px 18px',
    borderRadius: '14px',
    border: '1px solid rgba(0, 140, 255, 0.7)',
    background:
      'radial-gradient(circle at top left, rgba(0,140,255,0.22), rgba(0,0,0,0.95))',
    boxShadow: '0 0 22px rgba(0, 140, 255, 0.55)',
    marginBottom: '14px',
  };

  const labelStyle = {
    fontSize: '0.8rem',
    opacity: 0.7,
    marginBottom: '6px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };

  const animatedContainerStyle = {
    marginTop: '26px',
    opacity: showResults ? 1 : 0,
    transform: showResults ? 'translateY(0px)' : 'translateY(10px)',
    transition: 'opacity 220ms ease-out, transform 220ms ease-out',
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
          position: 'relative',
        }}
      >
        <h1 style={{ fontSize: '2.4rem', marginBottom: '20px' }}>Coherex</h1>
        <p style={{ opacity: 0.7, marginBottom: '10px' }}>
          Your Cognitive Operating System
        </p>

        {trialActive ? (
          <p
            style={{
              opacity: 0.8,
              fontSize: '0.9rem',
              marginBottom: '20px',
            }}
          >
            Free trial active — time left: {formatTime(timeLeft)}
          </p>
        ) : (
          <p
            style={{
              opacity: 0.8,
              fontSize: '0.9rem',
              marginBottom: '20px',
              color: 'red',
            }}
          >
            Your free trial has ended. Search is locked.
          </p>
        )}

        <SearchBar onSearch={handleSearch} disabled={!trialActive} />

        {analysis && (
          <div style={animatedContainerStyle}>
            {/* RAW INPUT */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Input</div>
              <div>{analysis.raw}</div>
            </div>

            {/* DOMAIN */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Domain</div>
              <div>{analysis.domain}</div>
            </div>

            {/* BELIEF TYPE */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Belief Type</div>
              <div>{analysis.beliefType}</div>
            </div>

            {/* EMOTIONAL CHARGE */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Emotional Charge</div>
              <div>{analysis.emotionalCharge}</div>
            </div>

            {/* HIDDEN ASSUMPTION */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Hidden Assumption</div>
              <div>{analysis.hiddenAssumption}</div>
            </div>

            {/* IMPLICATIONS */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Implications</div>
              <ul style={{ paddingLeft: '18px', margin: 0 }}>
                {analysis.implications.map((i, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTRADICTIONS */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Contradictions</div>
              <ul style={{ paddingLeft: '18px', margin: 0 }}>
                {analysis.contradictions.map((c, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* REWRITE */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Rewrite</div>
              <div>{analysis.rewrite}</div>
            </div>

            {/* NEXT QUESTION */}
            <div style={cardBaseStyle}>
              <div style={labelStyle}>Next Question</div>
              <div>{analysis.nextQuestion}</div>
            </div>
          </div>
        )}

        {showPopup && (
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '85%',
              maxWidth: '360px',
              background: 'black',
              border: '1px solid rgba(0,140,255,0.7)',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: '0 0 20px rgba(0,140,255,0.6)',
              zIndex: 9999,
              textAlign: 'center',
            }}
          >
            <div
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '14px',
                fontSize: '1.4rem',
                cursor: 'pointer',
                color: 'white',
              }}
            >
              ×
            </div>

            <h3 style={{ marginBottom: '14px' }}>Your free trial has ended.</h3>

            <p style={{ opacity: 0.8, marginBottom: '20px' }}>
              Go to Pricing for unlimited access.
            </p>

            <a
              href="/pricing"
              style={{
                display: 'inline-block',
                padding: '10px 18px',
                background: 'rgba(0,140,255,0.9)',
                borderRadius: '10px',
                color: 'white',
                textDecoration: 'none',
                boxShadow: '0 0 12px rgba(0,140,255,0.6)',
              }}
            >
              Go to Pricing
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
