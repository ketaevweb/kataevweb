import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { blogPosts, formatDate } from "@/lib/blog";
import { siteConfig } from "@/lib/data";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: `Блог — ${siteConfig.name}`,
  description:
    "Статьи о сайтах для малого бизнеса: сколько стоит разработка, Tilda или код, как проверить скорость сайта. Без воды и продажных лозунгов.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  // Свежие статьи — первыми
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="hero-glow absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 sm:text-sm">
                Блог
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
                О сайтах — без воды и продажных лозунгов
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-zinc-400">
                Цены, технологии и скорость простым языком: то, что я рассказываю
                клиентам на созвонах, но в письменном виде.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.08} className="h-full">
                  <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-emerald-500/30">
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-emerald-300">
                        {post.tag}
                      </span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <h2 className="mt-4 text-lg font-bold leading-snug">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="transition-colors group-hover:text-emerald-300"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
                      {post.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <BookOpen className="h-4 w-4" />~{post.readingMinutes} мин
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                      >
                        Читать
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
