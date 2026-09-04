"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";

/**
 * Липкая мобильная CTA-кнопка: фиксированный бар внизу экрана на <768px.
 *
 * Поведение:
 * - появляется после 600px прокрутки (hero с двумя CTA уже пройден);
 * - исчезает, когда в зону видимости попадает секция «Контакты» или футер
 *   (там своя форма — дубль кнопки только мешает);
 * - кнопка h-12 (48px) — целевой размер тапа (Material 48dp / Apple HIG 44pt);
 * - учитывается safe-area iPhone (выступ «домашней полоски»).
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let contactVisible = false;
    let footerVisible = false;

    const recompute = () => {
      setVisible(window.scrollY > 600 && !contactVisible && !footerVisible);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.id === "contact") contactVisible = entry.isIntersecting;
          else footerVisible = entry.isIntersecting;
        }
        recompute();
      },
      { threshold: 0.05 }
    );

    const contact = document.getElementById("contact");
    const footer = document.querySelector("footer");
    if (contact) observer.observe(contact);
    if (footer) observer.observe(footer);

    const onScroll = () => recompute();
    window.addEventListener("scroll", onScroll, { passive: true });
    recompute();

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pt-3 transition-all duration-300 md:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        background:
          "linear-gradient(to top, rgb(9 9 11 / 0.92) 60%, transparent)",
      }}
    >
      <a
        href="#contact"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 font-semibold text-zinc-950 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.55)] transition-colors hover:bg-emerald-400"
      >
        <Send className="h-4 w-4" />
        Обсудить проект
      </a>
    </div>
  );
}
