import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

/**
 * На Vercel SQLite живёт в эфемерном /tmp: при каждом холодном старте
 * serverless-функции база создаётся заново, но БЕЗ таблиц (prisma db push
 * там не выполнится). Поэтому таблицу создаём в рантайме — идемпотентно,
 * один раз за жизнь процесса. Локально таблица уже есть, и вызов ничего
 * не ломает (CREATE TABLE IF NOT EXISTS).
 */
let ensurePromise: Promise<unknown> | null = null

export function ensureLeadTable(): Promise<unknown> {
  ensurePromise ??= db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Lead" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "contact" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  return ensurePromise
}