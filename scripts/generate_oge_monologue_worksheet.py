from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, KeepTogether, PageBreak, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "oge-monologue-worksheet.pdf"
PUBLIC_OUT = ROOT / "public" / "downloads" / "oge-monologue-worksheet.pdf"
FONT = ROOT / "assets" / "fonts" / "Inter-Regular.ttf"
FONT_BOLD = ROOT / "assets" / "fonts" / "Inter-Bold.ttf"

NAVY = colors.HexColor("#1A2E4A")
MUTED = colors.HexColor("#64748B")
PAPER = colors.HexColor("#EEF1F6")
LINE = colors.HexColor("#DCE3EC")
LAVENDER = colors.HexColor("#C4B5F4")
SKY = colors.HexColor("#93C8EE")
MINT = colors.HexColor("#A8D5B2")
BLUSH = colors.HexColor("#F5AABC")
BUTTER = colors.HexColor("#F9D94E")
WHITE = colors.white


def register_fonts():
    pdfmetrics.registerFont(TTFont("Inter", str(FONT)))
    pdfmetrics.registerFont(TTFont("Inter-Bold", str(FONT_BOLD)))


def paragraph(text, style):
    return Paragraph(text, style)


def line_box(rows=3):
    data = [[""] for _ in range(rows)]
    table = Table(data, colWidths=[159 * mm], rowHeights=[8 * mm] * rows)
    table.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.6, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), WHITE),
    ]))
    return table


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFillColor(NAVY)
    canvas.setFont("Inter-Bold", 8)
    canvas.drawString(17 * mm, 10 * mm, "MZISSANAENGLISH · МОНОЛОГ ОГЭ")
    canvas.setFillColor(MUTED)
    canvas.drawRightString(193 * mm, 10 * mm, str(doc.page))
    canvas.restoreState()


def main():
    register_fonts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUT.parent.mkdir(parents=True, exist_ok=True)

    sample = getSampleStyleSheet()
    body = ParagraphStyle("Body", parent=sample["BodyText"], fontName="Inter", fontSize=9.4, leading=14, textColor=NAVY, spaceAfter=4 * mm)
    small = ParagraphStyle("Small", parent=body, fontSize=8.2, leading=11.5, textColor=MUTED, spaceAfter=2 * mm)
    h1 = ParagraphStyle("H1", parent=body, fontName="Inter-Bold", fontSize=25, leading=29, textColor=WHITE, spaceAfter=4 * mm)
    h2 = ParagraphStyle("H2", parent=body, fontName="Inter-Bold", fontSize=17, leading=21, textColor=NAVY, spaceBefore=2 * mm, spaceAfter=4 * mm)
    h3 = ParagraphStyle("H3", parent=body, fontName="Inter-Bold", fontSize=11, leading=14, textColor=NAVY, spaceAfter=2 * mm)
    label = ParagraphStyle("Label", parent=body, fontName="Inter-Bold", fontSize=7.5, leading=10, textColor=MUTED, spaceAfter=2 * mm)
    white_body = ParagraphStyle("WhiteBody", parent=body, textColor=colors.HexColor("#E7EDF7"), fontSize=10, leading=15)
    number = ParagraphStyle("Number", parent=body, fontName="Inter-Bold", fontSize=19, leading=20, alignment=TA_CENTER, textColor=WHITE)

    doc = BaseDocTemplate(str(OUT), pagesize=A4, leftMargin=17 * mm, rightMargin=17 * mm, topMargin=16 * mm, bottomMargin=18 * mm,
                          title="Рабочий лист по монологу ОГЭ", author="MzissanaEnglish")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
    doc.addPageTemplates([PageTemplate(id="worksheet", frames=frame, onPage=on_page)])

    story = []
    hero = Table([
        [paragraph("ЗАДАНИЕ 3 · УСТНАЯ ЧАСТЬ · 2026", ParagraphStyle("Eyebrow", parent=label, textColor=LAVENDER)), ""],
        [paragraph("Монолог ОГЭ:<br/>критерии и рабочий лист", h1), paragraph("7", number)],
        [paragraph("Разбери структуру, потренируйся на пяти разных школьных темах и расскажи свой ответ с таймером.", white_body), paragraph("макс.<br/>баллов", ParagraphStyle("Score", parent=small, alignment=TA_CENTER, textColor=WHITE))],
    ], colWidths=[133 * mm, 26 * mm])
    hero.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY), ("SPAN", (0, 0), (1, 0)),
        ("BOX", (0, 0), (-1, -1), 0, NAVY), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BACKGROUND", (1, 1), (1, 2), colors.HexColor("#2C4363")),
        ("TOPPADDING", (0, 0), (-1, 0), 8 * mm), ("BOTTOMPADDING", (0, 0), (-1, 0), 1 * mm),
        ("LEFTPADDING", (0, 0), (0, -1), 9 * mm), ("RIGHTPADDING", (-1, 0), (-1, -1), 7 * mm),
        ("BOTTOMPADDING", (0, -1), (-1, -1), 8 * mm),
    ]))
    story += [hero, Spacer(1, 7 * mm)]

    stats = Table([
        [paragraph("<b>4</b><br/>пункта плана", body), paragraph("<b>10–12</b><br/>предложений", body), paragraph("<b>90 сек</b><br/>подготовка", body), paragraph("<b>до 2 мин</b><br/>ответ", body)]
    ], colWidths=[39.75 * mm] * 4)
    stats.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#F4F1FD")),
        ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#EEF7FC")),
        ("BACKGROUND", (2, 0), (2, 0), colors.HexColor("#EFF8F1")),
        ("BACKGROUND", (3, 0), (3, 0), colors.HexColor("#FFFBEA")),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0.4, WHITE), ("INNERGRID", (0, 0), (-1, -1), 2, PAPER),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story += [stats, Spacer(1, 6 * mm), paragraph("Как оценивают монолог", h2)]

    criteria_data = [
        [paragraph("Критерий", h3), paragraph("Макс.", h3), paragraph("Максимальный балл", h3), paragraph("Снижение", h3)],
        [paragraph("К1<br/><b>Задача</b>", body), paragraph("3", h3), paragraph("Все 4 пункта; 10–12 предложений.", small), paragraph("8–9 = 2; 6–7 = 1; ≤5 = 0.", small)],
        [paragraph("К2<br/><b>Организация</b>", body), paragraph("2", h3), paragraph("Тематические вступление и заключение; логика и связки.", small), paragraph("Нет одного элемента или 1–3 логические ошибки = 1; оба отсутствуют или 4+ = 0.", small)],
        [paragraph("К3<br/><b>Язык</b>", body), paragraph("2", h3), paragraph("≤4 негрубых лексико-грамматических и ≤3 негрубых фонетических ошибок.", small), paragraph("До 5 и/или 4 = 1; 6+ и/или 5+ либо >3 грубых = 0.", small)],
    ]
    criteria = Table(criteria_data, colWidths=[29 * mm, 15 * mm, 56 * mm, 59 * mm], repeatRows=1)
    criteria.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("BACKGROUND", (0, 1), (-1, -1), WHITE), ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm), ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
    ]))
    warning = Table([[paragraph("<b>ВАЖНО.</b> Если К1 = 0, всё задание = 0. Назови тему во вступлении и заключении, раскрой каждый пункт и используй смысловые переходы.", body)]], colWidths=[159 * mm])
    warning.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FEF0F3")), ("LINEBEFORE", (0, 0), (0, 0), 4, BLUSH), ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm), ("TOPPADDING", (0, 0), (-1, -1), 4 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm)]))
    story += [criteria, Spacer(1, 5 * mm), warning, Spacer(1, 2 * mm), paragraph("Источник критериев: методические материалы ФИПИ 2026 (doc.fipi.ru).", small), PageBreak()]

    story += [paragraph("Разбор модели: Your school day", h2), paragraph("<b>Remember to say:</b> what your typical school day is like; what your favourite subject is, and why; what you like most about your school; what your attitude to your school life is.", body)]
    model = [
        ("ВСТУПЛЕНИЕ + КОНТЕКСТ", "I'm going to give a talk about my school life. School is an important part of every teenager's life.", colors.HexColor("#F4F1FD")),
        ("ПЕРЕХОД К ПУНКТУ 1", "As for my daily routine, my school day usually starts at eight thirty. I normally have six or seven lessons a day.", colors.HexColor("#EEF7FC")),
        ("ПЕРЕХОД К ПУНКТУ 2", "When it comes to subjects, my favourite one is English. The main reason is that I enjoy learning new words and communicating with people from other countries.", colors.HexColor("#EFF8F1")),
        ("ПЕРЕХОД К ПУНКТУ 3", "Speaking about the school itself, what I like most is its friendly atmosphere. This is because the teachers are helpful and I have many good friends there.", colors.HexColor("#FEF3EC")),
        ("ПЕРЕХОД К ПУНКТУ 4", "Overall, my attitude to school life is positive. Although homework can be difficult, school gives me useful knowledge and new experiences.", colors.HexColor("#FEF0F3")),
        ("ВЫВОД + ФИНАЛ", "To sum up, school plays an important role in my life. That's all that I wanted to say about my school life.", colors.HexColor("#F4F1FD")),
    ]
    for title, text, fill in model:
        box = Table([[paragraph(title, label), paragraph(text, body)]], colWidths=[29 * mm, 130 * mm])
        box.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), fill), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 3 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 1 * mm)]))
        story += [box, Spacer(1, 2 * mm)]
    story += [Spacer(1, 3 * mm), paragraph("Полезные фразы", h2), paragraph("<b>Связка должна добавлять смысл:</b> показывай переход от общего к своему опыту, от факта к мнению, от проблемы к решению и от аргументов к выводу.", small)]
    phrases = [
        [paragraph("ТЕМА", label), paragraph("I'm going to give a talk about… · I'd like to tell you about…", small)],
        [paragraph("ОБЩИЙ КОНТЕКСТ", label), paragraph("Every school has… · This topic is important because… · …is an important part of…", small)],
        [paragraph("СВОЙ ОПЫТ", label), paragraph("My school is no exception, and… · As for me, … · In my case, …", small)],
        [paragraph("НОВЫЙ ПУНКТ", label), paragraph("When it comes to…, … · Speaking about…, … · At the same time, …", small)],
        [paragraph("ПРИЧИНА / ИТОГ", label), paragraph("The main reason is that… · This is because… · For this reason, … · As a result, …", small)],
        [paragraph("ВЫВОД", label), paragraph("To sum up, … · That's all that I wanted to say about…", small)],
    ]
    phrase_table = Table(phrases, colWidths=[32 * mm, 127 * mm])
    phrase_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), WHITE), ("GRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 3 * mm)]))
    story += [phrase_table, PageBreak()]

    story += [paragraph("Упражнение 1 · School clubs", h2), paragraph("Прочитай монолог. Найди общий контекст, четыре смысловых пункта, переходы между ними, вывод и финальную фразу. Посчитай предложения и оцени К1 и К2.", body)]
    analysis_text = ("I'm going to give a talk about school clubs. School clubs give students a chance to learn outside regular lessons. My school is no exception, and it offers a drama club, a sports club and a science club. As for me, I attend the drama club every Wednesday after lessons. I chose it because I enjoy acting and working with other students. During our meetings, we practise short scenes and prepare school performances. What is more, our teacher shows us how to speak clearly in front of an audience. Speaking about the benefits, school clubs help teenagers discover their talents. They are also a good way to make new friends. For this reason, I would recommend joining a club that matches your interests. To sum up, school clubs can make school life more interesting and useful. That's all that I wanted to say about school clubs.")
    text_box = Table([[paragraph(analysis_text, body)]], colWidths=[159 * mm])
    text_box.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), WHITE), ("BOX", (0, 0), (-1, -1), 0.6, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm), ("TOPPADDING", (0, 0), (-1, -1), 5 * mm)]))
    story += [text_box, Spacer(1, 5 * mm)]
    questions = ["1. Вступление, общий контекст и финал:", "2. Четыре смысловых пункта:", "3. Количество предложений:", "4. Какие отношения показывают связки?", "5. Оценка К1 / К2 и объяснение:"]
    for question in questions:
        story += [paragraph(f"<b>{question}</b>", body), line_box(2 if question.startswith(("2", "5")) else 1), Spacer(1, 3 * mm)]
    story += [PageBreak(), Spacer(1, 9 * mm), paragraph("Упражнение 2 · School rules", h2), paragraph("Пронумеруй фрагменты от 1 до 6. Найди смысловую цепочку: общее → твоя школа → важное правило → проблема и изменение → вывод → финальная фраза.", body)]
    chunks = [
        "That's all that I wanted to say about school rules.",
        "My school also has several rules we have to follow. For example, students must arrive on time and bring everything they need for lessons.",
        "I'm going to give a talk about school rules. Every school has its own rules, and they help students feel safe and organised.",
        "In my opinion, all school rules matter, but the most important one is to respect other students and teachers. Without respect, it is difficult to study together.",
        "At the same time, not every rule is equally useful. I would change the ban on using phones during every break because students may need to contact their parents.",
        "To sum up, sensible rules make school life safer without creating unnecessary problems.",
    ]
    order_rows = [[paragraph("□", h3), paragraph(chunk, body)] for chunk in chunks]
    order_table = Table(order_rows, colWidths=[12 * mm, 147 * mm])
    order_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), WHITE), ("GRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 3 * mm)]))
    story += [order_table, PageBreak(), paragraph("Упражнение 3 · School exams", h2), paragraph("Ответь на каждый пункт 1–2 полными предложениями. Начинай каждый ответ с фразы, которая связывает его с предыдущей мыслью.", body)]
    exam_prompts = ["what school exams you usually take", "which exam is the most difficult for you, and why", "how you prepare for exams", "what advice you would give to a student before an exam"]
    exam_cues = [
        "School exams are an important part of education. My school is no exception, and…",
        "When it comes to difficulty, … The main reason is that…",
        "Because this exam is challenging, I usually prepare by…",
        "For this reason, I would advise other students to…",
    ]
    for index, (prompt, cue) in enumerate(zip(exam_prompts, exam_cues), 1):
        story += [paragraph(f"<b>{index}. {prompt}</b><br/><font color='#667795'>Опора: {cue}</font>", body), line_box(2), Spacer(1, 2 * mm)]
    story += [PageBreak(), Spacer(1, 9 * mm), paragraph("Упражнение 4 · School events", h2), paragraph("Напиши 10–12 предложений. После вступления дай общий контекст, логично соедини все пункты, сделай вывод и закончи фразой о теме.", body)]
    event_prompts = ["what events your school organises", "which school event you remember best", "how students can help organise school events", "whether school events are important, and why"]
    story += [Table([[paragraph("<b>Remember to say:</b><br/>• " + "<br/>• ".join(event_prompts) + "<br/><br/><b>Логика:</b> значение мероприятий → события твоей школы → личное воспоминание → участие учеников → почему мероприятия важны.", body)]], colWidths=[159 * mm], style=[("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F4F1FD")), ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm), ("TOPPADDING", (0, 0), (-1, -1), 5 * mm)]), Spacer(1, 4 * mm), line_box(14), Spacer(1, 5 * mm)]
    checklist = ["После темы есть общий контекст", "Все 4 пункта раскрыты", "10–12 предложений", "Каждый пункт связан со следующим", "Есть вывод и финальная фраза", "Проверены грамматика и произношение"]
    story += [paragraph("Самопроверка", h3), Table([[paragraph(f"□ {item}", small) for item in checklist[:3]], [paragraph(f"□ {item}", small) for item in checklist[3:]]], colWidths=[53 * mm] * 3, style=[("BACKGROUND", (0, 0), (-1, -1), WHITE), ("GRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 3 * mm)]), PageBreak(), Spacer(1, 9 * mm)]

    story += [paragraph("Упражнение 5 · Improving your school", h2), paragraph("За 90 секунд запиши ключевые слова и связи между идеями, затем говори до двух минут.", body)]
    improvement_prompts = ["what you like about your school now", "what facilities you would improve", "what new activity you would add", "how these changes could help students"]
    story += [Table([[paragraph("<b>Remember to say:</b><br/>• " + "<br/>• ".join(improvement_prompts), body)]], colWidths=[159 * mm], style=[("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#EEF7FC")), ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm), ("TOPPADDING", (0, 0), (-1, -1), 5 * mm)]), Spacer(1, 6 * mm)]
    bridge_plan = [
        "Контекст: Schools should develop with their students.",
        "К своей школе: My school already has… As for me, …",
        "К проблеме: At the same time, there is still something I would improve.",
        "К новой идее: Besides improving facilities, I would also add…",
        "К результату и выводу: These changes could… To sum up… That's all…",
    ]
    plan_rows = [[paragraph(f"{index}. {cue}", small), ""] for index, cue in enumerate(bridge_plan, 1)]
    plan_table = Table(plan_rows, colWidths=[83 * mm, 76 * mm], rowHeights=[16 * mm] * 5)
    plan_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), WHITE), ("GRID", (0, 0), (-1, -1), 0.6, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 4 * mm)]))
    timer = Table([[paragraph("90", ParagraphStyle("Timer", parent=h1, alignment=TA_CENTER)), paragraph("→", ParagraphStyle("Arrow", parent=h1, alignment=TA_CENTER)), paragraph("120", ParagraphStyle("Timer2", parent=h1, alignment=TA_CENTER))], [paragraph("секунд<br/>подготовка", ParagraphStyle("TimerLabel", parent=small, alignment=TA_CENTER, textColor=WHITE)), "", paragraph("секунд<br/>ответ", ParagraphStyle("TimerLabel2", parent=small, alignment=TA_CENTER, textColor=WHITE))]], colWidths=[65 * mm, 29 * mm, 65 * mm])
    timer.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), NAVY), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 4 * mm), ("BOTTOMPADDING", (0, -1), (-1, -1), 4 * mm)]))
    story += [plan_table, Spacer(1, 8 * mm), timer, Spacer(1, 7 * mm), paragraph("После ответа отметь:", h3), line_box(4), PageBreak()]

    story += [paragraph("Ключ для самопроверки", h2), paragraph("Упражнение 1", h3), paragraph("Тема — предложение 1, общий контекст — 2, вывод и финал — 11–12. Всего 12 предложений. Связки показывают отношения: <i>My school is no exception</i> (от общего к своей школе), <i>As for me</i> (к личному опыту), <i>What is more</i> (добавление), <i>Speaking about the benefits</i> (смена аспекта), <i>For this reason</i> (результат), <i>To sum up</i> (вывод).", body), Spacer(1, 4 * mm), paragraph("Упражнение 2", h3), paragraph("Правильный порядок фрагментов: <b>3 → 2 → 4 → 5 → 6 → 1</b>. В полном ответе 10 предложений; каждый переход объясняет, почему следующая мысль появляется именно здесь.", body), Spacer(1, 4 * mm), paragraph("Упражнения 3–5", h3), paragraph("Единственного правильного текста нет. Проверь: после темы дан общий контекст; каждый пункт связан с предыдущим по смыслу; на <i>why</i> дана причина; есть вывод и финальная фраза <i>That's all that I wanted to say about…</i>; итоговый монолог содержит 10–12 предложений.", body), Spacer(1, 8 * mm)]
    final = Table([[paragraph("Следующий шаг", ParagraphStyle("FinalLabel", parent=label, textColor=LAVENDER)), paragraph("Повтори эту схему с новой темой через несколько дней. Сохраняй структуру, но формулируй свой ответ.", white_body)]], colWidths=[38 * mm, 121 * mm])
    final.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), NAVY), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 7 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm), ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm)]))
    story += [final, Spacer(1, 6 * mm), paragraph("Интерактивный тренажёр: mzissana.ru/extra/oge-monologue", small), paragraph("Критерии: doc.fipi.ru/oge/dlya-predmetnyh-komissiy-subektov-rf/2026/mr_oge_angl_ustn_2026.pdf", small)]

    doc.build(story)
    shutil.copy2(OUT, PUBLIC_OUT)
    print(f"Created {OUT}")
    print(f"Copied to {PUBLIC_OUT}")


if __name__ == "__main__":
    main()
