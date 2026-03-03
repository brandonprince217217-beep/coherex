/**
 * Server-side environment variable validation.
 * This module MUST only be imported in server contexts (API routes, getServerSideProps, etc.).
 * Never import from client-side code.
 */

const REQUIRED_SERVER_ENV: Record<string, string> = {
  GROQ_API_KEY: "Groq API key (get it at https://console.groq.com/keys)",
};

export function validateServerEnv(): void {
  const missing: string[] = [];

  for (const [key, description] of Object.entries(REQUIRED_SERVER_ENV)) {
    if (!process.env[key]) {
      missing.push(`  ${key} — ${description}`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required server-side environment variables:\n${missing.join("\n")}\n\n` +
        `Copy .env.example to .env.local and fill in the values.`
    );
  }
}

/**
 * Returns an array of missing required env var names (does not throw).
 * Use in API route handlers to return structured error responses.
 */
export function getMissingServerEnv(): string[] {
  return Object.keys(REQUIRED_SERVER_ENV).filter((key) => !process.env[key]);
}
