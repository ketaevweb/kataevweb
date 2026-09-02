"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/data";

const navLinks = [
  { href: "/#services", label: "Услуги" },
  { href: "/#portfolio", label: "Работы" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/about", label: "Обо мне" },
  { href: "/blog", label: "Блог" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // На главной ссылки-якоря остаются короткими (#services),
  // на внутренних страницах ведут на соответствующий раздел главной
  const linkHref = (href: string) =>
    href.startsWith("/#") && pathname === "/" ? href.slice(1) : href;

  // Фон шапки появляется после небольшой прокрутки
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/5 bg-zinc-950/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href={pathname === "/" ? "#top" : "/"}
          className="flex items-center gap-2.5 font-bold tracking-tight"
          aria-label={pathname === "/" ? "Наверх" : "На главную"}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-extrabold text-zinc-950">
            {siteConfig.initials}
          </span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </a>

        {/* Навигация — десктоп (с lg, чтобы 6 пунктов + кнопка не сжимались на md) */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={linkHref(link.href)}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
          <a
            href={pathname === "/" ? "#contact" : "/#contact"}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Обсудить проект
          </a>
        </nav>

        {/* Кнопка меню — мобильные */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-white/5 hover:text-zinc-100 lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Выпадающее меню — мобильные */}
      {open && (
        <nav
          className="border-t border-white/5 bg-zinc-950/95 px-6 pb-6 pt-3 backdrop-blur-md lg:hidden"
          aria-label="Мобильная навигация"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={linkHref(link.href)}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base text-zinc-300 transition-colors hover:bg-white/5 hover:text-zinc-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={pathname === "/" ? "#contact" : "/#contact"}
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            Обсудить проект
          </a>
        </nav>
      )}
    </header>
  );
}
