/**
 * Tests for the /api/search route handler.
 * The groq module is mocked so tests run without real API calls.
 */

import { createMocks } from "node-mocks-http";

// Mock lib/groq before importing the handler
jest.mock("../../lib/groq", () => ({
  groq: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

// Silence console.error in tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

import handler from "../../pages/api/search";
import { groq } from "../../lib/groq";

const mockCreate = groq.chat.completions.create as jest.Mock;

const validAIResponse = JSON.stringify({
  beliefType: "fear",
  emotionalCharge: 0.8,
  coreNeed: "Safety",
  hiddenAssumption: "Success means losing control",
  contradiction: "Wants success but fears it",
  rewrite: "I can succeed and still feel safe",
  nextQuestion: "What specifically feels unsafe about success?",
  answer: "This is a fear response.\n\nIt stems from early experiences.",
});

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
    expect(res._getJSONData()).toEqual({ error: "Query is required" });
  });

  it("returns 400 when query is not a string", async () => {
    const { req, res } = createMocks({ method: "POST", body: { query: 123 } });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });

  it("happy path: returns structured CoherexResponse for a valid query", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validAIResponse } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "Why do I keep sabotaging myself?" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.query).toBe("Why do I keep sabotaging myself?");
    expect(data.beliefType).toBe("fear");
    expect(data.emotionalCharge).toBe(0.8);
    expect(data.coreNeed).toBe("Safety");
    expect(data.hiddenAssumption).toBe("Success means losing control");
    expect(data.contradiction).toBe("Wants success but fears it");
    expect(data.rewrite).toBe("I can succeed and still feel safe");
    expect(data.nextQuestion).toBe("What specifically feels unsafe about success?");
    expect(data.answer).toContain("fear response");
  });

  it("returns defaults when AI response fields are missing", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ answer: "Some answer" }) } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "test query" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.beliefType).toBe("other");
    expect(data.emotionalCharge).toBe(0.5);
    expect(data.coreNeed).toBe("Unknown");
    expect(data.hiddenAssumption).toBe("None identified");
    expect(data.contradiction).toBe("None identified");
    expect(data.rewrite).toBe("test query");
    expect(data.nextQuestion).toBe("What matters most to you here?");
  });

  it("returns 500 when AI returns no content", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "test query" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "No response from AI" });
  });

  it("returns 500 when AI returns invalid JSON", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "not valid json" } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "test query" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Invalid AI response format" });
  });

  it("returns 500 when Groq throws an error", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Groq network error"));

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "test query" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    const data = res._getJSONData();
    expect(typeof data.error).toBe("string");
  });
});
