/* ============================================================
   FIREWALL BREACH OPS - Boot sequence, breach takeover, desktop
   ============================================================ */

const Boot = (() => {
  const LINES = [
    { t: "NexusBIOS v9.14.2210 — CyberOps-01", c: "b-brand" },
    { t: "" },
    { t: "CPU         : NexCore i7 @ 3.40GHz  (8 cores)", c: "" },
    { t: "Memory      : 16384 MB  [OK]", c: "" },
    { t: "Storage     : NVMe 512GB  [OK]", c: "" },
    { t: "" },
    { t: "Initialising device tree ................ [ OK ]", c: "b-ok" },
    { t: "Mounting encrypted volume C: ............ [ OK ]", c: "b-ok" },
    { t: "Starting network stack (eth0) ........... [ OK ]", c: "b-ok" },
    { t: "Loading security agent nexus-defence.sys  [ WARN ]", c: "b-warn" },
    { t: "  -> signature mismatch: expected 0x4F2A, got 0x0000", c: "b-warn" },
    { t: "" },
    { t: "Scanning for anomalies .................. ", c: "" },
    { t: "  !! 3 unauthorised persistence entries detected", c: "b-err" },
    { t: "  !! kernel driver 'locker.sys' loaded at boot", c: "b-err" },
    { t: "  !! encryption thread active on PID 1337", c: "b-err" },
    { t: "" },
    { t: "CRITICAL: system integrity compromised.", c: "b-err" },
    { t: "" }
  ];

  function run(onDone) {
    const el = document.getElementById("boot");
    el.classList.remove("hidden");
    el.innerHTML = `<span class="b-brand">NEXUS DEFENCE BIOS</span>`;

    let i = 0;
    const step = () => {
      if (i >= LINES.length) {
        const cur = document.createElement("span");
        cur.className = "b-cursor";
        el.appendChild(cur);
        setTimeout(() => {
          el.classList.add("fade");
          setTimeout(() => { el.classList.add("hidden"); onDone(); }, 620);
        }, 700);
        return;
      }
      const l = LINES[i++];
      const div = document.createElement("div");
      if (l.c === "b-brand") { el.appendChild(div); step(); return; }
      div.className = l.c;
      div.textContent = l.t;
      el.appendChild(div);
      el.scrollTop = el.scrollHeight;
      setTimeout(step, l.t.startsWith("  !!") ? 240 : 150);
    };
    setTimeout(step, 420);
  }

  return { run };
})();


const Breach = (() => {
  function show(onDone) {
    const el = document.getElementById("breach");
    el.classList.remove("hidden");
    el.innerHTML = `
      <div class="scanlines"></div>
      <div class="breach-inner">
        <div class="skull">☠</div>
        <h1>YOU'VE BEEN HACKED</h1>
        <div class="br-sub">
          Every file on this laptop is being encrypted right now.<br>
          <b>Find what went wrong. Save your machine.</b>
        </div>
        <div class="br-bar"><div data-brbar></div></div>
        <div class="br-pct" data-brpct>DATA ENCRYPTION — 0%</div>
        <button class="br-btn" data-brbtn>Enter the machine</button>
        <div class="br-hint">read your messages · trust nothing · report to your runners</div>
      </div>
    `;

    const bar = el.querySelector("[data-brbar]");
    const pct = el.querySelector("[data-brpct]");
    const btn = el.querySelector("[data-brbtn]");

    let p = 0;
    const t = setInterval(() => {
      p = Math.min(47, p + Math.random() * 3.2);
      bar.style.width = p + "%";
      pct.textContent = `DATA ENCRYPTION — ${Math.floor(p)}%`;
      if (p >= 47) {
        clearInterval(t);
        btn.classList.add("ready");
      }
    }, 90);

    setTimeout(() => btn.classList.add("ready"), 4200);

    btn.addEventListener("click", () => {
      clearInterval(t);
      el.classList.add("hidden");
      onDone && onDone();
    });
  }
  return { show };
})();


const Desktop = (() => {
  const APPS = [
    { id: "mail",     label: "Mail",            icon: Icons.mail,     open: () => MailApp.open(),     badge: "1" },
    { id: "chatx",    label: "ChatX",           icon: Icons.chat,     open: () => ChatApp.open(),     badge: "2" },
    { id: "override", label: "System Override", icon: Icons.override, open: () => OverrideApp.open() },
    { id: "files",    label: "File Explorer",   icon: Icons.files,    open: () => FilesApp.open() },
    { id: "notepad",  label: "TO-DO.txt",       icon: Icons.notepad,  open: () => NotepadApp.open("todo") },
    { id: "taskmgr",  label: "Task Manager",    icon: Icons.taskmgr,  open: () => TaskMgrApp.open() },
    { id: "settings", label: "Settings",        icon: Icons.settings, open: null, dead: true }
  ];

  function render() {
    const box = document.getElementById("icons");
    box.innerHTML = "";

    APPS.forEach((a) => {
      const d = document.createElement("button");
      d.className = "icon" + (a.dead ? " dead" : "");
      d.innerHTML = `${a.icon}<span>${a.label}</span>${a.badge ? `<span class="badge">${a.badge}</span>` : ""}`;
      d.addEventListener("click", () => {
        if (a.dead) { UI.toast("Settings is locked by system policy.", "info", 2000); return; }
        a.open();
      });
      box.appendChild(d);
    });
  }

  function init() {
    render();
    document.getElementById("hintpips").innerHTML = `
      <span id="hintcount">0/3</span>
      <span class="pip"></span><span class="pip"></span><span class="pip"></span>
    `;
  }

  return { init, render };
})();


const Game = (() => {
  function start() {
    Desktop.init();
    TimerBridge.start();

    Boot.run(() => {
      document.body.classList.add("infected");
      Breach.show(() => {
        MailApp.open();
        ChatApp.open();
        setTimeout(() => {
          Ransom.open();
          setTimeout(() => {
            UI.toast("Tip: click the sentence that seems wrong.", "info", 5000);
          }, 1400);
        }, 900);
      });
    });

    wireGlobal();
  }

  function wireGlobal() {
    document.getElementById("hintcard").addEventListener("click", () => Hints.hideCard());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") Hints.hideCard();
    });

    /* GM freeze bridge polls (Sync owns the cadence, this is a safety net) */
    setInterval(() => TimerBridge.checkState(), 1500);
  }

  return { start };
})();

window.addEventListener("DOMContentLoaded", () => Game.start());
