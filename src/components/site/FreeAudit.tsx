"use client";

import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Send,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { freeAudit } from "@/lib/data";
import { reachGoal } from "@/lib/metrika";
import { Reveal } from "./Reveal";
import {
  SectionHeading,
  SectionWrapper,
} from "@/components/site/SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Лид-магнит «Бесплатный аудит» (аудит 17.09: воронки захвата не было —
 * кто не готов купить сразу, уходил навсегда).
 *
 * Форма отправляет заявку на существующий /api/leads ( honeypot, rate-limit,
 * сохранение в БД + Telegram-уведомление наследуются от основной формы).
 * Адрес сайта и комментарий собираются в поле message на клиенте — схема
 * API не меняется, владелец получает всё в одном месте.
 */
export function FreeAudit() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const site = String(data.get("site") ?? "").trim();
    // Мягкая валидация адреса: допускаем с домом и без «https://»
    const siteLooksValid =
      /^(https?:\/\/)?([\w-]+\.)+[a-zа-я]{2,}(\/.*)?$/i.test(site);
    if (!siteLooksValid) {
      setStatus("error");
      setErrorText("Проверьте адрес сайта — например, https://vashsite.ru");
      return;
    }

    const note = String(data.get("note") ?? "").trim();
    const message =
      `Заявка на бесплатный аудит сайта: ${site}. ` +
      (note ? `Что важно проверить: ${note}` : "Прошу полный разбор по чек-листу.");

    setStatus("sending");
    setErrorText("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          contact: String(data.get("contact") ?? ""),
          message,
          website: String(data.get("website") ?? ""), // honeypot
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Не удалось отправить заявку");
      }

      setStatus("success");
      // Новая цель Метрики: конверсия лид-магнита
      reachGoal("audit_form_submit");
      form.reset();
      toast({
        title: "Заявка на аудит отправлена",
        description: "Пришлю разбор в течение 1–2 дней.",
      });
    } catch (err) {
      setStatus("error");
      const text =
        err instanceof Error
          ? err.message
          : "Что-то пошло не так. Попробуйте ещё раз.";
      setErrorText(text);
      toast({
        variant: "destructive",
        title: "Ошибка отправки",
        description: text,
      });
    }
  }

  return (
    <SectionWrapper id="audit">
      <SectionHeading
        eyebrow={freeAudit.eyebrow}
        title={freeAudit.title}
        subtitle={freeAudit.subtitle}
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        {/* Что входит в аудит */}
        <Reveal delay={0.1}>
          <ul className="space-y-4">
            {freeAudit.includes.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Второй, «лёгкий» лид-магнит: чек-лист PDF */}
          <Reveal delay={0.2}>
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                <FileText className="h-5 w-5 text-emerald-400" />
              </span>
              <p className="text-sm leading-relaxed text-zinc-300">
                {freeAudit.checklist.prefix}{" "}
                <a
                  href={freeAudit.checklist.href}
                  download
                  onClick={() => reachGoal("checklist_download")}
                  className="font-semibold text-emerald-400 underline-offset-4 transition-colors hover:text-emerald-300 hover:underline"
                >
                  {freeAudit.checklist.linkText}
                </a>{" "}
                {freeAudit.checklist.after}
              </p>
            </div>
          </Reveal>
        </Reveal>

        {/* Форма заявки на аудит */}
        <Reveal delay={0.2}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            {status === "success" ? (
              <div className="flex h-full min-h-96 flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </span>
                <h3 className="mt-6 text-xl font-bold">
                  {freeAudit.form.successTitle}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
                  {freeAudit.form.successText}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 rounded-full border border-zinc-700 px-6 py-2.5 text-sm font-semibold transition-colors hover:border-zinc-400"
                >
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-emerald-400/15 bg-emerald-500/5 px-4 py-3 text-sm text-zinc-300">
                  <Zap className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span>0 ₽ и без обязательств</span>
                  <span className="text-zinc-600">·</span>
                  <span>разбор за 1–2 дня</span>
                  <span className="text-zinc-600">·</span>
                  <span>список правок — ваш, даже если пойдёте к другому</span>
                </p>

                {/* Honeypot против ботов — как в основной форме */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                <div className="space-y-2">
                  <Label htmlFor="audit-name">{freeAudit.form.name}</Label>
                  <Input
                    id="audit-name"
                    name="name"
                    placeholder={freeAudit.form.namePh}
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audit-contact">{freeAudit.form.contact}</Label>
                  <Input
                    id="audit-contact"
                    name="contact"
                    placeholder={freeAudit.form.contactPh}
                    required
                    minLength={5}
                    maxLength={100}
                    autoComplete="tel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audit-site">{freeAudit.form.site}</Label>
                  <Input
                    id="audit-site"
                    name="site"
                    type="text"
                    inputMode="url"
                    placeholder={freeAudit.form.sitePh}
                    required
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audit-note">{freeAudit.form.note}</Label>
                  <Textarea
                    id="audit-note"
                    name="note"
                    placeholder={freeAudit.form.notePh}
                    maxLength={500}
                    rows={3}
                  />
                </div>

                {status === "error" && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    {errorText}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Отправляю…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {freeAudit.form.submit}
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-relaxed text-zinc-500">
                  {freeAudit.form.privacy}
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
