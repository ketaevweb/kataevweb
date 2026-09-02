/**
 * lib/data.ts — ЕДИНСТВЕННЫЙ файл со всеми текстами сайта.
 *
 * Зачем так: когда пойдёте делать сайты клиентам, они вечно просят
 * поменять цены и формулировки. Здесь это делается за минуту
 * в одном месте, без лазания по компонентам.
 *
 * ↓ Впишите своё имя — оно подставится в шапку, футер и SEO-теги.
 */

export const siteConfig = {
  name: "Егор Катаев",
  initials: "ЕК", // монограмма в шапке
  city: "Пермь",
  cityIn: "Перми", // город в предложном падеже для SEO-заголовка
  url: "https://kataevweb.ru", // ← основной домен портфолио (поддомены кейсов — ниже, в portfolioCases)
  email: "hello@egorkataev.ru", // ← замените на реальную почту
  telegram: "@egorkataev", // ← замените на реальный ник в Telegram
  telegramUrl: "https://t.me/egorkataev",
  phone: "+7 900 000-00-00",
  responseTime: "Отвечаю в течение дня",
};

export const hero = {
  eyebrow: `Веб-разработчик · ${siteConfig.city}`,
  titleStart: "Делаю сайты, которые",
  titleAccent: "приносят заявки",
  subtitle:
    "Лендинги и корпоративные сайты на Next.js. От 30 000 ₽, срок от 7 дней.",
  stats: [
    { value: "от 30 000 ₽", label: "старт проекта" },
    { value: "7–10 дней", label: "срок лендинга" },
    { value: "3 месяца", label: "поддержки в подарок" },
  ],
};

export type Service = {
  title: string;
  price: string;
  term: string;
  features: string[];
  popular?: boolean;
};

export const services: Service[] = [
  {
    title: "Лендинг",
    price: "от 30 000 ₽",
    term: "7–10 дней",
    features: [
      "Продающая структура",
      "Адаптив под телефоны",
      "Форма заявки",
      "3 месяца поддержки",
    ],
  },
  {
    title: "Сайт-визитка",
    price: "от 45 000 ₽",
    term: "10–14 дней",
    popular: true,
    features: [
      "Всё из лендинга",
      "Несколько страниц",
      "Блог / новости",
      "SEO-настройка",
    ],
  },
  {
    title: "Интернет-магазин",
    price: "от 90 000 ₽",
    term: "от 3 недель",
    features: [
      "Каталог и корзина",
      "Онлайн-оплата",
      "Панель управления",
      "Интеграция доставки",
    ],
  },
];

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  term: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Заявка и созвон",
    description:
      "Обсуждаем задачу 30 минут: цель сайта, аудитория, желаемые сроки. Бесплатно и ни к чему не обязывает.",
    term: "день 1",
  },
  {
    number: "02",
    title: "Бриф и прототип",
    description:
      "Собираю структуру страниц и пишу смету с фиксированной ценой. Правки на этом этапе — самые дешёвые.",
    term: "1–2 дня",
  },
  {
    number: "03",
    title: "Дизайн и разработка",
    description:
      "Верстаю на Next.js + Tailwind, показываю промежуточные версии по ссылке. Прозрачно, без «чёрного ящика».",
    term: "5–10 дней",
  },
  {
    number: "04",
    title: "Запуск и поддержка",
    description:
      "Подключаю домен, настраиваю SEO и форму заявок. Три месяца поддерживаю сайт бесплатно.",
    term: "1 день",
  },
];

export type PortfolioCase = {
  title: string;
  kind: string; // тип клиента: «Кофейня · Пермь»
  /**
   * Подача кейса: product — работающий продукт с реальными пользователями;
   * demo — честный концепт/демо для портфолио (у такого бизнеса может и не быть).
   * Показывается бейджем на карточке — это намеренная честность, а не уязвимость.
   */
  status: "product" | "demo";
  description: string;
  tags: string[];
  image: string; // скриншот из /public/portfolio
  url: string; // живой сайт — открывается в новой вкладке
};

/**
 * Живые кейсы — реальные сайты, задеплоенные на Vercel.
 *
 * Адреса пока технические (***.vercel.app). Когда привяжете поддомены
 * kataevweb.ru в настройках Vercel (Settings → Domains), просто поменяйте
 * флаг на false — и все ссылки переключатся на красивые поддомены
 * одним движением. Это сила единого data.ts.
 */
const useVercelLinks = false;

// «Сырые» кейсы: две ссылки — техническая на Vercel и финальный поддомен
type RawCase = Omit<PortfolioCase, "url"> & { vercel: string; domain: string };
const rawCases: RawCase[] = [
  {
    title: "Кофейня «Зерно»",
    kind: "Кофейня · Пермь",
    status: "demo",
    description:
      "Лендинг спешелти-кофейни: меню и завтраки, галерея зала, блок отзывов и бронирование столика онлайн.",
    tags: ["Next.js", "Tailwind", "Бронь онлайн"],
    image: "/portfolio/coffee.webp",
    vercel: "https://zerno-coffee-psi.vercel.app",
    domain: "https://zerno.kataevweb.ru",
  },
  {
    title: "Барбершоп «Бритва»",
    kind: "Барбершоп · Пермь",
    status: "demo",
    description:
      "Сайт барбершопа: прайс на услуги, карточки мастеров, блок отзывов и онлайн-запись в два клика.",
    tags: ["Next.js", "Tailwind", "Онлайн-запись"],
    image: "/portfolio/barber.webp",
    vercel: "https://britva-barbershop-one.vercel.app",
    domain: "https://barber.kataevweb.ru",
  },
  {
    title: "Автосервис «Пит-Стоп»",
    kind: "Автосервис · Пермь",
    status: "demo",
    description:
      "Лендинг автосервиса: акции, этапы ремонта, прайс по маркам авто и форма «перезвоним за 15 минут».",
    tags: ["Next.js", "SEO", "Заявки"],
    image: "/portfolio/auto.webp",
    vercel: "https://autoservice-site.vercel.app",
    domain: "https://auto.kataevweb.ru",
  },
  {
    title: "Анна Лесная",
    kind: "Фотограф · Пермь",
    status: "demo",
    description:
      "Сайт-портфолио фотографа: галерея работ, пакеты съёмки с ценами, FAQ и заявка на свободные даты.",
    tags: ["Next.js", "Галерея", "Пакеты цен"],
    image: "/portfolio/photo.webp",
    vercel: "https://photographer-site-seven.vercel.app",
    domain: "https://photo.kataevweb.ru",
  },
  {
    title: "Анна Соколова",
    kind: "Психолог · Пермь",
    status: "demo",
    description:
      "Сайт психолога с онлайн-записью: свободные слоты видны сразу, подтверждение за один клик — без переписок и ожидания.",
    tags: ["Next.js", "Онлайн-запись", "Личный бренд"],
    image: "/portfolio/psy.webp",
    vercel: "https://proekt7-kataevweb.vercel.app",
    domain: "https://psy.kataevweb.ru",
  },
  {
    title: "Опишем",
    kind: "AI-сервис · Подписка",
    status: "product",
    description:
      "AI-генератор продающих описаний товаров для Ozon, Wildberries и Avito: параметры или фото — готовый текст за ~20 секунд.",
    tags: ["Next.js", "AI / LLM", "Подписка"],
    image: "/portfolio/opishem.webp",
    vercel: "https://opishem-kataevweb.vercel.app",
    domain: "https://opishem.kataevweb.ru",
  },
  {
    title: "COLD STUDIO",
    kind: "Магазин · Дроп-модель",
    status: "demo",
    description:
      "Магазин спортивной одежды дроп-моделью: витрина дропов, корзина и админ-панель владельца с аналитикой продаж.",
    tags: ["Next.js", "Prisma", "Админ-панель"],
    image: "/portfolio/cold.webp",
    vercel: "https://cold-studio-nu.vercel.app",
    domain: "https://cold.kataevweb.ru",
  },
  {
    title: "Дикий крой",
    kind: "Одежда · Малые партии",
    status: "demo",
    description:
      "Спортивная одежда ограниченными дропами: каталог с размерной сеткой, корзина, самовывоз в Перми и СДЭК по России.",
    tags: ["Next.js", "Каталог", "Корзина"],
    image: "/portfolio/kroy.webp",
    vercel: "https://dikoy-kroy.vercel.app",
    domain: "https://kroy.kataevweb.ru",
  },
];

export const portfolioCases: PortfolioCase[] = rawCases.map(
  ({ vercel, domain, ...rest }) => ({
    ...rest,
    url: useVercelLinks ? vercel : domain,
  })
);

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Сколько стоит сайт?",
    answer:
      "Лендинг — от 30 000 ₽, сайт-визитка — от 45 000 ₽, интернет-магазин — от 90 000 ₽. Точную смету с разбивкой по этапам присылаю после короткого брифа, и она не меняется в процессе работы.",
  },
  {
    question: "Какие сроки?",
    answer:
      "Лендинг занимает 7–10 дней, визитка — 10–14 дней, магазин — от 3 недель. В договоре фиксируем дату сдачи: за просрочку по моей вине скидка 10%.",
  },
  {
    question: "Почему Next.js, а не Tilda или WordPress?",
    answer:
      "На Tilda быстрее и дешевле собрать типовой лендинг — и если вам подходит только это, я честно скажу об этом на созвоне. Next.js выигрывает там, где важны скорость загрузки, SEO, уникальный дизайн и владение кодом: сайт не «зависит» от конструктора и его можно развивать годами.",
  },
  {
    question: "Что нужно от меня, чтобы начать?",
    answer:
      "Тексты или тезисы о компании, логотип и фото (если есть), примеры сайтов, которые вам нравятся. Всё остальное — структуру, тексты «под ключ», дизайн — возьму на себя и согласую с вами по шагам.",
  },
  {
    question: "Что будет после запуска?",
    answer:
      "Три месяца бесплатной поддержки: правки текстов, замена фото, мелкие доработки, мониторинг доступности. Дальше — по желанию, от 3 000 ₽ в месяц.",
  },
  {
    question: "Как проходит оплата?",
    answer:
      "50% после утверждения прототипа, 50% после приёмки. Работаю по договору или самозанятости — предоставлю чеки.",
  },
];

export const footerNote = "Сделано на Next.js, TypeScript и Tailwind CSS";
