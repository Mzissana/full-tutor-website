import type { MouseEvent } from 'react';
import type { PageKey } from './config';

type Navigate = (page: PageKey, hash?: string) => void;

export const PAGE_PATHS: Record<PageKey, string> = {
  home: '/',
  ogePrep: '/podgotovka-k-oge-po-angliyskomu',
  egePrep: '/podgotovka-k-ege-po-angliyskomu',
  schoolEnglish: '/angliyskiy-dlya-shkolnikov',
  teenSpeaking: '/razgovornyy-angliyskiy-dlya-podrostkov',
  materials: '/extra',
  examind: '/extra/examind',
  ogeMonologue: '/extra/oge-monologue',
  speakPractice: '/extra/speaking-practice',
  ogeElectronicLetter: '/extra/oge-electronic-letter',
  contacts: '/contacts',
  privacy: '/privacy',
};

export function routeHref(page: PageKey, hash?: string): string {
  return hash ? `${PAGE_PATHS[page]}#${hash}` : PAGE_PATHS[page];
}

export function pageFromPathname(pathname: string): PageKey | null {
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const entry = Object.entries(PAGE_PATHS).find(([, path]) => path === normalizedPath);
  return (entry?.[0] as PageKey | undefined) ?? null;
}

export function navigateFromLink(
  event: MouseEvent<HTMLAnchorElement>,
  navigate: Navigate,
  page: PageKey,
  hash?: string,
): boolean {
  const target = event.currentTarget.getAttribute('target');
  const shouldUseBrowserNavigation =
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (target !== null && target !== '_self');

  if (shouldUseBrowserNavigation) return false;

  event.preventDefault();
  navigate(page, hash);
  return true;
}
