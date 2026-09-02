import { ArrowRight, MessageCircle } from "lucide-react";
import { hero, siteConfig } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Декоративный фон: свечение + сетка */}
      <div className="hero-glow absolute inset-0" aria-hidden="true" />
      <div className="hero-grid absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 sm:text-sm">
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
              {hero.titleStart}{" "}
              <span className="text-emerald-400">{hero.titleAccent}</span>
            </h1>
          </Reveal>

          {/* Честная сноска под оффером: снимает противоречие
              «приносят заявки» vs «коммерческих заказов не было» —
              ревью: превратить честность в фичу, а не в риск. */}
          <Reveal delay={0.15}>
            <p className="mt-4 text-sm text-zinc-500">
              Коммерческих заказов пока не было —{" "}
              <a
                href="/blog/pochemu-u-menya-net-otzyvov"
                className="text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-emerald-400"
              >
                честно объясняю, почему
              </a>
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_-8px] hover:shadow-emerald-500/50 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Обсудить проект
              </a>
              <a
                href="#portfolio"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-zinc-700 px-8 font-semibold text-zinc-100 transition-colors hover:border-zinc-400 sm:w-auto"
              >
                Смотреть работы
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 border-t border-white/5 pt-8 sm:grid-cols-3">
              {hero.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold text-zinc-100">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-sm text-zinc-500">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
