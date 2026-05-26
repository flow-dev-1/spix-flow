import React, { useState, useEffect, useRef, useCallback } from "react";

import "./video.css";

function VideoComponent({ videoSrc }: { videoSrc: string }) {
  const [percentageWatched, setPercentageWatched] = useState(3);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [hasOfflinePlaybackError, setHasOfflinePlaybackError] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const [playbackErrorMessage, setPlaybackErrorMessage] = useState("");
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
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    videoRef.current?.load();
    function handleOnline() {
      setIsOnline(true);
      setHasOfflinePlaybackError(false);
      setPlaybackErrorMessage("");
    }

    function handleOffline() {
      setIsOnline(false);
    }

    setHasOfflinePlaybackError(false);
    setHasStartedPlayback(false);
    setPlaybackErrorMessage("");
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
      setPlaybackErrorMessage("");
    }
  }

  const handleVideoError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      const alreadyStarted =
        hasStartedPlayback ||
        video.currentTime > 1 ||
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;

      if (alreadyStarted) return;

      if (!navigator.onLine) {
        setHasOfflinePlaybackError(true);
        setPlaybackErrorMessage(
          "Go back online and open this week again so SPIX can download the course before you continue.",
        );
      } else {
        setPlaybackErrorMessage("We could not play this video. Please check your connection and try again.");
      }
    },
    [hasStartedPlayback],
  );

  if ((!isOnline && hasOfflinePlaybackError) || playbackErrorMessage) {
    return (
      <div className="resilience-video-offline-state">
        <div className="resilience-video-offline-state__content">
          <strong>{isOnline ? "Video unavailable" : "Video unavailable offline"}</strong>
          <span>{playbackErrorMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <video
        key={videoSrc}
        className="resilience-custom-video"
        ref={videoRef}
        controls
        controlsList="nodownload noremoteplayback"
        preload="metadata"
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
