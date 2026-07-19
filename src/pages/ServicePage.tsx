import { ArrowRight, BookOpenCheck, CheckCircle2, MessageCircleQuestion, Sparkles } from 'lucide-react';
import type { PageKey } from '../config';
import { Reveal } from '../components/Reveal';
import { TelegramButton } from '../components/TelegramButton';
import { navigateFromLink, routeHref } from '../navigation';
import { useRouter } from '../router';
import { HomeContactForm } from './HomePage';

export type ServicePageKey = 'ogePrep' | 'egePrep' | 'schoolEnglish' | 'teenSpeaking';

type ServiceContent = {
  eyebrow: string;
  title: string;
  intro: string;
  suitableFor: string[];
  programTitle: string;
  program: string[];
  process: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  related: { page: PageKey; label: string; description: string }[];
  wash: string;
  accent: string;
};

const SERVICE_CONTENT: Record<ServicePageKey, ServiceContent> = {
  ogePrep: {
    eyebrow: '9 класс · экзаменационная подготовка',
    title: 'Подготовка к ОГЭ по английскому языку',
    intro: 'Системно разбираем формат экзамена, укрепляем языковую базу и тренируем каждую часть ОГЭ. Программа строится по текущему уровню ученика и темам, которые требуют больше практики.',
    suitableFor: [
      'Тем, кому важно разобраться в структуре экзамена и критериях оценивания',
      'Ученикам с пробелами в грамматике, лексике или понимании речи на слух',
      'Тем, кому нужна регулярная практика устной и письменной частей',
    ],
    programTitle: 'Что входит в подготовку к ОГЭ',
    program: [
      'Чтение и аудирование: стратегии работы с заданиями и внимательная проверка ответов',
      'Грамматика и лексика: повторение тем и практика в экзаменационном формате',
      'Электронное письмо: структура, полезные фразы и проверка готовых работ',
      'Устная часть: чтение вслух, ответы на вопросы и монологическое высказывание',
      'Пробные задания, разбор ошибок и корректировка индивидуального плана',
    ],
    process: [
      { title: 'Определяем стартовый уровень', text: 'На пробном занятии обсуждаем цель, знакомимся с форматом ОГЭ и отмечаем сильные и слабые темы.' },
      { title: 'Составляем план', text: 'Распределяем темы и разделы экзамена так, чтобы регулярно возвращаться к сложным заданиям.' },
      { title: 'Тренируем формат', text: 'Разбираем алгоритмы, выполняем задания с ограничением по времени и учимся проверять себя.' },
      { title: 'Отслеживаем прогресс', text: 'Анализируем ошибки, повторяем проблемные темы и постепенно собираем полную пробную работу.' },
    ],
    faq: [
      { question: 'Когда лучше начинать подготовку?', answer: 'Срок зависит от стартового уровня и желаемого результата. После пробного занятия можно определить реалистичный темп и последовательность тем.' },
      { question: 'Разбираются ли все части ОГЭ?', answer: 'Да. В программу входят чтение, аудирование, грамматика и лексика, электронное письмо и устная часть.' },
      { question: 'Можно ли отдельно потренировать говорение?', answer: 'Да. На сайте есть тренажёры монолога и ответов на вопросы, а на занятиях можно получить обратную связь по содержанию и речи.' },
    ],
    related: [
      { page: 'ogeMonologue', label: 'Практика монологов ОГЭ', description: 'Карточки, структура ответа и таймеры.' },
      { page: 'speakPractice', label: 'Ответы на вопросы ОГЭ', description: 'Тренировка устной части с записью голоса.' },
      { page: 'ogeElectronicLetter', label: 'Шаблон электронного письма', description: 'Структура письма, фразы и рабочий лист.' },
    ],
    wash: 'bg-wash-lavender',
    accent: 'bg-lavender',
  },
  egePrep: {
    eyebrow: '10–11 классы · экзаменационная подготовка',
    title: 'Подготовка к ЕГЭ по английскому языку',
    intro: 'Выстраиваем подготовку вокруг текущего уровня, экзаменационных задач и времени до ЕГЭ. На занятиях сочетаются языковая база, работа с форматом и регулярный анализ ошибок.',
    suitableFor: [
      'Ученикам, которым нужен понятный план подготовки к экзамену',
      'Тем, кто хочет укрепить грамматику и расширить активный словарный запас',
      'Тем, кому нужна практика письменной и устной частей с обратной связью',
    ],
    programTitle: 'Что входит в подготовку к ЕГЭ',
    program: [
      'Аудирование и чтение: работа с ключевой информацией, деталями и логикой текста',
      'Грамматика и лексика: системное повторение тем и словообразование',
      'Письменная часть: структура ответа, логика, языковое оформление и редактирование',
      'Устная часть: чтение, вопросы, описание и развёрнутое высказывание',
      'Пробные блоки, работа по времени и персональный список повторения',
    ],
    process: [
      { title: 'Проводим диагностику', text: 'Определяем текущий уровень, знакомые форматы и задания, в которых чаще всего возникают ошибки.' },
      { title: 'Расставляем приоритеты', text: 'Формируем последовательность тем с учётом времени до экзамена и цели ученика.' },
      { title: 'Соединяем язык и формат', text: 'Повторяем языковой материал и сразу применяем его в заданиях экзаменационного типа.' },
      { title: 'Закрепляем результат', text: 'Регулярно возвращаемся к ошибкам, тренируем время и проверяем прогресс на пробных блоках.' },
    ],
    faq: [
      { question: 'Можно ли готовиться, если есть пробелы в школьной программе?', answer: 'Да. Индивидуальный план позволяет параллельно восстанавливать языковую базу и знакомиться с экзаменационными заданиями.' },
      { question: 'Будет ли практика устной части?', answer: 'Да. Устные задания тренируются регулярно: от точности произношения до логики и полноты развёрнутого ответа.' },
      { question: 'Как отслеживается прогресс?', answer: 'По результатам тематических заданий, повторной работе над ошибками и пробным блокам в формате экзамена.' },
    ],
    related: [
      { page: 'materials', label: 'Материалы по английскому', description: 'Рабочие листы и интерактивные задания.' },
      { page: 'teenSpeaking', label: 'Разговорная практика', description: 'Дополнительная работа над уверенностью в речи.' },
      { page: 'contacts', label: 'Обсудить подготовку', description: 'Связаться и подобрать подходящий формат.' },
    ],
    wash: 'bg-wash-sky',
    accent: 'bg-sky',
  },
  schoolEnglish: {
    eyebrow: '5–11 классы · индивидуальные занятия',
    title: 'Английский язык для школьников',
    intro: 'Помогаю разобраться со школьной программой, закрыть пробелы и увереннее пользоваться английским. Темп, материалы и домашние задания подбираются под возраст, уровень и цель ученика.',
    suitableFor: [
      'Школьникам, которым сложно следить за темпом программы в классе',
      'Тем, кто хочет улучшить оценки и увереннее выполнять домашние задания',
      'Ученикам, которым важно развивать не только правила, но и живую речь',
    ],
    programTitle: 'Над чем работаем на занятиях',
    program: [
      'Школьные темы: понятное объяснение правил и закрепление на практике',
      'Грамматика и лексика: системное повторение без механического заучивания',
      'Чтение и аудирование: понимание основной мысли и важных деталей',
      'Говорение: ответы, диалоги и обсуждение тем на доступном уровне',
      'Домашние задания и самостоятельность: учимся видеть алгоритм и проверять себя',
    ],
    process: [
      { title: 'Знакомимся', text: 'Обсуждаем школьную программу, трудности и цели, выполняем небольшие задания для определения уровня.' },
      { title: 'Выбираем фокус', text: 'Определяем темы, которые нужно восстановить, и связываем их с текущей школьной программой.' },
      { title: 'Практикуемся', text: 'Чередуем объяснение, упражнения, речь, чтение и задания на понимание английского на слух.' },
      { title: 'Закрепляем', text: 'Возвращаемся к пройденному, отмечаем прогресс и постепенно повышаем самостоятельность ученика.' },
    ],
    faq: [
      { question: 'Можно ли заниматься по школьному учебнику?', answer: 'Да. Школьные темы можно включить в индивидуальный план и дополнить упражнениями для более уверенного понимания материала.' },
      { question: 'Есть ли домашние задания?', answer: 'Домашняя практика помогает закрепить материал. Её объём подбирается с учётом нагрузки и цели ученика.' },
      { question: 'Подойдут ли занятия сильному ученику?', answer: 'Да. В этом случае можно расширять лексику, усложнять тексты и уделять больше времени свободной речи.' },
    ],
    related: [
      { page: 'teenSpeaking', label: 'Разговорный английский', description: 'Практика речи и понимания на слух.' },
      { page: 'materials', label: 'Бесплатные материалы', description: 'Дополнительные задания для самостоятельной работы.' },
      { page: 'contacts', label: 'Записаться на занятие', description: 'Обсудить класс, цель и текущий уровень.' },
    ],
    wash: 'bg-wash-butter',
    accent: 'bg-butter',
  },
  teenSpeaking: {
    eyebrow: 'Подростки · разговорная практика',
    title: 'Разговорный английский для подростков',
    intro: 'Развиваем уверенную речь через понятные темы, регулярные диалоги и работу с живым английским. Грамматика и лексика изучаются как инструменты для общения, а не изолированные правила.',
    suitableFor: [
      'Подросткам, которые понимают правила, но боятся или стесняются говорить',
      'Тем, кому сложно быстро подобрать слова и построить развёрнутый ответ',
      'Ученикам, которые хотят лучше понимать английскую речь на слух',
    ],
    programTitle: 'Что развиваем',
    program: [
      'Активная лексика по темам, которые подходят возрасту и уровню ученика',
      'Диалоги, вопросы и развёрнутые ответы без заучивания целого текста',
      'Понимание речи на слух и выделение ключевой информации',
      'Произношение, интонация и более естественный темп речи',
      'Грамматические конструкции, которые нужны для понятного высказывания',
    ],
    process: [
      { title: 'Выбираем темы', text: 'Опираемся на интересы подростка и ситуации, в которых английский действительно может пригодиться.' },
      { title: 'Собираем лексику', text: 'Разбираем полезные слова и выражения, затем сразу используем их в вопросах и мини-диалогах.' },
      { title: 'Говорим регулярно', text: 'Переходим от коротких ответов к обсуждениям, пересказам и аргументированному мнению.' },
      { title: 'Улучшаем точность', text: 'Разбираем повторяющиеся ошибки так, чтобы корректировка не мешала свободе речи.' },
    ],
    faq: [
      { question: 'Нужен ли высокий уровень для разговорных занятий?', answer: 'Нет. Сложность вопросов, темп и объём лексики подбираются под текущий уровень ученика.' },
      { question: 'Будет ли грамматика?', answer: 'Да, но она рассматривается в контексте речи: нужная конструкция объясняется и сразу используется в ответах и диалогах.' },
      { question: 'Можно ли совмещать разговорную практику со школьной программой?', answer: 'Да. Индивидуальный формат позволяет связать школьные темы с дополнительной практикой речи и аудирования.' },
    ],
    related: [
      { page: 'schoolEnglish', label: 'Английский для школьников', description: 'Поддержка по программе для 5–11 классов.' },
      { page: 'materials', label: 'Материалы для практики', description: 'Интерактивные задания и рабочие листы.' },
      { page: 'contacts', label: 'Подобрать формат', description: 'Написать преподавателю и обсудить цель.' },
    ],
    wash: 'bg-wash-mint',
    accent: 'bg-mint',
  },
};

export function ServicePage({ page }: { page: ServicePageKey }) {
  const content = SERVICE_CONTENT[page];
  const { navigate } = useRouter();

  return (
    <main className="pt-24 sm:pt-28">
      <section className={`relative overflow-hidden ${content.wash}`}>
        <div className="blob absolute -right-20 top-0 h-72 w-72 bg-white/60" />
        <div className="container-px py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <Reveal className="flex max-w-3xl flex-col items-start gap-5">
              <span className={`eyebrow ${content.accent} text-navy`}><Sparkles className="h-4 w-4" />{content.eyebrow}</span>
              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-navy text-balance sm:text-5xl lg:text-6xl">{content.title}</h1>
              <p className="max-w-2xl text-lg leading-relaxed text-navy/70 text-pretty">{content.intro}</p>
              <TelegramButton variant="blush">Записаться на пробное занятие</TelegramButton>
            </Reveal>
            <Reveal delay={120}>
              <div className="card card-tilt-r p-6 sm:p-8">
                <h2 className="font-display text-xl font-bold text-navy">Кому подойдут занятия</h2>
                <ul className="mt-5 space-y-4">
                  {content.suitableFor.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy/70"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint" />{item}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-px grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <div className="flex items-center gap-4"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${content.accent}`}><BookOpenCheck className="h-6 w-6" /></div><h2 className="section-title">{content.programTitle}</h2></div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.program.map((item, index) => <Reveal key={item} delay={(index % 2) * 70} as="article"><div className="card h-full p-5"><span className="text-xs font-extrabold text-navy/35">0{index + 1}</span><p className="mt-2 text-sm leading-relaxed text-navy/70">{item}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className={`${content.wash} py-16 sm:py-24`}>
        <div className="container-px">
          <h2 className="section-title text-center">Как проходит обучение</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.process.map((step, index) => <Reveal key={step.title} delay={index * 70} as="article"><div className="card h-full p-6"><div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${content.accent} font-display font-extrabold`}>{index + 1}</div><h3 className="mt-5 font-display text-lg font-bold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-navy/65">{step.text}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-px grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-4"><MessageCircleQuestion className="h-9 w-9 text-lavender" /><h2 className="section-title">Частые вопросы</h2></div>
            <div className="mt-7 space-y-4">{content.faq.map((item) => <article key={item.question} className="rounded-2xl border border-navy/10 bg-white p-5"><h3 className="font-display font-bold">{item.question}</h3><p className="mt-2 text-sm leading-relaxed text-navy/65">{item.answer}</p></article>)}</div>
          </div>
          <div>
            <h2 className="section-title">Полезные страницы</h2>
            <div className="mt-7 space-y-4">{content.related.map((item) => <a key={item.page} href={routeHref(item.page)} onClick={(event) => navigateFromLink(event, navigate, item.page)} className="group flex items-center justify-between gap-5 rounded-2xl bg-wash-lavender p-5 transition-colors hover:bg-lavender/30"><span><strong className="block font-display text-navy">{item.label}</strong><span className="mt-1 block text-sm text-navy/60">{item.description}</span></span><ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" /></a>)}</div>
          </div>
        </div>
      </section>

      <HomeContactForm />
    </main>
  );
}
