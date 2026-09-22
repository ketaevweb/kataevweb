import { NextRequest, NextResponse } from 'next/server'
import { guard } from '@/lib/assistant-auth'
import { SYSTEM_PROMPT } from '@/lib/kwork-knowledge'

/**
 * Чат личного Kwork-ассистента. Без БД: историю хранит клиент (localStorage),
 * сервер не сохраняет ничего. LLM — публичный API Z.ai (OpenAI-совместимый),
 * бесплатные модели GLM-Flash (env ZAI_MODEL, по умолчанию glm-4.5-flash).
 */

const BASE_URL = process.env.ZAI_BASE_URL ?? 'https://api.z.ai/api/paas/v4'
const MODEL = process.env.ZAI_MODEL ?? 'glm-4.5-flash'
const CONTEXT_MESSAGES = 16
const REQUEST_TIMEOUT_MS = 50_000

type ChatMsg = { role: 'user' | 'assistant'; content: string }

async function callModel(messages: ChatMsg[], attempt: number): Promise<string> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(BASE_URL + '/chat/completions', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ZAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        thinking: { type: 'disabled' },
      }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Z.ai ${res.status}: ${text.slice(0, 300)}`)
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const reply = data.choices?.[0]?.message?.content?.trim()
    if (!reply) throw new Error('Пустой ответ модели')
    return reply
  } finally {
    clearTimeout(timer)
  }
}

export async function POST(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied

  if (!process.env.ZAI_API_KEY) {
    return NextResponse.json(
      { error: 'Ассистент не настроен: не задан ZAI_API_KEY в окружении контейнера. Получите бесплатный ключ на z.ai (API Keys) и добавьте в env ревизии.' },
      { status: 503 },
    )
  }

  const body = (await req.json().catch(() => ({}))) as {
    message?: string
    history?: ChatMsg[]
  }
  const text = (body.message ?? '').trim()
  if (!text) return NextResponse.json({ error: 'Пустое сообщение' }, { status: 400 })
  if (text.length > 12_000) {
    return NextResponse.json({ error: 'Сообщение слишком длинное (макс. 12 000 знаков)' }, { status: 400 })
  }
  const history = Array.isArray(body.history)
    ? body.history
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
        .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 12_000) }))
        .slice(-CONTEXT_MESSAGES)
    : []

  const messages: ChatMsg[] = [
    { role: 'assistant', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: text },
  ]

  let lastErr: unknown
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const reply = await callModel(messages, attempt)
      return NextResponse.json({ content: reply })
    } catch (err) {
      lastErr = err
      console.error(`[assistant/chat] попытка ${attempt}/3:`, err instanceof Error ? err.message : err)
      if (attempt < 3) await new Promise((r) => setTimeout(r, 800 * attempt))
    }
  }
  return NextResponse.json(
    {
      error: 'Модель не ответила. Попробуйте ещё раз через минуту.',
      details: lastErr instanceof Error ? lastErr.message.slice(0, 200) : undefined,
    },
    { status: 502 },
  )
}
