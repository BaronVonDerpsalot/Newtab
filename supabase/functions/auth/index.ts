// Supabase Edge Function: auth
//
// Validates the dashboard password server-side and returns the APP_TOKEN that
// authorizes the other functions (chat, feedback, debrief). This keeps the
// password and token OUT of the static client bundle: neither is ever shipped
// to the browser. The browser sends a password, and only on a correct match
// receives the token, which it then stores locally for subsequent requests.
//
// Secrets required (set via `supabase secrets set` or the dashboard):
//   APP_PASSWORD — the dashboard password
//   APP_TOKEN    — must match the APP_TOKEN used by the chat/feedback/debrief fns

const APP_PASSWORD = Deno.env.get("APP_PASSWORD") ?? "";
const APP_TOKEN    = Deno.env.get("APP_TOKEN") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// Constant-time comparison so a wrong guess can't be tuned via response timing.
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!APP_PASSWORD || !APP_TOKEN) return json({ error: "auth not configured" }, 500);

  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }
  if (typeof password !== "string" || !safeEqual(password, APP_PASSWORD)) {
    return json({ error: "unauthorized" }, 401);
  }
  return json({ token: APP_TOKEN });
});
