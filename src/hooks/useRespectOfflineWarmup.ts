import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

const ASSET_CACHE = "flow-assets-v2";
const VIDEO_CACHE = "flow-videos-v8";
const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";
const ASSET_TIMEOUT_MS = 12000;
const VIDEO_TIMEOUT_MS = 120000;
const ASSET_CONCURRENCY = 8;
const VIDEO_CONCURRENCY = 1;
const VIDEO_CACHE_DELAY_MS = 8000;
const COMPLETED_KEY_PREFIX = "spix-offline-warmup-complete-week-";

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

function normalizeWeek(week?: number | null) {
  if (week && week >= 1 && week <= 5) return week;
  return null;
}

function currentWeek(week?: number | null) {
  const normalizedWeek = normalizeWeek(week);
  if (normalizedWeek) return normalizedWeek;

  const currentUrlWeek = getCurrentWeekFromUrl();
  const weekFromUrl = normalizeWeek(currentUrlWeek);
  if (weekFromUrl) return weekFromUrl;

  return 1;
}

function manifestUrlForWeek(week?: number | null) {
  return "/opds/tot2-week" + currentWeek(week) + "-manifest.json";
}

function completedKeyForWeek(week?: number | null) {
  return COMPLETED_KEY_PREFIX + currentWeek(week);
}

function setCompletedWarmup(week: number, total: number) {
  try {
    localStorage.setItem(
      completedKeyForWeek(week),
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

function cacheRequestFor(url: URL, type?: string) {
  const isVideo = isVideoResource(url, type);

  return new Request(url.href, {
    cache: "force-cache",
    credentials: "omit",
    mode: url.origin === window.location.origin ? "same-origin" : isVideo ? "no-cors" : "cors",
  });
}

function cacheMatchOptionsFor(url: URL, type?: string) {
  return isVideoResource(url, type) ? { ignoreVary: true } : undefined;
}

async function isResourceCached(href: string, type?: string) {
  const resolved = resolveManifestHref(href);
  if (!resolved) return false;

  const url = new URL(resolved);
  const cache = await caches.open(cacheNameFor(url, type));
  return Boolean(await cache.match(resolved, cacheMatchOptionsFor(url, type)));
}

async function persistStorageIfPossible() {
  try {
    if (!navigator.storage?.persist) return;
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) await navigator.storage.persist();
  } catch {
    // Browsers can deny or omit persistent storage; caching can still continue.
  }
}

function visibleWeekLabel(week: number) {
  return week >= 1 && week <= 5 ? week : 1;
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

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function cacheResource(href: string, type?: string) {
  const resolved = resolveManifestHref(href);
  if (!resolved) return;

  const url = new URL(resolved);

  if (url.origin !== window.location.origin && url.hostname !== CLOUDFRONT_HOST) {
    return;
  }

  const cache = await caches.open(cacheNameFor(url, type));
  if (await cache.match(resolved, cacheMatchOptionsFor(url, type))) return;

  const timeoutMs = isVideoResource(url, type) ? VIDEO_TIMEOUT_MS : ASSET_TIMEOUT_MS;
  const response = await withTimeout(
    fetch(cacheRequestFor(url, type)),
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
  week?: number | null,
) {
  if (!("caches" in window) || !navigator.onLine) return;

  const weekNumber = currentWeek(week);
  await persistStorageIfPossible();

  setProgress({
    ...initialProgress,
    visible: true,
    phase: "loading-manifest",
  });

  const manifestUrl = manifestUrlForWeek(weekNumber);
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

  const missingAssetResources: ManifestLink[] = [];
  const missingVideoResources: ManifestLink[] = [];

  await runPool(assetResources, ASSET_CONCURRENCY, async (item) => {
    if (!(await isResourceCached(item.href as string, item.type))) {
      missingAssetResources.push(item);
    }
  });
  await runPool(videoResources, VIDEO_CONCURRENCY, async (item) => {
    if (!(await isResourceCached(item.href as string, item.type))) {
      missingVideoResources.push(item);
    }
  });

  let cached = 0;
  const failed: string[] = [];
  const total = assetResources.length + videoResources.length;
  const alreadyCached = total - missingAssetResources.length - missingVideoResources.length;
  cached = alreadyCached;

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
    completed: alreadyCached,
    cached: alreadyCached,
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

  await runPool(missingAssetResources, ASSET_CONCURRENCY, cacheItem);

  updateCounts({
    phase: "caching-videos",
    active: 0,
  });

  if (missingVideoResources.length > 0) {
    await delay(VIDEO_CACHE_DELAY_MS);
  }

  await runPool(missingVideoResources, VIDEO_CONCURRENCY, cacheItem);

  try {
    localStorage.setItem("spix-offline-warmup-failed", JSON.stringify(failed));
  } catch {
    // Ignore storage quota/private mode failures.
  }

  if (failed.length === 0) {
    setCompletedWarmup(weekNumber, total);
  } else {
    try {
      localStorage.removeItem(completedKeyForWeek(weekNumber));
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
    lastUrl: failed.length ? prev.lastUrl : "Week " + visibleWeekLabel(weekNumber) + " cached",
  }));
}

export function useSpixWeekCache(week?: number | null) {
  const [progress, setProgress] = useState<WarmupProgress>(initialProgress);
  const runIdRef = useRef(0);

  useEffect(() => {
    const weekNumber = currentWeek(week);
    runIdRef.current += 1;
    const runId = runIdRef.current;

    const run = () => {
      warmupFromManifest((nextProgress) => {
        if (runId !== runIdRef.current) return;
        setProgress(nextProgress);
      }, weekNumber).catch((error) => {
        if (runId !== runIdRef.current) return;
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
  }, [week]);

  return progress;
}

export const useRespectOfflineWarmup = useSpixWeekCache;
