/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState, useCallback } from "react";
import Constellation from "../components/Constellation";

type CognitiveResult = {
  belief_type: string;
  emotional_charge: number;
  core_need: string;
  hidden_assumption: string;
  contradiction: string;
  rewrite: string;
  next_question: string;
  answer: string;
};

type TypedLine = {
  id: string;
  label?: string;
  text: string;
};

const SHADOW_PROMPTS = [
  "What’s really on your mind?",
  "What emotion is strongest right now?",
  "What pattern keeps repeating?",
  "What are you avoiding?",
  "What do you wish someone understood?",
  "Where do you feel stuck?",
  "What belief is shaping this moment?",
  "What do you need right now?"
];

const TYPING_SPEED = 20;

const HomePage: React.FC = () => {
  const [input, setInput] = useState("");
  const [shadowIndex, setShadowIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [lines, setLines] = useState<TypedLine[]>([]);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);

  const [pendingLines, setPendingLines] = useState<TypedLine[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [awaitingUserResponse, setAwaitingUserResponse] = useState(false);
  const [lastNextQuestion, setLastNextQuestion] = useState<string>("");

  useEffect(() => {
    if (isFocused || input.length > 0) return;
    const interval = setInterval(() => {
      setShadowIndex((prev) => (prev + 1) % SHADOW_PROMPTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isFocused, input]);

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

  useEffect(() => {
    if (pendingLines.length > 0 && currentLineIndex >= pendingLines.length && isTyping) {
      setIsTyping(false);
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
      setDisplayedText("");
      setPendingLines([]);
    }
  }, [pendingLines, currentLineIndex, isTyping]);

  const startTypingSequence = useCallback((newLines: TypedLine[]) => {
    setLines([]);
    setPendingLines(newLines);
    setDisplayedText("");
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setIsTyping(true);
  }, []);

  const buildLinesFromResult = (result: CognitiveResult): TypedLine[] => {
    const baseId = Date.now().toString();
    const lines: TypedLine[] = [];

    lines.push({
      id: baseId + "-intro",
      text: "Analyzing what you just shared..."
    });

    lines.push({
      id: baseId + "-belief_type",
      text: `Belief Type: ${result.belief_type}`
    });

    lines.push({
      id: baseId + "-emotional_charge",
      text: `Emotional Charge: ${result.emotional_charge}`
    });

    lines.push({
      id: baseId + "-core_need",
      text: `Core Need: ${result.core_need}`
    });

    lines.push({
      id: baseId + "-hidden_assumption",
      text: `Hidden Assumption: ${result.hidden_assumption}`
    });

    lines.push({
      id: baseId + "-contradiction",
      text: `Contradiction: ${result.contradiction}`
    });

    lines.push({
      id: baseId + "-rewrite",
      text: `Rewrite: ${result.rewrite}`
    });

    lines.push({
      id: baseId + "-answer",
      text: result.answer
    });

    lines.push({
      id: baseId + "-next_question",
      text: `Next Question: ${result.next_question}`
    });

    return lines;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setAwaitingUserResponse(false);

    setConversationHistory((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/cognitive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: userMessage })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cognitive result");
      }

      const data: CognitiveResult = await response.json();
      setLastNextQuestion(data.next_question);

      const newLines = buildLinesFromResult(data);
      startTypingSequence(newLines);

      setTimeout(() => {
        setAwaitingUserResponse(true);
      }, newLines.reduce((acc, line) => acc + line.text.length * TYPING_SPEED + 300, 0));
    } catch (err) {
      console.error(err);
      const errorLines: TypedLine[] = [
        {
          id: "error-" + Date.now().toString(),
          text: "Something went wrong processing that. Try again in a moment."
        }
      ];
      startTypingSequence(errorLines);
    } finally {
      setIsLoading(false);
    }
  };

  const currentShadowPrompt =
    !isFocused && input.length === 0 ? SHADOW_PROMPTS[shadowIndex] : "";

  return (
    <>
      <Constellation />
      <div
        className="min-h-screen text-slate-100 flex flex-col items-center justify-start px-4 py-8"
        style={{
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          position: "relative",
          zIndex: 2,
        }}
      >
      <div className="w-full max-w-2xl mb-8">
        <h1 className="text-xl font-semibold text-slate-100 mb-2 tracking-tight">
          Coherex Cognitive Field
        </h1>
        <p className="text-sm text-slate-400">
          Type what's on your mind. Coherex will break it down into beliefs, needs, and the next question to explore.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6">
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent border border-slate-700 rounded-full px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500 transition-colors"
          />
          {currentShadowPrompt && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4">
              <span className="text-sm text-slate-500 select-none">
                {currentShadowPrompt}
              </span>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || isTyping}
            className="absolute right-1 top-1 bottom-1 px-4 rounded-full text-xs font-medium bg-sky-500 text-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>

      <div className="w-full max-w-2xl flex-1 overflow-y-auto border border-slate-800 rounded-xl p-4 bg-black/40">
        {lines.length === 0 && !displayedText && (
          <div className="text-sm text-slate-500">
            Your cognitive field will appear here as Coherex types out what it sees in your words.
          </div>
        )}

        <div className="space-y-2 text-sm leading-relaxed">
          {lines.map((line) => (
            <div key={line.id} className="whitespace-pre-wrap">
              {line.text}
            </div>
          ))}

          {displayedText && (
            <div className="whitespace-pre-wrap">
              {displayedText}
              <span className="inline-block w-2 h-4 bg-slate-300 ml-1 animate-pulse" />
            </div>
          )}
        </div>

        {!isTyping && !isLoading && lastNextQuestion && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
              Continue the conversation
            </div>
            <div className="text-sm text-slate-200 mb-3">
              {lastNextQuestion}
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your response..."
                className="w-full bg-transparent border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 transition-colors"
              />
            </form>
          </div>
        )}
      </div>

      <section className="tech-section">
        <p className="tech-heading">Powered by advanced technology</p>
        <div className="tech-grid">
          <div className="tech-card">
            <span className="tech-icon">🤖</span>
            <span className="tech-label">GPT-4o mini</span>
            <p className="tech-desc">Fast, affordable reasoning for cognitive analysis</p>
          </div>
          <div className="tech-card">
            <span className="tech-icon">🌐</span>
            <span className="tech-label">Three.js</span>
            <p className="tech-desc">Real-time 3D visuals and immersive space background</p>
          </div>
          <div className="tech-card">
            <span className="tech-icon">⚡</span>
            <span className="tech-label">Real-time streaming</span>
            <p className="tech-desc">Instant response delivery as your thoughts are processed</p>
          </div>
          <div className="tech-card">
            <span className="tech-icon">🔍</span>
            <span className="tech-label">Semantic search</span>
            <p className="tech-desc">Deep semantic understanding of beliefs and patterns</p>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default HomePage;
