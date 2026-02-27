import { NextResponse } from "next/server";
import { analyzeMessageDeep } from "../../lib/cognitive/model";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { message, historySummary } = await req.json();

    if (!message || typeof message !== "string") {
      return new NextResponse(
        JSON.stringify({ error: "Missing message" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const analysis = await analyzeMessageDeep(message, historySummary || null);

    return new NextResponse(JSON.stringify(analysis), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: "Cognitive analysis failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
