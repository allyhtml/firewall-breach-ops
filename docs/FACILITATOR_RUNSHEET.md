# FACILITATOR RUNSHEET — Checkpoint 4: Firewall Breach

One page. Print this. Bring it.

---

## SETUP — step 1: hotspot (do this first)

```
[ ] Windows Settings > Network & Internet > Mobile hotspot > ON
[ ] Note the hotspot name + password
[ ] Phone joins that hotspot
```

## SETUP — step 2: start the server

```
[ ] Double-click  START GAME.bat
[ ] Windows Firewall asks about Python -> ALLOW on PRIVATE networks
[ ] Terminal shows a QR code -> scan with phone = GM console
[ ] Laptop Chrome opens the game automatically
[ ] On the phone: passphrase gm2026
[ ] CHECK: laptop timer card (bottom-right) turns GREEN
```

If the timer card stays grey and says **NO GM LINK**, see the troubleshooting table at the bottom.

## SETUP — step 3: physical kit

```
[ ] 11 transparent Tupperware
[ ] Labels printed and stuck on  (docs/BOX_LABELS.pdf)
[ ] 6 real boxes contain cards:  FRM x2 · 26 x2 · XP x2
[ ] 5 decoy boxes contain nothing (or a taunt card)
[ ] Boxes shuffled — reals NOT grouped together
[ ] Boxes placed away from the laptop table (runners must run)
[ ] Laptop charged, Chrome open
[ ] Phone: Reset all pressed (timer 15:00, score 100)
```

---

## THE LAPTOP SCREEN

**Bottom-right corner = the timer card.** It is the only thing you need to watch.

| What it shows | Meaning |
|---|---|
| Grey `--:--` + grey dot + *No GM link* | Phone not connected. Fix before starting. |
| `14:32` cyan + green dot | Running normally |
| `04:12` amber | Under 5 minutes — start pushing |
| `01:45` red, pulsing | Under 2 minutes — wrap up |
| `00:00` + *Time up* | Round over |


---

## ANSWER KEY (memorise or tape to your forearm)

| Trick | Word on the box lid |
|---|---|
| Mail: banking email, "respond before 2PM" | **FAKE URGENCY** |
| ChatX: "this is Maybank, send the OTP" | **ASKING FOR PASSWORD** |
| ChatX: "Aina (Boss)" new number | **FAKE SENDER** |

**Box backs:** `FRM` · `26` · `XP`
**Override code:** `FRM-26-XP`

---

## RUNNING A TEAM

| Minute | What you do |
|---|---|
| 0:00 | **Start** on your phone. Read the one-line brief. Say nothing else. |
| 0:30 | Say nothing. Let them click things. |
| 2:00 | If both analysts are still stuck: *"Both apps have messages. Read them all."* |
| 5:00 | Runners should be moving. If not, ask *"Has anyone shouted a word to the runners yet?"* |
| 8:00 | If still on messages: *"One email and two chats are tricks."* |
| 11:00 | If on the override app: *"Three cards, three boxes, then one code."* |
| 13:30 | Push: *"Two minutes left."* — then hands off. |
| 15:00 | Timer hits zero. **End round**. Note score + finish time. |
| 15:00+ | 2-minute debrief. Then **Reset all** — no laptop reload needed. |

---

## WHEN A RUNNER OPENS A DECOY

1. Tap that runner's **Freeze 10s** button on your phone
2. Laptop shows a full-screen FREEZE overlay counting 10… 0
3. Score drops by 2 automatically
4. Say nothing judgemental. Just *"ten seconds"*.

---

## SCORING

```
Final = 100 − (2 × decoys opened)
```
Record: **score** and **finish time**.

---

## DEBRIEF (2 min)

Ask:
1. *Which message tricked the owner of this laptop?* → the banking email
2. *Name the three tricks.* → urgency, asking for a password, fake sender
3. *One rule you'd tell a friend?*

Close with: **urgency + codes + unknown numbers = stop and check.**

---

## IF THINGS BREAK

| Symptom | Fix |
|---|---|
| Timer card grey, *No GM link* | Phone and laptop not on the same hotspot, or server not running. Restart `START GAME.bat`. |
| Card shows `--:--` but dot is green | Press **Start** on the phone. |
| Freeze does nothing on laptop | Timer card dot must be green. Grey = link is down. |
| Freeze stuck | Wait 10s, it clears itself |
| TIME UP stays after reset | Clears automatically now — if not, F5 the laptop |
| Game already on SECURED | Phone → **Reset all**, then F5 the laptop |
| Card missing | Give the fragment verbally |
| They are hopelessly stuck at 13:00 | Phone → **Force secured**, log the score as 60 |
| No internet at all | `dist/firewall-breach.html` — double-click; GM at `#gm` (same browser only) |
| Phone can't open the URL | Hotspot must be ON and phone joined it. Use a normal browser tab, not an in-app browser. |

---

## RESET BETWEEN TEAMS

```
[ ] Phone -> Reset all
[ ] Re-check all 6 real boxes have cards
[ ] Re-shuffle the boxes
```
No laptop reload needed.

