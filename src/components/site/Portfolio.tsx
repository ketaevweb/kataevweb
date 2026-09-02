import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { portfolioCases } from "@/lib/data";
import { Reveal } from "./Reveal";
import {
  SectionHeading,
  SectionWrapper,
} from "@/components/site/SectionHeading";

/**
 * Секция «Работы» — живые сайты: концепты-демо и работающий продукт.
 * Вся карточка — одна ссылка: клик открывает сайт кейса в новой вкладке.
 * Скриншоты лежат в /public/portfolio (WebP, по ~50–250 КБ).
 */
export function Portfolio() {
  return (
    <SectionWrapper id="portfolio">
      <SectionHeading
        eyebrow="Работы"
        title="Восемь живых сайтов — от концептов до продукта"
        subtitle="Каждый проект можно открыть и потрогать прямо сейчас. Демо — это честные концепты для портфолио, «Опишем» — работающий продукт с реальными пользователями."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {portfolioCases.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1} className="h-full">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.title} — открыть сайт в новой вкладке`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)]"
            >
              {/* Скриншот сайта: сжимается при наведении, как «взгляд в окно» */}
              <div className="relative aspect-video overflow-hidden bg-zinc-900">
                <Image
                  src={item.image}
                  alt={`Скриншот: ${item.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Честный статус кейса: продукт vs концепт-демо */}
                {item.status === "product" ? (
                  <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-zinc-950/80 px-3 py-1 text-xs text-emerald-300 backdrop-blur">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Работающий продукт
                  </span>
                ) : (
                  <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-zinc-950/80 px-3 py-1 text-xs text-zinc-400 backdrop-blur">
                    Концепт · демо
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs uppercase tracking-wide text-emerald-400/90">
                  {item.kind}
                </p>
                <h3 className="mt-1.5 font-bold">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                  {item.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {/* Подпись-ссылка: показывает адрес и намекает на клик */}
                <span className="mt-4 flex items-center gap-1.5 border-t border-white/5 pt-4 text-sm text-zinc-400 transition-colors group-hover:text-emerald-400">
                  <span className="truncate">
                    {new URL(item.url).hostname}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
