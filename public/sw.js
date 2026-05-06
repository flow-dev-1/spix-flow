const VIDEO_CACHE = "flow-videos-v1";
const ASSET_CACHE = "flow-assets-v1";
const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";
const CACHEABLE_ASSET_EXTENSIONS = [
  ".avif",
  ".gif",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".webp",
];

async function buildRangeResponse(request, cachedResponse) {
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader || !cachedResponse) return cachedResponse;

  const blob = await cachedResponse.blob();
  const size = blob.size;
  const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
  if (!match) return cachedResponse;

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : size - 1;
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

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Cache-first strategy: serve from cache if available, else fetch from network
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isCloudfrontVideo = url.hostname === CLOUDFRONT_HOST;
  const isSameOriginAsset =
    url.origin === self.location.origin &&
    CACHEABLE_ASSET_EXTENSIONS.some((extension) =>
      url.pathname.toLowerCase().endsWith(extension)
    );

  if (!isCloudfrontVideo && !isSameOriginAsset) return;

  event.respondWith(
    caches.open(isCloudfrontVideo ? VIDEO_CACHE : ASSET_CACHE).then(async (cache) => {
      const cached = await cache.match(event.request.url);
      if (cached) {
        return isCloudfrontVideo
          ? buildRangeResponse(event.request, cached)
          : cached;
      }

      try {
        const response = await fetch(event.request);
        if (response.ok || response.type === "opaque") {
          cache.put(event.request.url, response.clone());
        }
        return response;
      } catch {
        return new Response("Resource not available offline.", {
          status: 503,
          statusText: "Offline - resource not cached",
        });
      }
    })
  );
});
