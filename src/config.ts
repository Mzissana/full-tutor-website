import type { ReactNode } from 'react';

/**
 * Central site configuration.
 * Replace TELEGRAM_LINK and PHOTO_PLACEHOLDER in one place.
 * Update MATERIALS to add new downloadable resources.
 */

export const SITE = {
  name: 'MzissanaEnglish',
  tagline: 'Преподаватель английского языка',
  role: 'Преподаватель английского языка',
  telegram: 'https://t.me/mzissana',
  vk: 'https://vk.com/kmd2000',
  photo: '/images/teacher-about.webp',
  sinceYear: 2019,
  email: 'https://t.me/mzissana',
};

export type MaterialCategory =
  | 'Бесплатные'
  | 'ОГЭ'
  | 'ЕГЭ'
  | 'Интерактивные задания'
  | 'Рабочие листы';

export type MaterialFormat = 'PDF' | 'Интерактивное задание';
export type MaterialStatus = 'available' | 'soon';

export interface Material {
  id: string;
  title: string;
  category: MaterialCategory;
  examType?: string;
  level: string;
  format: MaterialFormat;
  status: MaterialStatus;
  cover: string;
  description: string;
  href: string;
  actionLabel?: string;
  openInNewTab?: boolean;
}

export const MATERIALS: Material[] = [
  {
    id: 'examind',
    title: 'Ментальные карты для подготовки к ОГЭ',
    category: 'Интерактивные задания',
    examType: 'ОГЭ',
    level: '9 класс',
    format: 'Интерактивное задание',
    status: 'available',
    cover: '/images/examind-dark-preview.png',
    description: 'Интерактивные ментальные карты с основной лексикой для устной и письменной частей ОГЭ',
    href: '/extra/examind',
    actionLabel: 'Открыть приложение',
    openInNewTab: false,
  },
  {
    id: 'oge-monologue',
    title: 'Монолог ОГЭ по английскому',
    category: 'Интерактивные задания',
    examType: 'ОГЭ',
    level: '9 класс',
    format: 'Интерактивное задание',
    status: 'available',
    cover: '/images/oge-monologue-card-v2.svg',
    description: 'План, темы и тренажёр монолога в формате задания 3 ОГЭ: пять уровней практики, карточки и таймеры.',
    href: '/extra/oge-monologue',
    actionLabel: 'Открыть практику',
    openInNewTab: false,
  },
  {
    id: 'speak-practice',
    title: 'Устная часть ОГЭ: вопросы',
    category: 'Интерактивные задания',
    examType: 'ОГЭ',
    level: '9 класс',
    format: 'Интерактивное задание',
    status: 'available',
    cover: '/images/speak-practice-preview.svg',
    description: 'Тренажёр вопросов устной части ОГЭ по английскому: случайные вопросы, таймеры и запись голоса',
    href: '/extra/speaking-practice',
    actionLabel: 'Открыть практику',
    openInNewTab: false,
  },
  {
    id: 'oge-monologue-worksheet',
    title: 'Рабочий лист по монологу ОГЭ',
    category: 'ОГЭ',
    level: '9 класс',
    format: 'PDF',
    status: 'available',
    cover: '/images/oge-monologue-worksheet-preview.svg',
    description: 'Структура задания 3, логика связного ответа, критерии ФИПИ, разбор примера и пять упражнений с таймером',
    href: '/extra/oge-monologue-worksheet',
    actionLabel: 'Открыть рабочий лист',
    openInNewTab: false,
  },
  {
    id: 'oge-electronic-letter',
    title: 'Электронное письмо ОГЭ по английскому',
    category: 'ОГЭ',
    level: '9 класс',
    format: 'PDF',
    status: 'available',
    cover: '/images/oge-letter-preview.svg',
    description: 'Наглядная структура электронного письма, шаблон, полезные фразы и пример готового ответа',
    href: '/extra/oge-electronic-letter',
    actionLabel: 'Открыть памятку',
    openInNewTab: false,
  },
  {
    id: 'ege-writing',
    title: 'Лексика для письменной части ЕГЭ',
    category: 'ЕГЭ',
    level: '10–11 класс',
    format: 'PDF',
    status: 'available',
    cover: 'https://images.pexels.com/photos/6147069/pexels-photo-6147069.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Подборка лексики и устойчивых выражений для эссе и письма в письменной части ЕГЭ по английскому языку',
    href: '#',
  },
  {
    id: 'tenses-interactive',
    title: 'Интерактивное задание по временам',
    category: 'Интерактивные задания',
    level: 'B1',
    format: 'Интерактивное задание',
    status: 'available',
    cover: 'https://images.pexels.com/photos/6147669/pexels-photo-6147669.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Интерактивное упражнение на отработку группы времён Present, Past и Future с автопроверкой',
    href: '#',
  },
  {
    id: 'oge-listening',
    title: 'Тренажёр для подготовки к аудированию ОГЭ',
    category: 'ОГЭ',
    level: '9 класс',
    format: 'Интерактивное задание',
    status: 'soon',
    cover: 'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Тренажёр с аудиозаписями в формате ОГЭ и пошаговым разбором ответов на задания по аудированию',
    href: '#',
  },
  {
    id: 'grammar-revision',
    title: 'Workbook: Grammar Revision',
    category: 'Рабочие листы',
    level: 'A2–B1',
    format: 'PDF',
    status: 'available',
    cover: 'https://images.pexels.com/photos/6147069/pexels-photo-6147069.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Сборник грамматических упражнений для повторения ключевых тем: артикли, степени сравнения, модальные глаголы',
    href: '#',
  },
  {
    id: 'speaking-pack',
    title: 'Подборка заданий для устной речи',
    category: 'Рабочие листы',
    level: 'B1–B2',
    format: 'PDF',
    status: 'soon',
    cover: 'https://images.pexels.com/photos/4147669/pexels-photo-6147669.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Карточки с темами для монолога и диалога, опорные конструкции и критерии самооценки устного ответа',
    href: '#',
  },
];

export const REVIEWS = [
  {
    id: 'exam-preparation-parent',
    quote: 'Отличный преподаватель, приятный в общении, пунктуальный. Ребёнок сказал, что занятие понравилось. Будем дальше заниматься, готовиться к экзаменам.',
    author: 'Родитель ученика',
    subject: 'Английский язык · подготовка к экзаменам',
  },
  {
    id: 'student-progress',
    quote: 'Мзиссана — отличный преподаватель и очень приятна в общении! Мне с ней учить язык легко и интересно, в уроке присутствуют интересные задания и отсутствует нудная зубрёжка. Я занимаюсь только два месяца, но уже чувствую огромный прогресс, стала намного увереннее чувствовать себя в разговоре и написании слов. Ещё не менее важно то, как отлично структурировано обучение: всё находится на доске в удобном доступе, и в голове всё сразу раскладывается по полочкам.',
    author: 'Ученица',
    subject: 'Английский язык',
  },
  {
    id: 'interactive-lessons-parent',
    quote: 'Мзиссана Давидовна очень интересно ведёт занятия с применением нескольких интерактивных программ, что увлекает ребёнка. Мы очень рады заниматься с ней.',
    author: 'Родитель ученика',
    subject: 'Английский язык · занятия для школьника',
  },
  {
    id: 'oge-preparation',
    quote: 'Хороший специалист. Помогала готовиться к ОГЭ по английскому языку, хорошо подтянула уровень знаний.',
    author: 'Отзыв о подготовке к ОГЭ',
    subject: 'ОГЭ по английскому языку',
  },
  {
    id: 'individual-program',
    quote: 'Всё замечательно, педагог очень внимательная, прислушивается ко всем моментам, которые возникают в процессе учёбы. Взаимоуважение. Перестраивает свою программу индивидуально под ученика. Ответственная, всегда вовремя выходит на связь.',
    author: 'Клиент Profi.ru',
    subject: 'Итальянский язык · индивидуальная программа',
  },
];

export interface NavLink {
  label: string;
  page: PageKey;
  hash?: string;
}

export type PageKey =
  | 'home'
  | 'ogePrep'
  | 'egePrep'
  | 'schoolEnglish'
  | 'teenSpeaking'
  | 'materials'
  | 'contacts'
  | 'privacy'
  | 'examind'
  | 'ogeMonologue'
  | 'ogeMonologueWorksheet'
  | 'speakPractice'
  | 'ogeElectronicLetter';

export const NAV_LINKS: NavLink[] = [
  { label: 'Главная', page: 'home' },
  { label: 'Занятия', page: 'home', hash: 'audience' },
  { label: 'Результаты', page: 'home', hash: 'results' },
  { label: 'Материалы', page: 'materials' },
  { label: 'Обо мне', page: 'home', hash: 'about' },
  { label: 'Контакты', page: 'contacts' },
];

export type { ReactNode };
