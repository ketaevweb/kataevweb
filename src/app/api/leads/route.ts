import { NextResponse } from "next/server";
import { z } from "zod";
import { db, ensureLeadTable } from "@/lib/db";
import { sendLeadToTelegram } from "@/lib/telegram";

/**
 * POST /api/leads — приём заявки с формы «Обсудить проект».
 * GET  /api/leads?pin=... — список заявок для панели в подвале сайта.
 * DELETE /api/leads?pin=...&id=... — удалить заявку (id=all — очистить все).
 *
 * Надёжность по схеме «два канала»: заявка ВСЕГДА сохраняется в SQLite,
 * а Telegram-уведомление — бонус сверху. Если Telegram недоступен,
 * POST всё равно вернёт успех.
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

// PIN-проверка для админ-методов (см. ADMIN_PIN в .env)
function isPinValid(request: Request): boolean {
  const pin = new URL(request.url).searchParams.get("pin");
  const adminPin = process.env.ADMIN_PIN ?? "2468";
  return pin === adminPin;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? "Проверьте правильность заполнения формы";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // Канал 1 (всегда): база данных.
    // ensureLeadTable: на serverless (Vercel) таблицы может не быть — создаём.
    await ensureLeadTable();
    const lead = await db.lead.create({
      data: parsed.data,
    });

    // Канал 2 (для надёжности): уведомление в Telegram, не влияет на результат
    const telegram = await sendLeadToTelegram(lead);

    console.log(
      `[lead] Заявка #${lead.id} от ${lead.name} (${lead.contact}); telegram: ${telegram}`
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
    return NextResponse.json({ error: "Неверный PIN" }, { status: 401 });
  }

  const leads = await ensureLeadTable().then(() =>
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })
  );

  return NextResponse.json({ leads });
}

export async function DELETE(request: Request) {
  if (!isPinValid(request)) {
    return NextResponse.json({ error: "Неверный PIN" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Не указан id заявки" }, { status: 400 });
  }

  if (id === "all") {
    await ensureLeadTable();
    const result = await db.lead.deleteMany({});
    return NextResponse.json({ ok: true, deleted: result.count });
  }

  try {
    await ensureLeadTable();
    await db.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }
}
