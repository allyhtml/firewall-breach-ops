/* ============================================================
   FIREWALL BREACH OPS - Mail app
   ============================================================ */

const MailApp = (() => {
  let current = null;
  const read = new Set();

  function open() {
    const body = WM.create({
      id: "mail",
      title: "Mail — Danial's Inbox",
      icon: Icons.mail,
      width: 860,
      height: 560,
      x: 40,
      y: 60
    });
    Taskbar.register("mail", "Mail", Icons.mail);
    render(body);
  }

  function render(root) {
    root.innerHTML = `
      <div class="mail-app">
        <div class="mail-side">
          <div class="mail-side-head">
            <h3>Inbox</h3>
            <div class="mail-count">${GameData.mails.length} messages · 1 unread</div>
          </div>
          <div class="mail-list scroll" id="mailList"></div>
        </div>
        <div class="mail-read" id="mailRead">
          <div class="mail-read-head">
            <h1 style="color:var(--txt-mute);font-weight:500;font-size:14px">Select a message</h1>
          </div>
          <div class="mail-body" style="display:grid;place-items:center;color:var(--txt-mute);font-size:13px">
            Choose an email on the left to read it.
          </div>
        </div>
      </div>
    `;

    const list = root.querySelector("#mailList");
    GameData.mails.forEach((m) => {
      const item = document.createElement("div");
      item.className = "mail-item" + (read.has(m.id) ? " done" : "");
      item.dataset.id = m.id;
      item.innerHTML = `
        <div class="mi-from">${m.fromName}</div>
        <div class="mi-subj">${m.subject}</div>
        <div class="mi-time">${m.time}</div>
      `;
      item.addEventListener("click", () => select(root, m, item));
      list.appendChild(item);
    });
  }

  function select(root, m, item) {
    root.querySelectorAll(".mail-item").forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    item.classList.add("done");
    read.add(m.id);
    current = m;

    const pane = root.querySelector("#mailRead");

    let bodyHtml = "";
    m.body.forEach((line) => {
      if (typeof line === "string") {
        bodyHtml += `<p><span class="cl" data-trap="0">${line}</span></p>`;
      } else {
        bodyHtml += `<p><span class="cl" data-trap="${line.cls === "trap" ? 1 : 0}" data-hint="${line.hint || ""}" data-src-label="${m.subject}">${line.text}</span></p>`;
      }
    });

    pane.innerHTML = `
      <div class="mail-read-head">
        <h1>${m.subject}</h1>
        <div class="mail-meta">
          <div><b>From</b> <span class="${m.flagged ? "from-bad" : ""}">${m.fromName} &lt;${m.from}&gt;</span>${m.flagged ? `<span class="flag" style="background:rgba(244,63,94,.16);color:#fda4af;border:1px solid rgba(244,63,94,.4)">${m.flagText}</span>` : ""}</div>
          <div><b>To</b> danial.hakim@company.com</div>
          <div><b>Date</b> Today, ${m.time}</div>
        </div>
      </div>
      <div class="mail-body scroll" data-msgbody>
        ${bodyHtml}
        ${m.sig ? `<div class="sig">${m.sig.replace(/\n/g, "<br>")}</div>` : ""}
      </div>
    `;

    const bodyEl = pane.querySelector(".mail-body");
    Hints.register("mail", m.id, bodyEl);
  }

  return { open };
})();
