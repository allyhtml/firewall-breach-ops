/* ============================================================
   FIREWALL BREACH OPS - Window Manager
   ============================================================ */

const WM = (() => {
  let zTop = 100;
  const open = new Map();
  let cascade = 0;

  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }

  function create({ id, title, icon, width = 780, height = 540, x, y, resizable = true, onClose, bodyClass = "" }) {
    if (open.has(id)) {
      const w = open.get(id);
      w.classList.remove("hidden");
      focus(w);
      return w.querySelector(".winbody");
    }

    const desk = document.getElementById("desktop");
    const dw = desk.clientWidth;
    const dh = desk.clientHeight - 48;

    const w = width > dw - 80 ? dw - 60 : width;
    const h = height > dh - 80 ? dh - 60 : height;

    cascade = (cascade + 1) % 7;
    const px = Math.max(8, Math.min(dw - Math.min(w, dw - 16) - 8,
      x != null ? x : Math.round((dw - w) / 2) - 40 + cascade * 26));
    const py = Math.max(40, Math.min(dh - Math.min(h, dh - 52) - 8,
      y != null ? y : Math.round((dh - h) / 2) - 20 + cascade * 22));

    const node = el(`
      <div class="win" id="win-${id}" style="left:${px}px;top:${py}px;width:${w}px;height:${h}px">
        <div class="titlebar">
          ${icon || ""}
          <h2>${title}</h2>
          <div class="winbtns">
            <button class="min" title="Minimize">${Icons.min}</button>
            <button class="max" title="Maximize">${Icons.max}</button>
            <button class="close" title="Close">${Icons.close}</button>
          </div>
        </div>
        <div class="winbody ${bodyClass}"></div>
        ${resizable ? '<div class="resize"></div>' : ""}
      </div>
    `);

    desk.appendChild(node);
    open.set(id, node);

    const bar = node.querySelector(".titlebar");
    const body = node.querySelector(".winbody");

    /* focus on any click */
    node.addEventListener("mousedown", () => focus(node), true);

    /* buttons */
    node.querySelector(".close").addEventListener("click", (e) => {
      e.stopPropagation();
      close(id);
      onClose && onClose();
    });
    node.querySelector(".min").addEventListener("click", (e) => {
      e.stopPropagation();
      node.classList.add("hidden");
      Taskbar.sync();
    });
    node.querySelector(".max").addEventListener("click", (e) => {
      e.stopPropagation();
      if (node.dataset.max === "1") {
        Object.assign(node.style, JSON.parse(node.dataset.prev));
        node.dataset.max = "0";
      } else {
        node.dataset.prev = JSON.stringify({ left: node.style.left, top: node.style.top, width: node.style.width, height: node.style.height });
        Object.assign(node.style, { left: "0px", top: "0px", width: dw + "px", height: dh + "px" });
        node.dataset.max = "1";
      }
    });

    /* drag */
    let drag = null;
    bar.addEventListener("mousedown", (e) => {
      if (e.target.closest(".winbtns")) return;
      if (node.dataset.max === "1") return;
      drag = { dx: e.clientX - node.offsetLeft, dy: e.clientY - node.offsetTop };
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", (e) => {
      if (!drag) return;
      node.style.left = Math.max(-node.offsetWidth + 120, Math.min(dw - 80, e.clientX - drag.dx)) + "px";
      node.style.top = Math.max(34, Math.min(dh - 40, e.clientY - drag.dy)) + "px";
    });
    document.addEventListener("mouseup", () => {
      if (drag) { drag = null; document.body.style.userSelect = ""; }
    });

    /* resize */
    const rz = node.querySelector(".resize");
    if (rz) {
      let rs = null;
      rz.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        rs = { x: e.clientX, y: e.clientY, w: node.offsetWidth, h: node.offsetHeight };
        document.body.style.userSelect = "none";
      });
      document.addEventListener("mousemove", (e) => {
        if (!rs) return;
        node.style.width = Math.max(340, rs.w + e.clientX - rs.x) + "px";
        node.style.height = Math.max(220, rs.h + e.clientY - rs.y) + "px";
      });
      document.addEventListener("mouseup", () => {
        if (rs) { rs = null; document.body.style.userSelect = ""; }
      });
    }

    focus(node);
    Taskbar.sync();
    return body;
  }

  function focus(node) {
    document.querySelectorAll(".win").forEach((w) => w.classList.remove("focused"));
    node.classList.add("focused");
    node.style.zIndex = ++zTop;
    Taskbar.sync();
    return;
  }

  function close(id) {
    const node = open.get(id);
    if (!node) return;
    node.classList.add("closing");
    setTimeout(() => node.remove(), 140);
    open.delete(id);
    Taskbar.sync();
  }

  function exists(id) { return open.has(id); }
  function node(id) { return open.get(id); }

  function minimizeAll() {
    open.forEach((n) => n.classList.add("hidden"));
    Taskbar.sync();
  }

  return { create, focus, close, exists, node, minimizeAll, list: open };
})();

/* ---------- Taskbar ---------- */
const Taskbar = (() => {
  const titles = {};

  function register(id, title, icon) {
    titles[id] = { title, icon };
  }

  function sync() {
    const list = document.getElementById("tasklist");
    const openIds = [...WM.list.keys()];
    list.innerHTML = "";

    openIds.forEach((id) => {
      const meta = titles[id] || { title: id, icon: "" };
      const node = WM.list.get(id);
      const active = !node.classList.contains("hidden") && node.classList.contains("focused");
      const btn = document.createElement("button");
      btn.className = "taskbtn" + (active ? " active" : "");
      btn.innerHTML = `${meta.icon || ""}<span>${meta.title}</span>`;
      btn.addEventListener("click", () => {
        if (node.classList.contains("hidden")) {
          node.classList.remove("hidden");
          WM.focus(node);
        } else if (node.classList.contains("focused")) {
          node.classList.add("hidden");
          sync();
        } else {
          WM.focus(node);
        }
      });
      list.appendChild(btn);
    });
  }

  return { register, sync };
})();
