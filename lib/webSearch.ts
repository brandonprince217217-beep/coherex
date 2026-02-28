/**
 * Web search abstraction backed by the Brave Search API.
 *
 * Required env var:
 *   BRAVE_SEARCH_API_KEY  — Brave Web Search subscription token
 *                           (https://brave.com/search/api/)
 *
 * If the key is absent the function returns an empty array so the API
 * route degrades gracefully.
 */

export type WebResult = {
  title: string;
  url: string;
  snippet: string;
};

const BRAVE_API_URL = "https://api.search.brave.com/res/v1/web/search";
const TIMEOUT_MS = 8_000;

export async function fetchWebResults(
  query: string,
  count = 5
): Promise<WebResult[]> {
  const key = process.env.BRAVE_SEARCH_API_KEY;
  if (!key) return [];

  const url = `${BRAVE_API_URL}?${new URLSearchParams({
    q: query,
    count: String(count),
    safesearch: "moderate",
  })}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": key,
      },
      signal: controller.signal,
    });

    if (!resp.ok) return [];

    const data = await resp.json();
    const items: Array<{ title?: string; url?: string; description?: string }> =
      data?.web?.results ?? [];

    return items.slice(0, count).map((r) => ({
      title: r.title ?? "",
      url: r.url ?? "",
      snippet: r.description ?? "",
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
