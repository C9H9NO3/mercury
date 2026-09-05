// Static server + the tiny values API behind /dashboard. Railway sets process.env.PORT.
//
//   GET  /api/values      current account values (defaults merged with the saved edits)
//   GET  /api/defaults    the values baked into test.html (data/defaults.json)
//   POST /api/values      save edits (JSON body). Written to $DATA_DIR/values.json — on Railway that
//                         is the persistent volume mounted at /data, locally .data/values.json.
//   /test                 test.html with the values injected into window.__VALUES__ (no fetch, no flash)
//   /dashboard            the editor
//
// Optional: set EDIT_KEY in the environment and POST /api/values must carry it in the X-Edit-Key header
// (the dashboard asks for it once and remembers it in localStorage).
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, ".data");
const VALUES_FILE = path.join(DATA_DIR, "values.json");
const DEFAULTS_FILE = path.join(ROOT, "data", "defaults.json");
const EDIT_KEY = process.env.EDIT_KEY || "";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
// Pretty URLs. "/" is the screenshot build, "/test" the hard-coded DOM build, "/dashboard" its editor.
const ROUTES = { "/": "/index.html", "/test": "/test.html", "/dashboard": "/dashboard.html" };

// ---- values -----------------------------------------------------------------
function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
function defaults() { return readJSON(DEFAULTS_FILE, {}); }
function currentValues() {
  const d = defaults();
  const saved = readJSON(VALUES_FILE, null);
  return saved ? merge(d, saved) : d;
}
// deep merge: saved values win, defaults fill anything missing (e.g. a field added later)
function merge(base, over) {
  if (Array.isArray(base) && Array.isArray(over)) return base.map((b, i) => (i < over.length ? merge(b, over[i]) : b));
  if (base && typeof base === "object" && over && typeof over === "object" && !Array.isArray(base)) {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = k in base ? merge(base[k], over[k]) : over[k];
    return out;
  }
  return over === undefined ? base : over;
}
function saveValues(v) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = VALUES_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(v, null, 2));
  fs.renameSync(tmp, VALUES_FILE);
}
function json(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}
function readBody(req, limit = 256 * 1024) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (c) => { buf += c; if (buf.length > limit) { reject(new Error("too large")); req.destroy(); } });
    req.on("end", () => resolve(buf));
    req.on("error", reject);
  });
}

http
  .createServer(async (req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);

    if (urlPath === "/api/values" || urlPath === "/api/defaults") {
      if (req.method === "GET") return json(res, 200, urlPath === "/api/defaults" ? defaults() : currentValues());
      if (req.method === "POST" && urlPath === "/api/values") {
        if (EDIT_KEY && req.headers["x-edit-key"] !== EDIT_KEY) return json(res, 401, { error: "bad key" });
        try {
          const body = JSON.parse(await readBody(req));
          if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("bad body");
          saveValues(merge(defaults(), body));
          return json(res, 200, { ok: true, values: currentValues() });
        } catch (e) {
          return json(res, 400, { error: String(e.message || e) });
        }
      }
      res.writeHead(405); return res.end();
    }

    if (ROUTES[urlPath]) urlPath = ROUTES[urlPath];
    const safe = path.normalize(urlPath).replace(/^([/\\.]+)/, "");
    const filePath = path.join(ROOT, safe);
    if (!filePath.startsWith(ROOT) || safe.startsWith(".data") || safe.startsWith("node_modules")) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not found");
      }
      const ext = path.extname(filePath).toLowerCase();
      const type = TYPES[ext] || "application/octet-stream";
      // Nothing is cached except the fonts (their URLs carry ?v=). Edits show up on the next open.
      const headers = { "Content-Type": type, "Cache-Control": ext === ".woff2" ? "public, max-age=31536000, immutable" : "no-store, must-revalidate" };
      if (safe === "test.html") {
        // inject the live values so the page renders with them on first paint
        data = data.toString("utf8").replace("/*__VALUES__*/null", JSON.stringify(currentValues()).replace(/</g, "\\u003c"));
      }
      res.writeHead(200, headers);
      res.end(data);
    });
  })
  .listen(PORT, () => console.log("Serving on port " + PORT + " (data: " + VALUES_FILE + ")"));
