import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prisma не бандлим: query engine должен остаться внешним файлом,
  // иначе serverless-функция на Vercel не найдёт его в рантайме
  serverExternalPackages: ["@prisma/client"],
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
