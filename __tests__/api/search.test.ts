/**
 * Tests for the /api/search route handler.
 * The openai module is mocked so tests run without real API calls.
 */

import { createMocks } from "node-mocks-http";

// Mock lib/openai before importing the handler
jest.mock("../../lib/openai", () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

// Silence console.error in tests
beforeAll(() => {
  // Provide a fake key so env validation passes in all tests by default
  process.env.OPENAI_API_KEY = "test-key";
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  delete process.env.OPENAI_API_KEY;
  (console.error as jest.Mock).mockRestore();
});

import handler from "../../pages/api/search";
import { openai } from "../../lib/openai";

const mockCreate = openai.chat.completions.create as jest.Mock;

describe("GET /api/search", () => {
  it("returns 405 for non-POST requests", async () => {
    const { req, res } = createMocks({ method: "GET" });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method not allowed" });
  });
});

describe("POST /api/search", () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it("returns 400 when query is missing", async () => {
    const { req, res } = createMocks({ method: "POST", body: {} });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Missing query" });
  });

  it("returns 400 when query is empty string", async () => {
    const { req, res } = createMocks({ method: "POST", body: { query: "   " } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  it("returns 503 with structured error when OPENAI_API_KEY is missing", async () => {
    const savedKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const { req, res } = createMocks({ method: "POST", body: { query: "pricing" } });
    await handler(req as any, res as any);

    process.env.OPENAI_API_KEY = savedKey;

    expect(res._getStatusCode()).toBe(503);
    const data = res._getJSONData();
    expect(typeof data.error).toBe("string");
    expect(data.error).toMatch(/OPENAI_API_KEY/i);
  });

  it("greeting query returns 200 with empty results and no LLM call", async () => {
    const { req, res } = createMocks({ method: "POST", body: { query: "hello" } });
    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(typeof data.answer).toBe("string");
    expect(data.answer.length).toBeGreaterThan(0);
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results).toHaveLength(0);
    // LLM must NOT be called for greetings
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("informational query with no matching sources returns 200 with empty results and no LLM call", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { query: "quantum teleportation xyz zzzz" },
    });
    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(typeof data.answer).toBe("string");
    expect(data.results).toHaveLength(0);
    // LLM must NOT be called when no sources pass the threshold
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("happy path: returns answer and results for a valid query", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "Coherex is a cognitive OS. [1]" } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "what is coherex" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(typeof data.answer).toBe("string");
    expect(data.answer).toContain("Coherex");
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results[0]).toHaveProperty("title");
    expect(data.results[0]).toHaveProperty("url");
    expect(data.results[0]).toHaveProperty("snippet");
  });

  it("results only include sources relevant to the query", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "Pricing info [1]" } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "pricing plans" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    // Only the Pricing source should be returned (not Home/About/Demo)
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.every((r: { title: string }) => r.title === "Pricing")).toBe(true);
  });

  it("returns 503 when OpenAI throws an error", async () => {
    mockCreate.mockRejectedValueOnce(new Error("OpenAI network error"));

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "pricing" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(503);
    const data = res._getJSONData();
    expect(typeof data.error).toBe("string");
  });

  it("returns 503 with timeout message when request times out", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Search request timed out"));

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "demo" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(503);
    const data = res._getJSONData();
    expect(data.error).toMatch(/timed out/i);
  });

  it("handles malformed response: missing choices gracefully", async () => {
    mockCreate.mockResolvedValueOnce({ choices: [] });

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "about" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.answer).toBe("");
  });
});
