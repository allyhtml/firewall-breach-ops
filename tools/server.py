#!/usr/bin/env python3
"""
Firewall Breach Ops - local game server (stdlib only)

Serves the game + GM console and holds shared state in memory so the GM
console can run on a phone while the game runs on the laptop.

    GET  /api/state   -> current state JSON
    POST /api/state   <- new state JSON (GM pushes, also acts as heartbeat)
    GET  /api/reset   -> wipe state (handy for testing)

Everything else is served from the project folder.
"""

import json
import os
import socket
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 7331

DEFAULT_STATE = {
    "running": False,
    "endsAt": 0,
    "remaining": 15 * 60 * 1000,
    "freezeUntil": 0,
    "freezeRunner": "",
    "forceSecure": 0,
    "timeUp": False,
    "beat": 0,
}

_lock = threading.Lock()
_state = dict(DEFAULT_STATE)


def lan_ip():
    """Best-effort primary LAN address (no external traffic sent)."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except Exception:
        try:
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return "127.0.0.1"
    finally:
        s.close()


def qr_ascii(text):
    """Render a QR code using whatever is available; never fatal."""
    try:
        import qrcode  # optional
        q = qrcode.QRCode(border=1)
        q.add_data(text)
        q.make()
        buf = []
        for row in q.get_matrix():
            buf.append("".join("  " if c else "██" for c in row))
        return "\n".join(buf)
    except Exception:
        return None


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        msg = fmt % args
        if "/api/" in msg:
            return  # keep the console clean
        sys.stdout.write("  %s\n" % msg)

    def _json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/state":
            with _lock:
                self._json(_state)
            return
        if self.path.split("?")[0] == "/api/reset":
            with _lock:
                _state.clear()
                _state.update(DEFAULT_STATE)
                snapshot = dict(_state)
            self._json(snapshot)
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/state":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(length) if length else b"{}"
            incoming = json.loads(raw or b"{}")
        except Exception:
            self._json({"ok": False, "error": "bad json"}, 400)
            return

        with _lock:
            for k in DEFAULT_STATE:
                if k in incoming:
                    _state[k] = incoming[k]
            snapshot = dict(_state)

        self._json({"ok": True, "state": snapshot})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def end_headers(self):
        # never cache the game during a live event
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()


def main():
    ip = lan_ip()
    game_url = f"http://{ip}:{PORT}/index.html"
    gm_url = f"http://{ip}:{PORT}/gm.html"

    print()
    print("  ============================================")
    print("   FIREWALL BREACH OPS - game server")
    print("  ============================================")
    print()
    print("  ON THIS LAPTOP")
    print(f"    Game        {game_url}")
    print(f"    GM console  {gm_url}")
    print()
    print("  ON YOUR PHONE (same hotspot)")
    print(f"    {gm_url}")
    print()

    qr = qr_ascii(gm_url)
    if qr:
        print("  Scan to open the GM console on your phone:")
        print()
        for line in qr.splitlines():
            print("    " + line)
        print()
    else:
        print("  (install 'qrcode' for a scannable code, or just type the URL)")
        print()

    print("  Passphrase: gm2026")
    print("  Press Ctrl+C to stop.")
    print()

    srv = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    srv.daemon_threads = True
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n  stopped")


if __name__ == "__main__":
    main()
