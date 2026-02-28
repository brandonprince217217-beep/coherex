import OpenAI from "openai";
import { validateServerEnv } from "./env";

validateServerEnv();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
