import { createHash } from 'crypto'
import { NextRequest } from 'next/server'

/**
 * Проверка доступа к личному Kwork-ассистенту.
 * PIN задаётся ТОЛЬКО через env ASSISTANT_PIN (деплой-скрипт читает .secrets/yc-rev-env.env).
 * Fail-closed: если переменная не задана — доступ невозможен.
 */
export const AUTH_COOKIE = 'kwork_a'

export function tokenFor(p: string): string {
  return createHash('sha256').update(p + '::kwork-assistant::v1').digest('hex')
}

export function expectedToken(): string {
  const pin = process.env.ASSISTANT_PIN
  return pin ? tokenFor(pin) : ''
}

/** Вернёт null, если запрос авторизован, иначе Response 401. */
export function guard(req: NextRequest): Response | null {
  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (token && expectedToken() && token === expectedToken()) return null
  return Response.json({ error: 'Не авторизован' }, { status: 401 })
}
