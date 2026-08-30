import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prisma не бандлим: query engine должен остаться внешним файлом,
  // иначе serverless-функция на Vercel не найдёт его в рантайме
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
