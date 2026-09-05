import { NextResponse } from "next/server";
import { z } from "zod";
import {
  clearLeads,
  getLeadsBackend,
  listLeads,
  removeLead,
  saveLead,
} from "@/lib/leads-store";
import { sendLeadToTelegram } from "@/lib/telegram";

/**
 * POST /api/leads — приём заявки с формы «Обсудить проект».
 * GET  /api/leads (header x-admin-pin) — список заявок для панели в подвале сайта.
 * DELETE /api/leads?id=... (header x-admin-pin) — удалить заявку (id=all — очистить все).
 *
 * PIN передаётся ТОЛЬКО заголовком x-admin-pin: query-параметр оседает в логах
 * Vercel/CDN и в истории браузера — исходная мотивация ротации PIN (ревью Task 29).
 * Ответы админ-методов — no-store: список заявок не должен кэшироваться.
 *
 * Надёжность по схеме «два канала»: заявка ВСЕГДА сохраняется в базу
 * (Postgres/Neon через LEADS_DATABASE_URL, при его отсутствии или недоступности —
 * SQLite-фолбэк), а Telegram-уведомление — бонус сверху. Если Telegram
 * недоступен, POST всё равно вернёт успех.
 *
 * Валидация на zod: сервер никогда не доверяет данным из формы.
 */

const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно быть не короче 2 символов")
    .max(80, "Имя слишком длинное"),
  contact: z
    .string()
    .trim()
    .min(5, "Укажите Telegram, телефон или почту")
    .max(100, "Контакт слишком длинный"),
  message: z
    .string()
    .trim()
    .min(10, "Опишите задачу хотя бы в паре предложений")
    .max(2000, "Описание слишком длинное"),
});

// PIN-проверка для админ-методов. PIN задаётся ТОЛЬКО в env (ADMIN_PIN):
// дефолт из кода убран — иначе ротация env бессмысленна (2468 пережил бы её).
// fail-closed: без env в проде админ-методы недоступны.
function isPinValid(request: Request): boolean {
  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) return false;
  const provided = request.headers.get("x-admin-pin");
  return provided !== null && provided === adminPin;
}

/**
 * Анти-спам: rate limit в памяти процесса.
 * На serverless каждый инстанс считает свои хиты — это не глобальный лимит,
 * но боты с одного IP он срезает надёжно (5 заявок/час достаточно любому клиенту).
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const rateHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    rateHits.set(ip, recent); // обновляем, чтобы старые записи не копились
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  // Гигиена памяти: карта разрастается — чистим устаревшие записи
  if (rateHits.size > 1000) {
    for (const [key, stamps] of rateHits) {
      if (stamps.every((t) => now - t >= RATE_WINDOW_MS)) rateHits.delete(key);
    }
  }
  return false;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  try {
    // Rate limit: до zod, чтобы дешёвый отказ шёл раньше любой работы с базой
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Слишком много заявок с одного адреса. Напишите мне сразу в Telegram — отвечу там же.",
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    // Honeypot: скрытое поле «сайт компании» человек не видит и не заполняет.
    // Боты заполняют всё подряд — им отвечаем как будто всё хорошо (201),
    // но заявку не сохраняем и в Telegram не отправляем.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      console.log(`[lead] Honeypot сработал (${ip}) — заявка отброшена тихо`);
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? "Проверьте правильность заполнения формы";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // Канал 1 (всегда): база данных (Postgres/Neon или SQLite-фолбэк).
    const lead = await saveLead(parsed.data);

    // Канал 2 (для надёжности): уведомление в Telegram, не влияет на результат
    const telegram = await sendLeadToTelegram(lead);

    console.log(
      `[lead] Заявка #${lead.id} от ${lead.name} (${lead.contact}); backend: ${getLeadsBackend()}; telegram: ${telegram}`
    );

    return NextResponse.json({ ok: true, id: lead.id, telegram }, { status: 201 });
  } catch (error) {
    console.error("[lead] Ошибка обработки заявки:", error);
    return NextResponse.json(
      { error: "Сервер не смог обработать заявку. Попробуйте позже." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  if (!isPinValid(request)) {
    return NextResponse.json(
      { error: "Неверный PIN" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const leads = await listLeads(50);

  // backend — источник истины для панели (Task 37, ревью Task 35–36):
  // при фолбэке на SQLite заявки эфемерны (/tmp на Vercel), панель обязана
  // это показать, а не молча выглядеть пустой. POST-ответ не менялся:
  // инфраструктурные детали не утекают публичным клиентам.
  return NextResponse.json(
    { leads, backend: getLeadsBackend() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function DELETE(request: Request) {
  if (!isPinValid(request)) {
    return NextResponse.json(
      { error: "Неверный PIN" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Не указан id заявки" }, { status: 400 });
  }

  if (id === "all") {
    const deleted = await clearLeads();
    return NextResponse.json({ ok: true, deleted });
  }

  const removed = await removeLead(id);
  if (removed) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
}
