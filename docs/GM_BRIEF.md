# Checkpoint 4 — Mission: Firewall Breach

**PIC:** Ally
**Equipment:** Transparent Tupperware × 11 (6 real + 5 decoys), printed box labels, 3 password fragment cards per real box, 1 laptop, 1 projector/screen (optional)
**Duration:** 15 minutes total
**Roles:** 1–2 Cyber Analysts (laptop) · 2–3 Field Agents (boxes)

---

## The story

The team sits down at a laptop that has just been "hacked". A ransom note is on screen, files are being encrypted, and somewhere in the machine's messages is the thing that started it.

Cyber Analysts read the emails and chat messages, find the sentence that is a trick, and shout the hint word to their Field Agents. Field Agents run to the physical boxes, open only the box with that word on the lid, and bring back one password fragment card from inside.

Three fragments → one override code → system secured.

> **Screen flow:** the laptop opens Mail and ChatX, then the ransom note on top of them. Teams can minimize the ransom note to read the apps behind it and restore it from the taskbar.

---

## Flow

```
BOOT + HACKED      0:00–0:30   ransom takeover, forensic vibe
READ               0:30–4:00   analysts read Mail + ChatX
CLICK              2:00–5:00   click the suspicious line → hint word
RUN                5:00–10:00  agents open matching lids, return with cards
OVERRIDE           10:00–13:30 fragments + code + kill the virus
SECURED            13:30–15:00 banner, wrap up, debrief
```

Times are guidance, not rules. Teams go at whatever pace they find.

---

## Answer key

### Mail (6 messages, 1 is a trick)

| ID | Sender | Subject | Verdict |
|---|---|---|---|
| **m1** | `accounts@maybank-secure-verify.com` | URGENT: Your account will be suspended in 2 hours | **TRICK → FAKE URGENCY** |
| m2 | `invoice@globalship.com` | Invoice #4471 — February shipment | real |
| m3 | `hr@company.com` | Updated leave policy 2026 | real |
| m4 | `noreply@lms.edu` | Assignment deadline extended | real |
| m5 | `team@company.com` | Friday lunch — vote for venue | real |
| m6 | `it-support@company.com` | Scheduled maintenance Saturday | real (also teaches: "IT will never ask for your password") |

The clickable line in **m1**:
> "Please respond with your updated banking information before 2PM or your account will be permanently closed."

### ChatX (5 threads, 2 are tricks)

| ID | Thread | Verdict |
|---|---|---|
| **c1** | `Unknown +60 12-889-4413` — "this is Maybank, send the OTP" | **TRICK → ASKING FOR PASSWORD** |
| **c2** | `Aina (Boss)` — new number, RM2 delivery link | **TRICK → FAKE SENDER** |
| c3 | `Sarah (IT)` | real — storyline and nudges |
| c4 | `Class Group` | real — banter, one mention of a weird email |
| c5 | `Delivery Co.` | real — verified business, genuine delivery |

### The three hint words → three boxes

| Hint word (box lid front) | Fragment (lid back) | Copies printed |
|---|---|---|
| `FAKE URGENCY` | `FRM` | 2 |
| `ASKING FOR PASSWORD` | `26` | 2 |
| `FAKE SENDER` | `XP` | 2 |

**Override code: `FRM-26-XP`**

### Decoy boxes (5)

Lid front → lid back:

| Front | Back |
|---|---|
| `Fake Link` | `VOID — WRONG BOX` |
| `Password Reset` | `VOID — WRONG BOX` |
| `Too Good To Be True` | `VOID — WRONG BOX` |
| `Wrong Grammar` | `VOID — WRONG BOX` |
| `Bank Alert` | `VOID — WRONG BOX` |

Note that the decoys are the three most "textbook" phishing tells on purpose. A team that plays by general knowledge instead of reading the screen will pick a decoy and get penalised.

---

## Box setup

11 boxes total. Each real hint is printed on **two** boxes so two runners can hunt in parallel.

| # | Lid front | Lid back | Contents |
|---|---|---|---|
| 1 | FAKE URGENCY | FRM | 1 card reading `FRM` |
| 2 | FAKE URGENCY | FRM | 1 card reading `FRM` |
| 3 | ASKING FOR PASSWORD | 26 | 1 card reading `26` |
| 4 | ASKING FOR PASSWORD | 26 | 1 card reading `26` |
| 5 | FAKE SENDER | XP | 1 card reading `XP` |
| 6 | FAKE SENDER | XP | 1 card reading `XP` |
| 7 | Fake Link | VOID | nothing (or a taunt card) |
| 8 | Password Reset | VOID | nothing |
| 9 | Too Good To Be True | VOID | nothing |
| 10 | Wrong Grammar | VOID | nothing |
| 11 | Bank Alert | VOID | nothing |

**Print:** `docs/BOX_LABELS.pdf` — 11 pages, 2 labels each. Print single-sided, cut, and tape front to the outside lid / back to the inside lid. Use identical paper and font for real and decoy boxes so they can't be told apart from the outside.

**Physical layout:** put the boxes far enough from the laptop table that a runner must actually run. Keep real and decoy boxes shuffled together — do not group them.

---

## Running the station

### 0. Two ways to run it

| | **Server mode** (recommended) | **Static mode** |
|---|---|---|
| Start with | `START GAME.bat` | open `index.html` |
| GM console runs on | **your phone** ✅ | same browser, second tab |
| Needs | Python on the laptop | nothing |
| Internet | not needed | not needed (use `dist/`) |
| Phone support | yes | no |

**Setup (server mode):**
1. Windows → Settings → Network & Internet → **Mobile hotspot** → On
2. Phone joins that hotspot
3. Double-click **`START GAME.bat`** → allow Python on **Private** networks when prompted
4. Terminal prints a QR code — scan it with the phone
5. Phone: passphrase `gm2026`
6. **Check the laptop's bottom-right timer card turns green.** That is the confirmation the link works.

### 1. Before the team arrives
- Game is open on the laptop (the `.bat` opens it)
- Phone has the GM console, unlocked with `gm2026`
- Press **Reset all** to clear the previous team

### 2. When the team sits
- Press **Start** on the GM console (15:00 begins)
- Say: *"Your laptop has been hacked. Read everything on it, work out what went wrong, and fix it. You have 15 minutes."*
- Say nothing else. Let them explore.

### 3. When a runner opens a decoy
- Tap that runner's **Freeze 10s** button on the GM console
- The game laptop shows a full-screen FREEZE overlay counting down from 10
- **−2 points** is applied automatically

### 4. If the team gets stuck
- After ~8 minutes, nudge: *"Have you checked both the Mail and the chat app?"*
- If a card is lost or a fragment is unreadable, use **Force secured** only as a last resort — or verbally give them the fragment.

### 5. Scoring
```
Base                        100
Each decoy box opened       −2   (accuracy)
Wrong override-code guesses  no penalty, just friction
Final score                 base − penalties
```
Record final score and finish time. If a team finishes early, note the time — ties break on speed.

### 6. Between teams
- GM console → **Reset all** (the laptop clears itself, no reload needed)
- Re-shuffle the boxes and re-check the 6 real boxes still contain their cards

### 7. The timer card (bottom-right of the laptop)

| Shows | Meaning |
|---|---|
| Grey `--:--`, grey dot, *No GM link* | Phone not connected — restart `START GAME.bat` |
| Cyan `14:32`, green dot | Running |
| Amber | Under 5:00 |
| Red, pulsing | Under 2:00 |
| `00:00`, *Time up* | Round over |

---

## The rules (from the brief) and how the game enforces them

| Rule | Enforcement |
|---|---|
| **Zone separation** — analysts stay at the laptop, runners stay at the boxes | The hint word only appears on the laptop screen. Runners physically cannot know which box to open without being told. |
| **No brute-force** — runners may only open called boxes | Hints never appear until the analyst clicks the right line. Decoy lids are labelled temptingly so guessing costs points. |
| **Decoy penalty** — 10s freeze + −2 accuracy | GM console button → live FREEZE overlay on the laptop + automatic score deduction |
| **Card handling** — one card per box, close the lid | Physical; GM observes. The vault rejects duplicate fragments so hoarding gains nothing. |
| **Laptop integrity** — no deleting/renaming/modifying | Everything runs in the browser. Nothing on the laptop's real file system is touched. |

---

## Debrief (2 minutes, after the timer)

Ask the team:
1. *Which message tricked the person whose laptop this is?* (the Maybank email)
2. *What were the three tricks?* (fake urgency, asking for a password, fake sender)
3. *What's the one rule you'd give a friend after today?*

The message you want: **urgency, requests for codes, and unknown numbers are the three big red flags.**

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Timer not moving on the laptop | Check the timer-card dot is green. If grey, the phone link is down — restart `START GAME.bat`. |
| Freeze overlay won't go away | It clears itself after 10s. Reload if stuck. |
| Timer card grey, *No GM link* | Phone and laptop not on the same hotspot, or the server isn't running. Restart `START GAME.bat`. |
| Card shows `--:--` but dot is green | Press **Start** on the phone. |
| Freeze does nothing on the laptop | The timer-card dot must be green. Grey = the link is down. |
| Freeze overlay won't go away | It clears itself after 10s. Reload if stuck. |
| A team's fragments won't be accepted | Type each fragment into its own box in the System Override app — the box turns green when accepted. Case-insensitive, any order, only `FRM`, `26`, `XP` are valid. Check the cards were printed correctly. |
| Override code rejected | It is `FRM-26-XP`. The dashes matter. The code field unlocks only after all three fragment boxes are green. |
| Game already ended (secured screen) | GM → Reset all. The laptop clears itself; F5 only if it doesn't. |
| Phone can't open the GM URL | Hotspot must be ON and the phone joined it. Use a normal browser tab, not an in-app browser. |
| No internet at the venue | Either run `START GAME.bat` (no internet needed) or use `dist/firewall-breach.html` — single file, GM console at the `#gm` route (same browser only). |

---

## Files

```
Firewall Breach Ops/
├─ START GAME.bat               start server + open the game (recommended)
├─ index.html                   game
├─ gm.html                      GM console
├─ tools/server.py              local server (phone sync)
├─ dist/firewall-breach.html    offline single-file fallback
├─ docs/BOX_LABELS.pdf          print this for the boxes
├─ docs/GM_BRIEF.md             this file
└─ docs/FACILITATOR_RUNSHEET.md one-page checklist
```

GM passphrase: **`gm2026`**
Server port: **7331**

