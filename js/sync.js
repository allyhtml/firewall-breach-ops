/* ============================================================
   FIREWALL BREACH OPS - Sync layer
   Two modes, auto-detected:
     SERVER     -> shared state via /api/state  (phone GM works)
     LOCAL      -> localStorage                 (GitHub Pages, same browser)
   The rest of the game only talks to Sync.
   ============================================================ */

const Sync = (() => {
  const LS_KEY = "fb_gm_timer";
  let mode = "local";          // "server" | "local"
  let lastState = null;
  let lastBeat = 0;
  let pollTimer = null;
  let errorStreak = 0;
  const listeners = [];

  /* ---------- state shape (shared by both modes) ----------
     {
       running, endsAt, remaining,
       freezeUntil, freezeRunner,
       timeUp, forceSecure,
       beat
     }
  --------------------------------------------------------- */

  function normalize(raw) {
    if (!raw || typeof raw !== "object") return null;
    return {
      running: !!raw.running,
      endsAt: Number(raw.endsAt) || 0,
      remaining: Number(raw.remaining) || 0,
      freezeUntil: Number(raw.freezeUntil) || 0,
      freezeRunner: raw.freezeRunner || "",
      timeUp: !!raw.timeUp,
      forceSecure: Number(raw.forceSecure) || 0,
      beat: Number(raw.beat) || 0
    };
  }

  function readLocal() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return normalize(JSON.parse(raw));
    } catch { return null; }
  }

  /* ---------- detect server ---------- */
  async function detect() {
    /* file:// and static hosting have no API - skip the probe entirely */
    if (location.protocol === "file:") {
      mode = "local";
      return mode;
    }
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 1200);
      const res = await fetch("api/state", { signal: ctrl.signal, cache: "no-store" });
      clearTimeout(t);
      if (res.ok) {
        const data = await res.json();
        const st = normalize(data);
        if (st) {
          mode = "server";
          lastState = st;
          lastBeat = Date.now();
          return mode;
        }
      }
    } catch { /* not server mode */ }
    mode = "local";
    return mode;
  }

  /* ---------- poll ---------- */
  async function pollOnce() {
    if (mode === "server") {
      try {
        const res = await fetch("api/state", { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const st = normalize(await res.json());
        errorStreak = 0;
        if (st) {
          lastState = st;
          lastBeat = Date.now();
          emit(st);
        }
      } catch {
        errorStreak++;
        if (errorStreak > 8) setMode("local");
      }
      return;
    }

    /* local mode: read localStorage */
    const st = readLocal();
    if (st) {
      lastState = st;
      lastBeat = Date.now();
      emit(st);
    }
  }

  function setMode(m) {
    if (mode === m) return;
    mode = m;
    console.warn("[Sync] falling back to", m, "mode");
  }

  function emit(st) {
    listeners.forEach(fn => {
      try { fn(st); } catch (e) { console.error(e); }
    });
  }

  /* ---------- public ---------- */
  async function start() {
    await detect();
    setupInstant();
    pollOnce();
    clearInterval(pollTimer);
    pollTimer = setInterval(pollOnce, mode === "server" ? 400 : 700);
    return mode;
  }

  /* instant delivery in local mode when both pages share a browser */
  function setupInstant() {
    window.addEventListener("storage", (e) => {
      if (mode === "local" && e.key === LS_KEY) pollOnce();
    });
    try {
      const bc = new BroadcastChannel("fb_gm");
      bc.onmessage = () => { if (mode === "local") pollOnce(); };
    } catch { /* unsupported */ }
  }

  function onChange(fn) { listeners.push(fn); }

  function state() { return lastState; }

  /* is the GM actually alive? (heartbeat fresh) */
  function isLinked() {
    if (!lastState) return false;
    if (!lastState.beat) return mode === "server";
    return (Date.now() - lastState.beat) < 6000;
  }

  function currentMode() { return mode; }

  return { start, onChange, state, isLinked, currentMode, pollOnce };
})();
