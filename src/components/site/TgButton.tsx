"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { reachGoal } from "@/lib/metrika";

/**
 * Плавающая кнопка Telegram — «чат-виджет» без сторонних скриптов.
 * Появляется после небольшой прокрутки, чтобы не спорить с CTA первого экрана.
 */
export function TgButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={siteConfig.telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => reachGoal("telegram_click")}
      aria-label={`Написать в Telegram ${siteConfig.telegram}`}
      className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 shadow-[0_12px_40px_-10px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 hover:bg-emerald-400 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Send className="h-5 w-5" />
    </a>
  );
}
