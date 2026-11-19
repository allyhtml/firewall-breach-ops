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
   Timer bridge - reads master clock written by GM console
   ============================================================ */
const TimerBridge = (() => {
  const KEY = "fb_gm_timer";
  let tick = null;

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  function fmt(ms) {
    if (ms < 0) ms = 0;
    const s = Math.floor(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  function start() {
    const clock = document.getElementById("clock");
    tick = setInterval(() => {
      const now = new Date();
      const t = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
      const st = read();
      if (st && st.running && st.endsAt) {
        const left = st.endsAt - Date.now();
        clock.textContent = fmt(left);
        clock.style.color = left < 120000 ? "var(--red)" : left < 300000 ? "var(--amber)" : "var(--txt)";
        if (left <= 0 && !window.__timeupShown) {
          window.__timeupShown = true;
          showTimeUp();
        }
      } else {
        clock.textContent = t;
        clock.style.color = "var(--txt)";
      }
    }, 500);

    window.addEventListener("storage", (e) => {
      if (e.key === KEY) checkState();
    });
  }

  let lastFreezeSeen = 0;

  function checkState() {
    const st = read();
    if (!st) return;
    if (st.freezeUntil && st.freezeUntil > lastFreezeSeen && Date.now() < st.freezeUntil) {
      lastFreezeSeen = st.freezeUntil;
      showFreeze(st.freezeUntil, st.freezeRunner || "Runner");
    }
    if (st.forceSecure && st.forceSecure > (window.__forceSecureSeen || 0)) {
      window.__forceSecureSeen = st.forceSecure;
      if (!document.getElementById("secured").classList.contains("hidden")) return;
      document.getElementById("secured").classList.remove("hidden");
      document.body.classList.remove("infected");
      document.body.classList.add("secured");
      const t = document.getElementById("sb-threat");
      if (t) t.textContent = "SYSTEM SECURED";
    }
  }

  let freezeTimer = null;
  function showFreeze(until, runner) {
    const f = document.getElementById("freeze");
    f.querySelector(".fz-sub").textContent = `${runner} opened a decoy box — −2 points`;
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

  function showTimeUp() {
    if (document.getElementById("secured").classList.contains("hidden") === false) return;
    document.getElementById("timeup").classList.remove("hidden");
  }

  function stop() { clearInterval(tick); }

  return { start, read, checkState, showFreeze, stop };
})();
