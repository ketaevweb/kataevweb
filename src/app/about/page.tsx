import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import { about, siteConfig } from "@/lib/data";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionWrapper } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: `Обо мне — ${siteConfig.name}`,
  description:
    "Веб-разработчик из Перми: живые сайты вместо макетов, фиксированная смета, Lighthouse 100 по SEO. Стек — Next.js, TypeScript, PostgreSQL.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Шапка страницы */}
        <section className="relative overflow-hidden">
          <div className="hero-glow absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32 sm:pb-20">
            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
              {/* Аватар: пока фото нет — монограмма. Когда появится настоящая
                  фотография, положите её в /public и укажите путь в about.photo
                  (src/lib/data.ts) — блок подхватит её сам. */}
              <Reveal>
                {about.photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={about.photo}
                    alt={`${siteConfig.name} — фото`}
                    className="h-28 w-28 rounded-3xl border border-white/10 object-cover sm:h-36 sm:w-36"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-28 w-28 items-center justify-center rounded-3xl bg-emerald-500 text-4xl font-extrabold text-zinc-950 sm:h-36 sm:w-36 sm:text-5xl"
                  >
                    {siteConfig.initials}
                  </span>
                )}
              </Reveal>

              <div>
                <Reveal delay={0.1}>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 sm:text-sm">
                    {siteConfig.name} · {siteConfig.city}
                  </p>
                  <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
                    Кто делает ваши сайты
                  </h1>
                </Reveal>
              </div>
            </div>

            {/* Рассказ о себе — три абзаца из data.ts */}
            <div className="mt-12 max-w-3xl space-y-5">
              {about.intro.map((paragraph, i) => (
                <Reveal key={i} delay={0.15 + i * 0.08}>
                  <p className="text-lg leading-relaxed text-zinc-300">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Факты-цифры — только проверяемые, никаких «10 лет опыта» */}
            <Reveal delay={0.3}>
              <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-white/5 pt-10 lg:grid-cols-4">
                {about.facts.map((fact) => (
                  <div key={fact.label}>
                    <dd className="text-3xl font-extrabold text-emerald-400">
                      {fact.value}
                    </dd>
                    <dd className="mt-2 text-sm leading-snug text-zinc-500">
                      {fact.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Как я работаю — принципы */}
        <SectionWrapper id="principles">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
                Подход
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Четыре принципа, на которых держится работа
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {about.principles.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 0.08} className="h-full">
                <article className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-emerald-500/30">
                  <p className="text-sm font-bold text-emerald-400">
                    0{i + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-bold">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {principle.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Стек */}
          <Reveal delay={0.2}>
            <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-7">
              <h3 className="font-bold">Стек, на котором я работаю</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                Осознанный фокус, а не случайный набор: один проверенный
                инструмент на роль. Поэтому сайт, сделанный сегодня, я смогу
                поддерживать и через пять лет.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {about.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-200"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </SectionWrapper>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal>
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-10 text-center sm:p-14">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Расскажите про свою задачу
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-zinc-400">
                Созвон 30 минут, после которого у вас будет структура сайта и
                понятная цена — даже если работать будем не сразу.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/#contact"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_-8px] hover:shadow-emerald-500/50 sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  Обсудить проект
                </a>
                <a
                  href="/#portfolio"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-700 px-8 font-semibold text-zinc-100 transition-colors hover:border-zinc-400 sm:w-auto"
                >
                  Смотреть работы
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
