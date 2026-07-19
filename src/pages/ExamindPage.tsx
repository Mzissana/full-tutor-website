import { useEffect, useRef, useState } from 'react';
import { Network } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { TelegramButton } from '../components/TelegramButton';
import { HomeContactForm } from './HomePage';
import { ToolStudyGuide } from '../components/ToolStudyGuide';

export function ExamindPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(720);

  useEffect(() => {
    const updateFrameHeight = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== 'examind:frame-height' || !Number.isFinite(event.data.height)) return;
      setFrameHeight(Math.max(720, Math.ceil(event.data.height)));
    };

    window.addEventListener('message', updateFrameHeight);
    return () => window.removeEventListener('message', updateFrameHeight);
  }, []);

  const requestFrameHeight = () => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'examind:request-frame-height' },
      window.location.origin,
    );
  };

  return (
    <main className="pt-24 sm:pt-28">
      <section className="relative overflow-hidden">
        <div className="blob absolute -right-20 top-0 h-72 w-72 bg-mint/20 opacity-60" />
        <div className="blob-2 absolute -left-16 top-32 h-56 w-56 bg-sky/20 opacity-50" />

        <div className="container-px py-10 sm:py-14">
          <Reveal className="flex max-w-2xl flex-col gap-5">
            <span className="eyebrow bg-mint/30 text-navy">
              <Network className="h-4 w-4" />
              ОГЭ · устная и письменная части
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-navy text-balance sm:text-5xl">
              Ментальные карты для подготовки к ОГЭ
            </h1>
            <p className="text-lg leading-relaxed text-navy/70 text-pretty">
              Интерактивные ментальные карты с основной лексикой для устной и письменной частей ОГЭ
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-px">
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-[2rem] shadow-float ring-1 ring-navy/10">
              <iframe
                ref={iframeRef}
                src="/examind.html"
                title="Ментальные карты для подготовки к ОГЭ"
                className="w-full border-0"
                style={{ height: `${frameHeight}px` }}
                onLoad={requestFrameHeight}
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 flex flex-col items-center gap-4 rounded-[2rem] bg-wash-mint px-6 py-10 text-center">
              <h2 className="font-display text-2xl font-bold text-navy text-balance sm:text-3xl">
                Хотите разобрать тему вместе со мной?
              </h2>
              <p className="max-w-xl text-navy/70 text-pretty">
                Используйте карты для самостоятельной подготовки, а для системных занятий оставьте заявку ниже или напишите мне в Telegram
              </p>
              <TelegramButton variant="blush" className="mt-2">Написать в Telegram</TelegramButton>
            </div>
          </Reveal>
        </div>
      </section>

      <ToolStudyGuide guide="mindmaps" />

      <HomeContactForm />
    </main>
  );
}
