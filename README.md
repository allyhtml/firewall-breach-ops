# Firewall Breach Ops

A physical + digital escape-room checkpoint for a cyber-security explorace.

Cyber Analysts sit at a fake infected laptop, read emails and chat messages, click the sentence that is a trick, and shout the hint word to Field Agents — who run to physical boxes and bring back password fragments.

**Live:** https://allyhtml.github.io/firewall-breach-ops/

---

## Screens

| | |
|---|---|
| ![Boot](docs/screenshots/s1_boot.jpg) | ![Breach](docs/screenshots/s2_breach.jpg) |
| BIOS boot | "You've been hacked" takeover |
| ![Desktop](docs/screenshots/s3_desktop.jpg) | ![Mail](docs/screenshots/s4_mail.jpg) |
| Infected desktop | Mail — the phishing email |
| ![Hint](docs/screenshots/s5_hintcard.jpg) | ![ChatX](docs/screenshots/s6_chatx.jpg) |
| Hint card (the shout word) | ChatX — fake boss |
| ![Override](docs/screenshots/s7_override.jpg) | ![Armed](docs/screenshots/s8_override_armed.jpg) |
| System Override — fragments | Override accepted, kill armed |
| ![Purge](docs/screenshots/s9_purge.jpg) | ![Secured](docs/screenshots/s10_secured.jpg) |
| Purge sequence | SYSTEM SECURED |
| ![GM](docs/screenshots/s11_gm.jpg) | |
| GM console | |

---

## Play it

| | |
|---|---|
| **Game** | open `index.html` (or the live URL) |
| **GM console** | `gm.html` — passphrase `gm2026` |
| **Offline** | `dist/firewall-breach.html` — double-click, no internet needed. GM console at `#gm` |

---

## The checkpoint

**Duration:** 15 minutes · **Roles:** 1–2 analysts, 2–3 runners

```
Boot → "YOU'VE BEEN HACKED" → read Mail + ChatX → click the trick line
     → hint word appears → runners open the matching box → 3 fragments
     → enter FRM + 26 + XP → FRM-26-XP → KILL THE VIRUS → SYSTEM SECURED
```

### The three tricks

| Message | Suspicious line | Hint word |
|---|---|---|
| Mail — "account suspended in 2 hours" | "respond with your updated banking information before 2PM" | **FAKE URGENCY** |
| ChatX — "this is Maybank" | "send us the 6-digit code we just SMSed you" | **ASKING FOR PASSWORD** |
| ChatX — "Aina (Boss)" new number | "pay RM2 at homerr-clone.site/track" | **FAKE SENDER** |

**Fragments:** `FRM` · `26` · `XP` → code **`FRM-26-XP`**

### The boxes

6 real (each hint printed on 2 boxes) + 5 decoys = 11 transparent containers.
Print `docs/BOX_LABELS.pdf`, tape front to the lid and back inside.

---

## Docs

- [`docs/GM_BRIEF.md`](docs/GM_BRIEF.md) — full rules, answer key, scoring, debrief
- [`docs/FACILITATOR_RUNSHEET.md`](docs/FACILITATOR_RUNSHEET.md) — one-page checklist to run the station
- [`docs/BOX_LABELS.pdf`](docs/BOX_LABELS.pdf) — print-ready box labels

---

## Build

No dependencies. Everything is plain HTML/CSS/JS.

```bash
# regenerate the printable box labels (pure-stdlib Python)
python tools/make_labels.py

# rebuild the offline single-file bundle
node tools/bundle.js
```

### Project layout

```
index.html        game shell (GitHub Pages root)
gm.html           GM console
css/              desktop.css · apps.css · animations.css
js/               icons · data (answer key) · wm · ui (hint engine)
js/apps/          mail · chatx · override · atmos
tools/            make_labels.py · bundle.js
docs/             briefs + printable labels
dist/             offline single-file build + screenshots
```

---

## Behavior notes

- **Hints** are the only thing that unlocks box knowledge — nothing about the boxes exists in the page until an analyst clicks the correct sentence.
- **Wrong clicks** are free twice per message, then the message locks for 5 seconds.
- **Decoys** are logged by the GM console, which pushes a 15-second full-screen freeze to the game laptop and deducts 2 points.
- **Fragments** can be entered in any order; the code field stays locked until all three are loaded.
- **KILL THE VIRUS** stays disabled until the override code is accepted.

## Configuration

Change these in `js/data.js`:

```js
fragments      // the three fragment strings
overrideCode   // the combined code
mails / chats  // messages; a trap line is { cls:"trap", hint:"...", text:"..." }
```

GM passphrase is the `PASS` constant in `gm.html` (and is baked into `dist/` on rebuild).
Timer length is set in `gm.html` (`15 * 60 * 1000`).
