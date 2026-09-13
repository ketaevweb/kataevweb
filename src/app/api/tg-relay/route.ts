/**
 * TG-relay: Yandex Cloud egress → api.telegram.org недоступен из RU,
 * поэтому контейнеры YC шлют уведомления через этот релей на Vercel.
 *
 * Секреты (заголовок x-relay-secret, достаточно любого):
 *   TG_RELAY_SECRET   — секрет ревизии v7+ (живые контейнеры, Task 59)
 *   TG_RELAY_SECRET_2 — секрет для новых контейнеров (fasad/opishem, Task 61)
 *
 * POST-тело, два формата:
 *   {text, chat_id?, parse_mode?}            → sendMessage (совместимость v7)
 *   {method: "sendMessage", payload: {...}}  → произвольный метод из вайтистлиста
 *
 * Токен бота не покидает Vercel-env: TELEGRAM_BOT_TOKEN этого проекта.
 * GET — health (без секретов).
 */
export const dynamic = "force-dynamic";

const ALLOWED_METHODS = new Set([
  "sendMessage",
  "sendInvoice",
  "answerPreCheckoutQuery",
  "answerCallbackQuery",
  "editMessageText",
  "deleteMessage",
  "setWebhook",
  "getWebhookInfo",
]);

const isAllowedSecret = (s: string | null): boolean => {
  const valid = [process.env.TG_RELAY_SECRET, process.env.TG_RELAY_SECRET_2]
    .filter(Boolean) as string[];
  return !!s && valid.includes(s);
};

export async function GET() {
  return Response.json({ ok: true, relay: true });
}

export async function POST(req: Request) {
  const secret = req.headers.get("x-relay-secret");
  if (!isAllowedSecret(secret)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: {
    text?: string;
    chat_id?: string | number;
    parse_mode?: string;
    method?: string;
    payload?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  let method = "sendMessage";
  let payload: Record<string, unknown>;

  if (body.method) {
    if (!ALLOWED_METHODS.has(body.method)) {
      return Response.json({ ok: false, error: "method_not_allowed" }, { status: 400 });
    }
    method = body.method;
    payload = body.payload ?? {};
  } else {
    if (!body.text || typeof body.text !== "string") {
      return Response.json({ ok: false, error: "text_required" }, { status: 400 });
    }
    payload = { text: body.text, ...(body.chat_id ? { chat_id: body.chat_id } : {}) };
    if (body.parse_mode) payload.parse_mode = body.parse_mode;
    if (!payload.chat_id) payload.chat_id = process.env.TELEGRAM_CHAT_ID;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return Response.json({ ok: false, error: "relay_not_configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.ok ? 200 : 502 });
  } catch (e) {
    console.error("[tg-relay] telegram error", e);
    return Response.json({ ok: false, error: "telegram_unreachable" }, { status: 502 });
  }
}
