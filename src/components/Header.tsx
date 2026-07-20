import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, SITE } from '../config';
import { navigateFromLink, routeHref } from '../navigation';
import { useRouter } from '../router';
import { TelegramButton, VkButton } from './TelegramButton';
import { SiteLogo } from './SiteLogo';

export function Header() {
  const { page, hash, navigate } = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [page, hash]);

  const go = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetPage: typeof NAV_LINKS[number]['page'],
    targetHash?: string,
  ) => {
    if (navigateFromLink(event, navigate, targetPage, targetHash)) setOpen(false);
  };

  const isActive = (label: string) => {
    const link = NAV_LINKS.find((l) => l.label === label);
    if (!link) return false;
    if (
      link.page === 'materials' &&
      page !== null &&
      ['examind', 'ogeMonologue', 'ogeMonologueWorksheet', 'speakPractice', 'ogeElectronicLetter'].includes(page)
    ) return true;
    if (link.hash) return page === link.page && hash === link.hash;
    return page === link.page && !hash;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 min-w-[320px] transition-all duration-300 ${
        scrolled || open ? 'bg-cream/90 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-5 sm:h-20 sm:px-8 lg:px-10">
        {/* Logo */}
        <a
          href={routeHref('home')}
          onClick={(event) => go(event, 'home')}
          className="group flex shrink-0 items-center gap-2.5 text-left"
          aria-label="На главную"
          aria-current={page === 'home' && !hash ? 'page' : undefined}
        >
          <SiteLogo className="transition-transform duration-300 group-hover:scale-105" />
          <span className="whitespace-nowrap font-display text-base font-bold tracking-tight text-navy sm:text-xl">
            {SITE.name}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden shrink-0 items-center gap-1 2xl:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={routeHref(link.page, link.hash)}
              onClick={(event) => go(event, link.page, link.hash)}
              aria-current={isActive(link.label) ? (link.hash ? 'location' : 'page') : undefined}
              className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold transition-colors duration-200 ${
                isActive(link.label) ? 'text-navy' : 'text-navy/55 hover:text-navy'
              }`}
            >
              {link.label}
              {isActive(link.label) && (
                <span className="absolute inset-x-3 -bottom-0.5 h-1 rounded-full bg-blush" />
              )}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden shrink-0 items-center gap-2 min-[800px]:flex">
          <TelegramButton variant="blush" className="whitespace-nowrap px-5 py-2.5 text-sm">
            Написать в Telegram
          </TelegramButton>
          <VkButton variant="blush" className="whitespace-nowrap px-4 py-2.5 text-sm">ВК</VkButton>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-navy/10 bg-white/60 text-navy transition-colors hover:bg-white 2xl:hidden"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="primary-mobile-navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-cream/95 backdrop-blur-md transition-[max-height,opacity] duration-300 2xl:hidden ${
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav id="primary-mobile-navigation" className="container-px flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={routeHref(link.page, link.hash)}
              onClick={(event) => go(event, link.page, link.hash)}
              aria-current={isActive(link.label) ? (link.hash ? 'location' : 'page') : undefined}
              className={`rounded-xl px-4 py-3 text-left text-base font-bold transition-colors ${
                isActive(link.label) ? 'bg-lavender/30 text-navy' : 'text-navy/60 hover:bg-lavender/15 hover:text-navy'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 min-[800px]:hidden">
            <TelegramButton variant="blush" className="w-full">
              Написать в Telegram
            </TelegramButton>
            <VkButton variant="blush" className="w-full">Написать ВКонтакте</VkButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
