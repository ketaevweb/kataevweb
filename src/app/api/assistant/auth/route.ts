import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, expectedToken, tokenFor } from '@/lib/assistant-auth'

/** Личный ассистент: доступ по PIN. GET — проверка, POST — вход, DELETE — выход. */
export async function GET(req: NextRequest) {
  const ok = req.cookies.get(AUTH_COOKIE)?.value === expectedToken()
  return NextResponse.json({ authorized: ok })
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { pin?: string }
  const pin = (body.pin ?? '').trim()
  if (!pin) {
    return NextResponse.json({ error: 'Введите PIN' }, { status: 400 })
  }
  if (tokenFor(pin) !== expectedToken()) {
    return NextResponse.json({ error: 'Неверный PIN' }, { status: 401 })
  }
  const res = NextResponse.json({ authorized: true })
  res.cookies.set(AUTH_COOKIE, expectedToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ authorized: false })
  res.cookies.set(AUTH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
