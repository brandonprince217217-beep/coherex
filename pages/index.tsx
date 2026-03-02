/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState, useCallback } from "react";
import Constellation from "../components/Constellation";

export default function HomePage() {
  const [input, setInput] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/cognitive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
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
    <>
      <Constellation />
      <div className="min-h-screen text-slate-100 flex flex-col items-center px-4 py-8 relative z-10">
        <h1 className="text-xl font-semibold mb-2">Coherex Cognitive Field</h1>
        <p className="text-sm text-slate-400 mb-6">
          Type what's on your mind. Coherex will break it down.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-6">
          <div className="relative w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent border border-slate-700 rounded-full px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={isLoading || isTyping}
              className="absolute right-1 top-1 bottom-1 px-4 rounded-full text-xs font-medium bg-sky-500 text-black disabled:opacity-40"
            >
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </div>
        </form>

        <div className="w-full max-w-2xl border border-slate-800 rounded-xl p-4 bg-black/40">
          {lines.map((line) => (
            <div key={line.id} className="whitespace-pre-wrap text-sm mb-2">
              {line.text}
            </div>
          ))}

          {displayedText && (
            <div className="whitespace-pre-wrap text-sm">
              {displayedText}
              <span className="inline-block w-2 h-4 bg-slate-300 ml-1 animate-pulse" />
            </div>
          )}

          {lastNextQuestion && !isTyping && (
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
                  className="w-full bg-transparent border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
