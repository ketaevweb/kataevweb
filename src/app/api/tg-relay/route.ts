/**
 * TG-relay: Yandex Cloud egress → api.telegram.org недоступен из RU,
 * поэтому контейнеры YC шлют уведомления через этот релей на Vercel.
 *
 * Секреты (заголовок x-relay-secret, достаточно любого):
 *   TG_RELAY_SECRET   — секрет ревизии v7+ (живые контейнеры, Task 59)
 *   TG_RELAY_SECRET_2 — секрет для новых контейнеров (fasad/opishem, Task 61)
 *
 * Токен бота не покидает Vercel-env: TELEGRAM_BOT_TOKEN этого проекта.
 * GET — health (без секретов). POST — прокси в sendMessage.
 */
export const dynamic = "force-dynamic";

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

  let body: { text?: string; chat_id?: string | number; parse_mode?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const { text, chat_id, parse_mode } = body;
  if (!text || typeof text !== "string") {
    return Response.json({ ok: false, error: "text_required" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = chat_id ?? process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return Response.json({ ok: false, error: "relay_not_configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...(parse_mode ? { parse_mode } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.ok ? 200 : 502 });
  } catch (e) {
    console.error("[tg-relay] telegram error", e);
    return Response.json({ ok: false, error: "telegram_unreachable" }, { status: 502 });
  }
}
