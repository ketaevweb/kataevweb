import type { Metadata } from "next";
import { siteConfig } from "@/lib/data";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { Calculator } from "@/components/site/Calculator";

export const metadata: Metadata = {
  title: `Калькулятор стоимости сайта — ${siteConfig.name}`,
  description:
    "Рассчитайте стоимость сайта за 30 секунд: лендинг, визитка или магазин + опции. Честные цены и сроки — итог виден сразу, без звонка менеджера.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="hero-glow absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-32">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 sm:text-sm">
                Калькулятор стоимости
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
                Сколько будет стоить ваш сайт
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-zinc-400">
                Выберите тип сайта и нужные опции — справа сразу появится сумма
                и срок. Без звонка менеджера и «цена договорная».
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-14">
                <Calculator />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
