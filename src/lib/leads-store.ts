/**
 * Единое хранилище заявок с двумя бэкендами.
 *
 * Проблема, которую решает модуль: на Vercel SQLite живёт в эфемерном /tmp —
 * при каждом холодном старте serverless-функции база пересоздаётся, и история
 * заявок в админ-панели теряется. Telegram при этом остаётся надёжным каналом,
 * но список в панели — нет.
 *
 * Решение: если задан LEADS_DATABASE_URL (строка подключения Postgres —
 * например, бесплатный Neon, тот же инстанс, что у «Опишем»), заявки пишутся
 * туда в таблицу portfolio_leads. Строка «pooled» (pgbouncer) — на Vercel
 * держим пул из одного соединения. Если переменной нет (локальная разработка)
 * или Postgres недоступен — прозрачный фолбэк на SQLite через Prisma, как
 * раньше. Telegram-уведомление отправляется независимо от выбранного бэкенда.
 */

import { randomUUID } from "crypto";
import { db, ensureLeadTable } from "@/lib/db";

export type Lead = {
  id: string;
  name: string;
  contact: string;
  message: string;
  createdAt: Date;
};

export type LeadsBackend = "postgres" | "sqlite";

/** Ленивый синглтон pg.Pool — как и PrismaClient, переживает hot reload. */
const globalForPg = globalThis as unknown as {
  pgPool: import("pg").Pool | undefined;
};

function getPool(): import("pg").Pool {
  if (!globalForPg.pgPool) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg") as typeof import("pg");
    globalForPg.pgPool = new Pool({
      connectionString: process.env.LEADS_DATABASE_URL,
      // Serverless: одно соединение на инстанс достаточно и безопаснее
      // для pgbouncer-пула Neon (transaction mode).
      max: 1,
      ssl: process.env.LEADS_DATABASE_URL?.includes("sslmode=")
        ? undefined // sslmode уже в строке — пусть pg сам разберётся
        : { rejectUnauthorized: false }, // Neon требует SSL даже без параметра
    });
  }
  return globalForPg.pgPool;
}

export function getLeadsBackend(): LeadsBackend {
  return process.env.LEADS_DATABASE_URL ? "postgres" : "sqlite";
}

/** Идемпотентное создание таблицы в Postgres — один раз за жизнь процесса. */
let pgReady: Promise<void> | null = null;

function ensurePgTable(): Promise<void> {
  pgReady ??= (async () => {
    const pool = getPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_leads (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "contact" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
  })();
  return pgReady;
}

const PG_FIELDS = `"id", "name", "contact", "message", "createdAt"`;

function rowToLead(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    name: String(row.name),
    contact: String(row.contact),
    message: String(row.message),
    createdAt: new Date(row.createdAt as string),
  };
}

/* ----------------------------- Публичное API ----------------------------- */

export async function saveLead(data: {
  name: string;
  contact: string;
  message: string;
}): Promise<Lead> {
  const id = randomUUID();

  if (getLeadsBackend() === "postgres") {
    try {
      await ensurePgTable();
      const result = await getPool().query(
        `INSERT INTO portfolio_leads ("id", "name", "contact", "message")
         VALUES ($1, $2, $3, $4) RETURNING ${PG_FIELDS}`,
        [id, data.name, data.contact, data.message]
      );
      return rowToLead(result.rows[0]);
    } catch (error) {
      // Postgres недоступен — не теряем заявку, пишем в SQLite-фолбэк
      console.error("[leads-store] Postgres insert failed, fallback to SQLite:", error);
      pgReady = null; // в следующий раз попробуем восстановить соединение
    }
  }

  await ensureLeadTable();
  return db.lead.create({ data: { ...data, id } });
}

export async function listLeads(take = 50): Promise<Lead[]> {
  if (getLeadsBackend() === "postgres") {
    try {
      await ensurePgTable();
      const result = await getPool().query(
        `SELECT ${PG_FIELDS} FROM portfolio_leads ORDER BY "createdAt" DESC LIMIT $1`,
        [take]
      );
      return result.rows.map(rowToLead);
    } catch (error) {
      console.error("[leads-store] Postgres select failed, fallback to SQLite:", error);
      pgReady = null;
    }
  }

  await ensureLeadTable();
  return db.lead.findMany({ orderBy: { createdAt: "desc" }, take });
}

export async function removeLead(id: string): Promise<boolean> {
  if (getLeadsBackend() === "postgres") {
    try {
      await ensurePgTable();
      const result = await getPool().query(
        `DELETE FROM portfolio_leads WHERE "id" = $1`,
        [id]
      );
      if (result.rowCount && result.rowCount > 0) return true;
      // Нет в Postgres — возможно, заявка из эпохи SQLite; попробуем там
    } catch (error) {
      console.error("[leads-store] Postgres delete failed, fallback to SQLite:", error);
      pgReady = null;
    }
  }

  await ensureLeadTable();
  try {
    await db.lead.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function clearLeads(): Promise<number> {
  if (getLeadsBackend() === "postgres") {
    try {
      await ensurePgTable();
      const result = await getPool().query(`DELETE FROM portfolio_leads`);
      return result.rowCount ?? 0;
    } catch (error) {
      console.error("[leads-store] Postgres clear failed, fallback to SQLite:", error);
      pgReady = null;
    }
  }

  await ensureLeadTable();
  const result = await db.lead.deleteMany({});
  return result.count;
}
