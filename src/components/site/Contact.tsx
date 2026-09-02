"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  TriangleAlert,
} from "lucide-react";
import { siteConfig } from "@/lib/data";
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

export function Contact() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState<string>("");
  // Сообщение может прийти из калькулятора (/calculator): смета подставляется сюда
  const [message, setMessage] = useState("");

  // Подстановка расчёта из калькулятора: он кладёт смету в sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("kataevweb_calc");
      if (saved) {
        setMessage(saved);
        sessionStorage.removeItem("kataevweb_calc");
      }
    } catch {
      // приватный режим — просто показываем пустую форму
    }
  }, []);

  // Отправка заявки на внутренний API-роут /api/leads.
  // На проде этот же код можно направить на Web3Forms или Telegram-бота —
  // меняется только URL и формат тела запроса.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrorText("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          contact: String(data.get("contact") ?? ""),
          message: String(data.get("message") ?? ""),
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Не удалось отправить заявку");
      }

      setStatus("success");
      // Цель Метрики: конверсия формы (см. src/lib/metrika.ts)
      reachGoal("lead_form_submit");
      form.reset();
      setMessage("");
      toast({
        title: "Заявка отправлена",
        description: "Отвечу в течение дня. Спасибо за доверие!",
      });
    } catch (err) {
      setStatus("error");
      const text =
        err instanceof Error ? err.message : "Что-то пошло не так. Попробуйте ещё раз.";
      setErrorText(text);
      toast({
        variant: "destructive",
        title: "Ошибка отправки",
        description: text,
      });
    }
  }

  return (
    <SectionWrapper id="contact">
      <div className="grid gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Контакты"
            title="Обсудим ваш проект?"
            subtitle="Расскажите о задаче в двух словах — вернусь с планом действий, сроком и ценой. Созвон бесплатный и ни к чему не обязывает."
          />

          <Reveal delay={0.15}>
            <ul className="mt-10 space-y-5">
              <li className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Send className="h-5 w-5 text-emerald-400" />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">Telegram — самый быстрый канал</p>
                  <a
                    href={siteConfig.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold transition-colors hover:text-emerald-400"
                  >
                    {siteConfig.telegram}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Mail className="h-5 w-5 text-emerald-400" />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">Почта — для документов и ТЗ</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="font-semibold transition-colors hover:text-emerald-400"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Phone className="h-5 w-5 text-emerald-400" />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">Телефон — звоните или пишите в WhatsApp</p>
                  <p className="font-semibold">
                    <a
                      href={siteConfig.phoneHref}
                      className="transition-colors hover:text-emerald-400"
                    >
                      {siteConfig.phone}
                    </a>
                    <a
                      href={siteConfig.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                    >
                      WhatsApp
                    </a>
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">География</p>
                  <p className="font-semibold">
                    {siteConfig.city} · работаю удалённо по всей России
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Clock className="h-5 w-5 text-emerald-400" />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">Скорость ответа</p>
                  <p className="font-semibold">{siteConfig.responseTime}</p>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            {status === "success" ? (
              <div className="flex h-full min-h-96 flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </span>
                <h3 className="mt-6 text-xl font-bold">Заявка отправлена!</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
                  Спасибо! Я уже увидел заявку — отвечу в течение дня. А пока можете
                  посмотреть, как я работаю, в разделе «Этапы».
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setMessage("");
                  }}
                  className="mt-8 rounded-full border border-zinc-700 px-6 py-2.5 text-sm font-semibold transition-colors hover:border-zinc-400"
                >
                  Отправить ещё одну
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
                <div className="space-y-2">
                  <Label htmlFor="name">Как вас зовут</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Иван"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Telegram, телефон или почта</Label>
                  <Input
                    id="contact"
                    name="contact"
                    placeholder="@ivan или +7 900 000-00-00"
                    required
                    minLength={5}
                    maxLength={100}
                    autoComplete="tel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Пара слов о задаче</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Нужен лендинг для студии маникюра: запись онлайн, прайс, портфолио. Хотим запуститься к маю."
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                      Отправить заявку
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-relaxed text-zinc-500">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
                  Данные не передаются третьим лицам.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
