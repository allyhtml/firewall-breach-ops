/* ============================================================
   FIREWALL BREACH OPS - System Override app
   [FRM][26][XP] -> FRM-26-XP -> OVERRIDE -> KILL THE VIRUS
   ============================================================ */

const OverrideApp = (() => {
  let state = {
    f1: false, f2: false, f3: false,
    codeOk: false,
    killed: false
  };

  function open() {
    const body = WM.create({
      id: "override",
      title: "System Override",
      icon: Icons.override,
      width: 760,
      height: 640,
      resizable: false
    });
    Taskbar.register("override", "System Override", Icons.override);
    render(body);
  }

  function render(root) {
    root.innerHTML = `
      <div class="ovr scroll" data-ovr>
        <div class="ovr-head">
          <div class="kick">Nexus Defence Console</div>
          <h1>System Override</h1>
          <p>Enter the three fragments recovered from the field, then authorise the override code to regain control of this machine.</p>
        </div>

        <div class="frag-row" data-fragrow>
          <div class="frag" data-slot="1"><div class="flabel">Fragment 1</div><div class="fval">···</div></div>
          <div class="frag" data-slot="2"><div class="flabel">Fragment 2</div><div class="fval">···</div></div>
          <div class="frag" data-slot="3"><div class="flabel">Fragment 3</div><div class="fval">···</div></div>
        </div>

        <div style="text-align:center;font-size:11px;color:var(--txt-mute);margin-top:2px">
          Type each fragment card into the box below, one at a time
        </div>

        <div class="code-row" data-fragcode>
          <input type="text" maxlength="6" placeholder="TYPE A FRAGMENT" data-input="frag" autocomplete="off" spellcheck="false">
          <button class="btn" data-act="frag">Submit</button>
        </div>

        <div class="code-row" style="margin-top:20px">
          <input type="text" maxlength="12" placeholder="OVERRIDE CODE" data-input="code" autocomplete="off" spellcheck="false" disabled>
          <button class="btn primary" data-act="ovr" disabled>Override</button>
        </div>

        <div class="kill-row">
          <button class="btn danger" data-act="kill" disabled>Kill the Virus</button>
        </div>

        <div class="progress"><div data-progress></div></div>

        <div class="ovr-log scroll" data-log>
<span class="l-dim">NEXUS DEFENCE CONSOLE v4.2.1 — ready</span>
<span class="l-dim">Awaiting fragment input: ${GameData.fragments.length} cards required</span>
        </div>

        <div class="ovr-note">
          <b>Field agents:</b> bring one card from each matched box. Fragments may be entered in any order.
        </div>
      </div>
    `;

    wire(root);
    logAdd(root, 'l-cy', 'Operator session opened');
  }

  function logAdd(root, cls, text) {
    const log = root.querySelector("[data-log]");
    const line = document.createElement("div");
    line.className = cls;
    line.textContent = text;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }

  function logRaw(root, html) {
    const log = root.querySelector("[data-log]");
    log.insertAdjacentHTML("beforeend", html);
    log.scrollTop = log.scrollHeight;
  }

  function setProgress(root, pct) {
    root.querySelector("[data-progress]").style.width = pct + "%";
  }

  function wire(root) {
    const fragInput = root.querySelector('[data-input="frag"]');
    const fragBtn = root.querySelector('[data-act="frag"]');
    const codeInput = root.querySelector('[data-input="code"]');
    const ovrBtn = root.querySelector('[data-act="ovr"]');
    const killBtn = root.querySelector('[data-act="kill"]');

    fragBtn.addEventListener("click", submitFrag);
    fragInput.addEventListener("keydown", (e) => { if (e.key === "Enter") submitFrag(); });

    function submitFrag() {
      const val = fragInput.value.trim().toUpperCase();
      if (!val) return;

      const idx = GameData.fragments.indexOf(val);
      const slotKey = "f" + (idx + 1);

      if (idx === -1) {
        fragInput.classList.add("bad");
        setTimeout(() => fragInput.classList.remove("bad"), 400);
        UI.toast("That fragment is not valid.", "bad", 2000);
        logAdd(root, "l-err", `REJECTED  "${val}" — no matching fragment`);
        return;
      }

      if (state[slotKey]) {
        UI.toast("That fragment is already loaded.", "info", 2000);
        fragInput.value = "";
        return;
      }

      state[slotKey] = true;
      const slot = root.querySelector(`[data-slot="${idx + 1}"]`);
      slot.classList.add("done");
      slot.querySelector(".fval").textContent = val;
      fragInput.value = "";
      fragInput.focus();

      UI.toast(`Fragment accepted: ${val}`, "good", 1800);
      logAdd(root, "l-ok", `ACCEPTED  ${val} → slot ${idx + 1} [OK]`);

      const allDone = state.f1 && state.f2 && state.f3;
      if (allDone) {
        codeInput.disabled = false;
        ovrBtn.disabled = false;
        codeInput.focus();
        logAdd(root, "l-cy", "All fragments loaded — enter override code");
        UI.toast("All three fragments loaded. Enter the override code.", "good", 3200);
        setProgress(root, 33);
      }
    }

    codeInput.addEventListener("keydown", (e) => { if (e.key === "Enter" && !ovrBtn.disabled) doOverride(); });
    ovrBtn.addEventListener("click", doOverride);

    function doOverride() {
      const val = codeInput.value.trim().toUpperCase();
      if (val !== GameData.overrideCode) {
        codeInput.classList.add("bad");
        setTimeout(() => { codeInput.classList.remove("bad"); codeInput.value = ""; codeInput.focus(); }, 420);
        UI.toast("Override code rejected. Check your fragments.", "bad", 2600);
        logAdd(root, "l-err", `OVERRIDE REJECTED — code "${val}" invalid`);
        return;
      }

      state.codeOk = true;
      codeInput.disabled = true;
      ovrBtn.disabled = true;
      killBtn.disabled = false;
      setProgress(root, 66);

      logAdd(root, "l-ok", "OVERRIDE ACCEPTED — authentication granted");
      logAdd(root, "l-cy", "Kill-switch armed. Awaiting operator confirmation.");
      UI.toast("Override accepted. Kill-switch armed.", "good", 3000);

      const note = root.querySelector(".ovr-note");
      note.innerHTML = `<b style="color:var(--green)">Kill-switch armed.</b> Press <b style="color:#fb7185">KILL THE VIRUS</b> to purge the infection.`;

      killBtn.focus();
    }

    killBtn.addEventListener("click", () => {
      if (!state.codeOk || state.killed) return;
      state.killed = true;
      killBtn.disabled = true;
      purge(root);
    });
  }

  function purge(root) {
    const overlay = document.getElementById("purge");
    overlay.classList.remove("hidden");
    overlay.innerHTML = "";

    const lines = [
      { t: "AUTH     ", c: "p-cy", m: "Operator override FRM-26-XP accepted" },
      { t: "SCAN     ", c: "", m: "Locating malicious process…" },
      { t: "FOUND    ", c: "p-rd", m: "PID 1337  NOTMALWARE.exe  (666,666 K)" },
      { t: "FOUND    ", c: "p-rd", m: "PID 1777  locker.sys      (kernel driver)" },
      { t: "LOCK     ", c: "p-am", m: "Halting threads…" },
      { t: "KILL     ", c: "", m: "Terminating NOTMALWARE.exe [1/2]" },
      { t: "KILL     ", c: "", m: "Terminating NOTMALWARE.exe [2/2]" },
      { t: "DRIVER   ", c: "", m: "Unloading locker.sys from kernel…" },
      { t: "KEYS     ", c: "", m: "Recovering encryption keys from memory…" },
      { t: "DECRYPT  ", c: "", m: "Restoring 1,284 files…" },
      { t: "DECRYPT  ", c: "", m: "Restoring 3,911 files…" },
      { t: "DECRYPT  ", c: "", m: "Restoring 6,402 files…" },
      { t: "CLEAN    ", c: "", m: "Removing persistence: Run\\NOTMALWARE" },
      { t: "CLEAN    ", c: "", m: "Removing persistence: Task Scheduler\\Updater" },
      { t: "VERIFY   ", c: "", m: "Integrity check 100% — no residual payload" },
      { t: "", c: "p-big", m: "FIREWALL RESTORED" }
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i >= lines.length) {
        clearInterval(timer);
        setTimeout(finish, 700);
        return;
      }
      const l = lines[i++];
      const div = document.createElement("div");
      div.className = l.c;
      div.textContent = l.t ? `[${l.t.trim().padEnd(8)}] ${l.m}` : l.m;
      overlay.appendChild(div);
      if (i % 3 === 0) setProgress(root, 66 + Math.min(33, i * 2));
      i++;
    }, 620);
  }

  function finish() {
    document.getElementById("purge").classList.add("hidden");
    const flash = document.getElementById("secureflash");
    flash.classList.remove("hidden");
    setTimeout(() => flash.classList.add("hidden"), 900);

    document.getElementById("secured").classList.remove("hidden");
    document.body.classList.remove("infected");
    document.body.classList.add("secured");

    const st = document.getElementById("sb-threat");
    st.textContent = "SYSTEM SECURED";
    const sb = document.getElementById("sb-brand");
    if (sb) sb.style.color = "var(--green)";
  }

  return { open };
})();
