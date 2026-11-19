#!/usr/bin/env python3
"""
Firewall Breach Ops - Box label generator
Pure stdlib PDF writer. No dependencies.

Produces docs/BOX_LABELS.pdf:
  - A4 pages, 2 labels per page (front + back pairs matched)
  - Front label: the HINT word (large, centered)
  - Back label:  the FRAGMENT code, or VOID for decoys

Print double-sided (flip on short edge) OR print fronts and backs
separately and tape them onto opposite sides of the lid.
"""

import os
import zlib

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs")
OUT_FILE = os.path.join(OUT_DIR, "BOX_LABELS.pdf")

# ---- content model -------------------------------------------------
# (front text, back text, copies, note)
LABELS = [
    ("FAKE URGENCY",        "FRM",              2, "REAL - Mail phishing email"),
    ("ASKING FOR PASSWORD", "26",               2, "REAL - ChatX bank scam"),
    ("FAKE SENDER",         "XP",               2, "REAL - ChatX fake boss"),
    ("Fake Link",           "VOID - WRONG BOX", 1, "DECOY"),
    ("Password Reset",      "VOID - WRONG BOX", 1, "DECOY"),
    ("Too Good To Be True", "VOID - WRONG BOX", 1, "DECOY"),
    ("Wrong Grammar",       "VOID - WRONG BOX", 1, "DECOY"),
    ("Bank Alert",          "VOID - WRONG BOX", 1, "DECOY"),
]

# ---- page geometry (A4 portrait, points) ---------------------------
W, H = 595.28, 841.89
MARGIN = 42.52          # 15mm
LABEL_W = W - 2 * MARGIN
SLOTS_Y = [H - MARGIN - 250, MARGIN + 60]   # two labels per page

INK = (0.06, 0.09, 0.15)
CYAN = (0.05, 0.55, 0.65)
RED = (0.78, 0.12, 0.24)
GREY = (0.45, 0.50, 0.58)


def esc(s):
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def build_content(entries):
    """entries: list of (kind, text, note) - up to 2, one per slot on this page."""
    c = []

    for slot, (kind, text, note) in enumerate(entries):
        y0 = SLOTS_Y[slot]
        x0 = MARGIN
        w = LABEL_W
        h = 220

        # frame - heavy cut line
        c.append("0.55 0.62 0.70 RG 1.6 w")
        c.append(f"{x0:.2f} {y0:.2f} {w:.2f} {h:.2f} re S")

        # corner ticks for cutting
        c.append("0.90 0.20 0.25 RG 0.8 w")
        for cx, cy in [(x0, y0), (x0 + w, y0), (x0, y0 + h), (x0 + w, y0 + h)]:
            c.append(f"{cx-8:.2f} {cy:.2f} m {cx+8:.2f} {cy:.2f} l S")
            c.append(f"{cx:.2f} {cy-8:.2f} m {cx:.2f} {cy+8:.2f} l S")

        if kind == "front":
            c.append("BT")
            c.append("/F2 9 Tf 0.45 0.50 0.58 rg")
            c.append(f"{x0+18:.2f} {y0+h-24:.2f} Td")
            c.append("(FIREWALL BREACH - BOX LID) Tj")
            c.append("ET")

            fs = 54 if len(text) <= 12 else 40 if len(text) <= 20 else 30
            c.append("BT")
            c.append(f"/F1 {fs} Tf 0.06 0.09 0.15 rg")
            tw = len(text) * fs * 0.60
            tx = max(x0 + 14, x0 + (w - tw) / 2)
            c.append(f"{tx:.2f} {y0 + h/2 - fs*0.34:.2f} Td")
            c.append(f"({esc(text.upper())}) Tj")
            c.append("ET")

            c.append("0.55 0.62 0.70 RG 0.6 w")
            c.append(f"{x0+18:.2f} {y0+34:.2f} m {x0+w-18:.2f} {y0+34:.2f} l S")
            c.append("BT")
            c.append("/F2 9 Tf 0.45 0.50 0.58 rg")
            c.append(f"{x0+18:.2f} {y0+18:.2f} Td")
            c.append("(OPEN ONLY IF YOUR ANALYST CALLS THIS WORD) Tj")
            c.append("ET")

        else:
            real = text.strip().upper() != "VOID - WRONG BOX"
            col = CYAN if real else RED

            c.append("BT")
            c.append("/F2 9 Tf 0.45 0.50 0.58 rg")
            c.append(f"{x0+18:.2f} {y0+h-24:.2f} Td")
            c.append("(FIREWALL BREACH - INSIDE LID) Tj")
            c.append("ET")

            fs = 86 if real else 26
            c.append("BT")
            c.append(f"/F1 {fs} Tf {col[0]:.2f} {col[1]:.2f} {col[2]:.2f} rg")
            tw = len(text) * fs * 0.60
            tx = max(x0 + 14, x0 + (w - tw) / 2)
            c.append(f"{tx:.2f} {y0 + h/2 - fs*0.34:.2f} Td")
            c.append(f"({esc(text.upper())}) Tj")
            c.append("ET")

            c.append("BT")
            c.append("/F2 10 Tf " + ("0.45 0.50 0.58" if real else "0.78 0.12 0.24") + " rg")
            c.append(f"{x0+18:.2f} {y0+18:.2f} Td")
            footer = "PASSWORD FRAGMENT - TAKE ONE CARD, CLOSE THE LID" if real \
                else "DECOY - RUNNER FROZEN 15s, TEAM -2 POINTS"
            c.append(f"({esc(footer)}) Tj")
            c.append("ET")

    return "\n".join(c)


def make_pdf(pages):
    """pages: list of content-stream strings. Returns bytes."""
    objs = []

    def add(o):
        objs.append(o)
        return len(objs)

    # font objects
    f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")

    # catalog + pages placeholders
    cat_id = add("<< /Type /Catalog /Pages __PAGES__ >>")
    pages_id = add("<< /Type /Pages /Kids __KIDS__ /Count __COUNT__ >>")

    page_ids = []
    for stream in pages:
        data = stream.encode("cp1252", "replace")
        comp = zlib.compress(data)
        stream_id = add(
            b"<< /Length " + str(len(comp)).encode() + b" /Filter /FlateDecode >>\nstream\n"
            + comp + b"\nendstream"
        )
        page_id = add(
            f"<< /Type /Page /Parent {pages_id} 0 R /MediaBox [0 0 {W} {H}] "
            f"/Resources << /Font << /F1 {f1} 0 R /F2 {f2} 0 R >> >> "
            f"/Contents {stream_id} 0 R >>"
        )
        page_ids.append(page_id)

    kids = "[" + " ".join(f"{i} 0 R" for i in page_ids) + "]"

    # repair placeholders
    objs[pages_id - 1] = objs[pages_id - 1].replace("__KIDS__", kids).replace("__COUNT__", str(len(page_ids)))
    objs[cat_id - 1] = objs[cat_id - 1].replace("__PAGES__", f"{pages_id} 0 R")

    out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]

    for i, o in enumerate(objs, start=1):
        offsets.append(len(out))
        out += f"{i} 0 obj\n".encode()
        if isinstance(o, bytes):
            out += o
        else:
            out += o.encode("cp1252", "replace")
        out += b"\nendobj\n"

    xref_pos = len(out)
    out += f"xref\n0 {len(objs)+1}\n".encode()
    out += b"0000000000 65535 f \n"
    for off in offsets[1:]:
        out += f"{off:010d} 00000 n \n".encode()

    out += (
        f"trailer\n<< /Size {len(objs)+1} /Root {cat_id} 0 R >>\n"
        f"startxref\n{xref_pos}\n%%EOF\n"
    ).encode()

    return bytes(out)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    # 1. Build the flat list of labels (front+back adjacent on the sheet)
    entries = []
    counters = {"front": 0, "back": 0}
    for front, back, copies, note in LABELS:
        for _ in range(copies):
            entries.append(("front", front, note))
            entries.append(("back", back, note))

    # 2. Two labels per page -> chunk
    pages = []
    per_page = 2
    for i in range(0, len(entries), per_page):
        chunk = entries[i:i + per_page]
        pages.append(build_content(chunk))

    pdf = make_pdf(pages)
    with open(OUT_FILE, "wb") as f:
        f.write(pdf)

    print(f"wrote {OUT_FILE}  ({len(pdf)} bytes, {len(pages)} pages)")
    print(f"labels: {len(entries)}  ({sum(c for _,_,c,_ in LABELS)} boxes)")


if __name__ == "__main__":
    main()
