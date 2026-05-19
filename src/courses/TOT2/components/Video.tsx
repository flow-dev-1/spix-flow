import React, { useState, useEffect, useRef } from "react";

import "./video.css";

function VideoComponent({ videoSrc }) {
  const [percentageWatched, setPercentageWatched] = useState(3);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [hasOfflinePlaybackError, setHasOfflinePlaybackError] = useState(false);
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
    }

    function handleOffline() {
      setIsOnline(false);
    }

    setHasOfflinePlaybackError(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [videoSrc]);

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
        onCanPlay={() => setHasOfflinePlaybackError(false)}
        onError={(e) => {
          console.log(e, "This is error");
          if (!navigator.onLine) setHasOfflinePlaybackError(true);
        }}
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
