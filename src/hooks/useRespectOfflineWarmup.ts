import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const ASSET_CACHE = "flow-assets-v1";
const VIDEO_CACHE = "flow-videos-v3";
const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";
const ASSET_TIMEOUT_MS = 12000;
const VIDEO_TIMEOUT_MS = 25000;
const ASSET_CONCURRENCY = 8;
const VIDEO_CONCURRENCY = 3;
const COMPLETED_KEY_PREFIX = "spix-offline-warmup-complete-week-";
const RESPECT_WARMUP_ENABLED = false;

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

function getCurrentWeekFromUrl() {
  const pathMatch = window.location.pathname.match(
    /\/tot2\/week(\d+)(?:\/index\.html)?\/?$/i,
  );
  if (pathMatch) return Number(pathMatch[1]);

  const params = new URLSearchParams(window.location.search);
  const startWeek = Number(params.get("startWeek"));
  if (startWeek >= 1 && startWeek <= 5) return startWeek;

  const savedWeek = Number(sessionStorage.getItem("flow-currentWeek"));
  if (savedWeek >= 1 && savedWeek <= 5) return savedWeek;

  return 1;
}

function currentWeek() {
  const week = getCurrentWeekFromUrl();
  return week >= 1 && week <= 5 ? week : 1;
}

function manifestUrlForCurrentWeek() {
  return "/opds/tot2-week" + currentWeek() + "-manifest.json";
}

function completedKeyForCurrentWeek() {
  return COMPLETED_KEY_PREFIX + currentWeek();
}

function getCompletedWarmup() {
  try {
    const raw = localStorage.getItem(completedKeyForCurrentWeek());
    return raw ? (JSON.parse(raw) as { total?: number; completedAt?: string }) : null;
  } catch {
    return null;
  }
}

function setCompletedWarmup(total: number) {
  try {
    localStorage.setItem(
      completedKeyForCurrentWeek(),
      JSON.stringify({
        total,
        completedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Ignore storage quota/private mode failures.
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

  const completedWarmup = getCompletedWarmup();
  if (completedWarmup?.total) {
    setProgress({
      ...initialProgress,
      visible: true,
      phase: "done",
      total: completedWarmup.total,
      completed: completedWarmup.total,
      cached: completedWarmup.total,
      lastUrl: "Week " + currentWeek() + " already cached",
    });
    return;
  }

  setProgress({
    ...initialProgress,
    visible: true,
    phase: "loading-manifest",
  });

  const manifestUrl = manifestUrlForCurrentWeek();
  const response = await fetch(manifestUrl, { cache: "no-cache" });
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

  if (failed.length === 0) {
    setCompletedWarmup(total);
  } else {
    try {
      localStorage.removeItem(completedKeyForCurrentWeek());
    } catch {
      // Ignore storage quota/private mode failures.
    }
  }

  setProgress((prev) => ({
    ...prev,
    phase: "done",
    active: 0,
    cached,
    failed: failed.length,
  }));
}

export function useRespectOfflineWarmup() {
  const [progress, setProgress] = useState<WarmupProgress>(initialProgress);

  useEffect(() => {
    if (!RESPECT_WARMUP_ENABLED) return;
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
