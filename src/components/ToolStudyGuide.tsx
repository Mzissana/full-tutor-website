import { AlertTriangle, ArrowRight, CheckCircle2, ListChecks, MessageSquareText } from 'lucide-react';
import type { PageKey } from '../config';
import { navigateFromLink, routeHref } from '../navigation';
import { useRouter } from '../router';

export type ToolGuideKey = 'monologue' | 'questions' | 'letter' | 'mindmaps';

type GuideContent = {
  title: string;
  intro: string;
  requirements: string[];
  steps: string[];
  phrases: string[];
  mistakes: string[];
  example: { title: string; text: string };
  faq: { question: string; answer: string }[];
  related: { page: PageKey; label: string }[];
  officialSource?: string;
};

const GUIDES: Record<ToolGuideKey, GuideContent> = {
  monologue: {
    title: 'Как подготовить монолог ОГЭ по английскому',
    intro: 'В задании 3 устной части важно не только говорить без долгих пауз, но и последовательно раскрыть каждый пункт плана. Тренажёр помогает отдельно отработать структуру, время и полный ответ.',
    requirements: [
      'Раскрыть все четыре аспекта, указанные в карточке задания',
      'Построить высказывание объёмом 10–12 фраз',
      'Добавить вступление, заключение и понятные логические переходы',
      'Следить за точностью лексики, грамматики и произношения',
    ],
    steps: [
      'Прочитайте тему и подчеркните четыре пункта плана.',
      'Для каждого пункта придумайте тезис и одну уточняющую деталь.',
      'Добавьте короткое вступление и итоговую фразу.',
      'Произнесите ответ с таймером, затем прослушайте запись.',
      'Отметьте пропущенные пункты, повторы и ошибки и запишите ответ ещё раз.',
    ],
    phrases: ['I’d like to give a talk about…', 'First of all,…', 'As for me,…', 'Another important point is…', 'To sum up,…'],
    mistakes: ['Один из пунктов плана пропущен или раскрыт одной общей фразой', 'Ответ состоит из несвязанных предложений без вступления и заключения', 'Одни и те же слова и конструкции повторяются слишком часто', 'Ученик читает заготовку вместо связного ответа по теме'],
    example: { title: 'Пример каркаса ответа', text: 'Вступление → первый аспект и пример → второй аспект и причина → третий аспект и личное мнение → четвёртый аспект → краткое заключение. Такой каркас помогает сохранить логику, но содержание нужно подбирать под конкретную карточку.' },
    faq: [
      { question: 'Нужно ли учить готовые монологи?', answer: 'Лучше учить универсальную структуру и связки. Заученный текст редко точно отвечает всем пунктам новой карточки.' },
      { question: 'Как использовать запись голоса?', answer: 'После ответа проверьте количество раскрытых аспектов, повторы, длинные паузы и понятность произношения, затем повторите попытку.' },
    ],
    related: [{ page: 'speakPractice', label: 'Вопросы устной части ОГЭ' }, { page: 'ogeElectronicLetter', label: 'Электронное письмо ОГЭ' }, { page: 'ogePrep', label: 'Подготовка к ОГЭ по английскому' }],
    officialSource: 'https://fipi.ru/oge/demoversii-specifikacii-kodifikatory',
  },
  questions: {
    title: 'Как тренировать вопросы устной части ОГЭ',
    intro: 'В задании с вопросами важно быстро понять, о чём спрашивают, дать прямой ответ и добавить достаточную деталь. Запись позволяет услышать паузы и заметить, где ответ остаётся слишком коротким.',
    requirements: ['Сначала прямо ответить на поставленный вопрос', 'Использовать полные и понятные фразы', 'Добавить причину, пример или уточнение, когда это уместно', 'Сохранять естественный темп без длинных пауз'],
    steps: ['Прослушайте вопрос целиком и определите вопросительное слово.', 'Сформулируйте короткий прямой ответ.', 'Добавьте одну причину или конкретный пример.', 'Запишите ответ и проверьте, действительно ли он отвечает на вопрос.', 'Повторите ответ, исправив паузы и неточности.'],
    phrases: ['I usually… because…', 'In my opinion,…', 'For example,…', 'It depends on…', 'I prefer… because…'],
    mistakes: ['Ответ не соответствует вопросительному слову', 'Односложный ответ без пояснения', 'Длинное вступление вместо прямого ответа', 'Заученная универсальная фраза не подходит к вопросу'],
    example: { title: 'Пример развёрнутого ответа', text: 'Question: What do you usually do after school? Answer: I usually have a short rest and then do my homework. After that, I often read or talk to my friends online. Конкретные действия делают ответ полнее и естественнее.' },
    faq: [{ question: 'Что делать, если не понял одно слово?', answer: 'Опирайтесь на вопросительное слово и знакомые ключевые слова. Не останавливайте ответ из-за одной незнакомой детали.' }, { question: 'Как сделать ответ длиннее?', answer: 'Добавьте причину, частотность, место, человека или короткий пример — только если это связано с вопросом.' }],
    related: [{ page: 'ogeMonologue', label: 'Монолог ОГЭ по английскому' }, { page: 'examind', label: 'Лексические ментальные карты' }, { page: 'ogePrep', label: 'Подготовка к ОГЭ по английскому' }],
    officialSource: 'https://fipi.ru/oge/demoversii-specifikacii-kodifikatory',
  },
  letter: {
    title: 'Как написать электронное письмо ОГЭ по английскому',
    intro: 'Хорошее письмо отвечает на все вопросы задания, соблюдает нормы неофициального общения и легко читается благодаря абзацам и логическим связкам. Рабочий лист ниже помогает проверить структуру по шагам.',
    requirements: ['Дать полные и точные ответы на три вопроса из письма-стимула', 'Использовать обращение, благодарность или положительную реакцию, завершающую фразу и подпись', 'Разделить текст на логичные абзацы', 'Проверить лексику, грамматику, орфографию и пунктуацию'],
    steps: ['Подчеркните три вопроса и ключевые слова в каждом.', 'Составьте по одному прямому ответу и добавьте необходимые детали.', 'Распределите содержание по абзацам и добавьте связки.', 'Оформите начало и завершение письма.', 'Перечитайте текст по чек-листу и исправьте ошибки.'],
    phrases: ['Thanks for your email.', 'You asked me about…', 'As for…', 'By the way,…', 'Write back soon.', 'Best wishes,'],
    mistakes: ['Один из трёх вопросов остался без полного ответа', 'Нет обязательного элемента письма или нарушена логика абзацев', 'Готовые фразы занимают место, но не раскрывают содержание', 'После написания не остаётся времени на проверку'],
    example: { title: 'Пример логики письма', text: 'Обращение → благодарность за письмо → ответы на первый и второй вопросы → ответ на третий вопрос → надежда на дальнейшее общение → завершающая фраза и подпись. Ответы должны быть связаны с конкретной ситуацией задания.' },
    faq: [{ question: 'Можно ли использовать шаблон?', answer: 'Да, для структуры и этикетных фраз. Содержательная часть всё равно должна точно отвечать на вопросы конкретного задания.' }, { question: 'Что проверять в конце?', answer: 'Все три ответа, абзацы, связки, начало и завершение письма, затем грамматику и написание слов.' }],
    related: [{ page: 'ogeMonologue', label: 'Монолог ОГЭ по английскому' }, { page: 'speakPractice', label: 'Вопросы устной части ОГЭ' }, { page: 'ogePrep', label: 'Подготовка к ОГЭ по английскому' }],
    officialSource: 'https://fipi.ru/oge/demoversii-specifikacii-kodifikatory',
  },
  mindmaps: {
    title: 'Как работать с ментальными картами',
    intro: 'Ментальная карта помогает увидеть лексику по теме как систему: основные понятия, уточнения, примеры и связи между словами. Её полезно сочетать с устными и письменными заданиями, а не просто перечитывать.',
    requirements: ['Выберите одну тему и сначала вспомните слова без подсказки', 'Откройте ветви карты и отметьте новую или неуверенную лексику', 'Составьте собственные примеры и вопросы с новыми выражениями', 'Вернитесь к теме через несколько дней и проверьте активное воспроизведение'],
    steps: ['Назовите известные слова по теме.', 'Изучите одну ветвь карты, не пытаясь запомнить всё сразу.', 'Составьте 5–7 собственных предложений.', 'Используйте лексику в коротком монологе или письме.', 'Повторите тему без карты и проверьте пробелы.'],
    phrases: ['One important aspect is…', 'For instance,…', 'I would also mention…', 'The main reason is…', 'From my point of view,…'],
    mistakes: ['Пассивное перечитывание без собственных примеров', 'Попытка выучить слишком много слов за один раз', 'Изучение отдельных слов без устойчивых сочетаний', 'Отсутствие повторения и применения в речи'],
    example: { title: 'Пример мини-практики', text: 'Выберите ветвь «Travelling», составьте три вопроса по теме, ответьте на них вслух и затем напишите пять предложений с новой лексикой. На следующем занятии повторите слова без подсказки.' },
    faq: [{ question: 'Нужно ли выписывать все слова?', answer: 'Нет. Сначала выберите лексику, которая нужна для ближайшей темы и которую пока трудно использовать самостоятельно.' }, { question: 'Как понять, что слово выучено?', answer: 'Вы можете вспомнить его без карты и правильно использовать в собственной фразе, вопросе или коротком тексте.' }],
    related: [{ page: 'ogeMonologue', label: 'Практика монологов ОГЭ' }, { page: 'speakPractice', label: 'Ответы на вопросы ОГЭ' }, { page: 'materials', label: 'Все материалы' }],
  },
};

export function ToolStudyGuide({ guide }: { guide: ToolGuideKey }) {
  const content = GUIDES[guide];
  const { navigate } = useRouter();

  return (
    <section className="pb-16 sm:pb-24" aria-labelledby={`${guide}-guide-title`}>
      <div className="container-px">
        <div className="mx-auto max-w-4xl">
          <h2 id={`${guide}-guide-title`} className="section-title">{content.title}</h2>
          <p className="mt-4 section-body">{content.intro}</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-wash-mint p-6 sm:p-8">
            <div className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-mint" /><h3 className="font-display text-xl font-bold">Что важно выполнить</h3></div>
            <ul className="mt-5 space-y-3">{content.requirements.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy/70"><span aria-hidden="true">•</span>{item}</li>)}</ul>
          </article>
          <article className="rounded-3xl bg-wash-lavender p-6 sm:p-8">
            <div className="flex items-center gap-3"><ListChecks className="h-6 w-6 text-lavender" /><h3 className="font-display text-xl font-bold">Пошаговый план</h3></div>
            <ol className="mt-5 space-y-3">{content.steps.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy/70"><strong className="text-navy/40">{index + 1}.</strong>{item}</li>)}</ol>
          </article>
          <article className="rounded-3xl bg-wash-butter p-6 sm:p-8">
            <div className="flex items-center gap-3"><MessageSquareText className="h-6 w-6" /><h3 className="font-display text-xl font-bold">Полезные фразы</h3></div>
            <ul className="mt-5 flex flex-wrap gap-2">{content.phrases.map((item) => <li key={item} className="rounded-xl bg-white/80 px-3 py-2 text-sm font-semibold text-navy/75">{item}</li>)}</ul>
          </article>
          <article className="rounded-3xl bg-wash-blush p-6 sm:p-8">
            <div className="flex items-center gap-3"><AlertTriangle className="h-6 w-6 text-blush" /><h3 className="font-display text-xl font-bold">Частые ошибки</h3></div>
            <ul className="mt-5 space-y-3">{content.mistakes.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy/70"><span aria-hidden="true">•</span>{item}</li>)}</ul>
          </article>
        </div>

        <article className="mx-auto mt-6 max-w-5xl rounded-3xl border border-navy/10 bg-white p-6 shadow-card sm:p-8"><h3 className="font-display text-xl font-bold">{content.example.title}</h3><p className="mt-3 leading-relaxed text-navy/70">{content.example.text}</p></article>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
          <div><h3 className="font-display text-2xl font-bold">Частые вопросы</h3><div className="mt-5 space-y-4">{content.faq.map((item) => <article key={item.question} className="rounded-2xl border border-navy/10 p-5"><h4 className="font-bold">{item.question}</h4><p className="mt-2 text-sm leading-relaxed text-navy/65">{item.answer}</p></article>)}</div></div>
          <div><h3 className="font-display text-2xl font-bold">Продолжить подготовку</h3><div className="mt-5 space-y-3">{content.related.map((item) => <a key={item.page} href={routeHref(item.page)} onClick={(event) => navigateFromLink(event, navigate, item.page)} className="group flex items-center justify-between rounded-2xl bg-wash-lavender px-5 py-4 font-bold transition-colors hover:bg-lavender/30">{item.label}<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></a>)}</div>{content.officialSource && <a href={content.officialSource} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-semibold text-navy/60 underline decoration-navy/25 underline-offset-4 hover:text-navy">Актуальные демоверсии и спецификации ФИПИ</a>}</div>
        </div>
      </div>
    </section>
  );
}
