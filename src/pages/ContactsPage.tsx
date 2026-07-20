import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Send,
  Video,
  CheckCircle2,
  User,
  GraduationCap,
  Target,
  MessageSquare,
} from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { TelegramButton, VkButton } from '../components/TelegramButton';
import { SITE } from '../config';
import { contactEndpoint } from '../contactEndpoint';
import { trackMetrikaGoal } from '../analytics';

interface FormState {
  name: string;
  grade: string;
  goal: string;
  message: string;
}

const EMPTY: FormState = { name: '', grade: '', goal: '', message: '' };

const INFO_CARDS = [
  { icon: Video, title: 'Формат', text: 'Онлайн', bg: 'bg-sky/30' },
  { icon: GraduationCap, title: 'Направления', text: 'Школьная программа, ОГЭ и ЕГЭ', bg: 'bg-mint/30' },
  { icon: Target, title: 'Стоимость', text: 'От 2 000 ₽ за час', bg: 'bg-butter/30' },
];

export function ContactsPage() {
  const formStartTracked = useRef(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const trackFormStart = () => {
    if (formStartTracked.current) return;
    formStartTracked.current = true;
    trackMetrikaGoal('form_start', { form_name: 'contact_form', placement: 'contacts_page' });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const response = await fetch(contactEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Request failed');
      trackMetrikaGoal('form_submit_success', { form_name: 'contact_form', placement: 'contacts_page' });
      setSubmitted(true);
    } catch {
      setError('Не удалось отправить сообщение. Пожалуйста, напишите мне в Telegram или ВКонтакте');
    } finally {
      setIsSending(false);
    }
  };

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const fieldBase =
    'ym-disable-keys w-full rounded-2xl border-2 border-navy/10 bg-white px-4 py-3 text-base text-navy placeholder:text-navy/30 transition-colors focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/20';

  return (
    <main className="pt-24 sm:pt-28">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="blob absolute -left-20 top-0 h-72 w-72 bg-blush/20 opacity-60" />
        <div className="blob-2 absolute -right-16 top-32 h-56 w-56 bg-lavender/20 opacity-50" />

        <div className="container-px py-12 sm:py-16">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <span className="eyebrow bg-blush/25 text-navy">
              <Send className="h-4 w-4" />
              Контакты
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-navy text-balance sm:text-5xl">
              Связаться со мной
            </h1>
            <p className="text-lg leading-relaxed text-navy/70 text-pretty">
              Чтобы записаться на занятия, напишите мне в Telegram. В сообщении можно указать класс
              ученика, цель занятий и удобное время для связи
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <TelegramButton variant="blush">Написать в Telegram</TelegramButton>
              <VkButton variant="blush">Написать во ВКонтакте</VkButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Info + Form */}
      <section className="pb-16 sm:pb-24">
        <div className="container-px grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* Info cards */}
          <div className="flex flex-col gap-4">
            {INFO_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={i * 90}>
                <div className={`card ${i % 2 === 0 ? 'card-tilt-r' : 'card-tilt-l'} flex items-center gap-4 p-5`}>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.bg} text-navy`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-blush">{card.title}</p>
                    <p className="mt-0.5 text-base font-bold text-navy">{card.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={300}>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="card card-tilt-l flex items-center gap-4 bg-navy p-5 text-white transition-transform hover:-translate-y-1"
                aria-label="Написать в Telegram"
                onClick={() => trackMetrikaGoal('telegram_click', { placement: 'contacts_quick_contact' })}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-butter/20 text-butter">
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-butter">Быстрый контакт</p>
                  <p className="mt-0.5 text-base font-medium text-white/90">Напишите в Telegram — отвечаю быстро</p>
                </div>
              </a>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={120}>
            <div className="card p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mint/30 text-navy">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-navy">Сообщение отправлено</h2>
                  <p className="max-w-md text-navy/70">
                    Спасибо! Я свяжусь с вами в ближайшее время
                  </p>
                  <button
                    onClick={() => {
                      setForm(EMPTY);
                      setSubmitted(false);
                    }}
                    className="btn-ghost mt-2 px-5 py-2.5 text-sm"
                  >
                    Отправить ещё одно
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} onFocusCapture={trackFormStart} className="flex flex-col gap-5">
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy">Форма обратной связи</h2>
                    <p className="mt-1 text-sm text-navy/60">Заполните поля — и я свяжусь с вами</p>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-navy">
                      <User className="h-4 w-4 text-sky" />
                      Имя
                    </span>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Как к вам обращаться"
                      className={fieldBase}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-navy">
                      <GraduationCap className="h-4 w-4 text-lavender" />
                      Класс ученика
                    </span>
                    <input
                      type="text"
                      value={form.grade}
                      onChange={update('grade')}
                      placeholder="Например, 8 класс"
                      className={fieldBase}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-navy">
                      <Target className="h-4 w-4 text-blush" />
                      Цель занятий
                    </span>
                    <input
                      type="text"
                      value={form.goal}
                      onChange={update('goal')}
                      placeholder="Например, подготовка к ОГЭ"
                      className={fieldBase}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-navy">
                      <MessageSquare className="h-4 w-4 text-mint" />
                      Сообщение
                    </span>
                    <textarea
                      required
                      value={form.message}
                      onChange={update('message')}
                      rows={4}
                      placeholder="Расскажите подробнее об ученике и пожеланиях"
                      className={`${fieldBase} resize-none`}
                    />
                  </label>

                  <button type="submit" disabled={isSending} className="btn-navy mt-1 w-full disabled:cursor-wait disabled:opacity-70">
                    <Send className="h-5 w-5" />
                    {isSending ? 'Отправляем…' : 'Отправить сообщение'}
                  </button>

                  {error && <p className="text-center text-sm font-medium text-red-700">{error}</p>}

                  <p className="text-center text-xs text-navy/50">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и даёте согласие на обработку персональных данных
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
