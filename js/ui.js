/* ============================================================
   FIREWALL BREACH OPS - Shared UI helpers + hint engine
   ============================================================ */

const UI = (() => {
  function toast(msg, type = "", ms = 2600) {
    const box = document.getElementById("toasts");
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => {
      t.classList.add("out");
      setTimeout(() => t.remove(), 260);
    }, ms);
  }
  return { toast };
})();

/* ============================================================
   Hint engine
   - click a suspicious line -> hint card + sidebar chip
   - wrong lines: 2 free, then 5s lock on that message
   ============================================================ */
const Hints = (() => {
  const found = new Set();
  const wrongCount = {};   // key: "src:id" -> count
  const lockedUntil = {};  // key -> timestamp
  const LOCK_MS = 5000;
  const FREE_TRIES = 2;
  let onFoundCb = null;

  function key(src, id) { return src + ":" + id; }

  function register(src, id, container) {
    const k = key(src, id);
    const lines = container.querySelectorAll(".cl");
    lines.forEach((line) => {
      line.addEventListener("click", (e) => {
        e.stopPropagation();
        handle(src, id, line, k);
      }, true);
    });
    applyLock(k, container);
    return lines.length;
  }

  function handle(src, id, line, k) {
    if (line.classList.contains("found")) return;

    if (lockedUntil[k] && Date.now() < lockedUntil[k]) {
      UI.toast("Still scanning this message… wait a moment.", "info", 1600);
      return;
    }

    if (line.dataset.trap === "1") {
      const hint = line.dataset.hint;
      line.classList.add("found");
      line.dataset.hintShown = hint;
      found.add(hint);
      showCard(hint, src, id);
      addChip(hint, src, line.dataset.srcLabel || "");
      updatePips();
      onFoundCb && onFoundCb(hint, found.size);
      return;
    }

    /* wrong line */
    wrongCount[k] = (wrongCount[k] || 0) + 1;
    if (wrongCount[k] <= FREE_TRIES) {
      UI.toast("Nothing wrong here.", "", 1700);
    } else {
      lockedUntil[k] = Date.now() + LOCK_MS;
      UI.toast("Too many guesses — rescanning this message (5s).", "bad", 2400);
      applyLock(k, line.closest("[data-msgbody]") || document);
      setTimeout(() => unapplyLock(k), LOCK_MS);
    }
  }

  function applyLock(k, scope) {
    if (!lockedUntil[k] || Date.now() >= lockedUntil[k]) return;
    scope.querySelectorAll(".cl").forEach((l) => {
      if (!l.classList.contains("found")) l.classList.add("locked");
    });
  }

  function unapplyLock(k) {
    document.querySelectorAll(".cl.locked").forEach((l) => l.classList.remove("locked"));
  }

  function showCard(hint, src, id) {
    const card = document.getElementById("hintcard");
    card.querySelector(".hc-title").textContent = hint;
    card.querySelector(".hc-runner b").textContent = `"${hint}"`;
    card.querySelector(".hc-src").textContent = src === "mail" ? "Found in Mail" : "Found in ChatX";
    card.classList.add("show");
    clearTimeout(card._t);
    card._t = setTimeout(() => card.classList.remove("show"), 5200);
  }

  function addChip(hint, src, label) {
    const bar = document.getElementById("hintbar");
    if ([...bar.children].some((c) => c.dataset.hint === hint)) return;
    const chip = document.createElement("div");
    chip.className = "hintchip";
    chip.dataset.hint = hint;
    chip.innerHTML = `
      <div class="hc-lbl">Hint found</div>
      <div class="hc-val">${hint}</div>
      <div class="hc-src">${src === "mail" ? "Mail" : "ChatX"}${label ? " · " + label : ""}</div>
    `;
    bar.appendChild(chip);
  }

  function updatePips() {
    const pips = document.querySelectorAll("#hintpips .pip");
    pips.forEach((p, i) => p.classList.toggle("on", i < found.size));
    const lbl = document.getElementById("hintcount");
    if (lbl) lbl.textContent = `${found.size}/3`;
  }

  function hideCard() {
    document.getElementById("hintcard").classList.remove("show");
  }

  function markAll(container, src, id) {
    container.querySelectorAll('.cl[data-trap="1"]').forEach((l) => {
      l.classList.add("found");
      l.dataset.hintShown = l.dataset.hint;
    });
  }

  return {
    register, found, hideCard, markAll,
    onFound: (cb) => { onFoundCb = cb; },
    count: () => found.size,
    reset: () => { found.clear(); Object.keys(wrongCount).forEach(k => delete wrongCount[k]); Object.keys(lockedUntil).forEach(k => delete lockedUntil[k]); }
  };
})();


/* ============================================================
   Timer bridge - consumes state from Sync (server or localStorage)
   Owns: timer card, connection dot, freeze, time-up, force-secure
   ============================================================ */
const TimerBridge = (() => {
  let renderTimer = null;
  let freezeTimer = null;
  let lastFreezeSeen = 0;
  let lastForceSecureSeen = 0;
  let timeUpShown = false;

  const TOTAL_MS = 15 * 60 * 1000;

  function fmt(ms) {
    if (ms < 0) ms = 0;
    const s = Math.floor(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  function el(id) { return document.getElementById(id); }

  /* ---------------- start ---------------- */
  async function start() {
    await Sync.start();
    Sync.onChange(apply);
    apply(Sync.state());
    renderTimer = setInterval(paint, 250);
  }

  /* ---------------- consume state ---------------- */
  function apply(st) {
    if (!st) { paint(); return; }

    /* freeze */
    if (st.freezeUntil && st.freezeUntil > lastFreezeSeen && Date.now() < st.freezeUntil) {
      lastFreezeSeen = st.freezeUntil;
      showFreeze(st.freezeUntil, st.freezeRunner || "Runner");
    }

    /* force-secure from GM */
    if (st.forceSecure && st.forceSecure > lastForceSecureSeen) {
      lastForceSecureSeen = st.forceSecure;
      forceSecure();
    }

    /* time up flag (End round) */
    if (st.timeUp && !timeUpShown) showTimeUp();
    if (!st.timeUp && timeUpShown) clearTimeUp();

    paint();
  }

  /* ---------------- paint the timer card ---------------- */
  function paint() {
    const card = el("timerCard");
    const clock = el("clock");
    if (!card) return;

    const st = Sync.state();
    const linked = Sync.isLinked();

    card.classList.toggle("linked", linked);
    card.classList.toggle("unlinked", !linked);

    const dotTip = linked
      ? "GM console connected"
      : "GM console not connected — open gm.html in this browser";

    const timeEl = card.querySelector(".tc-time");
    const labelEl = card.querySelector(".tc-label");
    card.title = dotTip;

    if (!st || (!st.running && !st.endsAt && !st.timeUp)) {
      /* no timer ever started */
      card.classList.remove("warn", "crit", "done");
      timeEl.textContent = "--:--";
      labelEl.textContent = linked ? "Timer idle" : "No GM link";
      if (clock) { clock.textContent = wallClock(); clock.style.color = "var(--txt)"; }
      return;
    }

    if (st.timeUp) {
      card.classList.remove("warn", "crit");
      card.classList.add("done");
      timeEl.textContent = "00:00";
      labelEl.textContent = "Time up";
      if (clock) { clock.textContent = "00:00"; clock.style.color = "var(--amber)"; }
      return;
    }

    const left = st.running
      ? Math.max(0, st.endsAt - Date.now())
      : Math.max(0, st.remaining || 0);

    card.classList.remove("done");
    card.classList.toggle("crit", left <= 120000);
    card.classList.toggle("warn", left > 120000 && left <= 300000);

    const txt = fmt(left);
    timeEl.textContent = txt;
    labelEl.textContent = st.running ? "Time left" : "Paused";
    if (clock) {
      clock.textContent = txt;
      clock.style.color = left <= 120000 ? "var(--red)" : left <= 300000 ? "var(--amber)" : "var(--txt)";
    }

    /* natural expiry */
    if (st.running && left <= 0 && !timeUpShown) showTimeUp();
  }

  function wallClock() {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  /* ---------------- freeze ---------------- */
  function showFreeze(until, runner) {
    const f = el("freeze");
    if (!f) return;
    f.querySelector(".fz-sub").textContent = `${runner} opened a decoy box — -2 points`;
    f.classList.remove("hidden");
    clearInterval(freezeTimer);
    const upd = () => {
      const left = Math.ceil((until - Date.now()) / 1000);
      f.querySelector(".fz-count").textContent = Math.max(0, left);
      if (left <= 0) {
        clearInterval(freezeTimer);
        f.classList.add("hidden");
      }
    };
    upd();
    freezeTimer = setInterval(upd, 200);
  }

  /* ---------------- time up ---------------- */
  function showTimeUp() {
    const securedVisible = el("secured") && !el("secured").classList.contains("hidden");
    if (securedVisible) return;
    timeUpShown = true;
    const t = el("timeup");
    if (t) t.classList.remove("hidden");
  }

  function clearTimeUp() {
    timeUpShown = false;
    const t = el("timeup");
    if (t) t.classList.add("hidden");
  }

  /* ---------------- force secure ---------------- */
  function forceSecure() {
    if (!document.body.classList.contains("secured")) {
      document.body.classList.remove("infected");
      document.body.classList.add("secured");
    }
    const s = el("secured");
    if (s && s.classList.contains("hidden")) s.classList.remove("hidden");
    const threat = el("sb-threat");
    if (threat) threat.textContent = "SYSTEM SECURED";
    clearTimeUp();
  }

  /* called by the game when the team actually finishes */
  function markSecured() {
    clearTimeUp();
    document.body.classList.add("secured");
    document.body.classList.remove("infected");
    const threat = el("sb-threat");
    if (threat) threat.textContent = "SYSTEM SECURED";
  }

  function checkState() { Sync.pollOnce(); }

  function stop() {
    clearInterval(renderTimer);
    clearInterval(freezeTimer);
  }

  return { start, checkState, showFreeze, stop, markSecured, forceSecure };
})();
