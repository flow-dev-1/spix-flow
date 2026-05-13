import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const ASSET_CACHE = "flow-assets-v1";
const VIDEO_CACHE = "flow-videos-v1";
const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";
const ASSET_TIMEOUT_MS = 12000;
const VIDEO_TIMEOUT_MS = 25000;
const ASSET_CONCURRENCY = 8;
const VIDEO_CONCURRENCY = 3;

type ManifestLink = {
  href?: string;
  type?: string;
};

type WebPublicationManifest = {
  links?: ManifestLink[];
  images?: ManifestLink[];
  resources?: ManifestLink[];
};

export type WarmupProgress = {
  visible: boolean;
  phase: "idle" | "loading-manifest" | "caching-assets" | "caching-videos" | "done" | "error";
  total: number;
  completed: number;
  cached: number;
  failed: number;
  active: number;
  assets: number;
  videos: number;
  lastUrl: string;
  error?: string;
};

const initialProgress: WarmupProgress = {
  visible: false,
  phase: "idle",
  total: 0,
  completed: 0,
  cached: 0,
  failed: 0,
  active: 0,
  assets: 0,
  videos: 0,
  lastUrl: "",
};

function debugAlert(message: string) {
  const params = new URLSearchParams(window.location.search);
  if (!isRespectSession() && params.get("spixDebug") !== "1") return;

  window.setTimeout(() => {
    window.alert(message);
  }, 250);
}

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

function isVideoResource(url: URL, type?: string) {
  return url.hostname === CLOUDFRONT_HOST || type?.startsWith("video/");
}

function uniqueResources(resources: ManifestLink[]) {
  const seen = new Set<string>();

  return resources.filter((item) => {
    if (!item.href) return false;

    const resolved = resolveManifestHref(item.href);
    if (!resolved || seen.has(resolved)) return false;

    seen.add(resolved);
    return true;
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, href: string) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("Timed out after " + Math.round(timeoutMs / 1000) + "s: " + href));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timeoutId));
  });
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

  const timeoutMs = isVideoResource(url, type) ? VIDEO_TIMEOUT_MS : ASSET_TIMEOUT_MS;
  const response = await withTimeout(
    fetch(resolved, {
      cache: "force-cache",
      mode: url.origin === window.location.origin ? "same-origin" : "cors",
    }),
    timeoutMs,
    resolved,
  );

  if (response.ok || response.type === "opaque") {
    await cache.put(resolved, response.clone());
  }
}

async function runPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
) {
  let index = 0;

  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      await worker(current);
    }
  });

  await Promise.all(runners);
}

function collectResources(manifest: WebPublicationManifest) {
  return [
    ...(manifest.links || []),
    ...(manifest.images || []),
    ...(manifest.resources || []),
  ].filter((item) => item.href);
}

async function warmupFromManifest(
  setProgress: Dispatch<SetStateAction<WarmupProgress>>,
) {
  if (!("caches" in window) || !navigator.onLine) return;

  setProgress({
    ...initialProgress,
    visible: true,
    phase: "loading-manifest",
  });

  const response = await fetch("/opds/tot2-manifest.json", { cache: "no-cache" });
  if (!response.ok) return;

  const manifest = (await response.json()) as WebPublicationManifest;
  const resources = uniqueResources(collectResources(manifest));
  const assetResources = resources.filter((item) => {
    const resolved = resolveManifestHref(item.href as string);
    return resolved ? !isVideoResource(new URL(resolved), item.type) : false;
  });
  const videoResources = resources.filter((item) => {
    const resolved = resolveManifestHref(item.href as string);
    return resolved ? isVideoResource(new URL(resolved), item.type) : false;
  });
  let cached = 0;
  const failed: string[] = [];
  const total = assetResources.length + videoResources.length;

  const updateCounts = (
    patch: Partial<WarmupProgress>,
    item?: ManifestLink,
  ) => {
    setProgress((prev) => ({
      ...prev,
      ...patch,
      lastUrl: item?.href || prev.lastUrl,
    }));
  };

  debugAlert(
    "[SPIX offline warmup]\n" +
      "Started caching manifest resources.\n" +
      "Assets: " + assetResources.length + "\n" +
      "Videos: " + videoResources.length + "\n" +
      "Each video is limited to " + Math.round(VIDEO_TIMEOUT_MS / 1000) + "s.",
  );

  setProgress({
    visible: true,
    phase: "caching-assets",
    total,
    completed: 0,
    cached: 0,
    failed: 0,
    active: 0,
    assets: assetResources.length,
    videos: videoResources.length,
    lastUrl: "",
  });

  const cacheItem = async (item: ManifestLink) => {
    setProgress((prev) => ({
      ...prev,
      active: prev.active + 1,
      lastUrl: item.href || prev.lastUrl,
    }));

    try {
      await cacheResource(item.href as string, item.type);
      cached += 1;
      setProgress((prev) => ({
        ...prev,
        completed: prev.completed + 1,
        cached,
        active: Math.max(prev.active - 1, 0),
        lastUrl: item.href || prev.lastUrl,
      }));
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error";
      failed.push((item.href as string) + " -> " + reason);
      setProgress((prev) => ({
        ...prev,
        completed: prev.completed + 1,
        failed: failed.length,
        active: Math.max(prev.active - 1, 0),
        lastUrl: item.href || prev.lastUrl,
      }));
    }
  };

  await runPool(assetResources, ASSET_CONCURRENCY, cacheItem);

  updateCounts({
    phase: "caching-videos",
    active: 0,
  });

  await runPool(videoResources, VIDEO_CONCURRENCY, cacheItem);

  try {
    localStorage.setItem("spix-offline-warmup-failed", JSON.stringify(failed));
  } catch {
    // Ignore storage quota/private mode failures.
  }

  const failedPreview = failed.slice(0, 8).join("\n");
  const remainingFailed = Math.max(failed.length - 8, 0);

  setProgress((prev) => ({
    ...prev,
    phase: "done",
    active: 0,
    cached,
    failed: failed.length,
  }));

  debugAlert(
    "[SPIX offline warmup]\n" +
      "Finished caching manifest resources.\n" +
      "Cached/skipped: " + cached + "\n" +
      "Failed: " + failed.length + "\n" +
      (failedPreview ? "\nFailed URLs:\n" + failedPreview + "\n" : "\n") +
      (remainingFailed ? "...and " + remainingFailed + " more.\n" : "") +
      "Full list saved in localStorage: spix-offline-warmup-failed",
  );
}

export function useRespectOfflineWarmup() {
  const [progress, setProgress] = useState<WarmupProgress>(initialProgress);

  useEffect(() => {
    if (!isRespectSession()) return;

    const run = () => {
      warmupFromManifest(setProgress).catch((error) => {
        setProgress((prev) => ({
          ...prev,
          visible: true,
          phase: "error",
          active: 0,
          error: error instanceof Error ? error.message : "Warmup failed",
        }));
      });
    };

    const timer = window.setTimeout(run, 1500);
    window.addEventListener("online", run);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", run);
    };
  }, []);

  return progress;
}
