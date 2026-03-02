/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, useCallback } from "react";
import Constellation from "../components/Constellation";
import InputBar from "../components/InputBar";
import Layout from "../components/Layout";
import Link from "next/link";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [lines, setLines] = useState([]);
  const [displayedText, setDisplayedText] = useState("");
  const [pendingLines, setPendingLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [lastNextQuestion, setLastNextQuestion] = useState("");

  const TYPING_SPEED = 20;

  useEffect(() => {
    if (!isTyping || pendingLines.length === 0) return;

    const currentLine = pendingLines[currentLineIndex];
    if (!currentLine) {
      setIsTyping(false);
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
      setPendingLines([]);
      setDisplayedText("");
      return;
    }

    const fullText = currentLine.text;
    if (currentCharIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, currentLine]);
        setDisplayedText("");
        setCurrentCharIndex(0);
        setCurrentLineIndex((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, pendingLines, currentLineIndex, currentCharIndex]);

  const startTypingSequence = useCallback((newLines) => {
    setLines([]);
    setPendingLines(newLines);
    setDisplayedText("");
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setIsTyping(true);
  }, []);

  const handleSubmit = async (text) => {
    if (!text.trim() || isLoading || isTyping) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/cognitive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await response.json();
      setLastNextQuestion(data.next_question);

      const newLines = [
        { id: "intro", text: "Analyzing what you just shared..." },
        { id: "belief", text: `Belief Type: ${data.belief_type}` },
        { id: "charge", text: `Emotional Charge: ${data.emotional_charge}` },
        { id: "need", text: `Core Need: ${data.core_need}` },
        { id: "assumption", text: `Hidden Assumption: ${data.hidden_assumption}` },
        { id: "contradiction", text: `Contradiction: ${data.contradiction}` },
        { id: "rewrite", text: `Rewrite: ${data.rewrite}` },
        { id: "answer", text: data.answer },
        { id: "next", text: `Next Question: ${data.next_question}` },
      ];

      startTypingSequence(newLines);
    } catch (err) {
      startTypingSequence([
        { id: "error", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Constellation />
      <div className="home-page">
        <section className="hero">
          <h1>Coherex Cognitive Field</h1>
          <p>Type what's on your mind. Coherex will break it down.</p>
          <div className="search-container">
            <InputBar
              onSend={handleSubmit}
              disabled={isLoading || isTyping}
              buttonLabel={isLoading ? "Thinking..." : "Send"}
            />
          </div>
        </section>

        {(lines.length > 0 || displayedText) && (
          <div style={{ maxWidth: '640px', margin: '0 auto 48px', padding: '0 24px', position: 'relative', zIndex: 2 }}>
            <div style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '20px',
              background: 'rgba(0,0,0,0.4)',
            }}>
              {lines.map((line) => (
                <div key={line.id} style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', marginBottom: '8px', opacity: 0.85 }}>
                  {line.text}
                </div>
              ))}
              {displayedText && (
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                  {displayedText}
                  <span className="soft-cursor" style={{ display: 'inline-block', width: '8px', height: '16px', background: '#cbd5e1', marginLeft: '4px' }} />
                </div>
              )}
              {lastNextQuestion && !isTyping && (
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.5, marginBottom: '8px' }}>
                    Continue the conversation
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '12px' }}>{lastNextQuestion}</div>
                  <InputBar
                    onSend={handleSubmit}
                    disabled={isLoading || isTyping}
                    buttonLabel="Send"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <section className="tech-section">
          <p className="tech-heading">Built on a Cognitive Stack</p>
          <div className="tech-grid">
            <Link href={`/search?q=${encodeURIComponent("Belief Engine")}`} className="tech-card">
              <span className="tech-icon">🧠</span>
              <span className="tech-label">Belief Engine</span>
              <p className="tech-desc">Maps the structure of your beliefs and underlying assumptions.</p>
            </Link>

            <Link href={`/search?q=${encodeURIComponent("Emotional Parser")}`} className="tech-card">
              <span className="tech-icon">⚡</span>
              <span className="tech-label">Emotional Parser</span>
              <p className="tech-desc">Detects emotional charge and energy patterns in your statements.</p>
            </Link>

            <Link href={`/search?q=${encodeURIComponent("Contradiction Finder")}`} className="tech-card">
              <span className="tech-icon">🔍</span>
              <span className="tech-label">Contradiction Finder</span>
              <p className="tech-desc">Surfaces hidden contradictions and cognitive dissonance.</p>
            </Link>

            <Link href={`/search?q=${encodeURIComponent("Rewrite Generator")}`} className="tech-card">
              <span className="tech-icon">✨</span>
              <span className="tech-label">Rewrite Generator</span>
              <p className="tech-desc">Proposes clearer, more coherent reformulations of your thinking.</p>
            </Link>

            <Link href={`/search?q=${encodeURIComponent("Need Mapper")}`} className="tech-card">
              <span className="tech-icon">🎯</span>
              <span className="tech-label">Need Mapper</span>
              <p className="tech-desc">Identifies the core need driving your thoughts and questions.</p>
            </Link>

            <Link href={`/search?q=${encodeURIComponent("Inquiry Engine")}`} className="tech-card">
              <span className="tech-icon">🔗</span>
              <span className="tech-label">Inquiry Engine</span>
              <p className="tech-desc">Generates the next most generative question for your growth.</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}