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
  photo: '/images/teacher-about.png',
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
    title: 'Практика монологов ОГЭ',
    category: 'Интерактивные задания',
    examType: 'ОГЭ',
    level: '9 класс',
    format: 'Интерактивное задание',
    status: 'available',
    cover: '/images/oge-monologue-preview.svg',
    description: 'Мини-приложение для тренировки монологов в формате задания 3 ОГЭ: пять уровней практики, карточки с темами и таймеры.',
    href: '/extra/oge-monologue',
    actionLabel: 'Открыть практику',
    openInNewTab: false,
  },
  {
    id: 'speak-practice',
    title: 'Ответы на вопросы ОГЭ',
    category: 'Интерактивные задания',
    examType: 'ОГЭ',
    level: '9 класс',
    format: 'Интерактивное задание',
    status: 'available',
    cover: '/images/speak-practice-preview.svg',
    description: 'Мини-приложение для ответов на вопросы ОГЭ: случайные вопросы, таймеры и запись голоса',
    href: '/extra/speaking-practice',
    actionLabel: 'Открыть практику',
    openInNewTab: false,
  },
  {
    id: 'oge-speaking',
    title: 'Рабочий лист по устной части ОГЭ',
    category: 'ОГЭ',
    level: '9 класс',
    format: 'PDF',
    status: 'available',
    cover: 'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Структурированный рабочий лист с разбором устной части ОГЭ, шаблонами ответов и тренировочными заданиями',
    href: '#',
  },
  {
    id: 'oge-electronic-letter',
    title: 'Шаблон электронного письма ОГЭ',
    category: 'ОГЭ',
    level: '9 класс',
    format: 'PDF',
    status: 'available',
    cover: '/images/oge-letter-preview.svg',
    description: 'Наглядный шаблон со структурой письма, клише и примером готового ответа',
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
    quote: 'Ребёнок сказал, что занятие понравилось. Будем дальше заниматься, готовиться к экзаменам',
    author: 'Родитель ученика',
    subject: 'английский язык',
    year: '2024',
  },
  {
    quote: 'Мне с ней учить язык легко и интересно. Уже чувствую огромный прогресс и стала увереннее в разговоре',
    author: 'Ученица',
    subject: 'английский язык',
    year: '2023',
  },
  {
    quote: 'Интересно ведёт занятия с применением нескольких интерактивных программ, что увлекает ребёнка',
    author: 'Родитель ученика',
    subject: 'английский язык',
    year: '2022',
  },
];

export interface NavLink {
  label: string;
  page: PageKey;
  hash?: string;
}

export type PageKey = 'home' | 'materials' | 'contacts' | 'privacy' | 'examind' | 'ogeMonologue' | 'speakPractice' | 'ogeElectronicLetter';

export const NAV_LINKS: NavLink[] = [
  { label: 'Главная', page: 'home' },
  { label: 'Занятия', page: 'home', hash: 'audience' },
  { label: 'Результаты', page: 'home', hash: 'results' },
  { label: 'Материалы', page: 'materials' },
  { label: 'Обо мне', page: 'home', hash: 'about' },
  { label: 'Контакты', page: 'contacts' },
];

export type { ReactNode };
