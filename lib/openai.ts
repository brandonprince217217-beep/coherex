import OpenAI from "openai";

export const openai: OpenAI | null = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
