"use client";

import { Download } from "lucide-react";
import { reachGoal } from "@/lib/metrika";

/**
 * Кнопка скачивания PDF-портфолио с подписью.
 * Клиентский компонент: клик ловится целью Метрики «pdf_download»
 * (цель 8-я к семи JS-событиям, см. src/lib/metrika.ts).
 * Файл версионный (kataev-web-portfolio-2026.pdf) — при обновлении
 * содержимого меняем имя на -v2, а не боремся с кэшем.
 */
export function PdfDownload() {
  return (
    <div className="flex flex-col items-center text-center">
      <a
        href="/kataev-web-portfolio-2026.pdf"
        download
        onClick={() => reachGoal("pdf_download")}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 px-5 py-3 font-semibold text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-400/10"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Скачать PDF-портфолио
      </a>
      <p className="mt-2 text-sm text-zinc-500">
        13 страниц · 1,4 МБ · обновлено сентябрь 2026
      </p>
    </div>
  );
}
