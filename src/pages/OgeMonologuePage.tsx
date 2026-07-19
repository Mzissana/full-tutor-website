import { Mic } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { TelegramButton } from '../components/TelegramButton';
import { HomeContactForm } from './HomePage';

export function OgeMonologuePage() {
  return (
    <main className="pt-24 sm:pt-28">
      <section className="relative overflow-hidden">
        <div className="blob absolute -right-20 top-0 h-72 w-72 bg-lavender/20 opacity-60" />
        <div className="blob-2 absolute -left-16 top-32 h-56 w-56 bg-sky/20 opacity-50" />

        <div className="container-px py-10 sm:py-14">
          <Reveal className="flex max-w-2xl flex-col gap-5">
            <span className="eyebrow bg-lavender/30 text-navy">
              <Mic className="h-4 w-4" />
              ОГЭ · задание 3
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-navy text-balance sm:text-5xl">
              Практика монологов ОГЭ
            </h1>
            <p className="text-lg leading-relaxed text-navy/70 text-pretty">
              Тренируйте монологическое высказывание по карточкам ОГЭ: разбирайте структуру ответа, говорите с таймером и проходите пробную экзаменационную сессию.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-px">
          <Reveal delay={100}>
            <div className="overflow-hidden rounded-[2rem] shadow-float ring-1 ring-navy/10">
              <iframe
                src="/oge-monologue.html"
                title="Практика монологов ОГЭ"
                className="block w-full border-0"
                style={{ height: 'min(820px, calc(100vh - 7rem))', minHeight: '620px' }}
                allow="microphone"
                allowFullScreen
              />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 flex flex-col items-center gap-4 rounded-[2rem] bg-wash-lavender px-6 py-10 text-center">
              <h2 className="font-display text-2xl font-bold text-navy text-balance sm:text-3xl">
                Хотите подготовиться к устной части ОГЭ вместе?
              </h2>
              <p className="max-w-xl text-navy/70 text-pretty">
                Используйте тренажёр для самостоятельной практики, а для системной подготовки напишите мне в Telegram.
              </p>
              <TelegramButton variant="blush" className="mt-2">Написать в Telegram</TelegramButton>
            </div>
          </Reveal>
        </div>
      </section>

      <HomeContactForm />
    </main>
  );
}
