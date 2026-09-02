"use client";

import Script from "next/script";

/**
 * Яндекс.Метрика — подключается только если задан
 * NEXT_PUBLIC_YANDEX_METRICA_ID (Vercel → Settings → Environment Variables;
 * ID счётчика создаётся на metrika.yandex.ru). Без переменной компонент
 * не рендерит ничего — ноль лишних запросов и ошибок в консоли.
 *
 * Цели задаются через reachGoal() из @/lib/metrika:
 *  - lead_form_submit      — форма заявки
 *  - calculator_to_contact — «Отправить расчёт» из калькулятора
 *  - telegram_click        — плавающая TG-кнопка
 */
const METRICA_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;

export function YandexMetrika() {
  if (!METRICA_ID) return null;
  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${Number(METRICA_ID)}, "init", {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: false,
});`}
    </Script>
  );
}
