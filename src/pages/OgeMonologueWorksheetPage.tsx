import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Home,
  Maximize2,
  Play,
  Printer,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { navigateFromLink, routeHref } from '../navigation';
import { useRouter } from '../router';

const PDF_URL = '/downloads/oge-monologue-worksheet.pdf';

const GUIDE_TASK = [
  'what your typical school day is like',
  'what your favourite subject is, and why',
  'what you like most about your school',
  'what your attitude to your school life is',
];

const MODEL_PARTS = [
  { label: 'Вступление + общий контекст', tone: 'bg-wash-lavender', text: "I'm going to give a talk about my school life. School is an important part of every teenager's life." },
  { label: 'Переход к пункту 1', tone: 'bg-wash-sky', text: 'As for my daily routine, my school day usually starts at eight thirty. I normally have six or seven lessons a day.' },
  { label: 'Переход к пункту 2', tone: 'bg-wash-mint', text: 'When it comes to subjects, my favourite one is English. The main reason is that I enjoy learning new words and communicating with people from other countries.' },
  { label: 'Переход к пункту 3', tone: 'bg-wash-peach', text: 'Speaking about the school itself, what I like most is its friendly atmosphere. This is because the teachers are helpful and I have many good friends there.' },
  { label: 'Переход к пункту 4', tone: 'bg-wash-blush', text: 'Overall, my attitude to school life is positive. Although homework can be difficult, school gives me useful knowledge and new experiences.' },
  { label: 'Вывод + финальная фраза', tone: 'bg-wash-lavender', text: "To sum up, school plays an important role in my life. That's all that I wanted to say about my school life." },
];

const ANALYSIS_MONOLOGUE = [
  "I'm going to give a talk about school clubs.",
  'School clubs give students a chance to learn outside regular lessons.',
  'My school is no exception, and it offers a drama club, a sports club and a science club.',
  'As for me, I attend the drama club every Wednesday after lessons.',
  'I chose it because I enjoy acting and working with other students.',
  'During our meetings, we practise short scenes and prepare school performances.',
  'What is more, our teacher shows us how to speak clearly in front of an audience.',
  'Speaking about the benefits, school clubs help teenagers discover their talents.',
  'They are also a good way to make new friends.',
  'For this reason, I would recommend joining a club that matches your interests.',
  'To sum up, school clubs can make school life more interesting and useful.',
  "That's all that I wanted to say about school clubs.",
];

const ORDER_CHUNKS = [
  "That's all that I wanted to say about school rules.",
  'My school also has several rules we have to follow. For example, students must arrive on time and bring everything they need for lessons.',
  "I'm going to give a talk about school rules. Every school has its own rules, and they help students feel safe and organised.",
  'In my opinion, all school rules matter, but the most important one is to respect other students and teachers. Without respect, it is difficult to study together.',
  'At the same time, not every rule is equally useful. I would change the ban on using phones during every break because students may need to contact their parents.',
  'To sum up, sensible rules make school life safer without creating unnecessary problems.',
];
const CORRECT_ORDER = [2, 1, 3, 4, 5, 0];

const PHRASE_GROUPS = [
  { title: '1. Назвать тему', phrases: ["I'm going to give a talk about…", "I'd like to tell you about…"] },
  { title: '2. Дать общий контекст', phrases: ['Every school has…', 'This topic is important because…', '…is an important part of…'] },
  { title: '3. Перейти к своему опыту', phrases: ['My school is no exception, and…', 'As for me, …', 'In my case, …'] },
  { title: '4. Связать следующий пункт', phrases: ['When it comes to…, …', 'Speaking about…, …', 'What is more, …', 'At the same time, …'] },
  { title: '5. Показать причину или результат', phrases: ['The main reason is that…', 'This is because…', 'For this reason, …', 'As a result, …'] },
  { title: '6. Сделать вывод', phrases: ['To sum up, …', "That's all that I wanted to say about…"] },
];

function countSentences(value: string): number {
  return value.split(/[.!?]+(?:\s|$)/).map((part) => part.trim()).filter(Boolean).length;
}

function SectionCard({ number, eyebrow, title, children, className = '' }: { number?: string; eyebrow: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`worksheet-card rounded-[1.75rem] bg-white p-5 shadow-soft sm:p-8 ${className}`}>
      <div className="flex items-start gap-4">
        {number && <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy font-display text-lg font-extrabold text-white">{number}</span>}
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-navy/45">{eyebrow}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-navy sm:text-3xl">{title}</h2>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function PromptList({ prompts }: { prompts: string[] }) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-[#f8f9fb] p-5">
      <p className="font-bold text-navy">Remember to say:</p>
      <ul className="mt-3 space-y-2 text-navy/75">
        {prompts.map((prompt) => <li key={prompt} className="flex gap-2"><span className="font-bold text-sky">•</span><span>{prompt}</span></li>)}
      </ul>
    </div>
  );
}

function AnswerToggle({ children }: { children: React.ReactNode }) {
  return (
    <details className="worksheet-no-print mt-5 rounded-2xl border border-navy/10 bg-wash-mint p-4 open:shadow-soft">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-navy">
        Проверить ответ <ChevronDown className="h-4 w-4 transition-transform [[open]>&]:rotate-180" />
      </summary>
      <div className="mt-4 border-t border-navy/10 pt-4 text-sm leading-relaxed text-navy/75">{children}</div>
    </details>
  );
}

type TimerPhase = 'idle' | 'prep' | 'speak' | 'done';

function SpeakingTimer() {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [seconds, setSeconds] = useState(90);

  useEffect(() => {
    if (phase !== 'prep' && phase !== 'speak') return;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;
        if (phase === 'prep') {
          setPhase('speak');
          return 120;
        }
        setPhase('done');
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const reset = () => {
    setPhase('idle');
    setSeconds(90);
  };
  const startPreparation = () => {
    setPhase('prep');
    setSeconds(90);
  };
  const startSpeaking = () => {
    setPhase('speak');
    setSeconds(120);
  };
  const label = phase === 'prep' ? 'Подготовка' : phase === 'speak' ? 'Говори' : phase === 'done' ? 'Время вышло' : 'Готов?';
  const display = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="worksheet-no-print mt-6 rounded-[1.75rem] bg-navy p-6 text-center text-white sm:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-lavender">{label}</p>
      <div className="mt-3 font-display text-6xl font-extrabold tabular-nums" aria-live="polite">{display}</div>
      <p className="mt-2 text-sm text-white/60">90 секунд на подготовку · до 2 минут на ответ</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {phase === 'idle' && <button type="button" onClick={startPreparation} className="btn-butter px-5 py-3 text-sm"><Play className="h-4 w-4" />Начать подготовку</button>}
        {phase === 'prep' && <button type="button" onClick={startSpeaking} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-navy">Перейти к ответу</button>}
        {(phase === 'speak' || phase === 'done') && <button type="button" onClick={startSpeaking} className="rounded-full bg-white px-5 py-3 text-sm font-bold text-navy"><Play className="mr-2 inline h-4 w-4" />Начать ответ заново</button>}
        {phase !== 'idle' && <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white"><RotateCcw className="h-4 w-4" />Сбросить</button>}
      </div>
    </div>
  );
}

export function OgeMonologueWorksheetPage() {
  const { navigate } = useRouter();
  const pageRef = useRef<HTMLElement>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [orderChecked, setOrderChecked] = useState(false);
  const [fullAnswer, setFullAnswer] = useState('');

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await pageRef.current?.requestFullscreen();
    } catch {
      // Fullscreen can be unavailable in embedded browser contexts.
    }
  };

  const selectChunk = (index: number) => {
    setOrderChecked(false);
    setOrder((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };
  const correctOrder = order.length === CORRECT_ORDER.length && order.every((item, index) => item === CORRECT_ORDER[index]);

  return (
    <main className="worksheet-page pt-24 sm:pt-28">
      <section className="relative overflow-hidden">
        <div className="blob absolute -right-20 top-0 h-72 w-72 bg-lavender/20 opacity-60" />
        <div className="blob-2 absolute -left-16 top-32 h-56 w-56 bg-sky/20 opacity-50" />
        <div className="container-px py-10 sm:py-14">
          <div className="max-w-3xl">
            <span className="eyebrow bg-lavender/25 text-navy"><Sparkles className="h-4 w-4" />Бесплатный материал · ОГЭ 2026</span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight text-navy text-balance sm:text-5xl">Монолог ОГЭ по английскому: критерии и рабочий лист</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy/70 text-pretty">Разбери структуру задания 3, критерии ФИПИ и пример ответа. Затем выполни пять упражнений на разные школьные темы и потренируйся с экзаменационным таймером.</p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-px">
          <section ref={pageRef} className="worksheet-shell overflow-hidden rounded-[2rem] bg-[#fafaf7] p-3 text-navy shadow-float ring-1 ring-navy/10 sm:p-7">
            <div className="worksheet-no-print flex items-center justify-between gap-3 px-2 sm:px-0">
              <a href={routeHref('materials')} onClick={(event) => navigateFromLink(event, navigate, 'materials')} className="inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-sm font-bold text-navy/70 transition-colors hover:text-navy sm:px-3"><ArrowLeft className="h-4 w-4" />Назад</a>
              <div className="flex items-center gap-2">
                <a href={routeHref('materials')} onClick={(event) => navigateFromLink(event, navigate, 'materials')} className="inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-white px-3 py-2 text-sm font-bold text-navy/75 shadow-soft transition-colors hover:bg-wash-lavender" aria-label="Вернуться к материалам"><Home className="h-4 w-4" /><span className="hidden sm:inline">Материалы</span></a>
                <button type="button" onClick={() => window.print()} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-navy/10 bg-white text-navy/75 shadow-soft" aria-label="Распечатать страницу"><Printer className="h-4 w-4" /></button>
                <button type="button" onClick={toggleFullscreen} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-navy/10 bg-white text-navy/75 shadow-soft" aria-label="Открыть во весь экран"><Maximize2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mx-auto mt-7 max-w-5xl sm:mt-10">
              <div className="worksheet-no-print mb-7 flex flex-col gap-4 rounded-3xl border border-navy/10 bg-white p-5 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-navy/70"><FileText className="h-4 w-4" />Рабочий лист по монологу ОГЭ</div>
                  <p className="mt-2 max-w-xl leading-relaxed text-navy/65">Критерии ФИПИ 2026 · разбор примера · 5 упражнений · таймер</p>
                </div>
                <a href={PDF_URL} download="oge-monologue-worksheet.pdf" className="btn-navy shrink-0 px-5 py-3 text-sm"><Download className="h-4 w-4" />Скачать PDF</a>
              </div>

              <article className="worksheet-content space-y-6 rounded-[2rem] bg-[#eef1f6] p-4 sm:space-y-8 sm:p-8 lg:p-12">
                <header className="worksheet-card relative overflow-hidden rounded-[2rem] bg-navy px-6 py-10 text-white sm:px-10 sm:py-12">
                  <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full bg-lavender/25" />
                  <div className="absolute -bottom-20 right-28 h-36 w-36 rounded-full bg-sky/20" />
                  <p className="relative text-xs font-extrabold uppercase tracking-[0.2em] text-lavender">Задание 3 · устная часть</p>
                  <h2 className="relative mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">Научись строить монолог, а не заучивать один ответ</h2>
                  <p className="relative mt-4 max-w-2xl leading-relaxed text-white/70">Сначала разберись, как устроен хороший ответ. Затем попробуй эту схему на новых темах — так ты подготовишься к реальному экзамену.</p>
                </header>

                <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ['4', 'пункта плана'],
                    ['10–12', 'предложений'],
                    ['90 сек', 'подготовка'],
                    ['7', 'макс. баллов'],
                  ].map(([value, label]) => <div key={label} className="worksheet-card rounded-2xl bg-white p-4 text-center shadow-soft"><div className="font-display text-2xl font-extrabold text-navy sm:text-3xl">{value}</div><div className="mt-1 text-xs font-bold uppercase tracking-wide text-navy/45">{label}</div></div>)}
                </section>

                <SectionCard eyebrow="Перед практикой" title="Как оценивают монолог">
                  <div className="overflow-x-auto rounded-2xl border border-navy/10">
                    <table className="w-full min-w-[660px] border-collapse text-left text-sm">
                      <thead className="bg-navy text-white"><tr><th className="p-4">Критерий</th><th className="p-4">Макс.</th><th className="p-4">Что нужно для максимума</th><th className="p-4">Когда балл снижается</th></tr></thead>
                      <tbody className="divide-y divide-navy/10 bg-white text-navy/75">
                        <tr><th className="p-4 align-top text-navy">К1. Решение коммуникативной задачи</th><td className="p-4 align-top font-extrabold text-navy">3</td><td className="p-4 align-top">Раскрыты все 4 пункта плана, дано 10–12 предложений.</td><td className="p-4 align-top">8–9 предложений — 2 балла; 6–7 — 1; 5 и меньше — 0.</td></tr>
                        <tr><th className="p-4 align-top text-navy">К2. Организация</th><td className="p-4 align-top font-extrabold text-navy">2</td><td className="p-4 align-top">Есть тематические вступление и заключение, логика и связки.</td><td className="p-4 align-top">Нет одного элемента или 1–3 ошибки в логике — 1; нет обоих или 4+ ошибки — 0.</td></tr>
                        <tr><th className="p-4 align-top text-navy">К3. Языковое оформление</th><td className="p-4 align-top font-extrabold text-navy">2</td><td className="p-4 align-top">Не более 4 негрубых лексико-грамматических и не более 3 негрубых фонетических ошибок.</td><td className="p-4 align-top">До 5 и/или 4 — 1; 6+ и/или 5+ либо более 3 грубых ошибок — 0.</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-5 rounded-2xl border-l-4 border-blush bg-wash-blush p-5 text-sm leading-relaxed text-navy/75"><strong className="text-navy">Важно:</strong> если за К1 поставили 0 баллов, всё задание оценивается в 0. Назови тему во вступлении и заключении, раскрой каждый пункт и используй смысловые переходы.</div>
                  <p className="mt-5 text-sm leading-relaxed text-navy/60">Источник: <a className="font-bold text-navy underline decoration-lavender decoration-2 underline-offset-4" href="https://doc.fipi.ru/oge/dlya-predmetnyh-komissiy-subektov-rf/2026/mr_oge_angl_ustn_2026.pdf" target="_blank" rel="noopener noreferrer">методические материалы ФИПИ 2026 <ExternalLink className="inline h-3.5 w-3.5" /></a></p>
                </SectionCard>

                <SectionCard eyebrow="Разбор примера" title="Модель: Your school day">
                  <PromptList prompts={GUIDE_TASK} />
                  <div className="mt-5 space-y-3">
                    {MODEL_PARTS.map((part) => <div key={part.label} className={`rounded-2xl p-4 ${part.tone}`}><span className="text-xs font-extrabold uppercase tracking-wider text-navy/45">{part.label}</span><p className="mt-1.5 leading-relaxed text-navy/80">{part.text}</p></div>)}
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-navy p-4 text-white"><strong className="block text-2xl">12</strong><span className="text-sm text-white/65">предложений</span></div>
                    <div className="rounded-2xl bg-wash-mint p-4"><strong className="block text-lg text-navy">A2–A2+</strong><span className="text-sm text-navy/60">понятный язык</span></div>
                    <div className="rounded-2xl bg-wash-butter p-4"><strong className="block text-lg text-navy">6 частей</strong><span className="text-sm text-navy/60">вступление + 4 пункта + финал</span></div>
                  </div>
                </SectionCard>

                <SectionCard eyebrow="Опора для ответа" title="Полезные фразы и клише">
                  <div className="mb-5 rounded-2xl border-l-4 border-sky bg-wash-sky p-5 text-sm leading-relaxed text-navy/75"><strong className="text-navy">Связка должна добавлять смысл.</strong> Не начинай каждый пункт только со слова <em>Firstly</em>. Покажи, как новая мысль связана с предыдущей: от общего — к своему опыту, от факта — к мнению, от проблемы — к решению.</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PHRASE_GROUPS.map((group) => <div key={group.title} className="rounded-2xl bg-[#f8f9fb] p-4"><h3 className="font-bold text-navy">{group.title}</h3><ul className="mt-2 space-y-1.5 text-sm text-navy/70">{group.phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}</ul></div>)}
                  </div>
                </SectionCard>

                <div className="py-2 text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-navy/40">Практическая часть</p><h2 className="mt-2 font-display text-3xl font-extrabold text-navy">Теперь построй связный ответ самостоятельно</h2><p className="mx-auto mt-3 max-w-2xl leading-relaxed text-navy/60">В каждом упражнении следи не только за содержанием, но и за логичным переходом от одной мысли к следующей.</p></div>

                <SectionCard number="1" eyebrow="School clubs" title="Прочитай и разбери монолог">
                  <div className="rounded-2xl bg-[#f8f9fb] p-5 text-sm leading-relaxed text-navy/80 sm:text-base">{ANALYSIS_MONOLOGUE.join(' ')}</div>
                  <ol className="mt-5 list-decimal space-y-2 pl-5 text-navy/75">
                    <li>Найди вступление и заключение. Названа ли в них тема?</li>
                    <li>Какие четыре смысловых пункта раскрывает автор?</li>
                    <li>Сколько предложений в ответе?</li>
                    <li>Какие фразы связывают общий контекст, личный опыт, пользу и рекомендацию?</li>
                    <li>Какую оценку можно поставить за ответ по К1 и К2?</li>
                  </ol>
                  <AnswerToggle><p><strong>Проверка:</strong> тема названа в предложении 1, общий контекст дан в предложении 2, а финальные предложения — 11–12. Всего 12 предложений. Логическую цепочку создают <em>My school is no exception</em> (от общего к своей школе), <em>As for me</em> (к личному выбору), <em>What is more</em> (добавление), <em>Speaking about the benefits</em> (переход к пользе), <em>For this reason</em> (результат) и <em>To sum up</em> (вывод).</p></AnswerToggle>
                </SectionCard>

                <SectionCard number="2" eyebrow="School rules" title="Собери ответ в правильном порядке">
                  <p className="leading-relaxed text-navy/70">Нажимай на фрагменты по порядку. Новая мысль должна естественно продолжать предыдущую: общая идея → правила твоей школы → самое важное правило → правило, которое стоит изменить → вывод.</p>
                  <div className="worksheet-no-print mt-5 grid gap-3 sm:grid-cols-2">
                    {ORDER_CHUNKS.map((chunk, index) => {
                      const position = order.indexOf(index);
                      return <button key={chunk} type="button" onClick={() => selectChunk(index)} className={`relative rounded-2xl border p-4 text-left text-sm leading-relaxed transition ${position >= 0 ? 'border-sky bg-wash-sky ring-2 ring-sky/25' : 'border-navy/10 bg-white hover:border-navy/25'}`}>{position >= 0 && <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-extrabold text-white">{position + 1}</span>}{chunk}</button>;
                    })}
                  </div>
                  <div className="worksheet-no-print mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setOrderChecked(true)} disabled={order.length !== ORDER_CHUNKS.length} className="btn-navy px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" />Проверить порядок</button>
                    <button type="button" onClick={() => { setOrder([]); setOrderChecked(false); }} className="btn-ghost px-5 py-3 text-sm"><RotateCcw className="h-4 w-4" />Начать заново</button>
                  </div>
                  {orderChecked && <p className={`worksheet-no-print mt-4 rounded-2xl p-4 font-bold ${correctOrder ? 'bg-wash-mint text-navy' : 'bg-wash-blush text-navy'}`} aria-live="polite">{correctOrder ? 'Верно: каждый фрагмент связан с предыдущей мыслью, а ответ заканчивается выводом и финальной фразой.' : 'Пока не совсем. Попробуй ещё раз: общее → твоя школа → важное правило → проблема и изменение → вывод.'}</p>}
                  <AnswerToggle><ol className="list-decimal space-y-1 pl-5">{CORRECT_ORDER.map((index) => <li key={index}>{ORDER_CHUNKS[index]}</li>)}</ol></AnswerToggle>
                </SectionCard>

                <SectionCard number="3" eyebrow="School exams" title="Напиши ответы по каждому пункту">
                  <PromptList prompts={['what school exams you usually take', 'which exam is the most difficult for you, and why', 'how you prepare for exams', 'what advice you would give to a student before an exam']} />
                  <div className="mt-5 rounded-2xl bg-wash-lavender p-5 text-sm leading-relaxed text-navy/75"><strong className="text-navy">Сначала соедини идеи:</strong> экзамены важны → какие экзамены есть у тебя → какой вызывает трудности → как эта трудность влияет на подготовку → какой совет следует из твоего опыта.</div>
                  <div className="mt-5 space-y-4">
                    {[
                      ['Переход от общей темы к экзаменам в твоей школе', 'School exams are an important part of education. My school is no exception, and…'],
                      ['Переход к личной оценке трудности', 'When it comes to difficulty, … The main reason is that…'],
                      ['Переход от трудности к подготовке', 'Because this exam is challenging, I usually prepare by…'],
                      ['Переход от своего опыта к совету', 'For this reason, I would advise other students to…'],
                    ].map(([label, placeholder], index) => <label key={label} className="block"><span className="mb-2 block text-sm font-bold text-navy">{index + 1}. {label}</span><textarea rows={3} className="w-full resize-y rounded-2xl border border-navy/15 bg-[#f8f9fb] p-4 text-navy outline-none transition focus:border-sky focus:ring-2 focus:ring-sky/25" placeholder={placeholder} /></label>)}
                  </div>
                  <div className="mt-5 rounded-2xl bg-wash-butter p-4 text-sm text-navy/75"><strong>Проверь:</strong> есть ли в каждом ответе конкретная информация, причина и фраза, которая связывает его с предыдущей мыслью?</div>
                </SectionCard>

                <SectionCard number="4" eyebrow="School events" title="Напиши полный монолог">
                  <PromptList prompts={['what events your school organises', 'which school event you remember best', 'how students can help organise school events', 'whether school events are important, and why']} />
                  <div className="mt-5 rounded-2xl bg-wash-sky p-5 text-sm leading-relaxed text-navy/75"><strong className="text-navy">Логический маршрут:</strong> зачем нужны школьные мероприятия → мероприятия в твоей школе → личное воспоминание → участие учеников → почему такие мероприятия важны.</div>
                  <label className="mt-5 block"><span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-navy"><span>Твой ответ</span><span className="font-normal text-navy/50">{countSentences(fullAnswer)} предложений</span></span><textarea value={fullAnswer} onChange={(event) => setFullAnswer(event.target.value)} rows={12} className="w-full resize-y rounded-2xl border border-navy/15 bg-[#f8f9fb] p-4 leading-relaxed text-navy outline-none transition focus:border-sky focus:ring-2 focus:ring-sky/25" placeholder="Сначала дай общий контекст, затем логично соедини все пункты и добавь вывод с финальной фразой о теме…" /></label>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {['После темы дан общий контекст', 'Раскрыты все 4 пункта', 'Есть 10–12 предложений', 'Каждый пункт логично связан со следующим', 'Есть вывод и финальная фраза о теме', 'Проверены грамматика и произношение'].map((item) => <label key={item} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-sm text-navy/75 ring-1 ring-navy/10"><input type="checkbox" className="h-4 w-4 accent-[#1A2E4A]" />{item}</label>)}
                  </div>
                </SectionCard>

                <SectionCard number="5" eyebrow="Improving your school" title="Расскажи монолог с таймером">
                  <PromptList prompts={['what you like about your school now', 'what facilities you would improve', 'what new activity you would add', 'how these changes could help students']} />
                  <p className="mt-5 leading-relaxed text-navy/70">За 90 секунд запиши не готовые предложения, а только опорные слова и связи между идеями. Затем говори до двух минут.</p>
                  <div className="mt-5 grid gap-2 text-sm text-navy/75 sm:grid-cols-2">
                    {[
                      'Общий контекст: Schools should develop with their students.',
                      'К своей школе: My school already has many good features. As for me, …',
                      'К проблеме: At the same time, there is still something I would improve.',
                      'К новой идее: Besides improving facilities, I would also add…',
                      'К результату: These changes could help students because…',
                      "Вывод: To sum up… That's all that I wanted to say about improving my school.",
                    ].map((item) => <div key={item} className="rounded-2xl bg-[#f8f9fb] p-4">{item}</div>)}
                  </div>
                  <SpeakingTimer />
                  <div className="worksheet-no-print mt-6 rounded-2xl bg-wash-lavender p-5 text-center"><p className="text-sm leading-relaxed text-navy/70">Хочешь больше случайных тем, карточек и режимов тренировки?</p><a href={routeHref('ogeMonologue')} onClick={(event) => navigateFromLink(event, navigate, 'ogeMonologue')} className="btn-navy mt-4 px-5 py-3 text-sm">Открыть тренажёр монолога</a></div>
                </SectionCard>

                <footer className="worksheet-card rounded-[1.75rem] bg-white p-6 text-center shadow-soft sm:p-8">
                  <h2 className="font-display text-2xl font-extrabold text-navy">Готово: теперь ты умеешь строить монолог самостоятельно</h2>
                  <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-navy/65">Повтори упражнения с новой темой через несколько дней. Сохраняй структуру, но каждый раз формулируй свой ответ.</p>
                </footer>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
