/* Yatra service worker — offline-first app shell.
   VERSION is replaced at build time by a hash of the app files, so every new deploy gets a fresh cache. */
const VERSION = "b8ff65490f";
const CORE_CACHE = "yatra-core-" + VERSION;
const FONT_CACHE = "yatra-fonts-v1";
const FONT_CSS = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

async function precacheFonts() {
  // Fonts are optional: if this fails (offline install) the app simply falls back to system fonts.
  if (!FONT_CSS) return;
  const cache = await caches.open(FONT_CACHE);
  const res = await fetch(FONT_CSS, { mode: "cors" });
  if (!res.ok) return;
  const css = await res.clone().text();
  await cache.put(FONT_CSS, res);
  const urls = Array.from(new Set((css.match(/url\((['"]?)(https?:[^)'"]+)\1\)/g) || []).map(u => u.replace(/^url\((['"]?)/, "").replace(/(['"]?)\)$/, ""))));
  await Promise.all(urls.map(async u => {
    try { const r = await fetch(u, { mode: "cors" }); if (r.ok) await cache.put(u, r); } catch (e) {}
  }));
}

self.addEventListener("install", event => {
  event.waitUntil(Promise.all([
    caches.open(CORE_CACHE).then(c => c.addAll(CORE_ASSETS)),
    precacheFonts().catch(() => {})
  ]));
  self.skipWaiting(); // new versions take over right away; open pages are told to refresh (see activate)
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("yatra-core-") && k !== CORE_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then(list => list.forEach(c => c.postMessage({ type: "SW_ACTIVATED", version: VERSION })))
  );
});

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)); }

async function networkFirstPage(request) {
  const cache = await caches.open(CORE_CACHE);
  try {
    const fresh = await Promise.race([fetch(request), timeout(4000)]);
    if (fresh && fresh.ok) cache.put("./index.html", fresh.clone());
    return fresh;
  } catch (err) {
    const cached = (await cache.match("./index.html", { ignoreSearch: true })) || (await cache.match("./", { ignoreSearch: true }));
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CORE_CACHE);
  const hit = await cache.match(request, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(request);
  if (res && res.ok) cache.put(request, res.clone());
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(FONT_CACHE);
  const hit = await cache.match(request);
  const net = fetch(request).then(res => { if (res && (res.ok || res.type === "opaque")) cache.put(request, res.clone()); return res; }).catch(() => null);
  return hit || (await net) || Response.error();
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate") { event.respondWith(networkFirstPage(req)); return; }
  if (url.origin === self.location.origin) { event.respondWith(cacheFirst(req)); return; }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com" || url.hostname === "www.gstatic.com" || (FONT_CSS && req.url === FONT_CSS) || url.pathname.endsWith(".woff2")) {
    event.respondWith(staleWhileRevalidate(req));
  }
});
