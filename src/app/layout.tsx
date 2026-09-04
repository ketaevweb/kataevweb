import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MotionProvider } from "@/components/site/MotionProvider";
import { TgButton } from "@/components/site/TgButton";
import { YandexMetrika } from "@/components/site/YandexMetrika";
import { siteConfig, faqItems, services } from "@/lib/data";

// next/font сам скачивает и оптимизирует шрифт,
// кириллица включена отдельным subset-ом
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} — сайты для бизнеса в ${siteConfig.cityIn}`,
  description:
    "Разрабатываю сайты на Next.js: лендинги, визитки, магазины. От 30 000 ₽, срок от 7 дней.",
  keywords: [
    "создание сайтов",
    "веб-разработчик",
    "лендинг под ключ",
    "Next.js",
    siteConfig.city,
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} — сайты, которые приносят заявки`,
    description:
      "Лендинги и корпоративные сайты на Next.js. От 30 000 ₽, срок от 7 дней.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/og-photo.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — веб-разработчик`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — сайты для бизнеса`,
    description:
      "Лендинги и корпоративные сайты на Next.js. От 30 000 ₽, срок от 7 дней.",
    images: ["/og-photo.jpg"],
  },
};

// Структурированные данные для поисковиков: @graph из двух нод.
// Ревью 04.09: priceRange/areaServed — свойства LocalBusiness, а не
// Person (валидатор помечает, Google молча игнорирует) — поэтому они
// живут в сервисной ноде, а ноды связаны worksFor (Person →
// Organization) и founder (Organization → Person): оба свойства в
// своём домене. Тип ноды — LocalBusiness: ProfessionalService
// объявлен deprecated в schema.org («confusion with Service»),
// свойства остаются в домене (LocalBusiness ⊂ Organization). Все
// значения — single-source из siteConfig/services, без выдумок.
const personNode = {
  "@type": "Person",
  "@id": `${siteConfig.url}#person`,
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Веб-разработчик",
  worksFor: { "@id": `${siteConfig.url}#service` },
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.city,
    addressCountry: "RU",
  },
  // sameAs: обе подтверждённые TG-ручки владельца + GitHub-профиль.
  // t.me/egorkataev ведёт на тот же og:title «Егор Катаев».
  sameAs: [
    siteConfig.telegramUrl,
    "https://t.me/egorkataev",
    "https://github.com/ketaevweb",
  ],
  telephone: siteConfig.phone,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "заказ сайта",
    telephone: siteConfig.phone,
    availableLanguage: "Russian",
  },
  knowsAbout: ["Next.js", "React", "TypeScript", "веб-разработка", "лендинги"],
};

const serviceNode = {
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}#service`,
  name: `${siteConfig.name} — лендинги и сайты на Next.js`,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.city,
    addressCountry: "RU",
  },
  areaServed: [siteConfig.city, "Россия"],
  priceRange: services[0].price,
  founder: { "@id": `${siteConfig.url}#person` },
};

const personServiceJsonLd = {
  "@context": "https://schema.org",
  "@graph": [personNode, serviceNode],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: "ru-RU",
};

// FAQPage — шанс расширенного сниппета с вопросами в поисковой выдаче
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body
        className={`${manrope.variable} font-sans bg-background text-foreground antialiased min-h-screen flex flex-col`}
      >
        {/* JSON-LD для поисковиков (@graph: Person + LocalBusiness, WebSite, FAQPage) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personServiceJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <MotionProvider>{children}</MotionProvider>
        <TgButton />
        <YandexMetrika />
        <Toaster />
      </body>
    </html>
  );
}
