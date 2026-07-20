import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, FileText, Home, Maximize2, Moon, Sun } from 'lucide-react';
import { navigateFromLink, routeHref } from '../navigation';
import { useRouter } from '../router';
import { ToolStudyGuide } from '../components/ToolStudyGuide';

const WORKSHEET_SOURCE = '/worksheets/oge-electronic-letter/index.html';

export function OgeLetterWorksheetPage() {
  const { navigate } = useRouter();
  const [dark, setDark] = useState(false);
  const [worksheetHeight, setWorksheetHeight] = useState(2500);
  const appRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateWorksheetHeight = (event: MessageEvent<{ type?: string; height?: number }>) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'oge-letter-worksheet-height') return;
      const nextHeight = Number(event.data.height);
      if (Number.isFinite(nextHeight)) setWorksheetHeight(Math.min(6000, Math.max(1200, nextHeight)));
    };

    window.addEventListener('message', updateWorksheetHeight);
    return () => window.removeEventListener('message', updateWorksheetHeight);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await appRef.current?.requestFullscreen();
    } catch {
      // Browsers can reject fullscreen requests in embedded contexts.
    }
  };

  const shellClass = dark ? 'bg-[#0f172a] text-slate-100 ring-slate-700' : 'bg-[#fafaf7] text-navy ring-navy/10';
  const controlClass = dark ? 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-navy/10 bg-white text-navy/75 hover:bg-wash-lavender';

  return (
    <main className="pt-24 sm:pt-28">
      <section className="relative overflow-hidden">
        <div className="blob absolute -right-20 top-0 h-72 w-72 bg-lavender/20 opacity-60" />
        <div className="blob-2 absolute -left-16 top-32 h-56 w-56 bg-sky/20 opacity-50" />
        <div className="container-px py-10 sm:py-14">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-navy text-balance sm:text-5xl">Электронное письмо ОГЭ по английскому: шаблон и пример</h1>
            <p className="mt-5 text-lg leading-relaxed text-navy/70 text-pretty">Разберите структуру электронного письма, изучите полезные фразы и пример ответа, затем скачайте рабочий лист для подготовки.</p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-px">
          <section ref={appRef} className={`overflow-hidden rounded-[2rem] p-3 shadow-float ring-1 transition-colors sm:p-7 ${shellClass}`}>
            <div className="flex items-center justify-between gap-3 px-2 sm:px-0">
              <a href={routeHref('materials')} onClick={(event) => navigateFromLink(event, navigate, 'materials')} className={`inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-sm font-bold transition-colors sm:px-3 ${dark ? 'text-slate-300 hover:text-white' : 'text-navy/70 hover:text-navy'}`}>
                <ArrowLeft className="h-4 w-4" />Назад
              </a>
              <div className="flex items-center gap-2">
                <a href={routeHref('materials')} onClick={(event) => navigateFromLink(event, navigate, 'materials')} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-bold shadow-soft transition-colors ${controlClass}`} aria-label="Вернуться к материалам">
                  <Home className="h-4 w-4" /><span className="hidden sm:inline">Главная</span>
                </a>
                <button type="button" onClick={() => setDark((value) => !value)} className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-soft transition-colors ${controlClass}`} aria-label={dark ? 'Включить светлую тему' : 'Включить тёмную тему'}>
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button type="button" onClick={toggleFullscreen} className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border shadow-soft transition-colors ${controlClass}`} aria-label="Открыть во весь экран">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mx-auto mt-7 max-w-5xl sm:mt-10">
              <div className={`mb-7 flex flex-col gap-4 rounded-3xl border p-5 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:p-7 ${dark ? 'border-slate-700 bg-slate-800/70' : 'border-navy/10 bg-white'}`}>
                <div>
                  <div className={`inline-flex items-center gap-2 text-sm font-bold ${dark ? 'text-lavender' : 'text-navy/70'}`}><FileText className="h-4 w-4" />Рабочий лист по письму ОГЭ</div>
                  <p className={`mt-2 max-w-xl leading-relaxed ${dark ? 'text-slate-300' : 'text-navy/65'}`}>Оригинальная версия рабочего листа из проекта</p>
                </div>
                <a href="/downloads/oge-electronic-letter-worksheet.pdf?v=project-version" download="oge-electronic-letter-worksheet.pdf" className="btn-navy shrink-0 px-5 py-3 text-sm"><Download className="h-4 w-4" />Скачать рабочий лист</a>
              </div>

              <iframe
                title="Рабочий лист по электронному письму ОГЭ"
                src={WORKSHEET_SOURCE}
                className="block w-full overflow-hidden rounded-3xl border-0 bg-[#eef1f6] shadow-card"
                style={{ height: `${worksheetHeight}px` }}
              />
            </div>
          </section>
        </div>
      </section>

      <ToolStudyGuide guide="letter" />
    </main>
  );
}
