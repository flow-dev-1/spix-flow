import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Service worker registration is paused while testing RESPECT download-only caching.
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .catch((err) => console.warn("SW registration failed:", err));
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);
