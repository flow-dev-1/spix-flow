import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const DISABLE_SPIX_SERVICE_WORKER = true;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    if (DISABLE_SPIX_SERVICE_WORKER) {
      const unregisterServiceWorkers = navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        )
        .catch((err) => console.warn("SW unregister failed:", err));

      const clearFlowCaches =
        "caches" in window
          ? caches
              .keys()
              .then((keys) =>
                Promise.all(
                  keys
                    .filter((key) => key.startsWith("flow-"))
                    .map((key) => caches.delete(key)),
                ),
              )
              .catch(() => {})
          : Promise.resolve();

      Promise.all([unregisterServiceWorkers, clearFlowCaches]).finally(() => {
        if (!navigator.serviceWorker.controller) {
          sessionStorage.removeItem("spix-sw-cleanup-reloaded");
          return;
        }

        if (sessionStorage.getItem("spix-sw-cleanup-reloaded") === "1") return;

        sessionStorage.setItem("spix-sw-cleanup-reloaded", "1");
        window.location.reload();
      });

      return;
    }

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("SW registration failed:", err);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
