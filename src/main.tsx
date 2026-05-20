import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("[SW] registered, scope:", reg.scope);

        // Log install / activate lifecycle
        const logState = (sw: ServiceWorker | null, label: string) => {
          if (!sw) return;
          sw.addEventListener("statechange", () => {
            console.log(`[SW] ${label} state → ${sw.state}`);
          });
        };
        logState(reg.installing, "installing");
        logState(reg.waiting, "waiting");
        logState(reg.active, "active");
      })
      .catch((err) => {
        console.error("[SW] registration FAILED:", err);
        // Store the error so Video debug panel can show it
        try {
          sessionStorage.setItem(
            "spix-sw-reg-error",
            err instanceof Error ? err.message : String(err),
          );
        } catch {
          // Ignore
        }
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
