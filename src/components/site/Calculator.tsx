"use client";

import { useMemo, useState } from "react";
import {
  Calculator as CalculatorIcon,
  CheckCircle2,
  Circle,
  Clock,
  Send,
  ShieldCheck,
} from "lucide-react";
import {
  calcBases,
  calcDisclaimer,
  calcOptions,
  calcUrgency,
  siteConfig,
} from "@/lib/data";

const rub = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";

/**
 * Калькулятор стоимости сайта.
 * Выбор типа → опции → (опционально) срочность → итог + срок.
 * «Отправить расчёт» кладёт смету в sessionStorage и ведёт на форму
 * заявки на главной — там она подставится в поле сообщения.
 */
export function Calculator() {
  const [baseId, setBaseId] = useState<string>(calcBases[1].id); // по умолчанию — визитка (популярный)
  const [optionIds, setOptionIds] = useState<string[]>(["crm", "seo"]);
  const [urgent, setUrgent] = useState(false);

  const base = calcBases.find((b) => b.id === baseId) ?? calcBases[0];
  const chosen = calcOptions.filter((o) => optionIds.includes(o.id));

  const { price, days, lines } = useMemo(() => {
    const lines: { title: string; price: number; days: number }[] = [
      { title: base.title, price: base.price, days: base.days },
      ...chosen.map((o) => ({ title: o.title, price: o.price, days: o.days })),
    ];
    const rawPrice = lines.reduce((s, l) => s + l.price, 0);
    const rawDays = lines.reduce((s, l) => s + l.days, 0);
    const price = urgent ? rawPrice * calcUrgency.multiplier : rawPrice;
    const days = urgent ? Math.max(3, Math.round(rawDays * 0.7)) : rawDays;
    return { price, days, lines };
  }, [base, chosen, urgent]);

  function toggleOption(id: string) {
    setOptionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function sendToForm() {
    // Смета уедет в форму на главной (/#contact) и подставится в поле «о задаче»
    const linesText = lines
      .map((l) => `— ${l.title} — ${rub(l.price)}`)
      .join("\n");
    const text = `Расчёт с калькулятора:\n${linesText}${
      urgent ? `\n— Срочная разработка — надбавка 30%` : ""
    }\nИтого: ${rub(price)}, срок ~${days} дней.`;
    try {
      sessionStorage.setItem("kataevweb_calc", text);
    } catch {
      // приватный режим — просто перейдём на форму без подстановки
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      {/* Левая колонка: выбор */}
      <div>
        {/* 1. Тип сайта */}
        <h2 className="flex items-center gap-3 text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-extrabold text-zinc-950">
            1
          </span>
          Что за сайт
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {calcBases.map((b) => {
            const active = b.id === baseId;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setBaseId(b.id)}
                aria-pressed={active}
                className={`relative rounded-2xl border p-5 text-left transition-all ${
                  active
                    ? "border-emerald-500/60 bg-emerald-500/[0.07] shadow-[0_0_24px_-12px] shadow-emerald-500/50"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                {b.popular && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-zinc-950">
                    Популярно
                  </span>
                )}
                <p className="font-bold">{b.title}</p>
                <p className="mt-1 text-lg font-extrabold text-emerald-400">
                  от {rub(b.price)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500">{b.hint}</p>
              </button>
            );
          })}
        </div>

        {/* 2. Опции */}
        <h2 className="mt-12 flex items-center gap-3 text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-extrabold text-zinc-950">
            2
          </span>
          Что добавить
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {calcOptions.map((o) => {
            const active = optionIds.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggleOption(o.id)}
                aria-pressed={active}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-emerald-500/50 bg-emerald-500/[0.06]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                {active ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
                )}
                <span className="flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-sm">{o.title}</span>
                    <span className="text-sm font-bold text-emerald-400">
                      +{rub(o.price)}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-zinc-500">
                    {o.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Срочность */}
        <h2 className="mt-12 flex items-center gap-3 text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-extrabold text-zinc-950">
            3
          </span>
          Темп работы
        </h2>
        <button
          type="button"
          onClick={() => setUrgent((v) => !v)}
          aria-pressed={urgent}
          className={`mt-5 flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all sm:max-w-xl ${
            urgent
              ? "border-emerald-500/50 bg-emerald-500/[0.06]"
              : "border-white/10 bg-white/[0.02] hover:border-white/25"
          }`}
        >
          {urgent ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <Circle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-600" />
          )}
          <span>
            <span className="font-semibold text-sm">{calcUrgency.title} (+30%)</span>
            <span className="mt-1 block text-xs leading-relaxed text-zinc-500">
              {calcUrgency.hint}
            </span>
          </span>
        </button>
      </div>

      {/* Правая колонка: смета */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.08] to-transparent p-7">
          <h2 className="flex items-center gap-2.5 text-lg font-extrabold">
            <CalculatorIcon className="h-5 w-5 text-emerald-400" />
            Ваша смета
          </h2>

          <ul className="mt-5 space-y-2.5 text-sm">
            {lines.map((l) => (
              <li key={l.title} className="flex items-baseline justify-between gap-3">
                <span className="text-zinc-300">{l.title}</span>
                <span className="shrink-0 font-semibold">{rub(l.price)}</span>
              </li>
            ))}
            {urgent && (
              <li className="flex items-baseline justify-between gap-3 text-zinc-400">
                <span>Срочность</span>
                <span className="shrink-0">+30%</span>
              </li>
            )}
          </ul>

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">Итого</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-emerald-400">
              {rub(price)}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
              <Clock className="h-4 w-4 text-emerald-400" />
              срок: примерно {days} дней
            </p>
          </div>

          <a
            href="/#contact"
            onClick={sendToForm}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_-8px] hover:shadow-emerald-500/50"
          >
            <Send className="h-4 w-4" />
            Отправить расчёт
          </a>
          <a
            href={siteConfig.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-zinc-700 px-6 text-sm font-semibold text-zinc-100 transition-colors hover:border-zinc-400"
          >
            Сначала спросить в Telegram
          </a>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-zinc-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            {calcDisclaimer}
          </p>
        </div>
      </aside>
    </div>
  );
}
