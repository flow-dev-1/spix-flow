import React, { useState, useEffect, useRef } from "react";

import "./video.css";

function VideoComponent({ videoSrc }) {
  const [percentageWatched, setPercentageWatched] = useState(3);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [hasOfflinePlaybackError, setHasOfflinePlaybackError] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const [videoErrorDetails, setVideoErrorDetails] = useState("");
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
    function handleOnline() {
      setIsOnline(true);
      setHasOfflinePlaybackError(false);
      setVideoErrorDetails("");
    }

    function handleOffline() {
      setIsOnline(false);
    }

    setHasOfflinePlaybackError(false);
    setHasStartedPlayback(false);
    setVideoErrorDetails("");
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

  function describeVideoError(video: HTMLVideoElement) {
    const error = video.error;
    const errorNames: Record<number, string> = {
      1: "MEDIA_ERR_ABORTED",
      2: "MEDIA_ERR_NETWORK",
      3: "MEDIA_ERR_DECODE",
      4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
    };

    return [
      `code: ${error?.code ?? "none"} ${error?.code ? errorNames[error.code] || "" : ""}`,
      `message: ${error?.message || "none"}`,
      `online: ${navigator.onLine}`,
      `networkState: ${video.networkState}`,
      `readyState: ${video.readyState}`,
      `currentTime: ${Math.round(video.currentTime * 10) / 10}`,
      `duration: ${Number.isFinite(video.duration) ? Math.round(video.duration * 10) / 10 : "unknown"}`,
      `src: ${video.currentSrc || videoSrc}`,
    ].join("\n");
  }

  if (!isOnline && hasOfflinePlaybackError) {
    return (
      <div className="resilience-video-offline-state">
        <div className="resilience-video-offline-state__content">
          <strong>Video unavailable offline</strong>
          <span>Reconnect and open this video online to finish preparing it.</span>
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
        onCanPlay={() => {
          setHasOfflinePlaybackError(false);
          markPlaybackStarted();
        }}
        onPlaying={markPlaybackStarted}
        onTimeUpdate={markPlaybackStarted}
        onError={(e) => {
          console.log(e, "This is error");
          const video = e.currentTarget;
          setVideoErrorDetails(describeVideoError(video));
          const alreadyStarted =
            hasStartedPlayback ||
            video.currentTime > 1 ||
            video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;

          if (!navigator.onLine && !alreadyStarted) {
            setHasOfflinePlaybackError(true);
          }
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {videoErrorDetails && (
        <pre className="resilience-video-error-debug">{videoErrorDetails}</pre>
      )}
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
