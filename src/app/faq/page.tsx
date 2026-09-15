import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, MessageCircle } from "lucide-react";
import { faqItems, siteConfig } from "@/lib/data";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";

// Отдельная страница FAQ (ревью 15.09.2026): ответы живут в исходном HTML
// серверного рендера — их видят поисковики без выполнения JS, а страница
// собирает информационный трафик («сколько стоит лендинг» и т.п.).
export const metadata: Metadata = {
  title: `Частые вопросы о заказе сайта — ${siteConfig.name}`,
  description:
    "Сколько стоит лендинг или магазин, какие сроки, почему Next.js вместо Tilda, как проходит оплата и что будет после запуска — честные ответы до старта проекта.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `Частые вопросы о заказе сайта — ${siteConfig.name}`,
    description:
      "Цены, сроки, оплата, поддержка после запуска — честные ответы на вопросы, которые задают до старта проекта.",
    url: `${siteConfig.url}/faq`,
    siteName: siteConfig.name,
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/og-photo.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — частые вопросы о заказе сайта`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Частые вопросы о заказе сайта — ${siteConfig.name}`,
    description:
      "Цены, сроки, оплата, поддержка после запуска — честные ответы до старта проекта.",
    images: ["/og-photo.jpg"],
  },
};

// FAQPage — только на страницах, где вопросы реально видны пользователю:
// здесь и на главной (секция #faq). В корневом layout ему не место.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: siteConfig.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Вопросы и ответы",
      item: `${siteConfig.url}/faq`,
    },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        {/* Шапка страницы */}
        <section className="relative overflow-hidden">
          <div className="hero-glow absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-3xl px-6 pb-10 pt-32">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                FAQ
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Вопросы и ответы
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-zinc-400">
                Всё, что обычно спрашивают до старта проекта: цены, сроки,
                оплата и что будет после запуска. Отвечаю честно — так проще
                принять решение. Если вашего вопроса здесь нет, напишите в{" "}
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline-offset-4 transition-colors hover:text-emerald-300 hover:underline"
                >
                  Telegram
                </a>{" "}
                — отвечу в течение дня.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Вопросы — статический HTML, без аккордеона */}
        <section className="mx-auto w-full max-w-3xl px-6">
          <div className="divide-y divide-white/5">
            {faqItems.map((item, i) => (
              <Reveal key={item.question} delay={Math.min(i * 0.04, 0.3)}>
                <article id={`q-${i + 1}`} className="py-8">
                  <h2 className="text-xl font-bold leading-snug">
                    {item.question}
                  </h2>
                  <p className="mt-3 leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA — калькулятор и заявка */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-24">
          <Reveal>
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 sm:p-10">
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Остались вопросы — прикиньте бюджет
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                Калькулятор за 30 секунд покажет предварительную сумму и срок —
                без звонка менеджера. Финальная смета фиксируется после
                короткого брифа и не меняется в процессе работы.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/calculator"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_-8px] hover:shadow-emerald-500/50"
                >
                  <Calculator className="h-4 w-4" />
                  Рассчитать стоимость
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-700 px-8 font-semibold text-zinc-100 transition-colors hover:border-zinc-400"
                >
                  <MessageCircle className="h-4 w-4" />
                  Оставить заявку
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
