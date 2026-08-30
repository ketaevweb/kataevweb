# kataevweb — сайт-визитка веб-разработчика

Одностраничный сайт-портфолио Егора Катаева: услуги, этапы работы, живые кейсы,
FAQ и рабочая форма заявок с **двойной доставкой** — SQLite + Telegram.

**Стек:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma + SQLite · framer-motion

## Секции

| Секция | Что внутри |
|---|---|
| Hero | Заголовок, CTA, ключевые цифры |
| Услуги | 3 тарифа: лендинг / визитка / интернет-магазин |
| Этапы | 4 шага от заявки до запуска |
| Работы | 4 живых сайта-кейса со скриншотами (кликабельные карточки) |
| FAQ | 6 вопросов, аккордеон |
| Контакты | Форма заявки → API → БД + Telegram |

## Быстрый старт

```bash
bun install                  # или npm install
cp .env.example .env         # заполните переменные
bun run db:push              # создаст SQLite и таблицу Lead
bun run dev                  # http://localhost:3000
```

## Переменные окружения

| Переменная | Зачем | Обязательна |
|---|---|---|
| `DATABASE_URL` | Путь к SQLite-файлу для Prisma | да |
| `ADMIN_PIN` | PIN панели заявок (кнопка в подвале) | да |
| `TELEGRAM_BOT_TOKEN` | Токен бота от @BotFather | нет (пусто = выключено) |
| `TELEGRAM_CHAT_ID` | Ваш chat_id (узнать: @userinfobot) | нет |

## Как устроен код

```
src/
├── app/
│   ├── page.tsx            # сборка страницы из секций
│   ├── layout.tsx          # шрифт Manrope (кириллица), SEO-метаданные
│   ├── sitemap.ts          # sitemap.xml генерируется автоматически
│   └── api/leads/route.ts  # POST заявка / GET список (PIN) / DELETE
├── components/site/        # секции лендинга (Header, Hero, Services…)
└── lib/
    ├── data.ts             # ЕДИНСТВЕННЫЙ файл со всеми текстами и ценами
    ├── telegram.ts         # уведомления о заявках в Telegram
    └── db.ts               # Prisma client
```

Все тексты, цены и кейсы редактируются в одном месте — `src/lib/data.ts`.
Ссылки кейсов переключаются между Vercel-адресами и поддоменами флагом
`useVercelLinks` в этом же файле.

## Форма заявок: два канала надёжности

1. **SQLite** — заявка всегда пишется в базу (модель `Lead`), просмотр — кнопка
   «Заявки» в подвале сайта, вход по PIN из `ADMIN_PIN`.
2. **Telegram** — если заданы `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`,
   каждая заявка дублируется сообщением в личку. Сбой Telegram не ломает
   сохранение заявки.

> ⚠️ **На Vercel** файловая система эфемерна: SQLite-файл не сохраняется между
> деплоями. Поэтому в проде Telegram — основной канал получения заявок,
> а база нужна для локальной разработки. Для постоянного хранения подключите
> Turso/Supabase (драйвер `@prisma/adapter-libsql`).

## Деплой на Vercel

1. Запушьте репозиторий на GitHub.
2. На [vercel.com](https://vercel.com) → **Add New Project** → импортируйте репозиторий.
3. В **Environment Variables** добавьте переменные из таблицы выше
   (для `DATABASE_URL` на Vercel укажите `file:/tmp/kataevweb.db`).
4. Deploy. Домены подключаются в **Settings → Domains**
   (для `kataevweb.ru`: A-запись `@ → 76.76.21.21`, для поддоменов —
   CNAME на `cname.vercel-dns.com`).

---

Сделано по мотивам разбора «Сайт-визитка на Next.js: полный разбор первого проекта».
