import { FileText } from 'lucide-react';
import { Reveal } from '../components/Reveal';

export function PrivacyPage() {
  return (
    <main className="pt-24 sm:pt-28">
      <section className="relative overflow-hidden">
        <div className="blob absolute -left-20 top-0 h-72 w-72 bg-lavender/20 opacity-60" />

        <div className="container-px py-12 sm:py-16">
          <Reveal className="mx-auto flex max-w-3xl flex-col gap-5">
            <span className="eyebrow bg-lavender/25 text-navy">
              <FileText className="h-4 w-4" />
              Документ
            </span>
            <h1 className="break-words font-display text-3xl font-extrabold leading-tight tracking-tight text-navy text-balance sm:text-5xl">
              Политика конфиденциальности
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-px">
          <Reveal>
            <div className="mx-auto max-w-3xl space-y-8 rounded-3xl bg-white p-6 text-navy/70 shadow-card sm:p-10">
              <Block title="1. Общие положения">
                Настоящая политика конфиденциальности определяет порядок обработки и защиты
                персональных данных пользователей сайта «MzissanaEnglish» (далее — «Сайт»).
                Используя Сайт и отправляя свои данные через формы обратной связи, вы соглашаетесь
                с настоящей политикой
              </Block>

              <Block title="2. Какие данные обрабатываются">
                Через формы на Сайте могут быть получены: имя, класс ученика, цель занятий и текст
                сообщения, а также технические данные (тип и версия браузера, время доступа).
                Сайт не запрашивает и не хранит специальные категории персональных данных
              </Block>

              <Block title="3. Цели обработки данных">
                Данные используются исключительно для связи с вами, записи на занятия, ответа на
                обращения и улучшения работы Сайта. Данные не передаются третьим лицам и не
                используются для массовых рассылок без вашего согласия
              </Block>

              <Block title="4. Хранение и защита данных">
                Принимаются разумные меры для защиты данных от несанкционированного доступа.
                Данные хранятся не дольше, чем это необходимо для целей, для которых они были
                предоставлены, если иное не требуется действующим законодательством
              </Block>

              <Block title="5. Права пользователя">
                Вы вправе запросить доступ к своим данным, их исправление или удаление, а также
                отозвать согласие на обработку, направив обращение через доступные контактные
                способы
              </Block>

              <Block title="6. Контакты">
                По вопросам обработки персональных данных свяжитесь со мной через Telegram.
                Все контакты указаны на странице «Контакты»
              </Block>

              <p className="pt-4 text-xs text-navy/40">
                Документ обновлён: {new Date().toLocaleDateString('ru-RU')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-navy">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/70">{children}</p>
    </div>
  );
}
