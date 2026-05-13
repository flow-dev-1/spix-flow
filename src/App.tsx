import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";
import TOT2Course from "./courses/TOT2/index";
import TOT2Feedback from "./courses/TOT2/feedback/index";
import ServiceWorkerSignalPanel from "./components/ServiceWorkerSignalPanel";
import XapiDebugPanel from "./components/XapiDebugPanel";
import {
  useRespectOfflineWarmup,
  type WarmupProgress,
} from "./hooks/useRespectOfflineWarmup";

const queryClient = new QueryClient();

function OfflineWarmupPanel({ progress }: { progress: WarmupProgress }) {
  if (!progress.visible) return null;

  const percent = progress.total
    ? Math.round((progress.completed / progress.total) * 100)
    : 0;

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 99999,
        background: "rgba(6, 21, 44, 0.94)",
        color: "#fff",
        borderRadius: 8,
        padding: "10px 12px",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <strong>SPIX offline cache</strong>
        <span>{progress.phase}</span>
      </div>
      <div
        style={{
          height: 6,
          background: "rgba(255,255,255,0.25)",
          borderRadius: 999,
          overflow: "hidden",
          margin: "8px 0",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: "#00BCC3",
            transition: "width 0.2s ease",
          }}
        />
      </div>
      <div>
        {progress.completed}/{progress.total} ({percent}%) | cached {progress.cached} |
        failed {progress.failed} | active {progress.active}
      </div>
      <div>
        assets {progress.assets} | videos {progress.videos}
      </div>
      {progress.lastUrl && (
        <div
          style={{
            marginTop: 4,
            opacity: 0.85,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {progress.lastUrl}
        </div>
      )}
      {progress.error && <div style={{ color: "#ffb4b4" }}>{progress.error}</div>}
    </div>
  );
}

const App = () => {
  const warmupProgress = useRespectOfflineWarmup();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ServiceWorkerSignalPanel />
            <XapiDebugPanel />
            <OfflineWarmupPanel progress={warmupProgress} />
            <Toaster />
            <Sonner />
            <ToastContainer position="top-right" autoClose={5000} />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/tot2" element={<TOT2Course />} />
                <Route path="/tot2/" element={<TOT2Course />} />
                <Route path="/tot2/*" element={<TOT2Course />} />
                <Route path="/tot2/feedback" element={<TOT2Feedback />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
