import React, { useState, useEffect, useRef, useCallback } from "react";

import "./video.css";

const VIDEO_CACHE = "flow-videos-v6";

interface CacheDiagnostics {
  swStatus: string;
  swScriptURL: string;
  cacheExists: boolean;
  videoInCache: boolean;
  cachedSize: string;
  allCacheNames: string[];
  videoCacheEntryCount: number;
  cachedUrls: string[];
}

async function probeCacheDiagnostics(videoSrc: string): Promise<CacheDiagnostics> {
  const diag: CacheDiagnostics = {
    swStatus: "unknown",
    swScriptURL: "none",
    cacheExists: false,
    videoInCache: false,
    cachedSize: "n/a",
    allCacheNames: [],
    videoCacheEntryCount: 0,
    cachedUrls: [],
  };

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        const sw = reg.active || reg.waiting || reg.installing;
        diag.swStatus = sw ? sw.state : "no worker";
        diag.swScriptURL = sw?.scriptURL || reg.scope;
      } else {
        diag.swStatus = "no registration";
      }
    } else {
      diag.swStatus = "not supported";
    }
  } catch {
    diag.swStatus = "error checking";
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

        // Check for exact match
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reportRef = useRef<HTMLPreElement | null>(null);

  // Run a background cache check on mount / src change to surface issues early
  useEffect(() => {
    let cancelled = false;
    probeCacheDiagnostics(videoSrc).then((diag) => {
      if (cancelled) return;
      if (!diag.videoInCache) {
        const lines = [
          "⚠ Video NOT found in cache on page load",
          `src: ${videoSrc}`,
          `online: ${navigator.onLine}`,
          `sw: ${diag.swStatus} (${diag.swScriptURL})`,
          `cache "${VIDEO_CACHE}": ${diag.cacheExists ? "exists" : "MISSING"}`,
          `entries in cache: ${diag.videoCacheEntryCount}`,
          `all caches: ${diag.allCacheNames.join(", ") || "none"}`,
          "",
          "Cached URLs:",
          ...(diag.cachedUrls.length > 0
            ? diag.cachedUrls.map((u, i) => `  ${i + 1}. ${u}`)
            : ["  (empty)"]),
        ];
        setErrorReport(lines.join("\n"));
      }
    });
    return () => { cancelled = true; };
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
    }
  }

  const handleVideoError = useCallback(
    async (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      const error = video.error;
      const errorNames: Record<number, string> = {
        1: "MEDIA_ERR_ABORTED",
        2: "MEDIA_ERR_NETWORK",
        3: "MEDIA_ERR_DECODE",
        4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
      };

      const diag = await probeCacheDiagnostics(videoSrc);

      const lines = [
        "━━━ VIDEO ERROR ━━━",
        `time: ${new Date().toISOString()}`,
        `code: ${error?.code ?? "none"} ${error?.code ? errorNames[error.code] || "" : ""}`,
        `message: ${error?.message || "none"}`,
        "",
        "━━━ VIDEO STATE ━━━",
        `online: ${navigator.onLine}`,
        `networkState: ${video.networkState}`,
        `readyState: ${video.readyState}`,
        `currentTime: ${Math.round(video.currentTime * 10) / 10}`,
        `duration: ${Number.isFinite(video.duration) ? Math.round(video.duration * 10) / 10 : "unknown"}`,
        `src: ${video.currentSrc || videoSrc}`,
        `crossOrigin: ${video.crossOrigin ?? "not set"}`,
        "",
        "━━━ SERVICE WORKER ━━━",
        `status: ${diag.swStatus}`,
        `script: ${diag.swScriptURL}`,
        "",
        "━━━ CACHE STATUS ━━━",
        `cache "${VIDEO_CACHE}": ${diag.cacheExists ? "exists" : "MISSING"}`,
        `video in cache: ${diag.videoInCache ? `YES (${diag.cachedSize})` : "NO ❌"}`,
        `entries in cache: ${diag.videoCacheEntryCount}`,
        `all caches: ${diag.allCacheNames.join(", ") || "none"}`,
        "",
        "━━━ CACHED URLs ━━━",
        ...(diag.cachedUrls.length > 0
          ? diag.cachedUrls.map((u, i) => `${i + 1}. ${u}`)
          : ["(empty)"]),
      ];

      setErrorReport(lines.join("\n"));

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
        .catch(() => {
          // Fallback: select the text
          const range = document.createRange();
          range.selectNodeContents(reportRef.current!);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        });
    }
  }

  if (!isOnline && hasOfflinePlaybackError) {
    return (
      <div className="resilience-video-offline-state">
        <div className="resilience-video-offline-state__content">
          <strong>Video unavailable offline</strong>
          <span>Reconnect and open this video online to finish preparing it.</span>
        </div>
        {errorReport && (
          <div className="resilience-video-error-panel">
            <div className="resilience-video-error-panel__header">
              <span>Debug Info</span>
              <button onClick={handleCopy} className="resilience-video-error-copy-btn">
                Copy
              </button>
            </div>
            <pre ref={reportRef} className="resilience-video-error-panel__body">
              {errorReport}
            </pre>
          </div>
        )}
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

      {errorReport && (
        <div className="resilience-video-error-panel">
          <div className="resilience-video-error-panel__header">
            <span>⚠ Video Debug Info</span>
            <button onClick={handleCopy} className="resilience-video-error-copy-btn">
              Copy
            </button>
          </div>
          <pre ref={reportRef} className="resilience-video-error-panel__body">
            {errorReport}
          </pre>
        </div>
      )}

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

export default VideoComponent;
