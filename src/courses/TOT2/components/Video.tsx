import React, { useState, useEffect, useRef } from "react";

import "./video.css";

const VIDEO_CACHE = "flow-videos-v3";

async function hasCachedVideo(videoSrc: string) {
  if (!("caches" in window)) return false;

  try {
    const cache = await caches.open(VIDEO_CACHE);
    const cached = await cache.match(videoSrc, { ignoreVary: true });
    return Boolean(cached);
  } catch {
    return false;
  }
}

function VideoComponent({ videoSrc }) {
  const [percentageWatched, setPercentageWatched] = useState(3);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [isVideoCached, setIsVideoCached] = useState(false);
  const [cacheChecked, setCacheChecked] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const intervalId = setInterval(() => {
      if (video) {
        const currentTime = video.currentTime;
        const duration = video.duration;
        const percentage = (currentTime / duration) * 100;
        setPercentageWatched(percentage);
      }
    }, 1000); // update every 1 second

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function checkVideoCache() {
      setCacheChecked(false);
      const cached = await hasCachedVideo(videoSrc);
      if (!isMounted) return;
      setIsVideoCached(cached);
      setCacheChecked(true);
    }

    function handleOnline() {
      setIsOnline(true);
      checkVideoCache();
    }

    function handleOffline() {
      setIsOnline(false);
      checkVideoCache();
    }

    checkVideoCache();
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [videoSrc]);

  const shouldBlockOfflinePlayback = !isOnline && cacheChecked && !isVideoCached;
  const isCheckingOfflineReadiness = !isOnline && !cacheChecked;

  if (shouldBlockOfflinePlayback || isCheckingOfflineReadiness) {
    return (
      <div className="resilience-video-offline-state">
        <div className="resilience-video-offline-state__content">
          {isCheckingOfflineReadiness && (
            <span className="resilience-video-offline-state__loader" />
          )}
          <strong>
            {isCheckingOfflineReadiness
              ? "Checking saved video"
              : "Video not ready offline"}
          </strong>
          <span>
            {isCheckingOfflineReadiness
              ? "Please wait a moment."
              : "Reconnect and open this video online to finish preparing it."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative",}}>
      <video
        className="resilience-custom-video"
        ref={videoRef}
        controls
        controlsList="nodownload noremoteplayback"
        style={{ pointerEvents: "auto" }}
        onCanPlay={() => null}
        onError={(e) => console.log(e,"This is error")}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* <Icon
        // onClick={()=> videoRef.current.play()}
        icon="mdi:play-circle-outline"
        color="skyblue"
        width={40}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      /> */}

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
