import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  PenLine,
  MessagesSquare,
  CheckCircle2,
  ChevronDown,
  Award,
  CalendarClock,
  Globe,
  Building2,
  Sparkles,
  Video,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Quote,
  Star,
  Send,
  User,
  Target,
} from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { TeacherPhoto } from '../components/TeacherPhoto';
import { TelegramButton, VkButton } from '../components/TelegramButton';
import { SmartImage } from '../components/SmartImage';
import { SITE, REVIEWS } from '../config';
import type { PageKey } from '../config';
import { contactEndpoint } from '../contactEndpoint';
import { navigateFromLink, routeHref } from '../navigation';
import { useRouter } from '../router';

/* ---------------- Hero ---------------- */

const HERO_BADGES = [
  { icon: CalendarClock, text: `Опыт с ${SITE.sinceYear} года`, bg: 'bg-blush/30' },
  { icon: GraduationCap, text: 'Дипломированный преподаватель', bg: 'bg-lavender/30' },
  { icon: Video, text: 'Онлайн-занятия', bg: 'bg-sky/30' },
  { icon: UserCheck, text: 'Индивидуальная программа', bg: 'bg-peach/30' },
];

function Hero() {
  const { navigate } = useRouter();
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      {/* Soft watercolor blobs */}
      <div className="blob absolute -right-10 top-20 -z-10 h-72 w-72 bg-butter/30 opacity-60" />
      <div className="blob-2 absolute -left-12 top-48 -z-10 h-64 w-64 bg-blush/30 opacity-60" />
      <div className="blob absolute right-1/3 bottom-0 -z-10 h-48 w-48 bg-lavender/25 opacity-50" />

      <div className="container-px grid items-center gap-10 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:pb-24">
        {/* Left */}
        <div className="flex flex-col items-start gap-6">
          <Reveal>
            <span className="eyebrow bg-mint/30 text-navy">
              <Sparkles className="h-4 w-4 text-navy" />
              Английский для школьников
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-navy text-balance sm:text-5xl lg:text-6xl">
              Английский язык для школьников 5–11 классов
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="max-w-xl text-lg leading-relaxed text-navy/70 text-pretty">
              Помогаю уверенно говорить по-английски, справляться со школьной программой и готовиться
              к ОГЭ и ЕГЭ
            </p>
          </Reveal>

          <Reveal delay={220}>
            <ul className="flex flex-wrap gap-2.5">
              {HERO_BADGES.map((b) => (
                <li
                  key={b.text}
                  className={`inline-flex items-center gap-2 rounded-full ${b.bg} px-3.5 py-2 text-sm font-semibold text-navy`}
                >
                  <b.icon className="h-4 w-4" />
                  {b.text}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <TelegramButton variant="blush">Записаться на занятие</TelegramButton>
              <VkButton variant="blush">Написать во ВКонтакте</VkButton>
              <a
                href={routeHref('home', 'directions')}
                onClick={(event) => navigateFromLink(event, navigate, 'home', 'directions')}
                className="btn-ghost"
              >
                Узнать о занятиях
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Right: photo */}
        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div className="overflow-hidden rounded-[2.5rem] border border-white/80 shadow-float">
              <TeacherPhoto className="rounded-[2.5rem]" loading="eager" />
            </div>
            {/* Floating stat cards */}
            <div className="absolute -bottom-5 -left-3 hidden animate-floatY rounded-2xl bg-white p-4 shadow-float sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-butter/30 text-navy">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-xl font-extrabold leading-none text-navy">92 балла</p>
                  <p className="mt-1 text-xs text-navy/60">ЕГЭ по английскому</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-3 -top-3 hidden animate-floatY rounded-2xl bg-white p-3.5 shadow-float [animation-delay:1.5s] sm:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/30 text-navy">
                  <Globe className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-navy">Уровень C1</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Audience ---------------- */

const AUDIENCE = [
  { icon: BookOpen, tag: '5–8 классы', title: 'Школьная программа', text: 'Помощь с домашними заданиями, школьной программой, грамматикой и лексикой', bg: 'bg-wash-butter', accent: 'bg-butter' },
  { icon: ClipboardCheck, tag: '9 класс', title: 'Подготовка к ОГЭ', text: 'Системная подготовка к ОГЭ: чтение, грамматика, аудирование, устная и письменная часть', bg: 'bg-wash-lavender', accent: 'bg-lavender' },
  { icon: GraduationCap, tag: '10–11 классы', title: 'Подготовка к ЕГЭ', text: 'Подготовка к ЕГЭ с разбором всех заданий, отработкой форматов и тренировкой письма', bg: 'bg-wash-sky', accent: 'bg-sky' },
  { icon: MessagesSquare, tag: 'Общий английский', title: 'Уверенность в речи', text: 'Для тех, кто хочет говорить увереннее, лучше понимать речь на слух и улучшить уровень', bg: 'bg-wash-peach', accent: 'bg-peach' },
];

function Audience() {
  return (
    <section id="audience" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Кому подойдут занятия"
          eyebrowColor="butter"
          title="Поддержка на каждом этапе обучения"
          description="Занятия выстроены под возраст, цель и уровень ученика — от пятого класса до выпускного"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {AUDIENCE.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} as="article">
              <div className={`card ${i % 2 === 0 ? 'card-tilt-r' : 'card-tilt-l'} h-full ${item.bg} p-6`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.accent} text-navy`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-navy/50">{item.tag}</p>
                <h3 className="mt-1.5 font-display text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Directions ---------------- */

const DIRECTIONS: { icon: typeof BookOpen; title: string; desc: string; bg: string; hoverBg: string; page?: PageKey }[] = [
  { icon: BookOpen, title: 'Английский для школы', desc: 'Помощь с программой и домашними заданиями', bg: 'bg-lavender/30', hoverBg: 'hover:bg-wash-lavender', page: 'schoolEnglish' },
  { icon: ClipboardCheck, title: 'Подготовка к ВПР', desc: 'Отработка формата и ключевых тем ВПР', bg: 'bg-sky/30', hoverBg: 'hover:bg-wash-sky' },
  { icon: PenLine, title: 'Подготовка к ОГЭ', desc: 'Все разделы экзамена и устная часть', bg: 'bg-blush/30', hoverBg: 'hover:bg-wash-blush', page: 'ogePrep' },
  { icon: GraduationCap, title: 'Подготовка к ЕГЭ', desc: 'Письмо, чтение, аудирование и говорение', bg: 'bg-butter/30', hoverBg: 'hover:bg-wash-butter', page: 'egePrep' },
  { icon: MessagesSquare, title: 'Разговорный английский', desc: 'Развиваем беглость и понимание на слух', bg: 'bg-mint/30', hoverBg: 'hover:bg-wash-mint', page: 'teenSpeaking' },
];

function Directions() {
  const { navigate } = useRouter();

  return (
    <section id="directions" className="scroll-mt-24 bg-wash-lavender py-16 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Направления работы"
          eyebrowColor="lavender"
          title="Выберите подходящее направление"
          description="От школьной программы до подготовки к экзаменам и разговорной практики"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {DIRECTIONS.map((d, i) => (
            <Reveal key={d.title} delay={i * 80} as="article">
              {d.page ? (
                <a href={routeHref(d.page)} onClick={(event) => navigateFromLink(event, navigate, d.page!)} className={`card ${i % 2 === 0 ? 'card-tilt-l' : 'card-tilt-r'} group ${d.hoverBg} block h-full p-6`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${d.bg} text-navy transition-transform duration-300 group-hover:scale-110`}>
                      <d.icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-navy/35 transition-transform group-hover:translate-x-1" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/65">{d.desc}</p>
                </a>
              ) : (
                <div className={`card ${i % 2 === 0 ? 'card-tilt-l' : 'card-tilt-r'} group ${d.hoverBg} h-full p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${d.bg} text-navy transition-transform duration-300 group-hover:scale-110`}>
                    <d.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-navy">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{d.desc}</p>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Results ---------------- */

function Results() {
  return (
    <section id="results" className="scroll-mt-24 bg-wash-sky py-16 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Результаты учеников"
          eyebrowColor="sky"
          title="Результаты ОГЭ моих учеников за 2025 год"
        />
        <div className="mx-auto mt-10 max-w-md lg:mt-14">
          <Reveal as="article">
            <div className="card card-tilt-r relative overflow-hidden border-l-4 border-lavender p-8 text-center">
              <div className="blob absolute -right-6 -top-6 h-24 w-24 bg-sky/25 opacity-60" />
              <div className="relative">
                <p className="font-display text-6xl font-extrabold leading-none text-navy sm:text-7xl">
                  60–66<sup className="ml-1 align-top text-2xl sm:text-3xl">*</sup>
                </p>
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-navy/50">
                  баллов · ОГЭ 2025
                </p>
                <p className="mt-3 text-xs font-semibold text-navy/75">
                  * из 68 максимально возможных
                </p>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={260} className="mx-auto mt-8 max-w-2xl">
          <p className="rounded-2xl bg-white/60 px-5 py-4 text-center text-xs leading-relaxed text-navy/60">
            Программа подготовки составляется индивидуально. Итоговый результат зависит от стартового
            уровня, регулярности занятий и самостоятельной работы ученика
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */

const STEPS = [
  { title: 'Знакомимся', text: 'Знакомимся и определяем уровень на бесплатном пробном 45-минутном занятии', bg: 'bg-butter' },
  { title: 'Программа', text: 'Составляю индивидуальную программу', bg: 'bg-blush' },
  { title: 'Занятия', text: 'Занимаемся онлайн: теория, практика, речь и интерактивные задания', bg: 'bg-lavender' },
  { title: 'Прогресс', text: 'Выполняем домашние задания и отслеживаем прогресс', bg: 'bg-mint' },
];

function Process() {
  return (
    <section className="bg-wash-mint py-16 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Как проходят занятия"
          eyebrowColor="mint"
          title="Четыре простых шага"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 100} as="article">
              <div className={`card ${i % 2 === 0 ? 'card-tilt-r' : 'card-tilt-l'} relative h-full p-6`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.bg} font-display text-xl font-extrabold text-navy`}>
                  {i + 1}
                </div>
                <h3 className="mt-5 font-display text-base font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{step.text}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-navy/20 lg:block" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 text-center text-sm text-navy/70 shadow-card">
            <Video className="h-5 w-5 shrink-0 text-sky" />
            <p>
              Занятия проходят онлайн в Телемосте или другом удобном сервисе для видеосвязи, с использованием интерактивных материалов
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Approach ---------------- */

const APPROACH_POINTS = [
  'Современные учебники Oxford и Pearson',
  'Интерактивные задания, аудио и видео',
  'Понятная структура уроков',
  'Домашние задания с учётом сложностей ученика',
  'Проверка домашней работы до занятия',
  'Возможность задавать вопросы в мессенджере между уроками',
  'Доброжелательная и спокойная атмосфера',
];

const POINT_BGS = ['bg-butter/25', 'bg-blush/25', 'bg-lavender/25', 'bg-sky/25', 'bg-mint/25', 'bg-peach/25', 'bg-butter/25'];
const CHECK_BGS = ['text-butter', 'text-blush', 'text-lavender', 'text-sky', 'text-mint', 'text-peach', 'text-butter'];

function Approach() {
  return (
    <section className="bg-wash-peach py-16 sm:py-24">
      <div className="container-px grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Мой подход"
            eyebrowColor="peach"
            title="Занятия, в которых знания начинают работать"
            description="Я строю занятия на коммуникативной методике: новая лексика и грамматические конструкции сразу используются в речи. Для каждого ученика я составляю индивидуальную программу с учётом цели, уровня и особенностей обучения"
            align="left"
          />
          <Reveal delay={150}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {APPROACH_POINTS.map((point, i) => (
                <li
                  key={point}
                  className={`flex items-start gap-3 rounded-2xl ${POINT_BGS[i % POINT_BGS.length]} p-3.5`}
                >
                  <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${CHECK_BGS[i % CHECK_BGS.length]}`} />
                  <span className="text-sm leading-snug font-medium text-navy">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div className="absolute -inset-3 -z-10 rounded-[2.4rem] bg-lavender/25 blur-2xl" />
            <SmartImage
              src="https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1100"
              alt="Онлайн-занятие по английскому языку"
              className="aspect-[4/3] overflow-hidden rounded-[2rem] shadow-float"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */

function Reviews() {
  return (
    <section className="bg-wash-blush py-16 sm:py-24">
      <div className="container-px">
        <SectionHeading
          eyebrow="Отзывы"
          eyebrowColor="blush"
          title="Что говорят ученики и родители"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {REVIEWS.map((r, i) => {
            const isPink = i % 2 === 0;
            return (
              <Reveal key={r.author + r.year} delay={(i % 3) * 100} as="article">
                <figure className={`card ${i % 2 === 0 ? 'card-tilt-r' : 'card-tilt-l'} flex h-full flex-col p-6 ${isPink ? 'bg-blush/15' : 'bg-white'}`}>
                  <Quote className="h-8 w-8 text-butter" />
                  <blockquote className="mt-3 flex-1 text-pretty text-base leading-relaxed text-navy">
                    «{r.quote}»
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-navy/10 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender/40 font-display text-sm font-bold text-navy">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">{r.author}</p>
                      <p className="text-xs text-navy/50">{r.subject}, {r.year}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5 text-butter">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-butter text-butter" />
                      ))}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
        <Reveal delay={180} className="mt-8 flex justify-center">
          <a
            href="https://profi.ru/profile/KurtanidzeMD/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Посмотреть все отзывы на Profi.ru
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */

const ABOUT_FACTS = [
  { icon: CalendarClock, text: 'Преподаю с 2019 года', bg: 'bg-butter/25' },
  { icon: Award, text: 'ЕГЭ по английскому языку — 92 балла', bg: 'bg-blush/25' },
  { icon: Globe, text: 'Английский язык — уровень C1', bg: 'bg-lavender/25' },
  { icon: GraduationCap, text: 'Прошла курсы подготовки преподавателей к ОГЭ и ЕГЭ', bg: 'bg-mint/25' },
];

const EDUCATION = [
  'МГПУ, Институт иностранных языков, педагогическое образование, 2018–2022',
  'Фоксфорд: подготовка обучающихся к ОГЭ и ЕГЭ по английскому языку, 72 часа, 2021',
  'МГПУ: Digital-дизайн учебного занятия, 2021',
  'МГПУ: Репетиторство как педагогическая деятельность, 2021',
  'Курс «Подготовка к ОГЭ по английскому языку для преподавателей», 2023',
  'Курс «Подготовка к ЕГЭ по английскому языку для преподавателей», 2025–2026',
];

function About() {
  const [open, setOpen] = useState(false);
  return (
    <section id="about" className="scroll-mt-24 bg-wash-lavender py-16 sm:py-24">
      <div className="container-px">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <Reveal>
            <div className="relative mx-auto max-w-sm lg:max-w-none lg:sticky lg:top-28">
              <div className="absolute -inset-3 -z-10 rounded-[2.4rem] bg-blush/20 blur-2xl" />
              <div className="overflow-hidden rounded-[2.5rem] shadow-float">
                <TeacherPhoto src="/images/teacher-hero-original.webp" width={732} height={740} className="rounded-[2.5rem]" />
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Обо мне"
              eyebrowColor="blush"
              title="Преподаватель, который помогает учиться спокойно и уверенно"
              description="Здравствуйте! Меня зовут Мзиссана. Я выпускница Московского городского педагогического университета и дипломированный преподаватель английского языка"
              align="left"
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ABOUT_FACTS.map((fact, i) => (
                <Reveal key={fact.text} delay={i * 70}>
                  <div className={`flex items-start gap-3 rounded-2xl ${fact.bg} p-4`}>
                    <fact.icon className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                    <span className="text-sm leading-snug font-medium text-navy">{fact.text}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-wash-lavender"
                  aria-expanded={open}
                >
                  <span className="flex items-center gap-3 font-display text-base font-bold text-navy">
                    <Building2 className="h-5 w-5 text-lavender" />
                    Образование и повышение квалификации
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-navy/40 transition-transform duration-300 ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-3 px-5 pb-5">
                      {EDUCATION.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-navy/70">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Format ---------------- */

const FORMAT_CARDS = [
  { icon: Video, title: 'Онлайн-занятия', text: 'Занятия проходят дистанционно из любой точки', bg: 'bg-sky/30' },
  { icon: UserCheck, title: 'Индивидуальный подход', text: 'Программа подбирается под каждого ученика', bg: 'bg-lavender/30' },
  { icon: Video, title: 'Телемост и другие сервисы', text: 'Выбираем удобный сервис для видеосвязи', bg: 'bg-mint/30' },
  { icon: ShieldCheck, title: 'Официальная работа', text: 'Работаю как самозанятая и выдаю чек после оплаты', bg: 'bg-butter/30' },
];

function Format() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-px">
        <SectionHeading eyebrow="Формат работы" eyebrowColor="mint" title="Как устроены занятия" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {FORMAT_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 80} as="article">
              <div className={`card ${i % 2 === 0 ? 'card-tilt-l' : 'card-tilt-r'} h-full p-6`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg} text-navy`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-base font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/65">{card.text}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={400} as="article">
            <div className="flex h-full flex-col justify-center rounded-3xl border-2 border-dashed border-navy/15 bg-cream p-6 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-blush">Стоимость занятия</p>
              <p className="mt-3 font-display text-2xl font-extrabold text-navy">от 2 000 ₽ / час</p>
              <p className="mt-2 text-xs text-navy/50">Точная стоимость зависит от целей занятий</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */

function FinalCta() {
  return (
    <section className="pb-16 sm:pb-24">
      <div className="container-px">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy px-6 py-14 text-center shadow-float sm:px-12 sm:py-20">
            <div className="blob absolute -right-16 -top-16 h-64 w-64 bg-butter/15 opacity-50" />
            <div className="blob-2 absolute -bottom-16 -left-16 h-64 w-64 bg-blush/15 opacity-50" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold leading-tight text-butter text-balance sm:text-4xl lg:text-[2.75rem]">
                Готовы начать заниматься английским увереннее?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
                Напишите мне в Telegram — обсудим цель, текущий уровень и подходящий формат занятий
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <TelegramButton variant="butter">Написать в Telegram</TelegramButton>
                <VkButton variant="butter">Написать во ВКонтакте</VkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Contact form ---------------- */

export function HomeContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', grade: '', goal: '', message: '' });
  const fieldBase =
    'w-full rounded-2xl border-2 border-navy/10 bg-white px-4 py-3 text-base text-navy placeholder:text-navy/30 transition-colors focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/20';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const response = await fetch(contactEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Не удалось отправить сообщение. Пожалуйста, напишите мне в Telegram или ВКонтакте');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="pb-16 sm:pb-24">
      <div className="container-px">
        <Reveal>
          <div className="mx-auto max-w-2xl card p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint/30 text-navy">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl font-bold text-navy">Сообщение отправлено</h2>
                <p className="max-w-md text-navy/70">Спасибо! Я свяжусь с вами в ближайшее время</p>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: '', grade: '', goal: '', message: '' });
                    setSubmitted(false);
                  }}
                  className="btn-ghost mt-2 px-5 py-2.5 text-sm"
                >
                  Отправить ещё одно
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">Форма обратной связи</h2>
                  <p className="mt-1 text-sm text-navy/60">Заполните поля — и я свяжусь с вами</p>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-navy"><User className="h-4 w-4 text-sky" />Имя</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Как к вам обращаться"
                    className={fieldBase}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-navy"><GraduationCap className="h-4 w-4 text-lavender" />Класс ученика</span>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={(event) => setForm((current) => ({ ...current, grade: event.target.value }))}
                    placeholder="Например, 8 класс"
                    className={fieldBase}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-navy"><Target className="h-4 w-4 text-blush" />Цель занятий</span>
                  <input
                    type="text"
                    value={form.goal}
                    onChange={(event) => setForm((current) => ({ ...current, goal: event.target.value }))}
                    placeholder="Например, подготовка к ОГЭ"
                    className={fieldBase}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-navy"><MessagesSquare className="h-4 w-4 text-mint" />Сообщение</span>
                  <textarea
                    required
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    rows={4}
                    placeholder="Расскажите об ученике и пожеланиях"
                    className={`${fieldBase} resize-none`}
                  />
                </label>

                <button type="submit" disabled={isSending} className="btn-navy mt-1 w-full disabled:cursor-wait disabled:opacity-70">
                  <Send className="h-5 w-5" />{isSending ? 'Отправляем…' : 'Отправить сообщение'}
                </button>
                {error && <p className="text-center text-sm font-medium text-red-700">{error}</p>}
                <p className="text-center text-xs text-navy/55">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и даёте согласие на обработку персональных данных
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Page ---------------- */

export function HomePage() {
  return (
    <main>
      <Hero />
      <Audience />
      <Directions />
      <Results />
      <Process />
      <Approach />
      <Reviews />
      <About />
      <Format />
      <FinalCta />
      <HomeContactForm />
    </main>
  );
}
