import { siteConfig } from "@/lib/data";
import { LeadsDialog } from "./LeadsDialog";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-xs font-extrabold text-zinc-950">
            {siteConfig.initials}
          </span>
          <p className="text-sm text-zinc-400">
            © {year} {siteConfig.name}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500" aria-label="Навигация в подвале">
          <a href="/#services" className="transition-colors hover:text-zinc-300">
            Услуги
          </a>
          <a href="/#portfolio" className="transition-colors hover:text-zinc-300">
            Работы
          </a>
          <a href="/about" className="transition-colors hover:text-zinc-300">
            Обо мне
          </a>
          <a href="/#faq" className="transition-colors hover:text-zinc-300">
            FAQ
          </a>
          <a
            href={siteConfig.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-emerald-400"
          >
            Telegram
          </a>
        </nav>

        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p className="text-xs text-zinc-600">Сделано на Next.js и Tailwind CSS</p>
          <LeadsDialog />
        </div>
      </div>
    </footer>
  );
}
