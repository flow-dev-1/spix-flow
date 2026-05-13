import { useEffect } from "react";

const ASSET_CACHE = "flow-assets-v1";
const VIDEO_CACHE = "flow-videos-v1";
const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";

type ManifestLink = {
  href?: string;
  type?: string;
};

type WebPublicationManifest = {
  links?: ManifestLink[];
  images?: ManifestLink[];
  resources?: ManifestLink[];
};

function isRespectSession() {
  const params = new URLSearchParams(window.location.search);
  return (
    params.has("respectLaunchVersion") ||
    Boolean(sessionStorage.getItem("respect-launch-params"))
  );
}

function resolveManifestHref(href: string) {
  try {
    return new URL(href, window.location.origin + "/opds/tot2-manifest.json").href;
  } catch {
    return null;
  }
}

function cacheNameFor(url: URL, type?: string) {
  if (url.hostname === CLOUDFRONT_HOST || type?.startsWith("video/")) {
    return VIDEO_CACHE;
  }

  return ASSET_CACHE;
}

async function cacheResource(href: string, type?: string) {
  const resolved = resolveManifestHref(href);
  if (!resolved) return;

  const url = new URL(resolved);

  if (url.origin !== window.location.origin && url.hostname !== CLOUDFRONT_HOST) {
    return;
  }

  const cache = await caches.open(cacheNameFor(url, type));
  if (await cache.match(resolved)) return;

  const response = await fetch(resolved, {
    cache: "force-cache",
    mode: url.origin === window.location.origin ? "same-origin" : "cors",
  });

  if (response.ok || response.type === "opaque") {
    await cache.put(resolved, response.clone());
  }
}

function collectResources(manifest: WebPublicationManifest) {
  return [
    ...(manifest.links || []),
    ...(manifest.images || []),
    ...(manifest.resources || []),
  ].filter((item) => item.href);
}

async function warmupFromManifest() {
  if (!("caches" in window) || !navigator.onLine) return;

  const response = await fetch("/opds/tot2-manifest.json", { cache: "no-cache" });
  if (!response.ok) return;

  const manifest = (await response.json()) as WebPublicationManifest;
  const resources = collectResources(manifest);

  for (const item of resources) {
    try {
      await cacheResource(item.href as string, item.type);
    } catch {
      // Some resources may be blocked by CORS or unavailable. Keep warming the rest.
    }
  }
}

export function useRespectOfflineWarmup() {
  useEffect(() => {
    if (!isRespectSession()) return;

    const run = () => {
      warmupFromManifest().catch(() => {});
    };

    const timer = window.setTimeout(run, 1500);
    window.addEventListener("online", run);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", run);
    };
  }, []);
}
