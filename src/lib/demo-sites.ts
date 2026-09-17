/**
 * lib/demo-sites.ts — белый список демо-сайтов для показа клиентам.
 *
 * Зачем: концепты-демо, собранные на space-z.ai, показываются клиенту
 * не с «технического» домена *.space-z.ai, а через адрес портфолио:
 *
 *     https://kataevweb.ru/sites/<slug>
 *
 * Страница /sites/[slug] открывает демо в полноэкранном фрейме с тонкой
 * плашкой-шапкой (ссылка назад на портфолио + кнопка «Обсудить проект»).
 * Адресная строка и все пересланные ссылки остаются на kataevweb.ru.
 *
 * Почему белый список, а не «любой <slug>.space-z.ai»: открытый вьюер
 * превратил бы kataevweb.ru в прокси для чужих сайтов (любой человек мог
 * бы показывать произвольный сайт от имени вашего домена). Со списком
 * показываются только ваши демо.
 *
 * ─── Как добавить новое демо (1 строка + деплой) ──────────────────────
 * 1. Создайте сайт на space-z.ai → получите https://<имя>.space-z.ai
 * 2. Добавьте запись в DEMO_SITES: slug = <имя>, title — название для плашки
 *    (если демо живёт не на space-z.ai, укажите origin явно)
 * 3. Деплой kataevweb (build → push → revision deploy) — страницы
 *    /sites/* пререндериваются при сборке.
 * ───────────────────────────────────────────────────────────────────────
 */

export type DemoSite = {
  /** slug = часть адреса /sites/<slug>; по умолчанию совпадает с <имя>.space-z.ai */
  slug: string;
  /** Название в верхней плашке вьюера и в <title> */
  title: string;
  /** Короткая подпись типа проекта (опционально) */
  kind?: string;
  /** Origin демо, если оно живёт НЕ на https://<slug>.space-z.ai */
  origin?: string;
};

export const DEMO_SITES: DemoSite[] = [
  {
    slug: "barbersem",
    title: "Barber Sem",
    kind: "Барбершоп · лендинг с онлайн-записью",
  },
];

export function getDemoSite(slug: string): DemoSite | undefined {
  return DEMO_SITES.find((s) => s.slug === slug);
}

/** Реальный адрес демо (по умолчанию — https://<slug>.space-z.ai) */
export function demoUrl(site: DemoSite): string {
  return site.origin ?? `https://${site.slug}.space-z.ai`;
}
