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

  const buildHiddenAssumption = (text) => {
    const t = text.toLowerCase();
    let core;
    if (t.includes('always') || t.includes('never'))
      core = 'You’re assuming this pattern is permanent rather than situational.';
    else if (t.includes("can't") || t.includes('cannot'))
      core = 'You’re assuming your current ability defines your permanent capacity.';
    else if (t.includes('should') || t.includes('supposed to'))
      core = 'You’re assuming there is a strict standard you must meet to be acceptable.';
    else if (t.includes('if') && t.includes('then'))
      core = 'You’re running a conditional rule about what must happen for you to be okay.';
    else if (t.includes('everyone') || t.includes('nobody'))
      core = 'You’re assuming other people’s reactions are universal and fixed.';
    else
      core = 'You’re assuming this thought is simply true, rather than one possible interpretation.';

    const preview =
      core + ' It hints at a deeper rule your mind is using to interpret this situation.';
    const full =
      core +
      ' Underneath this, your mind is likely trying to create predictability and control. Hidden assumptions often form early, based on repeated emotional experiences, and then operate in the background as if they are facts. They shape what you notice, what you ignore, and how you explain events to yourself. They protect you from uncertainty or emotional pain, but they also limit what you believe is possible. A healthier assumption would be one that leaves room for change, nuance, and your own growth over time.';

    return { preview, full };
  };

  const buildImplications = (text) => {
    const t = text.toLowerCase();
    const bullets = [];
    if (t.includes("can't") || t.includes('cannot'))
      bullets.push('You may see your current limitation as a fixed part of who you are, rather than a skill or capacity that can grow.');
    if (t.includes('always') || t.includes('never'))
      bullets.push('You may believe this pattern defines your reality across situations, not just in specific contexts.');
    if (t.includes('should') || t.includes('supposed to'))
      bullets.push('You may feel that your worth depends on meeting certain standards or expectations.');
    if (t.includes('if') && t.includes('then'))
      bullets.push('You may believe that one event automatically leads to another, without room for alternative outcomes.');
    if (t.includes('want') || t.includes('wish'))
      bullets.push('You may feel that something important is missing, and that your current state is not enough.');
    if (bullets.length === 0)
      bullets.push('This belief suggests that something meaningful feels at stake for you in this situation.');

    const preview =
      'This belief carries several implications about how you see yourself, other people, and the future.';
    const fullIntro =
      'Here are some of the key implications embedded in this belief. Each one shapes how you interpret events and what you expect to happen next:';

    return { preview, fullIntro, bullets };
  };

  const buildContradictions = (text) => {
    const t = text.toLowerCase();
    const bullets = [];
    if (t.includes("can't") && t.includes('want'))
      bullets.push('You believe you cannot do something you also strongly desire, which creates inner conflict and tension.');
    if (t.includes('always') && t.includes('sometimes'))
      bullets.push('You use absolute language while also admitting exceptions, which suggests the belief is not fully accurate.');
    if (t.includes('never') && t.includes('but'))
      bullets.push('You claim something never happens while also acknowledging a counterexample.');
    if (t.includes("i'm") && t.includes('but'))
      bullets.push('You hold two conflicting views about yourself at the same time, which can create confusion and self‑doubt.');
    if (bullets.length === 0)
      bullets.push('No direct logical contradiction is obvious, but the belief may still be one‑sided or incomplete.');

    const preview =
      'There are tensions or gaps between this belief and other things you know or experience.';
    const fullIntro =
      'Looking at contradictions helps reveal where your belief doesn’t fully line up with reality or with other things you know about yourself. These cracks are often the entry points for change:';

    return { preview, fullIntro, bullets };
  };

  const buildRewrite = (text) => {
    const t = text.toLowerCase();
    let core;
    if (t.includes('always') || t.includes('never'))
      core = 'It’s more accurate to say this happens sometimes, in certain situations, rather than always or never.';
    else if (t.includes("can't") || t.includes('cannot'))
      core = 'It’s more accurate to say you don’t yet know how to do this, rather than that you never can.';
    else if (t.includes('should') || t.includes('supposed to'))
      core = 'It’s more accurate to frame this as a preference or value, rather than a rigid “should.”';
    else if (t.includes('failure') || t.includes('failed'))
      core = 'It’s more accurate to say you failed at something specific while learning, rather than that you are a failure.';
    else
      core = 'It’s more accurate to see this thought as one possible story, not the whole truth.';

    const preview =
      core + ' This shifts the belief from something absolute into something more flexible and human.';
    const full =
      core +
      ' A good rewrite keeps the emotional truth of what you’re feeling, but removes the parts that erase your agency, growth, or nuance. A helpful rewrite is specific, time‑bound, and leaves room for change. It doesn’t pretend everything is fine; it simply refuses to collapse your entire identity or future into a single moment or pattern.';

    return { preview, full };
  };

  const buildNextQuestion = (text) => {
    const t = text.toLowerCase();
    let question;
    if (t.includes('always') || t.includes('never'))
      question = 'If this were even 10–20% less absolute, what would change in how you see yourself or this situation?';
    else if (t.includes("can't") || t.includes('cannot'))
      question = 'What is one small version of this you could experiment with, even if you don’t feel fully ready?';
    else if (t.includes('should') || t.includes('supposed to'))
      question = 'Who gave you this “should,” and do you still consciously agree with them today?';
    else if (t.includes('scared') || t.includes('afraid') || t.includes('anxious'))
      question = 'What specific outcome are you most afraid of, and how likely is it really, based on evidence?';
    else
      question = 'If this thought were only partially true, what part would you keep and what part would you soften or update?';

    const preview =
      'A single, precise question can open this belief up and create movement where it currently feels stuck.';
    const full =
      question +
      ' Sitting with this question—not to find a perfect answer, but to notice what comes up—can start to loosen the grip of the belief. Often, the most powerful shift comes not from replacing a belief instantly, but from becoming more curious and less certain about it.';

    return { preview, full };
  };

  const handleSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const domain = detectDomain(trimmed);
    const beliefType = detectBeliefType(trimmed);
    const emotionalCharge = detectEmotionalCharge(trimmed);
    const hiddenAssumption = buildHiddenAssumption(trimmed);
    const implications = buildImplications(trimmed);
    const contradictions = buildContradictions(trimmed);
    const rewrite = buildRewrite(trimmed);
    const nextQuestion = buildNextQuestion(trimmed);

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
                This is the main area of life this belief is touching: {analysis.domain}.
              </div>
              {openCard === 'domain' && (
                <div style={fullTextStyle}>
                  The domain tells you where this belief is most active—work, relationships, money, health, family, or your overall sense of identity. Seeing the domain clearly helps you notice patterns across situations and prevents you from treating a local struggle as a global truth about your entire life.
                </div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'beliefType')}
              onClick={() => handleToggleCard('beliefType')}
            >
              <div style={labelStyle}>Belief Type</div>
              <div style={previewTextStyle}>
                This belief is showing up as a {analysis.beliefType.toLowerCase()}. It shapes how you explain what’s happening.
              </div>
              {openCard === 'beliefType' && (
                <div style={fullTextStyle}>
                  The type of belief matters because it reveals the lens you’re using. Identity beliefs sound like “I am…”, permanence beliefs sound like “It will always be this way…”, and scarcity beliefs sound like “There’s never enough…”. Each type tends to generate its own emotional tone and behavior patterns. Naming the type gives you leverage: you can start to question the lens instead of assuming it’s the only way to see things.
                </div>
              )}
            </div>

            <div
              style={cardBaseStyle(openCard === 'emotionalCharge')}
              onClick={() => handleToggleCard('emotionalCharge')}
            >
              <div style={labelStyle}>Emotional Charge</div>
              <div style={previewTextStyle}>
                The emotional intensity of this belief feels {analysis.emotionalCharge.toLowerCase()} right now.
              </div>
              {openCard === 'emotionalCharge' && (
                <div style={fullTextStyle}>
                  Emotional charge is not just about how “big” the feeling is—it’s also about how quickly it takes over and how hard it is to step back from. High‑charge beliefs often come with body sensations (tight chest, racing thoughts, heaviness) and a sense of urgency or threat. Noticing the charge helps you separate “how true this is” from “how intense this feels,” which are not the same thing.
                </div>
              )}
            </div>

            <div
             
