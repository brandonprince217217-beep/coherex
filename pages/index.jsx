import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import { useState, useEffect } from 'react';

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [trialActive, setTrialActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showPopup, setShowPopup] = useState(false);

  // Load or create persistent trial end time
  useEffect(() => {
    const savedEnd = localStorage.getItem("trialEnd");

    if (!savedEnd) {
      const endTime = Date.now() + 180000; // 3 minutes
      localStorage.setItem("trialEnd", endTime.toString());
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
      const endTime = parseInt(localStorage.getItem("trialEnd"), 10);
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

  // Engine logic
  const detectDomain = (text) => {
    const t = text.toLowerCase();
    if (t.includes('work') || t.includes('job') || t.includes('career')) return 'Work / Career';
    if (t.includes('relationship') || t.includes('love') || t.includes('partner')) return 'Relationships';
    if (t.includes('money') || t.includes('debt') || t.includes('bills')) return 'Money / Stability';
    if (t.includes('health') || t.includes('body') || t.includes('tired')) return 'Health / Energy';
    return 'Identity / General Life';
  };

  const generateImplications = (text) => {
    const t = text.toLowerCase();
    const implications = [];

    if (t.includes("can't") || t.includes("cannot"))
      implications.push("You believe this limitation is fixed, not temporary.");
    if (t.includes("always") || t.includes("never"))
      implications.push("You’re treating a single moment as a permanent pattern.");
    if (t.includes("should"))
      implications.push("You believe there is a correct standard you’re failing to meet.");
    if (t.includes("want"))
      implications.push("You believe something is missing from your current reality.");

    if (implications.length === 0)
      implications.push("This thought implies there is something important beneath the surface.");

    return implications;
  };

  const generateContradictions = (text) => {
    const t = text.toLowerCase();
    const contradictions = [];

    if (t.includes("can't") && t.includes("want"))
      contradictions.push("You believe you cannot do something you also desire.");
    if (t.includes("always") && t.includes("sometimes"))
      contradictions.push("You’re mixing absolute language with uncertain language.");
    if (t.includes("never") && t.includes("but"))
      contradictions.push("You’re claiming something never happens while acknowledging exceptions.");

    if (contradictions.length === 0)
      contradictions.push("No direct contradiction detected, but the belief may still be incomplete.");

    return contradictions;
  };

  const handleSearch = (query) => {
    if (!trialActive) {
      window.location.href = "https://buy.stripe.com/14A3cn4bXbgCh0t2pvasg04";
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) return;

    const domain = detectDomain(trimmed);
    const implications = generateImplications(trimmed);
    const contradictions = generateContradictions(trimmed);

    setAnalysis({
      raw: trimmed,
      domain,
      assumption: "You’re treating this thought as globally true instead of situational.",
      implications,
      contradictions,
      reframe: "What if this thought is only describing a moment, not your entire reality?"
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'black',
        color: 'white',
        paddingTop: '160px',
        paddingBottom: '60px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
        position: 'relative'
      }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '20px' }}>Coherex</h1>
        <p style={{ opacity: 0.7, marginBottom: '10px' }}>Your Cognitive Operating System</p>

        {trialActive ? (
          <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '20px' }}>
            Free trial active — time left: {formatTime(timeLeft)}
          </p>
        ) : (
          <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '20px', color: 'red' }}>
            Your free trial has ended. Search is locked.
          </p>
        )}

        <SearchBar onSearch={handleSearch} disabled={!trialActive} />

        {analysis && (
          <div style={{
            marginTop: '30px',
            marginInline: 'auto',
            maxWidth: '520px',
            textAlign: 'left',
            padding: '20px 22px',
            borderRadius: '14px',
            border: '1px solid rgba(0, 140, 255, 0.6)',
            background: 'radial-gradient(circle at top left, rgba(0,140,255,0.25), rgba(0,0,0,0.9))',
            boxShadow: '0 0 24px rgba(0, 140, 255, 0.5)'
          }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '6px' }}>INPUT</div>
            <div style={{ marginBottom: '14px' }}>{analysis.raw}</div>

            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '6px' }}>DOMAIN</div>
            <div style={{ marginBottom: '14px' }}>{analysis.domain}</div>

            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '6px' }}>HIDDEN ASSUMPTION</div>
            <div style={{ marginBottom: '14px' }}>{analysis.assumption}</div>

            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '6px' }}>IMPLICATIONS</div>
            <ul>
              {analysis.implications.map((i, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{i}</li>
              ))}
            </ul>

            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '6px', marginTop: '14px' }}>CONTRADICTIONS</div>
            <ul>
              {analysis.contradictions.map((c, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{c}</li>
              ))}
            </ul>

            <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '6px', marginTop: '14px' }}>REFRAME</div>
            <div>{analysis.reframe}</div>
          </div>
        )}

        {showPopup && (
          <div style={{
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
            textAlign: 'center'
          }}>
            <div
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '14px',
                fontSize: '1.4rem',
                cursor: 'pointer',
                color: 'white'
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
                boxShadow: '0 0 12px rgba(0,140,255,0.6)'
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
