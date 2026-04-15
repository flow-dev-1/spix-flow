import { useState, useCallback, useEffect } from "react";
import { getWeekVideoUrls } from "../utils/videoUtils";

export type DownloadState = "idle" | "downloading" | "done" | "error";

export interface DownloadProgress {
  state: DownloadState;
  current: number;
  total: number;
  error?: string;
}

const VIDEO_CACHE = "flow-videos-v1";

/** Open the shared video cache directly from the main thread */
async function openCache() {
  return caches.open(VIDEO_CACHE);
}

/**
 * Caches each video for a given week sequentially using the Cache API directly.
 * The Service Worker intercepts CloudFront requests and serves from this cache when offline.
 */
export function useVideoDownload() {
  const [progress, setProgress] = useState<Record<number, DownloadProgress>>({});

  // On mount, check which weeks are already fully cached and restore their "done" state
  useEffect(() => {
    const restore = async () => {
      if (!("caches" in window)) return;
      const cache = await openCache();
      const keys = await cache.keys();
      const cachedUrls = keys.map((r) => r.url);

      for (let week = 1; week <= 5; week++) {
        const urls = getWeekVideoUrls(week);
        if (!urls.length) continue;
        if (urls.every((u) => cachedUrls.includes(u))) {
          setProgress((prev) => ({
            ...prev,
            [week]: { state: "done", current: urls.length, total: urls.length },
          }));
        }
      }
    };
    restore();
  }, []);

  const downloadWeek = useCallback(async (weekNumber: number) => {
    if (!("caches" in window)) {
      alert("Your browser does not support offline caching.");
      return;
    }

    const urls = getWeekVideoUrls(weekNumber);
    if (!urls.length) return;

    // Request persistent storage so the browser never evicts the cached videos
    if (navigator.storage?.persist) {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) await navigator.storage.persist();
    }

    setProgress((prev) => ({
      ...prev,
      [weekNumber]: { state: "downloading", current: 0, total: urls.length },
    }));

    const cache = await openCache();

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        // Skip if already cached
        const existing = await cache.match(url);
        if (!existing) {
          const response = await fetch(url, { mode: "cors" });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          await cache.put(url, response);
        }

        setProgress((prev) => ({
          ...prev,
          [weekNumber]: {
            state: i === urls.length - 1 ? "done" : "downloading",
            current: i + 1,
            total: urls.length,
          },
        }));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed";
        setProgress((prev) => ({
          ...prev,
          [weekNumber]: {
            state: "error",
            current: i,
            total: urls.length,
            error: message,
          },
        }));
        return;
      }
    }
  }, []);

  const removeWeek = useCallback(async (weekNumber: number) => {
    if (!("caches" in window)) return;
    const urls = getWeekVideoUrls(weekNumber);
    const cache = await openCache();
    await Promise.all(urls.map((u) => cache.delete(u)));
    setProgress((prev) => {
      const next = { ...prev };
      delete next[weekNumber];
      return next;
    });
  }, []);

  return { progress, downloadWeek, removeWeek };
}
