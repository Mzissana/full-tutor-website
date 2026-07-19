from pathlib import Path
import shutil

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Flowable,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "oge-electronic-letter-worksheet.pdf"
PUBLIC_OUT = ROOT / "public" / "downloads" / "oge-electronic-letter-worksheet.pdf"
FONT = ROOT / "assets" / "fonts" / "Inter-Regular.ttf"
FONT_BOLD = ROOT / "assets" / "fonts" / "Inter-Bold.ttf"

NAVY = colors.HexColor("#1A2744")
SKY = colors.HexColor("#93C8EE")
LAVENDER = colors.HexColor("#C4B5F4")
BLUSH = colors.HexColor("#F5AABC")
MINT = colors.HexColor("#A8D5B2")
PAPER = colors.HexColor("#EEF1F6")
INK_MUTED = colors.HexColor("#667795")
LINE = colors.HexColor("#DCE3EC")
WASH_SKY = colors.HexColor("#EEF7FC")
WASH_LAVENDER = colors.HexColor("#F4F1FD")
WASH_MINT = colors.HexColor("#EFF8F1")


def register_fonts():
    pdfmetrics.registerFont(TTFont("DejaVu", str(FONT)))
    pdfmetrics.registerFont(TTFont("DejaVu-Bold", str(FONT_BOLD)))


def p(text, style):
    return Paragraph(text, style)


class Hero(Flowable):
    def __init__(self, eyebrow, title, subtitle, accent, dark=False, height_mm=42):
        super().__init__()
        self.eyebrow, self.title, self.subtitle = eyebrow, title, subtitle
        self.accent, self.dark = accent, dark
        self.width, self.height = 159 * mm, height_mm * mm

    def wrap(self, avail_width, avail_height):
        return self.width, self.height

    def draw(self):
        c = self.canv
        fill = NAVY if self.dark else colors.HexColor("#294B70")
        c.setFillColor(fill)
        c.roundRect(0, 0, self.width, self.height, 8 * mm, fill=1, stroke=0)
        c.setFillColor(self.accent)
        circle_y = self.height - (8 * mm if not self.subtitle else 9 * mm)
        circle_radius = 14 * mm if not self.subtitle else 16 * mm
        c.circle(self.width - 11 * mm, circle_y, circle_radius, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("DejaVu-Bold", 9)
        eyebrow_y = self.height - (8 * mm if not self.subtitle else 11 * mm)
        title_y = self.height - (17 * mm if not self.subtitle else 24 * mm)
        c.drawString(9 * mm, eyebrow_y, self.eyebrow)
        c.setFont("DejaVu-Bold", 21)
        c.drawString(9 * mm, title_y, self.title)
        c.setFillColor(colors.HexColor("#DFE9F8"))
        c.setFont("DejaVu", 10.5)
        c.drawString(9 * mm, self.height - 33 * mm, self.subtitle)


def plain(text):
    return text.replace("<b>", "").replace("</b>", "")


def text_lines(text, font, size, width):
    words, lines, current = text.split(), [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and pdfmetrics.stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


class StatTile(Flowable):
    def __init__(self, value, label, fill, accent):
        super().__init__()
        self.value, self.label, self.fill, self.accent = value, label, fill, accent
        self.width, self.height = 50 * mm, 22 * mm

    def wrap(self, avail_width, avail_height):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(self.fill)
        c.roundRect(0, 0, self.width, self.height, 4 * mm, fill=1, stroke=0)
        c.setFillColor(self.accent)
        c.setFont("DejaVu-Bold", 15)
        c.drawString(5 * mm, 12 * mm, self.value)
        c.setFillColor(INK_MUTED)
        c.setFont("DejaVu", 10)
        c.drawString(5 * mm, 6 * mm, self.label)


class ModernStep(Flowable):
    def __init__(self, number, heading, body, cliche, accent):
        super().__init__()
        self.number, self.heading = number, heading
        self.body, self.cliche, self.accent = plain(body), cliche, accent
        self.width, self.height = 159 * mm, 32 * mm

    def wrap(self, avail_width, avail_height):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(colors.white)
        c.roundRect(0, 0, self.width, self.height, 5 * mm, fill=1, stroke=0)
        c.setFillColor(self.accent)
        c.circle(10 * mm, self.height / 2, 6 * mm, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("DejaVu-Bold", 10)
        c.drawCentredString(10 * mm, self.height / 2 - 3.5, str(self.number))
        c.setFont("DejaVu-Bold", 11.2)
        c.drawString(20 * mm, self.height - 8.2 * mm, self.heading)
        c.setFillColor(INK_MUTED)
        c.setFont("DejaVu", 9.4)
        for i, line in enumerate(text_lines(self.body, "DejaVu", 9.4, 126 * mm)[:2]):
            c.drawString(20 * mm, self.height - 15.5 * mm - i * 4.3 * mm, line)
        c.setFillColor(WASH_LAVENDER)
        cliche_lines = self.cliche.split("\n")
        horizontal_padding = 4.2 * mm
        text_width = max(pdfmetrics.stringWidth(line, "DejaVu-Bold", 9.1) for line in cliche_lines)
        cliche_width = max(50 * mm, min(96 * mm, text_width + horizontal_padding * 2))
        cliche_height = 11.4 * mm if len(cliche_lines) > 1 else 7.6 * mm
        cliche_y = 3.8 * mm
        c.roundRect(20 * mm, cliche_y, cliche_width, cliche_height, 3 * mm, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("DejaVu-Bold", 9.1)
        if len(cliche_lines) > 1:
            for i, line in enumerate(cliche_lines):
                c.drawString(20 * mm + horizontal_padding, (9.6 - i * 3.8) * mm, line)
        else:
            c.drawString(20 * mm + horizontal_padding, 6.5 * mm, self.cliche)


class EmailCard(Flowable):
    def __init__(self):
        super().__init__()
        self.width, self.height = 159 * mm, 72 * mm

    def wrap(self, avail_width, avail_height):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(colors.white)
        c.roundRect(0, 0, self.width, self.height, 7 * mm, fill=1, stroke=0)
        c.setFillColor(BLUSH)
        c.roundRect(8 * mm, self.height - 13 * mm, 34 * mm, 7 * mm, 3.5 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("DejaVu-Bold", 7.5)
        c.drawCentredString(25 * mm, self.height - 10.5 * mm, "FROM  EMMA")
        c.setFillColor(NAVY)
        c.setFont("DejaVu-Bold", 11.5)
        c.drawString(8 * mm, self.height - 23 * mm, "A school event")
        c.setFont("DejaVu", 10.2)
        c.drawString(8 * mm, self.height - 32 * mm, "Dear friend,")
        message = ("Last Saturday I helped to organise a small book fair at school, and it was more fun than I expected. "
                   "Our school is planning a bigger event next month, and I would like to take part. "
                   "What school events do you enjoy most? What role would you choose at an event? "
                   "Why are school events useful for teenagers?")
        c.setFont("DejaVu", 10)
        for i, line in enumerate(text_lines(message, "DejaVu", 10, 143 * mm)):
            c.drawString(8 * mm, self.height - 41 * mm - i * 4.7 * mm, line)
        c.setFillColor(NAVY)
        c.setFont("DejaVu", 9.5)
        c.drawString(8 * mm, 11 * mm, "Write back soon,")
        c.drawString(8 * mm, 6.4 * mm, "Emma")


class ModelLetter(Flowable):
    def __init__(self):
        super().__init__()
        self.width, self.height = 159 * mm, 124 * mm

    def wrap(self, avail_width, avail_height):
        return self.width, self.height

    def draw(self):
        c = self.canv
        blocks = [
            ("1 ОБРАЩЕНИЕ", "Dear Emma,", SKY, 107, 17),
            ("2 БЛАГОДАРНОСТЬ", "Thanks for your email. It was great to hear from you.", MINT, 85, 17),
            ("3 ОТВЕТЫ", "In your email you ask me about school events. I enjoy school concerts most because I like listening to live music with my friends. Speaking about the event itself, I would choose to be a presenter, as I enjoy talking to people and helping them feel welcome. Finally, I think school events are useful because they help teenagers make friends and learn to work as a team.", LAVENDER, 47, 33),
            ("4 ЗАВЕРШЕНИЕ", "Write back soon.", BLUSH, 25, 17),
            ("5 ПОДПИСЬ", "Best wishes,\n[Your name]", SKY, 4, 17),
        ]
        for title, body, accent, y, height in blocks:
            c.setFillColor(colors.white)
            c.roundRect(0, y * mm, self.width, height * mm, 4 * mm, fill=1, stroke=0)
            c.setFillColor(colors.HexColor("#8B83D4"))
            c.setFont("DejaVu-Bold", 9)
            c.drawString(10 * mm, (y + height - 7) * mm, title)
            c.setFillColor(INK_MUTED)
            c.setFont("DejaVu", 10)
            wrapped_lines = []
            for paragraph in body.split("\n"):
                wrapped_lines.extend(text_lines(paragraph, "DejaVu", 10, 139 * mm))
            for index, line in enumerate(wrapped_lines):
                c.drawString(10 * mm, (y + height - 11 - index * 4.3) * mm, line)


class ModernChecklist(Flowable):
    def __init__(self):
        super().__init__()
        self.width, self.height = 159 * mm, 21 * mm

    def wrap(self, avail_width, avail_height):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(NAVY)
        c.roundRect(0, 0, self.width, self.height, 5 * mm, fill=1, stroke=0)
        c.setFillColor(MINT)
        c.setFont("DejaVu-Bold", 9.5)
        c.drawString(6 * mm, 14 * mm, "ПРОВЕРЬ СЕБЯ")
        c.setFillColor(colors.white)
        c.setFont("DejaVu", 9.2)
        c.drawString(6 * mm, 7 * mm, "3 ответа  •  абзацы  •  обращение + завершение  •  100-120 слов")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
    canvas.setFont("DejaVu", 8.5)
    canvas.setFillColor(INK_MUTED)
    canvas.drawString(18 * mm, 9 * mm, "MzissanaEnglish  •  ОГЭ English  •  Electronic letter")
    canvas.drawRightString(A4[0] - 18 * mm, 9 * mm, f"{doc.page}")
    canvas.restoreState()


def badge(text, fill, styles):
    cell = Table([[p(text, styles["ws_badge"])]], colWidths=[45 * mm])
    cell.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), fill),
        ("BOX", (0, 0), (-1, -1), 0, fill),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return cell


def step(number, heading, body, cliche, fill, styles):
    return ModernStep(number, heading, body, cliche, fill)


def fill_lines(count=2, width=159 * mm):
    rows = [[""] for _ in range(count)]
    table = Table(rows, colWidths=[width], rowHeights=[7 * mm] * count)
    table.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.7, colors.HexColor("#BFCBDD")),
    ]))
    return table


def build_pdf():
    register_fonts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("ws_title", fontName="DejaVu-Bold", fontSize=24, leading=29, textColor=NAVY, spaceAfter=3 * mm))
    styles.add(ParagraphStyle("ws_subtitle", fontName="DejaVu", fontSize=10.2, leading=14, textColor=INK_MUTED))
    styles.add(ParagraphStyle("ws_badge", fontName="DejaVu-Bold", fontSize=7.8, leading=9, textColor=NAVY, alignment=TA_CENTER))
    styles.add(ParagraphStyle("ws_section", fontName="DejaVu-Bold", fontSize=13, leading=15, textColor=NAVY, spaceAfter=1 * mm))
    styles.add(ParagraphStyle("ws_step_no", fontName="DejaVu-Bold", fontSize=11, leading=12, textColor=NAVY, alignment=TA_CENTER))
    styles.add(ParagraphStyle("ws_step_head", fontName="DejaVu-Bold", fontSize=10.2, leading=12.5, textColor=NAVY))
    styles.add(ParagraphStyle("ws_step_body", fontName="DejaVu", fontSize=8.7, leading=12, textColor=INK_MUTED))
    styles.add(ParagraphStyle("ws_body", fontName="DejaVu", fontSize=9.3, leading=13, textColor=INK_MUTED))
    styles.add(ParagraphStyle("ws_body_dark", fontName="DejaVu", fontSize=9.3, leading=13, textColor=NAVY))
    styles.add(ParagraphStyle("ws_small", fontName="DejaVu", fontSize=7.8, leading=10.5, textColor=INK_MUTED))
    styles.add(ParagraphStyle("ws_quote", fontName="DejaVu", fontSize=9.5, leading=14, textColor=NAVY))

    doc = BaseDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=17 * mm,
        bottomMargin=20 * mm,
        pageTemplates=[PageTemplate(id="main", frames=[Frame(18 * mm, 20 * mm, A4[0] - 36 * mm, A4[1] - 37 * mm, id="body")], onPage=footer)],
    )

    story = []
    story.append(Hero("ОГЭ ENGLISH", "Электронное письмо ОГЭ", "Структура, клише и готовый пример", LAVENDER, dark=True, height_mm=39))
    story.append(Spacer(1, 4 * mm))

    stat = Table([[StatTile("100-120", "слов", colors.white, NAVY), StatTile("3", "полных ответа", colors.white, NAVY), StatTile("5", "частей письма", colors.white, NAVY)]], colWidths=[53 * mm] * 3)
    stat.hAlign = "LEFT"
    stat.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    story.append(stat)
    story.append(Spacer(1, 5 * mm))
    story.append(p("Маршрут письма", styles["ws_section"]))
    steps = [
        (1, "Обращение", "Начни письмо с личного обращения на отдельной строке", "Dear Alex,"),
        (2, "Спасибо и реакция", "Поблагодари за письмо и коротко покажи, что тебе приятно получить новости", "Thanks for your email."),
        (3, "Три ответа", "Ответь на все три вопроса письма-стимула в одном связном абзаце", "In your email you ask me about ..."),
        (4, "Дружелюбное завершение", "Перед подписью добавь короткую фразу, которая завершает общение", "Write back soon."),
        (5, "Подпись и проверка", "Подпиши письмо только своим именем и проверь абзацы и объём", "Best wishes,\n[Your name]"),
    ]
    for i, item in enumerate(steps):
        story.append(step(*item, [colors.HexColor("#E8E5F8"), colors.HexColor("#FEF3C0"), colors.HexColor("#DBEAFE"), colors.HexColor("#FDE8D8"), colors.HexColor("#DCFCE7")][i], styles))
        story.append(Spacer(1, 2.2 * mm))

    story.append(PageBreak())
    story.append(Hero("ПРИМЕР ОТВЕТА", "Готовое письмо", "", MINT, dark=False, height_mm=18))
    story.append(Spacer(1, 4 * mm))

    story.append(EmailCard())
    story.append(Spacer(1, 3 * mm))
    story.append(p("Пример готового письма", styles["ws_section"]))
    story.append(ModelLetter())
    story.append(Spacer(1, 1 * mm))
    story.append(ModernChecklist())
    doc.build(story)
    PUBLIC_OUT.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(OUT, PUBLIC_OUT)
    print(OUT)


if __name__ == "__main__":
    build_pdf()
