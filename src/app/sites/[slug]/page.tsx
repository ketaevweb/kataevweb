import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_SITES, getDemoSite } from "@/lib/demo-sites";
import { DemoViewer } from "@/components/site/DemoViewer";

/**
 * /sites/[slug] — показ демо-сайтов клиентам под доменом портфолио.
 * Список слагов — белый список в src/lib/demo-sites.ts: страницы
 * пререндерятся при сборке, чужие/опечаточные адреса дают 404.
 * Индексация закрыта: демо-показ — приватная витрина для клиентов.
 */

// Только слаги из DEMO_SITES (404 на всё остальное без рантайм-проверок)
export const dynamicParams = false;

export function generateStaticParams() {
  return DEMO_SITES.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = getDemoSite(slug);
  if (!site) return {};
  return {
    title: `${site.title} — пример сайта`,
    description:
      "Сайт-пример от Егора Катаева: лендинги и сайты для бизнеса на Next.js, удалённо по всей России.",
    // Демо-показ не для поисковиков: только прямые ссылки клиентам
    robots: { index: false, follow: false },
  };
}

export default async function DemoSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = getDemoSite(slug);
  if (!site) notFound();
  return <DemoViewer site={site} />;
}
