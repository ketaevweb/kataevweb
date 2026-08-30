import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/lib/data";
import { Reveal } from "./Reveal";
import {
  SectionHeading,
  SectionWrapper,
} from "@/components/site/SectionHeading";

export function Faq() {
  return (
    <SectionWrapper id="faq" className="border-y border-white/5">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            eyebrow="FAQ"
            title="Вопросы, которые задают до старта"
            subtitle="Отвечаю честно — так проще принять решение."
          />
        </div>

        <Reveal delay={0.15}>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={item.question} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold hover:text-emerald-400 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-zinc-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
