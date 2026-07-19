import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { NAV_LINKS } from './config';
import type { PageKey } from './config';

interface RouterContextValue {
  page: PageKey;
  hash: string;
  navigate: (page: PageKey, hash?: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseLocation(): { page: PageKey; hash: string } {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const page = (
    pathname === '/extra/examind'
      ? 'examind'
      : pathname === '/extra/oge-monologue'
        ? 'ogeMonologue'
      : pathname === '/extra/speaking-practice'
        ? 'speakPractice'
      : pathname === '/extra/oge-electronic-letter'
        ? 'ogeElectronicLetter'
      : pathname === '/extra'
      ? 'materials'
      : pathname === '/contacts'
        ? 'contacts'
        : pathname === '/privacy'
          ? 'privacy'
          : 'home'
  ) as PageKey;
  const hash = window.location.hash.replace(/^#/, '');
  return { page, hash };
}

function locationString(page: PageKey, hash?: string): string {
  const paths: Record<PageKey, string> = {
    home: '/',
    materials: '/extra',
    examind: '/extra/examind',
    ogeMonologue: '/extra/oge-monologue',
    speakPractice: '/extra/speaking-practice',
    ogeElectronicLetter: '/extra/oge-electronic-letter',
    contacts: '/contacts',
    privacy: '/privacy',
  };
  return hash ? `${paths[page]}#${hash}` : paths[page];
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [{ page, hash }, setState] = useState(parseLocation);

  useEffect(() => {
    const onLocationChange = () => {
      const location = parseLocation();
      setState(location);
      const loc = parseLocation();
      if (!loc.hash) {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  const navigate = useCallback((toPage: PageKey, toHash?: string) => {
    const target = locationString(toPage, toHash);
    if (`${window.location.pathname}${window.location.hash}` === target) {
      // Same location: still handle scroll
      if (toHash) {
        scrollToHash(toHash);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    window.history.pushState({}, '', target);
    const nextLocation = parseLocation();
    setState(nextLocation);
    if (!nextLocation.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  // Handle section scroll after navigation
  useEffect(() => {
    if (hash) {
      // Wait a tick for the page to render
      const t = setTimeout(() => scrollToHash(hash), 80);
      return () => clearTimeout(t);
    }
  }, [page, hash]);

  const value = useMemo(() => ({ page, hash, navigate }), [page, hash, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

function scrollToHash(hash: string) {
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export { NAV_LINKS };
