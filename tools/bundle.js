#!/usr/bin/env node
/**
 * Bundles the game into a single offline HTML file.
 * - inlines all CSS and JS
 * - inlines screenshots? no (keeps size small)
 * - GM console folded into the same file behind #gm
 * Output: dist/firewall-breach.html
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dist", "firewall-breach.html");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/* ---------- CSS ---------- */
const css = [
  read("css/desktop.css"),
  read("css/apps.css"),
  read("css/animations.css")
].join("\n\n");

/* ---------- JS (order matters) ---------- */
const jsOrder = [
  "js/icons.js",
  "js/data.js",
  "js/sync.js",
  "js/wm.js",
  "js/ui.js",
  "js/apps/mail.js",
  "js/apps/chatx.js",
  "js/apps/override.js",
  "js/apps/atmos.js",
  "js/boot.js"
];
const js = jsOrder.map(read).join("\n\n");

/* ---------- GM console (extracted from gm.html) ---------- */
const gmHtml = read("gm.html");

const gmStyleMatch = gmHtml.match(/<style>([\s\S]*?)<\/style>/);
const gmBodyMatch = gmHtml.match(/<body>([\s\S]*?)<script>/);
const gmScriptMatch = gmHtml.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);

if (!gmStyleMatch || !gmBodyMatch || !gmScriptMatch) {
  console.error("FAILED to extract GM console parts from gm.html");
  process.exit(1);
}

const gmStyle = gmStyleMatch[1];
const gmBody = gmBodyMatch[1];
const gmScript = gmScriptMatch[1];

/* ---------- index.html shell ---------- */
const idx = read("index.html");

const bodyMatch = idx.match(/<body>([\s\S]*?)<!-- ============ SCRIPTS ============ -->/);
if (!bodyMatch) { console.error("FAILED to extract body from index.html"); process.exit(1); }
const gameBody = bodyMatch[1];

/* ---------- assemble ---------- */
const out = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CYBEROPS-01</title>
<style>
${css}
</style>
<style id="gm-mode-styles" disabled>
${gmStyle}
</style>
</head>
<body>

${gameBody}

<!-- ============ GM CONSOLE (hidden unless #gm) ============ -->
<div id="gm-root" style="display:none">
${gmBody}
</div>

<script>
(function(){
"use strict";

/* ---- game ---- */
${js}

/* ---- gm console ---- */
window.__GM_INIT = function(){
${gmScript}
};

/* ---- router: #gm shows the console in place of the game ---- */
function route(){
  var isGm = location.hash === "#gm";
  document.getElementById("gm-root").style.display = isGm ? "block" : "none";
  document.getElementById("gm-mode-styles").disabled = !isGm;

  var shell = ["boot","breach","desktop","hintcard","freeze","purge","secureflash","secured","timeup"];
  shell.forEach(function(id){
    var n = document.getElementById(id);
    if (!n) return;
    n.style.display = isGm ? "none" : "";
  });

  if (isGm && !window.__gmBooted) {
    window.__gmBooted = true;
    document.getElementById("gate").style.display = "grid";
    window.__GM_INIT();
  }
}

window.addEventListener("hashchange", function(){
  if (location.hash !== "#gm") { location.reload(); return; }
  route();
});

if (location.hash === "#gm") {
  route();
}

})();
</script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, "utf8");

const kb = (Buffer.byteLength(out) / 1024).toFixed(1);
console.log(`wrote ${OUT}  (${kb} KB)`);
