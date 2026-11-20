/* ============================================================
   FIREWALL BREACH OPS - ChatX app (static threads)
   ============================================================ */

const ChatApp = (() => {
  const readSet = new Set();
  let currentId = null;

  function open() {
    const body = WM.create({
      id: "chatx",
      title: "ChatX",
      icon: Icons.chat,
      width: 820,
      height: 540,
      x: 560,
      y: 190
    });
    Taskbar.register("chatx", "ChatX", Icons.chat);
    render(body);
  }

  function render(root) {
    root.innerHTML = `
      <div class="chat-app">
        <div class="chat-side">
          <div class="chat-side-head">
            <div class="dot"></div>
            <h3>Chats</h3>
          </div>
          <div class="chat-list scroll" id="chatList"></div>
        </div>
        <div class="chat-main" id="chatMain">
          <div style="flex:1;display:grid;place-items:center;color:var(--txt-mute);font-size:13px">
            Select a conversation
          </div>
        </div>
      </div>
    `;

    const list = root.querySelector("#chatList");
    GameData.chats.forEach((c) => {
      const item = document.createElement("div");
      item.className = "chat-item" + (readSet.has(c.id) ? " done" : "");
      item.dataset.id = c.id;
      const initials = c.name.replace(/[^A-Za-z ]/g, "").trim().slice(0, 2).toUpperCase() || "??";
      item.innerHTML = `
        <div class="avatar ${c.warn ? "warn" : ""}">${initials}</div>
        <div class="ci-meta">
          <div class="ci-name">${c.name}${c.tag ? `<span class="tag">${c.tag}</span>` : ""}</div>
          <div class="ci-prev">${c.preview}</div>
        </div>
      `;
      item.addEventListener("click", () => select(root, c, item));
      list.appendChild(item);
    });
  }

  function select(root, c, item) {
    root.querySelectorAll(".chat-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    item.classList.add("done");
    readSet.add(c.id);
    currentId = c.id;

    const main = root.querySelector("#chatMain");
    const initials = c.name.replace(/[^A-Za-z ]/g, "").trim().slice(0, 2).toUpperCase() || "??";

    main.innerHTML = `
      <div class="chat-head">
        <div class="avatar ${c.warn ? "warn" : ""}">${initials}</div>
        <div>
          <div class="ch-name">${c.name}${c.tag ? `<span class="tag" style="margin-left:7px">${c.tag}</span>` : ""}</div>
          <div class="ch-sub">${c.sub}</div>
        </div>
      </div>
      <div class="chat-body scroll" data-msgbody id="chatBody"></div>
      <div class="chat-foot">Read-only conversation history — ChatX desktop archive</div>
    `;

    const bodyEl = main.querySelector("#chatBody");

    c.messages.forEach((msg) => {
      const b = document.createElement("div");

      if (msg.who === "sys") {
        b.className = "bubble sys";
        b.textContent = msg.text;
        bodyEl.appendChild(b);
        return;
      }

      b.className = "bubble" + (msg.who === "me" ? " me" : "");

      let inner = msg.sender ? `<div style="font-size:10px;color:#7dd3fc;font-weight:700;margin-bottom:3px">${msg.sender}</div>` : "";

      if (msg.trap) {
        inner += `<span class="cl" data-trap="1" data-hint="${msg.hint}" data-src-label="${c.name}">${msg.text}</span>`;
      } else {
        inner += `<span class="cl" data-trap="0">${msg.text.replace(/\n/g, "<br>")}</span>`;
      }

      inner += `<span class="btime">${msg.t}</span>`;
      b.innerHTML = inner;
      bodyEl.appendChild(b);
    });

    if (c.warn) {
      const warn = document.createElement("div");
      warn.className = "bubble sys";
      warn.style.background = "rgba(244,63,94,.1)";
      warn.style.borderColor = "rgba(244,63,94,.35)";
      warn.style.color = "#fda4af";
      warn.textContent = "⚠ This account is not verified";
      bodyEl.prepend(warn);
    }

    Hints.register("chat", c.id, bodyEl);
    bodyEl.scrollTop = 0;
  }

  return { open };
})();
