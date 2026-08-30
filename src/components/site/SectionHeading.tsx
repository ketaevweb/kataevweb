import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Обёртка секции: отступы + якорь для навигации.
 * scroll-mt-20 — чтобы фиксированная шапка не перекрывала заголовок при переходе по якорю.
 */
export function SectionWrapper({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">{subtitle}</p>
        )}
      </div>
    </Reveal>
  );
}
