/**
 * Отправка заявки в Telegram — «второй канал» доставки для надёжности.
 *
 * Настройка (см. .env):
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   — ваш chat_id (узнать у @userinfobot)
 *
 * Функция НИКОГДА не бросает исключений: если Telegram недоступен
 * или не настроен, заявка всё равно остаётся в базе, а POST /api/leads
 * вернёт статус доставки ("sent" | "not_configured" | "failed").
 */

type LeadPayload = {
  id: string;
  name: string;
  contact: string;
  message: string;
};

export async function sendLeadToTelegram(
  lead: LeadPayload
): Promise<"sent" | "not_configured" | "failed"> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return "not_configured";

  // Экранируем HTML, чтобы текст заявки не сломал разметку сообщения
  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const text = [
    `<b>Новая заявка с сайта</b> #${escapeHtml(lead.id.slice(-6))}`,
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Контакт:</b> ${escapeHtml(lead.contact)}`,
    `<b>Задача:</b> ${escapeHtml(lead.message)}`,
  ].join("\n");

  try {
    // ── YC egress: api.telegram.org недоступен из RU-egress Yandex Cloud ──
    // Если задан TG_RELAY_URL — шлём через релей на Vercel (Task 59/61);
    // на Vercel-деплое переменная не задана → прямой вызов как раньше.
    const relayUrl = process.env.TG_RELAY_URL;
    const relaySecret = process.env.TG_RELAY_SECRET;
    if (relayUrl && relaySecret) {
      const relayRes = await fetch(relayUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-relay-secret": relaySecret },
        body: JSON.stringify({ text, chat_id: chatId, parse_mode: "HTML" }),
        signal: AbortSignal.timeout(8000),
      });
      if (!relayRes.ok) {
        console.error(`[telegram] релей ответил ${relayRes.status}: ${await relayRes.text()}`);
        return "failed";
      }
      return "sent";
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
      // Не ждём Telegram дольше 5 секунд — клиент не должен висеть
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`[telegram] API ответил ${res.status}: ${await res.text()}`);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[telegram] Не удалось доставить уведомление:", error);
    return "failed";
  }
}
