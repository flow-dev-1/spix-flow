import React, { useState, useEffect, useRef, useCallback } from "react";

import "./video.css";

const VIDEO_CACHE = "flow-videos-v6";

interface CacheDiagnostics {
  swStatus: string;
  swScriptURL: string;
  swRegError: string;
  cacheExists: boolean;
  videoInCache: boolean;
  cachedSize: string;
  allCacheNames: string[];
  videoCacheEntryCount: number;
  cachedUrls: string[];
  storageEstimate: string;
  swAutoRepair: string;
}

async function probeCacheDiagnostics(videoSrc: string): Promise<CacheDiagnostics> {
  const diag: CacheDiagnostics = {
    swStatus: "unknown",
    swScriptURL: "none",
    swRegError: "none",
    cacheExists: false,
    videoInCache: false,
    cachedSize: "n/a",
    allCacheNames: [],
    videoCacheEntryCount: 0,
    cachedUrls: [],
    storageEstimate: "n/a",
    swAutoRepair: "not attempted",
  };

  // Check for registration error stored by main.tsx
  try {
    const regErr = sessionStorage.getItem("spix-sw-reg-error");
    if (regErr) diag.swRegError = regErr;
  } catch {
    // Ignore
  }

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        const sw = reg.active || reg.waiting || reg.installing;
        diag.swStatus = sw ? sw.state : "no worker";
        diag.swScriptURL = sw?.scriptURL || reg.scope;
      } else {
        diag.swStatus = "no registration";

        // Auto-repair: try to re-register the SW
        try {
          const newReg = await navigator.serviceWorker.register("/sw.js");
          const sw = newReg.installing || newReg.waiting || newReg.active;
          diag.swAutoRepair = `re-registered (${sw?.state || "no worker"})`;
          diag.swStatus = `repaired → ${sw?.state || "pending"}`;
          diag.swScriptURL = sw?.scriptURL || newReg.scope;
        } catch (repairErr) {
          diag.swAutoRepair = `repair FAILED: ${repairErr instanceof Error ? repairErr.message : String(repairErr)}`;
        }
      }
    } else {
      diag.swStatus = "not supported";
    }
  } catch (err) {
    diag.swStatus = `error: ${err instanceof Error ? err.message : String(err)}`;
  }

  // Storage estimate
  try {
    if (navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      const usedMB = ((est.usage || 0) / 1024 / 1024).toFixed(1);
      const quotaMB = ((est.quota || 0) / 1024 / 1024).toFixed(0);
      const persisted = navigator.storage?.persisted ? await navigator.storage.persisted() : "unknown";
      diag.storageEstimate = `${usedMB} MB / ${quotaMB} MB (persisted: ${persisted})`;
    }
  } catch {
    // Ignore
  }

  try {
    if ("caches" in window) {
      diag.allCacheNames = await caches.keys();
      diag.cacheExists = diag.allCacheNames.includes(VIDEO_CACHE);

      if (diag.cacheExists) {
        const cache = await caches.open(VIDEO_CACHE);
        const keys = await cache.keys();
        diag.videoCacheEntryCount = keys.length;
        diag.cachedUrls = keys.map((r) => r.url);

        const match = await cache.match(videoSrc, { ignoreVary: true });
        if (match) {
          diag.videoInCache = true;
          try {
            const blob = await match.clone().blob();
            const mb = (blob.size / 1024 / 1024).toFixed(2);
            diag.cachedSize = `${mb} MB (${blob.size} bytes)`;
          } catch {
            diag.cachedSize = "blob unreadable";
          }
        }
      }
    }
  } catch {
    // Cache API unavailable
  }

  return diag;
}

function VideoComponent({ videoSrc }: { videoSrc: string }) {
  const [percentageWatched, setPercentageWatched] = useState(3);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [hasOfflinePlaybackError, setHasOfflinePlaybackError] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const [errorReport, setErrorReport] = useState("");
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reportRef = useRef<HTMLPreElement | null>(null);

  // Run a background cache check on mount / src change
  useEffect(() => {
    let cancelled = false;
    probeCacheDiagnostics(videoSrc).then((diag) => {
      if (cancelled) return;
      if (!diag.videoInCache) {
        const lines = buildDiagReport("⚠ VIDEO NOT IN CACHE (page load check)", videoSrc, null, diag);
        setErrorReport(lines);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    const intervalId = setInterval(() => {
      if (video) {
        const currentTime = video.currentTime;
        const duration = video.duration;
        const percentage = (currentTime / duration) * 100;
        setPercentageWatched(percentage);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setHasOfflinePlaybackError(false);
      setErrorReport("");
    }

    function handleOffline() {
      setIsOnline(false);
    }

    setHasOfflinePlaybackError(false);
    setHasStartedPlayback(false);
    setErrorReport("");
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [videoSrc]);

  function markPlaybackStarted() {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > 0 || video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setHasStartedPlayback(true);
      // Clear error on successful playback
      setErrorReport("");
    }
  }

  const handleVideoError = useCallback(
    async (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      const diag = await probeCacheDiagnostics(videoSrc);
      const report = buildDiagReport("VIDEO PLAYBACK ERROR", videoSrc, video, diag);
      setErrorReport(report);

      const alreadyStarted =
        hasStartedPlayback ||
        video.currentTime > 1 ||
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;

      if (!navigator.onLine && !alreadyStarted) {
        setHasOfflinePlaybackError(true);
      }
    },
    [videoSrc, hasStartedPlayback],
  );

  function handleCopy() {
    if (reportRef.current) {
      navigator.clipboard
        .writeText(reportRef.current.textContent || "")
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          const range = document.createRange();
          range.selectNodeContents(reportRef.current!);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        });
    }
  }

  const errorPanel = errorReport ? (
    <div className="resilience-video-error-panel">
      <div className="resilience-video-error-panel__header">
        <span>⚠ Video Debug Info</span>
        <button onClick={handleCopy} className="resilience-video-error-copy-btn">
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre ref={reportRef} className="resilience-video-error-panel__body">
        {errorReport}
      </pre>
    </div>
  ) : null;

  if (!isOnline && hasOfflinePlaybackError) {
    return (
      <div className="resilience-video-offline-state">
        <div className="resilience-video-offline-state__content">
          <strong>Video unavailable offline</strong>
          <span>Reconnect and open this video online to finish preparing it.</span>
        </div>
        {errorPanel}
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <video
        className="resilience-custom-video"
        ref={videoRef}
        controls
        controlsList="nodownload noremoteplayback"
        crossOrigin="anonymous"
        style={{ pointerEvents: "auto" }}
        onCanPlay={() => {
          setHasOfflinePlaybackError(false);
          markPlaybackStarted();
        }}
        onPlaying={markPlaybackStarted}
        onTimeUpdate={markPlaybackStarted}
        onError={handleVideoError}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {errorPanel}

      <div
        style={{
          width: `${percentageWatched}%`,
          height: "15px",
          backgroundColor: "#00BCC3",
          marginTop: "-6px",
        }}
      ></div>
    </div>
  );
}

function buildDiagReport(
  title: string,
  videoSrc: string,
  video: HTMLVideoElement | null,
  diag: CacheDiagnostics,
): string {
  const errorNames: Record<number, string> = {
    1: "MEDIA_ERR_ABORTED",
    2: "MEDIA_ERR_NETWORK",
    3: "MEDIA_ERR_DECODE",
    4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
  };

  const sections: string[] = [];

  sections.push(`━━━ ${title} ━━━`);
  sections.push(`time: ${new Date().toISOString()}`);
  sections.push(`userAgent: ${navigator.userAgent}`);

  if (video) {
    const error = video.error;
    sections.push("");
    sections.push("━━━ VIDEO STATE ━━━");
    sections.push(`code: ${error?.code ?? "none"} ${error?.code ? errorNames[error.code] || "" : ""}`);
    sections.push(`message: ${error?.message || "none"}`);
    sections.push(`online: ${navigator.onLine}`);
    sections.push(`networkState: ${video.networkState}`);
    sections.push(`readyState: ${video.readyState}`);
    sections.push(`currentTime: ${Math.round(video.currentTime * 10) / 10}`);
    sections.push(
      `duration: ${Number.isFinite(video.duration) ? Math.round(video.duration * 10) / 10 : "unknown"}`,
    );
    sections.push(`src: ${video.currentSrc || videoSrc}`);
    sections.push(`crossOrigin: ${video.crossOrigin ?? "not set"}`);
  } else {
    sections.push(`src: ${videoSrc}`);
    sections.push(`online: ${navigator.onLine}`);
  }

  sections.push("");
  sections.push("━━━ SERVICE WORKER ━━━");
  sections.push(`status: ${diag.swStatus}`);
  sections.push(`script: ${diag.swScriptURL}`);
  sections.push(`regError: ${diag.swRegError}`);
  sections.push(`autoRepair: ${diag.swAutoRepair}`);

  sections.push("");
  sections.push("━━━ CACHE STATUS ━━━");
  sections.push(`cache "${VIDEO_CACHE}": ${diag.cacheExists ? "exists" : "MISSING"}`);
  sections.push(`video in cache: ${diag.videoInCache ? `YES (${diag.cachedSize})` : "NO ❌"}`);
  sections.push(`entries in cache: ${diag.videoCacheEntryCount}`);
  sections.push(`all caches: ${diag.allCacheNames.join(", ") || "none"}`);
  sections.push(`storage: ${diag.storageEstimate}`);

  sections.push("");
  sections.push("━━━ CACHED URLs ━━━");
  if (diag.cachedUrls.length > 0) {
    diag.cachedUrls.forEach((u, i) => sections.push(`${i + 1}. ${u}`));
  } else {
    sections.push("(empty)");
  }

  return sections.join("\n");
}

export default VideoComponent;
