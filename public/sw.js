const APP_CACHE = "flow-app-v4";
const VIDEO_CACHE = "flow-videos-v8";
const ASSET_CACHE = "flow-assets-v2";
const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";
const isWebView = /wv|WebView/i.test(self.navigator.userAgent);
// const PRECACHE_VIDEO_URLS = [
//   "https://d3sc34m1n26ele.cloudfront.net/SPIX-TOT2/Week+1/Week+1_1.mp4",
//   "https://d3sc34m1n26ele.cloudfront.net/SPIX-TOT2/Week+2/Week+2_1.mp4",
// ];
const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/tot",
  "/tot/",
  "/tot2",
  "/tot2/",
  "/favicon.ico",
  "/logo.png",
  "/FLOW.png",
  "/placeholder.svg",
  "/respect-manifest.json",
  "/opds/index.json",
  "/opds/tot.json",
  "/opds/tot-manifest.json",
  "/opds/tot-week1-manifest.json",
  "/opds/tot-week2-manifest.json",
  "/opds/tot-week3-manifest.json",
  "/opds/tot-week4-manifest.json",
  "/opds/tot-week5-manifest.json",
  "/opds/tot-week6-manifest.json",
  "/opds/tot2.json",
  "/opds/tot2-manifest.json",
  "/opds/tot2-week1-manifest.json",
  "/opds/tot2-week2-manifest.json",
  "/opds/tot2-week3-manifest.json",
  "/opds/tot2-week4-manifest.json",
  "/opds/tot2-week5-manifest.json",
  "/tot/week1/index.html",
  "/tot/week1/",
  "/tot/week1",
  "/tot?startWeek=1",
  "/tot/week2/index.html",
  "/tot/week2/",
  "/tot/week2",
  "/tot?startWeek=2",
  "/tot/week3/index.html",
  "/tot/week3/",
  "/tot/week3",
  "/tot?startWeek=3",
  "/tot/week4/index.html",
  "/tot/week4/",
  "/tot/week4",
  "/tot?startWeek=4",
  "/tot/week5/index.html",
  "/tot/week5/",
  "/tot/week5",
  "/tot?startWeek=5",
  "/tot/week6/index.html",
  "/tot/week6/",
  "/tot/week6",
  "/tot?startWeek=6",
  "/tot2/week1/index.html",
  "/tot2/week1/",
  "/tot2/week1",
  "/tot2?startWeek=1",
  "/tot2/week2/index.html",
  "/tot2/week2/",
  "/tot2/week2",
  "/tot2?startWeek=2",
  "/tot2/week3/index.html",
  "/tot2/week3/",
  "/tot2/week3",
  "/tot2?startWeek=3",
  "/tot2/week4/index.html",
  "/tot2/week4/",
  "/tot2/week4",
  "/tot2?startWeek=4",
  "/tot2/week5/index.html",
  "/tot2/week5/",
  "/tot2/week5",
  "/tot2?startWeek=5",
];
const CACHEABLE_ASSET_EXTENSIONS = [
  ".avif",
  ".css",
  ".gif",
  ".html",
  ".ico",
  ".jpg",
  ".jpeg",
  ".js",
  ".json",
  ".mjs",
  ".png",
  ".svg",
  ".webp",
];
const NAVIGATION_ROUTE_PREFIXES = ["/courses", "/tot", "/tot2"];

async function staleWhileRevalidate(cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok || response.type === "opaque") {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || network || Response.error();
}

async function navigationResponse(request) {
  const cache = await caches.open(APP_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      cache.put("/index.html", response.clone());
    }
    return response;
  } catch {
    return (
      (await cache.match(request)) ||
      (await cache.match("/index.html")) ||
      new Response("SPIX is not available offline yet.", {
        status: 503,
        statusText: "Offline - app shell not cached",
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

async function buildRangeResponse(request, cachedResponse) {
  if (cachedResponse.type === "opaque") return cachedResponse;

  const rangeHeader = request.headers.get("range");
  if (!rangeHeader || !cachedResponse) return cachedResponse;

  const blob = await cachedResponse.blob();
  const size = blob.size;
  const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
  if (!match || !size) return cachedResponse;

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (start >= size || end < start) {
    return new Response(null, {
      status: 416,
      statusText: "Range Not Satisfiable",
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  const chunk = blob.slice(start, end + 1);

  return new Response(chunk, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": String(chunk.size),
      "Content-Type": cachedResponse.headers.get("Content-Type") || "video/mp4",
    },
  });
}

async function videoResponse(request) {
  const cache = await caches.open(VIDEO_CACHE);
  const cached = await cache.match(request.url, { ignoreVary: true });
  if (cached) return buildRangeResponse(request, cached);

  // Helper to fetch and verify the response is valid (not 503 / failed)
  const fetchAndCheck = async (req) => {
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.status === 206 || res.type === "opaque")) {
        return res;
      }
    } catch (e) {
      // Ignore and let it fall back
    }
    return null;
  };

  const response = await fetchAndCheck(request);
  if (response) return response;

  return new Response("Resource not available offline.", {
    status: 503,
    statusText: "Offline - resource not cached",
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(APP_CACHE).then((cache) =>
        Promise.all(
          APP_SHELL_URLS.map((url) =>
            cache.add(new Request(url, { cache: "reload" })).catch(() => undefined),
          ),
        ),
      ),
      // caches.open(VIDEO_CACHE).then((cache) =>
      //   Promise.all(
      //     PRECACHE_VIDEO_URLS.map((url) =>
      //       cache
      //         .add(new Request(url, { cache: "reload", mode: "cors" }))
      //         .catch(() => undefined),
      //     ),
      //   ),
      // ),
    ])
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_CACHE, VIDEO_CACHE, ASSET_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isCloudfrontVideo = url.hostname === CLOUDFRONT_HOST;

  // Android WebView direct media requests can fail before the native cache layer
  // serves them. Let CloudFront videos use this SW cache path, while non-video
  // WebView requests still defer to native handling.
  if (isWebView && !isCloudfrontVideo) {
    return;
  }

  const isSameOriginAsset =
    url.origin === self.location.origin &&
    CACHEABLE_ASSET_EXTENSIONS.some((extension) =>
      url.pathname.toLowerCase().endsWith(extension),
    );
  const isNavigation =
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") || "").includes("text/html");
  const isAppNavigation =
    url.origin === self.location.origin &&
    isNavigation &&
    NAVIGATION_ROUTE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));

  if (isAppNavigation) {
    event.respondWith(navigationResponse(event.request));
    return;
  }

  if (isCloudfrontVideo) {
    if (self.navigator.onLine && !isWebView) {
      return;
    }

    event.respondWith(videoResponse(event.request));
    return;
  }

  if (!isSameOriginAsset) return;

  event.respondWith(
    staleWhileRevalidate(
      APP_SHELL_URLS.includes(url.pathname) ? APP_CACHE : ASSET_CACHE,
      event.request,
    ).catch(
      () =>
        new Response("Resource not available offline.", {
          status: 503,
          statusText: "Offline - resource not cached",
        }),
    ),
  );
});
