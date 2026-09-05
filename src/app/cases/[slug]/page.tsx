import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import {
  caseStudies,
  metricsMeasuredAt,
  portfolioCases,
  siteConfig,
} from "@/lib/data";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionWrapper } from "@/components/site/SectionHeading";

// Слаги кейсов известны на этапе сборки — генерируем страницы статически
export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

// В Next 16 params — Promise: ждём его и отдаём метаданные конкретного кейса
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies[slug];
  const item = portfolioCases.find((c) => c.slug === slug);
  if (!study || !item) return {};
  return {
    title: `${item.title} — разбор кейса`,
    description: `${item.description} Задача, решение, инженерные детали и реальные Lighthouse-метрики.`,
    alternates: { canonical: `/cases/${slug}` },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies[slug];
  const item = portfolioCases.find((c) => c.slug === slug);
  if (!study || !item) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Шапка кейса */}
        <section className="relative overflow-hidden">
          <div className="hero-glow absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-32">
            <Reveal>
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Все работы
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                  {item.kind}
                </p>
                {item.status === "product" ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Работающий продукт
                  </span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
                    Концепт · демо
                  </span>
                )}
              </div>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                {item.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-zinc-400">
                {item.description}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                {/* liveSuspended (временно): живой сайт деградирован — кнопка
                    скрыта, чтобы не вести посетителя на сломанное демо.
                    Реверс — снять флаг в data.ts, кнопка вернётся сама. */}
                {!item.liveSuspended && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_-8px] hover:shadow-emerald-500/50"
                  >
                    Открыть живой сайт
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                <Link
                  href="/#contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-700 px-8 font-semibold text-zinc-100 transition-colors hover:border-zinc-400"
                >
                  Обсудить похожий проект
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Скриншот */}
        <section className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 sm:aspect-video">
              <Image
                src={item.image}
                alt={`Скриншот: ${item.title}`}
                fill
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="object-cover object-top"
                priority
              />
            </div>
          </Reveal>
        </section>

        {/* Задача → Решение */}
        <SectionWrapper id="story">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                  Задача
                </p>
                <p className="mt-5 leading-relaxed text-zinc-300">
                  {study.task}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                  Решение
                </p>
                <p className="mt-5 leading-relaxed text-zinc-300">
                  {study.solution}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Что внутри */}
          <Reveal>
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <h2 className="text-xl font-bold">Что под капотом</h2>
              <ul className="mt-5 space-y-3">
                {study.inside.map((detail) => (
                  <li key={detail} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <span className="leading-relaxed text-zinc-300">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Метрики — реальные замеры Lighthouse */}
          <Reveal>
            <div className="mt-10">
              <h2 className="text-xl font-bold">
                Метрики — замер Lighthouse 13 по живому адресу
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Эмуляция смартфона, замер от {metricsMeasuredAt}. CLS ноль
                означает, что вёрстка не «прыгает» при загрузке.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {study.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <dd className="text-2xl font-extrabold text-emerald-400">
                      {metric.value}
                    </dd>
                    <dt className="mt-1.5 text-xs leading-snug text-zinc-500">
                      {metric.label}
                      {metric.hint && (
                        <span className="mt-1 block text-[11px] text-zinc-600">
                          {metric.hint}
                        </span>
                      )}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Вердикт */}
          <Reveal>
            <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                Итог
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-200">
                {study.verdict}
              </p>
              <p className="mt-4 text-sm text-zinc-500">
                Хотите так же для своего бизнеса —{" "}
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline-offset-4 transition-colors hover:text-emerald-300 hover:underline"
                >
                  напишите в Telegram
                </a>{" "}
                или{" "}
                <Link
                  href="/#contact"
                  className="text-emerald-400 underline-offset-4 transition-colors hover:text-emerald-300 hover:underline"
                >
                  оставьте заявку на главной
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
