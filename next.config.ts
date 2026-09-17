import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Prisma не бандлим: query engine должен остаться внешним файлом,
  // иначе serverless-функция на Vercel не найдёт его в рантайме
  serverExternalPackages: ["@prisma/client"],
  // Старые/опечаточные адреса не должны отдавать 404 (ревью 15.09.2026):
  // /calc — частая опечатка, отправляем на полноценный калькулятор
  async redirects() {
    return [
      { source: "/calc", destination: "/calculator", permanent: true },
    ];
  },
  // Демо стоматологии «Астра Дент» живёт в том же контейнере вторым
  // Next-приложением на 127.0.0.1:3001 (basePath /dent). Реврайт работает
  // как внутренний прокси: адрес, DOM и сеть — всё на kataevweb.ru.
  async rewrites() {
    return [
      {
        source: "/dent/:path*",
        destination: "http://127.0.0.1:3001/dent/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        // Версионное имя файла (при обновлении — -v2), поэтому кэш immutable
        source: "/kataev-web-portfolio-2026.pdf",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
