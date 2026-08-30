"use client";

import { useCallback, useState } from "react";
import { Database, Loader2, RefreshCw, Trash2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Lead = {
  id: string;
  name: string;
  contact: string;
  message: string;
  createdAt: string;
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * Панель заявок: открывается кнопкой в подвале сайта, вход по PIN
 * (ADMIN_PIN в .env). Заявки читаются и удаляются через /api/leads.
 *
 * Для реального клиента панель стоит вынести на отдельный маршрут
 * и закрыть полноценной авторизацией — здесь это учебный демо-вариант.
 */
export function LeadsDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [pinError, setPinError] = useState("");

  const loadLeads = useCallback(
    async (currentPin: string, silent = false) => {
      if (!silent) setLoading(true);
      setPinError("");
      try {
        const res = await fetch(`/api/leads?pin=${encodeURIComponent(currentPin)}`);
        if (res.status === 401) {
          setPinError("Неверный PIN. Подсказка для демо: 2468");
          setUnlocked(false);
          return;
        }
        if (!res.ok) throw new Error("Не удалось загрузить заявки");
        const data = (await res.json()) as { leads: Lead[] };
        setLeads(data.leads);
        setUnlocked(true);
      } catch (error) {
        setPinError(
          error instanceof Error ? error.message : "Что-то пошло не так"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  async function deleteLead(id: string) {
    try {
      const res = await fetch(
        `/api/leads?pin=${encodeURIComponent(pin)}&id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Не удалось удалить заявку");
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      toast({ title: "Заявка удалена" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description:
          error instanceof Error ? error.message : "Попробуйте ещё раз",
      });
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      // При закрытии сбрасываем состояние входа
      setUnlocked(false);
      setPin("");
      setPinError("");
      setLeads([]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-600 transition-colors hover:text-emerald-400"
          aria-label="Открыть панель заявок"
        >
          <Database className="h-3.5 w-3.5" />
          Заявки
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-zinc-950 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Заявки с сайта</DialogTitle>
          <DialogDescription>
            Все обращения сохраняются в базу — Telegram-уведомления лишь дублируют
            их. Вход по PIN из переменной ADMIN_PIN.
          </DialogDescription>
        </DialogHeader>

        {!unlocked ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadLeads(pin);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Input
                type="password"
                inputMode="numeric"
                placeholder="Введите PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
              {pinError && (
                <p
                  role="alert"
                  className="flex items-start gap-2 text-sm text-red-400"
                >
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {pinError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || pin.length < 3}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 font-semibold text-zinc-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Проверяю…
                </>
              ) : (
                "Открыть панель"
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Всего заявок: <span className="font-semibold text-zinc-300">{leads.length}</span>
              </p>
              <button
                type="button"
                onClick={() => loadLeads(pin, true)}
                className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
              >
                <RefreshCw className="h-4 w-4" />
                Обновить
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 px-6 py-10 text-center text-sm text-zinc-500">
                Пока нет ни одной заявки. Отправьте тестовую через форму —
                она появится здесь сразу.
              </p>
            ) : (
              <ul className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
                {leads.map((lead) => (
                  <li
                    key={lead.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold">{lead.name}</p>
                        <p className="truncate text-sm text-emerald-400">
                          {lead.contact}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {dateFormatter.format(new Date(lead.createdAt))}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteLead(lead.id)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Удалить заявку от ${lead.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                      {lead.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
