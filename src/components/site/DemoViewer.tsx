"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { demoUrl, type DemoSite } from "@/lib/demo-sites";

/**
 * Полноэкранный вьюер демо-сайта (клиентский компонент).
 *
 * Сверху — тонкая плашка портфолио (контекст + CTA), всё остальное
 * занимает фрейм с демо. Ссылки клиенту уходят на kataevweb.ru/sites/<slug>,
 * технический домен демо в адресной строке не появляется.
 */
export function DemoViewer({ site }: { site: DemoSite }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex h-[100dvh] flex-col bg-zinc-950">
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-white/10 bg-zinc-950 px-3 sm:h-12 sm:px-4">
        <a
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zinc-300 transition-colors hover:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Егор Катаев
        </a>

        <span
          className="ml-2 hidden min-w-0 truncate text-sm text-zinc-500 sm:block"
          aria-hidden="true"
        >
          · {site.title}
          {site.kind ? ` — ${site.kind}` : ""}
        </span>

        <a
          href="https://t.me/kataevweb"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 sm:px-4 sm:py-1.5 sm:text-sm"
        >
          Обсудить проект
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </header>

      <div className="relative flex-1">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400"
                aria-hidden="true"
              />
              <p className="text-sm text-zinc-500">Загружаю демо…</p>
            </div>
          </div>
        )}
        <iframe
          src={demoUrl(site)}
          title={site.title}
          onLoad={() => setLoaded(true)}
          allow="fullscreen"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
