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
  return new Request(request.url, {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    cache: "reload",
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
  // const cache = await caches.open(VIDEO_CACHE);
  // const cached = await cache.match(request.url, { ignoreVary: true });
  // if (cached) return buildRangeResponse(request, cached);

  // Helper to fetch and verify the response is valid (not 503 / failed)
  const fetchAndCheck = async (req) => {
    try {
      const res = await fetch(req);
      if (res && (res.status === 200 || res.status === 206)) {
        return res;
      }
    } catch (e) {
      // Ignore and let it fall back
    }
    return null;
  };

  try {
    // 1. Always fetch the full video (no Range header) online first so we can cache it completely.
    const cleanReq = createFullVideoRequest(request);
    const fullResponse = await fetch(cleanReq);
    if (fullResponse && fullResponse.status === 200) {
      // await cache.put(request.url, fullResponse.clone());
      return buildRangeResponse(request, fullResponse);
    }
  } catch (e) {
    // Ignore and proceed to offline fallbacks
  }

  // 2. Try the original new URL (offline WebView intercept path)
  let response = await fetchAndCheck(request);
  if (response) return buildRangeResponse(request, response);

  // 3. Try the legacy URL path (offline WebView intercept path for old server-imported manifests)
  if (request.url.includes("/SPIX-TOT2/")) {
    const oldUrlStr = request.url.replace("/SPIX-TOT2/", "/tot2_videos/");
    const oldRequest = new Request(oldUrlStr, {
      method: request.method,
      headers: request.headers,
      mode: request.mode,
      credentials: request.credentials,
      redirect: request.redirect,
    });
    response = await fetchAndCheck(oldRequest);
    if (response) return buildRangeResponse(oldRequest, response);
  }

  // 4. Ultimate fallback: if everything fails, return 503
  return new Response("Resource not available offline.", {
    status: 503,
    statusText: "Offline - resource not cached",
  });
}

async function cacheFullVideo(request) {
//   if (inFlightVideoCaches.has(request.url)) return inFlightVideoCaches.get(request.url);
// 
//   const task = caches
//     .open(VIDEO_CACHE)
//     .then(async (cache) => {
//       const cached = await cache.match(request.url, { ignoreVary: true });
//       if (cached) return;
// 
//       const fullResponse = await fetch(createFullVideoRequest(request));
//       if (fullResponse.status === 200) {
//         await cache.put(request.url, fullResponse);
//       }
//     })
//     .catch(() => undefined)
//     .finally(() => {
//       inFlightVideoCaches.delete(request.url);
//     });
// 
//   inFlightVideoCaches.set(request.url, task);
//   return task;
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
  // CRITICAL FIX: Android WebView's `shouldInterceptRequest` DOES NOT reliably intercept
  // network requests made by a Service Worker. If we are running inside the RESPECT app (WebView),
  // we MUST bypass the Service Worker completely and let the page make the request directly.
  // This ensures `OkHttpWebViewClient` catches it and serves it from `UstadCache`.
  if (isWebView) {
    console.log("[Service Worker] WebView detected! Deferring all intercepts to native OkHttpWebViewClient.");
    return;
  }

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
    let videoRequest = event.request;
    if (isWebView) {
      // Rewrite to same-origin to force Android WebView shouldInterceptRequest interception
      const sameOriginUrl = event.request.url.replace(
        "https://d3sc34m1n26ele.cloudfront.net",
        self.location.origin,
      );
      videoRequest = new Request(sameOriginUrl, {
        method: event.request.method,
        headers: event.request.headers,
        mode: "same-origin",
        credentials: event.request.credentials,
      });
    }

    event.respondWith(videoResponse(videoRequest));
    // event.waitUntil(cacheFullVideo(videoRequest));
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
