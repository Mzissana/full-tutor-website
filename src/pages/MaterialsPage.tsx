import { useMemo, useState } from 'react';
import {
  Download,
  Eye,
  FileText,
  MonitorPlay,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { MATERIALS } from '../config';
import type { Material, MaterialCategory } from '../config';
import { navigateFromLink, routeHref } from '../navigation';
import { useRouter } from '../router';

const FILTERS: (MaterialCategory | 'Все материалы')[] = [
  'Все материалы',
  'Бесплатные',
  'ОГЭ',
  'ЕГЭ',
  'Интерактивные задания',
  'Рабочие листы',
];

const CATEGORY_COLORS: Record<string, string> = {
  'ОГЭ': 'bg-blush/30 text-navy',
  'ЕГЭ': 'bg-butter/30 text-navy',
  'ОГЭ и ЕГЭ': 'bg-mint/30 text-navy',
  'Интерактивные задания': 'bg-lavender/30 text-navy',
  'Рабочие листы': 'bg-sky/30 text-navy',
  'Бесплатные': 'bg-mint/30 text-navy',
};

function matchesFilter(material: Material, filter: string): boolean {
  if (filter === 'Все материалы') return true;
  if (filter === 'Бесплатные') return material.status === 'available';
  if (filter === 'ОГЭ' || filter === 'ЕГЭ') {
    return material.examType?.includes(filter) || material.category === filter;
  }
  if (filter === 'Интерактивные задания') return material.format === 'Интерактивное задание';
  return material.category === filter;
}

function MaterialCard({ material, index }: { material: Material; index: number }) {
  const isPdf = material.format === 'PDF';
  const isAvailable = material.status === 'available';
  const tilt = index % 2 === 0 ? 'card-tilt-r' : 'card-tilt-l';
  const actionLabel = material.format === 'Интерактивное задание'
    ? 'Открыть приложение'
    : material.actionLabel ?? 'Скачать';

  return (
    <Reveal delay={(index % 3) * 90} as="article">
      <article className={`card ${tilt} flex h-full flex-col overflow-hidden`}>
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden bg-wash-lavender">
          <>
            <img
              src={material.cover}
              alt=""
              width="800"
              height="500"
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover transition-transform duration-500 ${
                material.id === 'examind'
                  ? 'scale-[1.08]'
                  : material.id === 'oge-monologue'
                    ? 'object-center hover:scale-[1.02]'
                    : 'hover:scale-105'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
          </>
          {/* Status and format badges stay whole and move to a new row when needed. */}
          <div className="absolute inset-x-3 top-3 flex flex-wrap gap-2">
            {isAvailable ? (
              <span className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur">
                <CheckCircle2 className="h-3.5 w-3.5 text-mint" />
                Бесплатно
              </span>
            ) : (
              <span className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-butter/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur">
                <Clock className="h-3.5 w-3.5" />
                Скоро появится
              </span>
            )}
            <span className={`inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${
              isPdf ? 'bg-navy/80 text-white' : 'bg-white/90 text-navy'
            }`}>
              {isPdf ? <FileText className="h-3.5 w-3.5" /> : <MonitorPlay className="h-3.5 w-3.5" />}
              {material.format}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 ${CATEGORY_COLORS[material.examType ?? material.category] ?? 'bg-lavender/25 text-navy'}`}>
              {material.examType ?? material.category}
            </span>
            <span className="inline-flex shrink-0 whitespace-nowrap items-center gap-1 rounded-full bg-navy/5 px-2.5 py-1 text-navy/55">
              <GraduationCap className="h-3.5 w-3.5" />
              {material.level}
            </span>
          </div>

          <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-navy">
            {material.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">{material.description}</p>

          <div className="mt-5">
            {isAvailable ? (
              <a
                href={material.href}
                className="btn-navy w-full px-4 py-2.5 text-sm"
                target={material.openInNewTab === false ? undefined : '_blank'}
                rel={material.openInNewTab === false ? undefined : 'noopener noreferrer'}
              >
                {material.openInNewTab === false ? <ArrowUpRight className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                {actionLabel}
              </a>
            ) : (
              <button type="button" className="btn-ghost w-full cursor-not-allowed px-4 py-2.5 text-sm opacity-70">
                <Eye className="h-4 w-4" />
                Подробнее скоро
              </button>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function MaterialsPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>('Все материалы');
  const { navigate } = useRouter();

  const filtered = useMemo(
    () => MATERIALS.filter((m) => matchesFilter(m, active)),
    [active]
  );

  return (
    <main className="pt-24 sm:pt-28">
      {/* Hero */}
      <section className="relative overflow-hidden pb-10">
        <div className="blob absolute -right-20 top-0 h-72 w-72 bg-lavender/25 opacity-60" />
        <div className="blob-2 absolute -left-16 top-32 h-56 w-56 bg-sky/20 opacity-50" />

        <div className="container-px py-10 sm:py-14">
          <Reveal className="flex max-w-2xl flex-col gap-5">
            <span className="eyebrow bg-lavender/25 text-navy">
              <Sparkles className="h-4 w-4" />
              Для учащихся и преподавателей
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-navy text-balance sm:text-5xl">
              Материалы для учащихся и преподавателей
            </h1>
            <p className="text-lg leading-relaxed text-navy/70 text-pretty">
              Рабочие листы, интерактивные задания и материалы для подготовки к ОГЭ и ЕГЭ
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="pb-16 sm:pb-24">
        <div className="container-px">
          <Reveal>
            <div className="flex flex-wrap gap-2.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                    active === f
                      ? 'bg-navy text-white shadow-card'
                      : 'bg-white text-navy/60 hover:text-navy shadow-soft'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m, i) => (
              <MaterialCard key={m.id} material={m} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-10 rounded-3xl border-2 border-dashed border-navy/15 bg-white/50 p-12 text-center text-navy/60">
              В этой категории пока нет материалов
            </div>
          )}

          {/* CTA */}
          <Reveal delay={150}>
            <div className="mt-14 flex flex-col items-center gap-4 rounded-[2rem] bg-wash-lavender px-6 py-10 text-center">
              <SectionHeading
                eyebrow="Не пропустите новинки"
                eyebrowColor="lavender"
                title="Хотите узнать о новых материалах?"
                description="Напишите в Telegram — пришлю уведомление, когда появятся новые рабочие листы и задания"
              />
              <a
                href={routeHref('contacts')}
                onClick={(event) => navigateFromLink(event, navigate, 'contacts')}
                className="btn-ghost mt-2"
              >
                Перейти в контакты
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
