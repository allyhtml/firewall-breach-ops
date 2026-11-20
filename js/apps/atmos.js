/* ============================================================
   FIREWALL BREACH OPS - Atmosphere apps
   Files / Notepad / Task Manager / Ransom note
   ============================================================ */

const FilesApp = (() => {
  let curFolder = "Desktop";
  let rootEl = null;

  function open(folder) {
    const body = WM.create({
      id: "files",
      title: "File Explorer",
      icon: Icons.files,
      width: 820,
      height: 520
    });
    Taskbar.register("files", "Files", Icons.files);
    rootEl = body;
    curFolder = folder || "Desktop";
    render();
  }

  function render() {
    const root = rootEl;
    const folders = ["Desktop", "Documents", "Downloads", "Inbox"];

    root.innerHTML = `
      <div class="files">
        <div class="files-side">
          <h3>Quick access</h3>
          <div class="fs-tree">
            ${folders.map(f => `<div class="fs-node ${f === curFolder ? "active" : ""}" data-folder="${f}">${Icons.folder}${f}</div>`).join("")}
          </div>
        </div>
        <div class="files-main">
          <div class="files-bar">C:\\Users\\danial\\${curFolder}</div>
          <div class="files-grid" id="filesGrid"></div>
        </div>
      </div>
    `;

    root.querySelectorAll(".fs-node").forEach((n) => {
      n.addEventListener("click", () => { curFolder = n.dataset.folder; render(); });
    });

    const grid = root.querySelector("#filesGrid");
    const items = GameData.files[curFolder] || [];

    items.forEach((f) => {
      const d = document.createElement("div");
      d.className = "file-item" + (f.icon === "exe" ? " exec" : "");
      d.innerHTML = `${f.icon === "folder" ? Icons.folder : f.icon === "exe" ? Icons.exe : Icons.file}<span>${f.name}</span>`;
      d.addEventListener("click", () => {
        if (f.open === "ransom") { Ransom.open(); return; }
        if (f.open === "todo") { NotepadApp.open("todo"); return; }
        if (f.open && GameData.files[f.open]) { curFolder = f.open; render(); return; }
        if (f.sus) {
          UI.toast("Cannot open — file has been flagged by system policy.", "bad", 2600);
        } else if (f.icon === "exe") {
          UI.toast("Windows cannot open this file on a game machine.", "info", 2200);
        } else {
          UI.toast(`Preview unavailable: ${f.name}`, "info", 2000);
        }
      });
      grid.appendChild(d);
    });

    if (!items.length) {
      grid.innerHTML = `<div style="color:var(--txt-mute);font-size:12.5px;padding:20px">This folder is empty.</div>`;
    }
  }

  return { open };
})();


const NotepadApp = (() => {
  function open(which) {
    const id = "np-" + which;
    const body = WM.create({
      id,
      title: which === "todo" ? "TO-DO.txt — Notepad" : "Note",
      icon: Icons.notepad,
      width: 560,
      height: 440
    });
    Taskbar.register(id, which === "todo" ? "TO-DO.txt" : "Note", Icons.notepad);

    body.innerHTML = `
      <div class="notepad">
        <div class="np-bar"><span>File</span><span>Edit</span><span>Format</span><span>View</span><span>Help</span></div>
        <textarea class="np-text" readonly spellcheck="false">${GameData.notes[which] || ""}</textarea>
      </div>
    `;
  }
  return { open };
})();


const TaskMgrApp = (() => {
  function open() {
    const body = WM.create({
      id: "taskmgr",
      title: "Task Manager",
      icon: Icons.taskmgr,
      width: 700,
      height: 500
    });
    Taskbar.register("taskmgr", "Task Manager", Icons.taskmgr);

    body.innerHTML = `
      <div class="tm">
        <div class="tm-bar"><span>CPU: <b>68%</b></span><span>Memory: <b>87%</b></span><span>Disk: <b>100%</b></span><span>Network: <b>0.2 Mbps</b></span></div>
        <div class="tm-table scroll">
          <div class="tm-row head"><div>Name</div><div>CPU</div><div>Memory</div><div>PID</div></div>
          ${GameData.processes.map(p => `
            <div class="tm-row ${p.sus ? "sus" : ""}">
              <div>${p.name}</div><div>${p.cpu}</div><div>${p.mem}</div><div>${p.pid}</div>
            </div>`).join("")}
        </div>
      </div>
    `;
  }
  return { open };
})();


const Ransom = (() => {
  let shown = false;

  function open() {
    if (WM.exists("ransom")) { WM.focus(WM.node("ransom")); return; }
    const body = WM.create({
      id: "ransom",
      title: "RANSOM_NOTE.txt — Notepad",
      icon: Icons.lock,
      width: 640,
      height: 500,
      x: 260,
      y: 100
    });
    Taskbar.register("ransom", "RANSOM_NOTE.txt", Icons.lock);
    shown = true;

    body.innerHTML = `
      <div class="ransom scroll">
        <h1>YOUR FILES ARE ENCRYPTED</h1>
        <div class="r-rule"></div>
        <p>All documents, photos and databases on this machine have been locked with military-grade encryption.</p>
        <p class="dim">You have ONE chance to get them back.</p>
        <div class="r-box">
          <b>Total files locked:</b> 11,597<br>
          <b>Files recovered:</b> 0<br>
          <b>Encryption:</b> RSA-4096 + AES-256<br>
          <b>Backup status:</b> destroyed
        </div>
        <p>Do not attempt to shut down this computer. Do not rename any files. Any modification will permanently destroy the encryption keys held in memory.</p>
        <p>Somewhere on this machine is the way back in. Your team will have to find it.</p>
        <div class="r-timer">DATA ENCRYPTION 47%</div>
        <p class="dim" style="text-align:center">This percentage is increasing.</p>
        <div class="r-foot">
          — NOTMALWARE —<br>
          stay calm. stay quiet. watch your messages.
        </div>
      </div>
    `;
  }

  return { open };
})();
