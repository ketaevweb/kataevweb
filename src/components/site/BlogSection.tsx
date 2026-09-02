import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { blogPosts, formatDate } from "@/lib/blog";
import { Reveal } from "./Reveal";
import { SectionHeading, SectionWrapper } from "./SectionHeading";

/**
 * Блок «Блог» на главной: свежие статьи со ссылками на /blog/[slug].
 * Показывает последние 4 статьи; полный список — на странице /blog.
 */
export function BlogSection() {
  const posts = blogPosts.slice(0, 4);

  return (
    <SectionWrapper id="blog">
      <SectionHeading
        eyebrow="Блог"
        title="Пишу о том, что знаю"
        subtitle="Цены, скорость и проверки сайта — без воды и «секретных фишек маркетологов». Полезно и до заказа: каждый чек-лист можно применить к своему сайту сегодня."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={0.08 * i}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-emerald-500/40"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-400">
                  {post.tag}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
                <span>{post.readingMinutes} мин</span>
              </div>
              <h3 className="mt-4 text-lg font-bold leading-snug transition-colors group-hover:text-emerald-400">
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
                {post.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
                Читать статью
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
