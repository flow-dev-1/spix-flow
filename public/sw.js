const APP_CACHE = "flow-app-v2";
const VIDEO_CACHE = "flow-videos-v3";
const ASSET_CACHE = "flow-assets-v2";
const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";
const PRECACHE_VIDEO_URLS = [
  "https://d3sc34m1n26ele.cloudfront.net/SPIX-TOT2/Week+1/Week+1_1.mp4",
];
const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/tot2",
  "/tot2/",
  "/favicon.ico",
  "/logo.png",
  "/FLOW.png",
  "/placeholder.svg",
  "/respect-manifest.json",
  "/opds/index.json",
  "/opds/tot2.json",
  "/opds/tot2-manifest.json",
  "/opds/tot2-week1-manifest.json",
  "/opds/tot2-week2-manifest.json",
  "/opds/tot2-week3-manifest.json",
  "/opds/tot2-week4-manifest.json",
  "/opds/tot2-week5-manifest.json",
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
const NAVIGATION_ROUTE_PREFIXES = ["/courses", "/tot2"];
const inFlightVideoCaches = new Map();

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

function createFullVideoRequest(request) {
  const headers = new Headers(request.headers);
  headers.delete("range");

  return new Request(request.url, {
    method: "GET",
    headers,
    mode: request.mode,
    credentials: request.credentials,
    cache: "reload",
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    integrity: request.integrity,
  });
}

async function buildRangeResponse(request, cachedResponse) {
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

  const hasRangeHeader = request.headers.has("range");

  try {
    if (hasRangeHeader) {
      return await fetch(request);
    }

    const fullResponse = await fetch(createFullVideoRequest(request));
    if (fullResponse.status === 200) {
      await cache.put(request.url, fullResponse.clone());
    }

    return fullResponse;
  } catch {
    return new Response("Resource not available offline.", {
      status: 503,
      statusText: "Offline - resource not cached",
    });
  }
}

async function cacheFullVideo(request) {
  if (inFlightVideoCaches.has(request.url)) return inFlightVideoCaches.get(request.url);

  const task = caches
    .open(VIDEO_CACHE)
    .then(async (cache) => {
      const cached = await cache.match(request.url, { ignoreVary: true });
      if (cached) return;

      const fullResponse = await fetch(createFullVideoRequest(request));
      if (fullResponse.status === 200) {
        await cache.put(request.url, fullResponse);
      }
    })
    .catch(() => undefined)
    .finally(() => {
      inFlightVideoCaches.delete(request.url);
    });

  inFlightVideoCaches.set(request.url, task);
  return task;
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
      caches.open(VIDEO_CACHE).then((cache) =>
        Promise.all(
          PRECACHE_VIDEO_URLS.map((url) =>
            cache
              .add(new Request(url, { cache: "reload", mode: "cors" }))
              .catch(() => undefined),
          ),
        ),
      ),
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
    event.respondWith(videoResponse(event.request));
    event.waitUntil(cacheFullVideo(event.request));
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
