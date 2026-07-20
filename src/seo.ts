import type { PageKey } from './config';
import { PAGE_PATHS } from './navigation';

export const SITE_ORIGIN = 'https://mzissana.ru';
const SITE_NAME = 'MzissanaEnglish';
const SOCIAL_IMAGE = `${SITE_ORIGIN}/images/teacher-hero-social.jpg`;
const SOCIAL_IMAGE_TYPE = 'image/jpeg';
const SOCIAL_IMAGE_WIDTH = 1122;
const SOCIAL_IMAGE_HEIGHT = 1402;

export interface PageSeo {
  page: PageKey;
  title: string;
  description: string;
  canonicalUrl: string;
  image: string;
  imageAlt: string;
  imageType: string;
  imageWidth: number;
  imageHeight: number;
  structuredData: Record<string, unknown>;
}

const PAGE_COPY: Record<PageKey, { title: string; description: string }> = {
  home: {
    title: 'Репетитор английского онлайн для школьников — MzissanaEnglish',
    description: 'Индивидуальные онлайн-занятия английским для школьников 5–11 классов: школьная программа, уверенная речь, подготовка к ОГЭ и ЕГЭ.',
  },
  ogePrep: {
    title: 'Подготовка к ОГЭ по английскому языку онлайн — MzissanaEnglish',
    description: 'Индивидуальная онлайн-подготовка к ОГЭ по английскому языку: все разделы экзамена, устная и письменная практика, пробные задания и работа над ошибками.',
  },
  egePrep: {
    title: 'Подготовка к ЕГЭ по английскому языку онлайн — MzissanaEnglish',
    description: 'Системная индивидуальная подготовка к ЕГЭ по английскому языку: чтение, аудирование, грамматика, лексика, письмо и устная часть.',
  },
  schoolEnglish: {
    title: 'Английский для школьников 5–8 классов онлайн — MzissanaEnglish',
    description: 'Индивидуальные онлайн-занятия английским для школьников 5–8 классов: школьная программа, грамматика, домашние задания и уверенная речь.',
  },
  teenSpeaking: {
    title: 'Английский для подростков онлайн: разговорная практика',
    description: 'Индивидуальный английский для подростков онлайн: меньше страха, больше живой речи, понятная грамматика и регулярная разговорная практика.',
  },
  materials: {
    title: 'Материалы по английскому языку — MzissanaEnglish',
    description: 'Бесплатные материалы и интерактивные задания по английскому языку для школьников, подготовки к ОГЭ и ЕГЭ.',
  },
  examind: {
    title: 'Ментальные карты для подготовки к ОГЭ — MzissanaEnglish',
    description: 'Интерактивные ментальные карты с основной английской лексикой для устной и письменной частей ОГЭ.',
  },
  ogeMonologue: {
    title: 'Монолог ОГЭ по английскому: план, темы и тренажёр',
    description: 'Тренажёр монолога ОГЭ по английскому языку: план ответа, темы, критерии, карточки и таймер для подготовки к заданию 3 устной части.',
  },
  ogeMonologueWorksheet: {
    title: 'Монолог ОГЭ по английскому: критерии и рабочий лист',
    description: 'Структура задания 3 ОГЭ, логические переходы, критерии ФИПИ 2026, пример монолога, пять упражнений и таймер для устной практики.',
  },
  speakPractice: {
    title: 'Устная часть ОГЭ по английскому: вопросы и тренажёр',
    description: 'Тренажёр устной части ОГЭ по английскому языку: вопросы экзаменатора, таймер, запись голоса и практика развёрнутых ответов.',
  },
  ogeElectronicLetter: {
    title: 'Электронное письмо ОГЭ по английскому: шаблон и пример',
    description: 'Электронное письмо ОГЭ по английскому языку: актуальная структура, шаблон, полезные фразы, пример ответа и рабочий лист для скачивания.',
  },
  contacts: {
    title: 'Контакты преподавателя английского — MzissanaEnglish',
    description: 'Свяжитесь с MzissanaEnglish, чтобы записаться на онлайн-занятия по английскому языку или подготовку к ОГЭ и ЕГЭ.',
  },
  privacy: {
    title: 'Политика конфиденциальности — MzissanaEnglish',
    description: 'Политика обработки и защиты персональных данных пользователей сайта MzissanaEnglish.',
  },
};

export function getPageSeo(page: PageKey): PageSeo {
  const copy = PAGE_COPY[page];
  const canonicalUrl = `${SITE_ORIGIN}${PAGE_PATHS[page]}`;
  const isWorksheet = page === 'ogeMonologueWorksheet';
  const pageEntity = {
    '@type': isWorksheet ? ['WebPage', 'LearningResource'] : page === 'materials' ? 'CollectionPage' : page === 'contacts' ? 'ContactPage' : 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: copy.title,
    description: copy.description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    ...(page === 'home' ? { about: { '@id': `${SITE_ORIGIN}/#organization` } } : {}),
    inLanguage: 'ru',
    ...(isWorksheet ? {
      learningResourceType: 'Worksheet',
      educationalLevel: '9 класс',
      teaches: 'Монологическое высказывание в задании 3 устной части ОГЭ по английскому языку',
      isAccessibleForFree: true,
    } : {}),
  };
  const organizationEntity = {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    description: PAGE_COPY.home.description,
    logo: `${SITE_ORIGIN}/images/mzissana-eng-logo.png`,
    sameAs: ['https://t.me/mzissana', 'https://vk.com/kmd2000'],
  };

  return {
    page,
    ...copy,
    canonicalUrl,
    image: SOCIAL_IMAGE,
    imageAlt: 'Преподаватель английского языка MzissanaEnglish',
    imageType: SOCIAL_IMAGE_TYPE,
    imageWidth: SOCIAL_IMAGE_WIDTH,
    imageHeight: SOCIAL_IMAGE_HEIGHT,
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_ORIGIN}/#website`,
          url: `${SITE_ORIGIN}/`,
          name: SITE_NAME,
          inLanguage: 'ru',
        },
        ...(page === 'home' ? [organizationEntity] : []),
        pageEntity,
      ],
    },
  };
}
