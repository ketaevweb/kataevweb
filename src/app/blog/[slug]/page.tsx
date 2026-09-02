import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Calculator,
  CheckCircle2,
  Info,
} from "lucide-react";
import { blogPosts, formatDate, getPost } from "@/lib/blog";
import { siteConfig } from "@/lib/data";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";

// Слаги статей известны на этапе сборки — страницы статические
export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — блог ${siteConfig.name}`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [siteConfig.name],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = blogPosts.filter((p) => p.slug !== post.slug);

  // Разметка статьи для поисковиков
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    image: `${siteConfig.url}/og-photo.jpg`,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    inLanguage: "ru-RU",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="hero-glow absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-3xl px-6 pb-10 pt-32">
            <Reveal>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Все статьи
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  {post.tag}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />~{post.readingMinutes} мин чтения
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-zinc-400">
                {post.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Текст статьи — блоки из lib/blog.ts */}
        <article className="mx-auto w-full max-w-3xl px-6">
          {post.blocks.map((block, i) => {
            switch (block.type) {
              case "h2":
                return (
                  <Reveal key={i}>
                    <h2 className="mt-12 text-2xl font-extrabold tracking-tight">
                      {block.text}
                    </h2>
                  </Reveal>
                );
              case "list":
                return (
                  <Reveal key={i}>
                    <ul className="mt-6 space-y-3">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                          <span className="leading-relaxed text-zinc-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                );
              case "callout":
                return (
                  <Reveal key={i}>
                    <div className="mt-8 flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6">
                      <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                      <p className="leading-relaxed text-emerald-100/90">{block.text}</p>
                    </div>
                  </Reveal>
                );
              default:
                return (
                  <Reveal key={i}>
                    <p className="mt-6 text-[17px] leading-relaxed text-zinc-300">
                      {block.text}
                    </p>
                  </Reveal>
                );
            }
          })}
        </article>

        {/* Автор */}
        <section className="mx-auto w-full max-w-3xl px-6">
          <Reveal>
            <div className="mt-14 flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-7 sm:flex-row sm:items-center">
              <Image
                src="/egor-kataev.webp"
                alt={`${siteConfig.name} — автор блога`}
                width={72}
                height={72}
                className="h-18 w-18 rounded-2xl border border-white/10 object-cover"
              />
              <div>
                <p className="font-bold">{siteConfig.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  Веб-разработчик из {siteConfig.cityIn}. Делаю сайты на Next.js,
                  которые открываются за секунду и приносят заявки.
                </p>
                <Link
                  href="/about"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Обо мне
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* CTA — калькулятор и заявка */}
          <Reveal>
            <div className="mt-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 sm:p-10">
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Прикиньте бюджет своего сайта
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                Калькулятор за 30 секунд покажет сумму и срок — без звонка
                менеджера. Понравилась цифра — напишите, обсудим задачу.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/calculator"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 font-semibold text-zinc-950 transition-all hover:bg-emerald-400 hover:shadow-[0_0_32px_-8px] hover:shadow-emerald-500/50"
                >
                  <Calculator className="h-4 w-4" />
                  Рассчитать стоимость
                </Link>
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-700 px-8 font-semibold text-zinc-100 transition-colors hover:border-zinc-400"
                >
                  Спросить в Telegram
                </a>
              </div>
            </div>
          </Reveal>

          {/* Другие статьи */}
          {others.length > 0 && (
            <Reveal>
              <div className="mt-8 mb-8">
                <h2 className="text-lg font-bold">Другие статьи</h2>
                <ul className="mt-4 space-y-3">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/blog/${other.slug}`}
                        className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-emerald-500/30"
                      >
                        <span className="text-sm font-semibold leading-snug text-zinc-200 transition-colors group-hover:text-emerald-300">
                          {other.title}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-emerald-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
