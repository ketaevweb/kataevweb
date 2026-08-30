import { Check, ArrowRight } from "lucide-react";
import { services } from "@/lib/data";
import { Reveal } from "./Reveal";
import {
  SectionHeading,
  SectionWrapper,
} from "@/components/site/SectionHeading";

export function Services() {
  return (
    <SectionWrapper id="services">
      <SectionHeading
        eyebrow="Услуги и цены"
        title="Понятные пакеты — без сюрпризов в смете"
        subtitle="Цена фиксируется до начала работы и не растёт по ходу проекта."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.1} className="h-full">
            <article
              className={`relative flex h-full flex-col rounded-2xl border p-8 transition-colors ${
                service.popular
                  ? "border-emerald-500/60 bg-emerald-500/[0.04]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-zinc-950">
                  Популярный выбор
                </span>
              )}

              <h3 className="text-xl font-bold">{service.title}</h3>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-emerald-400">
                {service.price}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Срок: {service.term}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                  service.popular
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-zinc-300 hover:text-emerald-400"
                }`}
              >
                Обсудить задачу
                <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
