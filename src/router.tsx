import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { NAV_LINKS } from './config';
import type { PageKey } from './config';
import { pageFromPathname, routeHref } from './navigation';

interface RouterContextValue {
  page: PageKey | null;
  hash: string;
  navigate: (page: PageKey, hash?: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseLocation(initialUrl?: string): { page: PageKey | null; hash: string } {
  const location = initialUrl ?? `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const [pathAndQuery, hash = ''] = location.split('#', 2);
  const pathname = pathAndQuery.split('?', 1)[0];
  return { page: pageFromPathname(pathname), hash };
}

export function RouterProvider({ children, initialUrl }: { children: ReactNode; initialUrl?: string }) {
  const [{ page, hash }, setState] = useState(() => parseLocation(initialUrl));

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
    const target = routeHref(toPage, toHash);
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
