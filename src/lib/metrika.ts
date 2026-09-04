/**
 * Яндекс.Метрика: безопасный вызов цели с любой клиентской точки.
 *
 * Счётчик подключается в layout через <YandexMetrika />; он активен,
 * только если задан NEXT_PUBLIC_YANDEX_METRICA_ID (ID счётчика берётся
 * на metrika.yandex.ru → Vercel → Settings → Environment Variables →
 * Redeploy). Без переменной всё безболезненно отключено.
 *
 * Цели на сайте:
 *  - lead_form_submit    — отправлена форма заявки (Contact)
 *  - calculator_to_contact — «Отправить расчёт» из калькулятора
 *  - telegram_click      — клик по плавающей TG-кнопке
 *  - pdf_download        — скачивание PDF-портфолио (/about, /calculator)
 */
export function reachGoal(goal: string) {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
  if (!id || typeof window === "undefined") return;
  const w = window as unknown as {
    ym?: (...args: unknown[]) => void;
  };
  if (typeof w.ym === "function") w.ym(Number(id), "reachGoal", goal);
}
