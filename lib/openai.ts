import OpenAI from "openai";
import { validateServerEnv } from "./env";

validateServerEnv();

export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const groqModel =
  process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
