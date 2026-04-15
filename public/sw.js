const VIDEO_CACHE = "flow-videos-v1";
const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Cache-first strategy: serve from cache if available, else fetch from network
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.hostname !== CLOUDFRONT_HOST) return;

  event.respondWith(
    caches.open(VIDEO_CACHE).then(async (cache) => {
      const cached = await cache.match(event.request.url);
      if (cached) return cached;

      try {
        return await fetch(event.request);
      } catch {
        return new Response("Video not available offline.", {
          status: 503,
          statusText: "Offline — video not cached",
        });
      }
    })
  );
});
