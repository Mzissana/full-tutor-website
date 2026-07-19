import { ArrowRight, SearchX } from 'lucide-react';
import { useRouter } from '../router';
import { navigateFromLink, routeHref } from '../navigation';

export function NotFoundPage() {
  const { navigate } = useRouter();

  return (
    <main className="section-shell flex min-h-[62vh] items-center py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <SearchX aria-hidden="true" className="mx-auto mb-6 h-12 w-12 text-navy" strokeWidth={1.7} />
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-navy/55">Ошибка 404</p>
        <h1 className="font-display text-4xl font-black leading-tight text-navy sm:text-6xl">
          Страница не найдена
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-navy/65 sm:text-lg">
          Возможно, адрес изменился или в ссылке есть ошибка. Вернитесь на главную страницу или откройте
          бесплатные материалы по английскому языку.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={routeHref('home')}
            onClick={(event) => navigateFromLink(event, navigate, 'home')}
            className="btn-primary justify-center"
          >
            На главную <ArrowRight aria-hidden="true" size={18} />
          </a>
          <a
            href={routeHref('materials')}
            onClick={(event) => navigateFromLink(event, navigate, 'materials')}
            className="btn-secondary justify-center"
          >
            Открыть материалы
          </a>
        </div>
      </div>
    </main>
  );
}
