import { Send } from 'lucide-react';
import { SITE, NAV_LINKS } from '../config';
import { navigateFromLink, routeHref } from '../navigation';
import { useRouter } from '../router';
import { VkButton } from './TelegramButton';
import { SiteLogo } from './SiteLogo';

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="min-w-[320px] bg-navy text-white">
      <div className="container-px py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <SiteLogo variant="dark" />
              <span className="font-display text-lg font-bold text-white">{SITE.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              {SITE.tagline}. Онлайн-занятия для школьников 5–11 классов
            </p>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/40">Разделы</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={routeHref(link.page, link.hash)}
                    onClick={(event) => navigateFromLink(event, navigate, link.page, link.hash)}
                    className="text-sm text-white/70 transition-colors hover:text-butter"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={routeHref('privacy')}
                  onClick={(event) => navigateFromLink(event, navigate, 'privacy')}
                  className="text-sm leading-snug text-white/70 transition-colors hover:text-butter"
                >
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/40">Связаться</h3>
            <p className="mt-4 text-sm text-white/60">Запишитесь на занятие через Telegram</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-butter px-5 py-2.5 text-sm"
              >
                <Send className="h-4 w-4" />
                Написать в Telegram
              </a>
              <VkButton variant="butter" className="px-4 py-2.5 text-sm">ВК</VkButton>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
}
