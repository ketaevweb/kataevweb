import { processSteps } from "@/lib/data";
import { Reveal } from "./Reveal";
import {
  SectionHeading,
  SectionWrapper,
} from "@/components/site/SectionHeading";

export function Process() {
  return (
    <SectionWrapper id="process" className="border-y border-white/5">
      <SectionHeading
        eyebrow="Как я работаю"
        title="Четыре шага от заявки до запуска"
        subtitle="Каждый этап заканчивается конкретным результатом, который вы видите и утверждаете."
      />

      <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {processSteps.map((step, i) => (
          <li key={step.number}>
            <Reveal delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-extrabold tracking-tight text-emerald-500/40">
                    {step.number}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                    {step.term}
                  </span>
                </div>
                <h3 className="mt-5 font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </SectionWrapper>
  );
}
