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
      if (cached) return cached;

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
