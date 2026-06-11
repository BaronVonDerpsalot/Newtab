// Supabase Edge Function: feedback
//
// Proxies a habit-stats payload to the Anthropic Messages API and returns a
// short, supportive, evidence-based coaching note. The Anthropic key lives only
// as a Supabase secret (ANTHROPIC_API_KEY) — never in the client. A shared
// APP_TOKEN header gates the function so it isn't an open Anthropic proxy.
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

const SYSTEM_PROMPT = `You are a warm, perceptive, evidence-based habit coach embedded in someone's personal tracking dashboard. The person is recovering from a compulsive habit and rebuilding healthy daily routines. You receive their tracked stats — short-term (last 7 days) and longer-term (last 30 days) — and offer caring, specific, grounded observations.

Grounding facts you may draw on (already part of this app's philosophy):
- Sleep is load-bearing. A single night under ~6 hours measurably impairs the prefrontal cortex — the exact region responsible for impulse control — and increases dopamine sensitivity in the reward pathway, so cravings hit harder while the brake is weaker. Poor sleep makes a relapse meaningfully more likely the next day.
- Exercise directly rebuilds the hardware: ~6 weeks of regular exercise increases D2 receptor density (the receptors downregulated by compulsive use), BDNF spikes aid neuroplasticity, and prefrontal-cortex volume grows over months.
- Recovery is non-linear — an early "flatline" (grey, low-motivation) period is recalibration, not damage. Things register again over months.
- Tracking here is about cumulative wins, not streaks. A slip is a lower number, not a catastrophe or a restart.

How to respond:
- Open with the single most important observation, tied to a specific number from their data.
- Connect deficits to concrete consequences ("you've averaged 5.2h sleep this week — here's how that's working against you in X and Y ways"), using the facts above where relevant.
- Acknowledge what's going well; don't only flag problems.
- Be concrete and kind, never preachy, clinical, or alarmist. No emoji. No markdown headers.
- Keep it to 2–4 short paragraphs. Speak directly to them ("you").
- If data is sparse, say so gently and encourage a few more days of tracking rather than over-interpreting.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  if (!APP_TOKEN || req.headers.get("x-app-token") !== APP_TOKEN) {
    return json({ error: "unauthorized" }, 401);
  }
  if (!ANTHROPIC_API_KEY) {
    return json({ error: "ANTHROPIC_API_KEY not configured" }, 500);
  }

  let stats: unknown;
  try {
    ({ stats } = await req.json());
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }
  if (!stats) return json({ error: "missing stats" }, 400);

  const userMessage =
    `Here are my tracked stats as JSON:\n\n${JSON.stringify(stats, null, 2)}\n\n` +
    `Give me your honest, caring read on how I'm doing — both the short-term picture and the longer trend.`;

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
        max_tokens: 3000,
        thinking: { type: "adaptive" },
        output_config: { effort: "high" },
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return json({ error: "anthropic_error", detail: data }, 502);
    }
    if (data.stop_reason === "refusal") {
      return json({
        feedback:
          "I wasn't able to generate a reflection on this one. Try again, or check back after logging a bit more.",
      });
    }

    const feedback = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();

    return json({ feedback });
  } catch (e) {
    return json({ error: "fetch_failed", detail: String(e) }, 502);
  }
});
