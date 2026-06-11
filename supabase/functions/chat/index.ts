// Supabase Edge Function: chat
//
// Multi-turn crisis-support chat proxy to the Anthropic Messages API.
// Receives { system, messages } from the client and returns { reply }.
// APP_TOKEN gates the function to prevent open proxy abuse.
//
// Secrets required (set via `supabase secrets set` or the dashboard):
//   ANTHROPIC_API_KEY  — your Anthropic API key
//   APP_TOKEN          — must match APP_TOKEN in index.html

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const APP_TOKEN         = Deno.env.get("APP_TOKEN") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-app-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  if (!APP_TOKEN || req.headers.get("x-app-token") !== APP_TOKEN) {
    return json({ error: "unauthorized" }, 401);
  }
  if (!ANTHROPIC_API_KEY) {
    return json({ error: "ANTHROPIC_API_KEY not configured" }, 500);
  }

  let system: string;
  let messages: Array<{ role: string; content: string }>;
  try {
    ({ system, messages } = await req.json());
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }
  if (!system || !Array.isArray(messages) || messages.length === 0) {
    return json({ error: "missing system or messages" }, 400);
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        system,
        messages,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return json({ error: "anthropic_error", detail: data }, 502);
    }

    const reply = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();

    return json({ reply });
  } catch (e) {
    return json({ error: "fetch_failed", detail: String(e) }, 502);
  }
});
