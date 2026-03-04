/**
 * Tests for the /api/engine route handler.
 * The groq-sdk module is mocked so tests run without real API calls.
 */

import { createMocks } from "node-mocks-http";

const mockCreate = jest.fn();

jest.mock("../../lib/groq", () => ({
  groq: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

jest.mock("groq-sdk", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

// Silence console.error in tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

import handler from "../../pages/api/engine";
import { groq as sharedGroq } from "../../lib/groq";

const mockSharedCreate = sharedGroq!.chat.completions.create as jest.Mock;

const validAIResponse = JSON.stringify({
  predictedNextThought: "I will fail again",
  whyItAppears: "Fear of failure",
  patternDetected: "Catastrophising",
  protectedThought: "I have succeeded before and can again",
  reasoning: "Evidence shows past success",
});

describe("GET /api/engine", () => {
  it("returns 405 for non-POST requests", async () => {
    const { req, res } = createMocks({ method: "GET" });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method not allowed" });
  });
});

describe("POST /api/engine", () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockSharedCreate.mockReset();
    delete process.env.GROQ_API_KEY;
    delete process.env.NEXT_PUBLIC_GROQ_API_KEY;
  });

  it("returns 400 when both thought and query are missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { apiKey: "test-key" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "thought is required" });
  });

  it("returns 503 when no API key is provided and env is unset", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { thought: "I feel stuck" },
    });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(503);
    expect(res._getJSONData()).toEqual({ error: "No Groq API key available. Set GROQ_API_KEY in your environment or supply apiKey in the request body." });
  });

  it("accepts thought field and uses body apiKey", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validAIResponse } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { thought: "I feel stuck", apiKey: "body-key" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.predictedNextThought).toBe("I will fail again");
    expect(data.patternDetected).toBe("Catastrophising");
  });

  it("accepts query field as fallback for thought", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validAIResponse } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { query: "I feel stuck", apiKey: "body-key" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data.predictedNextThought).toBe("I will fail again");
  });

  it("uses shared Groq client (lib/groq) when env key is set", async () => {
    process.env.GROQ_API_KEY = "env-key";
    mockSharedCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validAIResponse } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { thought: "I feel stuck" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(mockSharedCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).not.toHaveBeenCalled();
    expect(res._getJSONData().predictedNextThought).toBe("I will fail again");
  });

  it("falls back to process.env.GROQ_API_KEY when no body apiKey", async () => {
    process.env.GROQ_API_KEY = "env-key";
    mockSharedCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validAIResponse } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { thought: "I feel stuck" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().predictedNextThought).toBe("I will fail again");
  });

  it("parses AI response wrapped in markdown code fences", async () => {
    const fencedResponse = "```json\n" + validAIResponse + "\n```";
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: fencedResponse } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { thought: "I feel stuck", apiKey: "body-key" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData().patternDetected).toBe("Catastrophising");
  });

  it("returns 500 when AI returns no content", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    });

    const { req, res } = createMocks({
      method: "POST",
      body: { thought: "I feel stuck", apiKey: "body-key" },
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
      body: { thought: "I feel stuck", apiKey: "body-key" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    const data = res._getJSONData();
    expect(data.error).toBe("Invalid AI response format");
    expect(data.raw).toBe("not valid json");
  });

  it("returns 401 when Groq throws an authentication error", async () => {
    const authError = Object.assign(new Error("Invalid API Key"), { status: 401 });
    mockCreate.mockRejectedValueOnce(authError);

    const { req, res } = createMocks({
      method: "POST",
      body: { thought: "I feel stuck", apiKey: "bad-key" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({
      error: "Invalid API key. Please provide a valid Groq API key.",
    });
  });

  it("surfaces upstream Groq error message in response", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Groq network error"));

    const { req, res } = createMocks({
      method: "POST",
      body: { thought: "I feel stuck", apiKey: "body-key" },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Groq network error" });
  });
});
