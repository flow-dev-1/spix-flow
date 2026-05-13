import { useEffect } from "react";

function hasRespectLaunch() {
  const params = new URLSearchParams(window.location.search);
  return (
    params.has("respectLaunchVersion") ||
    Boolean(sessionStorage.getItem("respect-launch-params"))
  );
}

function shouldDebug() {
  const params = new URLSearchParams(window.location.search);
  return !navigator.onLine || hasRespectLaunch() || params.get("spixDebug") === "1";
}

async function getCacheNames() {
  if (!("caches" in window)) return "Cache API unavailable";

  try {
    const names = await caches.keys();
    return names.length ? names.join(", ") : "none";
  } catch (error) {
    return error instanceof Error ? error.message : "cache read failed";
  }
}

async function getServiceWorkerState() {
  if (!("serviceWorker" in navigator)) {
    return {
      supported: "no",
      controller: "none",
      active: "none",
    };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      supported: "yes",
      controller: navigator.serviceWorker.controller?.scriptURL || "none",
      active: registration?.active?.scriptURL || "none",
    };
  } catch (error) {
    return {
      supported: "yes",
      controller: "read failed",
      active: error instanceof Error ? error.message : "read failed",
    };
  }
}

export default function OfflineDebugAlerts() {
  useEffect(() => {
    let cancelled = false;

    const showReport = async (source: string) => {
      if (!shouldDebug() || cancelled) return;

      const sw = await getServiceWorkerState();
      const cacheNames = await getCacheNames();
      const root = document.getElementById("root");
      const params = new URLSearchParams(window.location.search);

      if (cancelled) return;

      window.setTimeout(() => {
        window.alert(
          "[SPIX offline debug]\n" +
            "Source: " + source + "\n" +
            "Online: " + navigator.onLine + "\n" +
            "RESPECT launch: " + hasRespectLaunch() + "\n" +
            "spixDebug: " + (params.get("spixDebug") || "off") + "\n" +
            "URL: " + window.location.href + "\n" +
            "Root children: " + (root?.childElementCount ?? 0) + "\n" +
            "SW supported: " + sw.supported + "\n" +
            "SW controller: " + sw.controller + "\n" +
            "SW active: " + sw.active + "\n" +
            "Caches: " + cacheNames,
        );
      }, 700);
    };

    const mountTimer = window.setTimeout(() => {
      showReport("React mounted");
    }, 1000);

    const handleOffline = () => showReport("offline event");
    const handleOnline = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("spixDebug") === "1") showReport("online event");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      cancelled = true;
      window.clearTimeout(mountTimer);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}
