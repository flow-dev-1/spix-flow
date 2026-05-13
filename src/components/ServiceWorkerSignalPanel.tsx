import { useEffect, useState } from "react";

const CLOUDFRONT_HOST = "d3sc34m1n26ele.cloudfront.net";

type ManifestLink = {
  href?: string;
  type?: string;
};

type WebPublicationManifest = {
  links?: ManifestLink[];
  images?: ManifestLink[];
  resources?: ManifestLink[];
};

type ServiceWorkerSignalState = {
  visible: boolean;
  week: number;
  supported: boolean;
  controller: boolean;
  active: boolean;
  total: number;
  initialCached: number;
  currentCached: number;
  cacheNames: string;
  status: "checking" | "ready-before-open" | "warming-now" | "empty-before-warmup" | "partial" | "error";
  error?: string;
};

const initialState: ServiceWorkerSignalState = {
  visible: false,
  week: 1,
  supported: "serviceWorker" in navigator,
  controller: false,
  active: false,
  total: 0,
  initialCached: 0,
  currentCached: 0,
  cacheNames: "",
  status: "checking",
};

function isRespectSession() {
  const params = new URLSearchParams(window.location.search);
  return (
    params.has("respectLaunchVersion") ||
    Boolean(sessionStorage.getItem("respect-launch-params"))
  );
}

function shouldShowPanel() {
  const params = new URLSearchParams(window.location.search);
  return isRespectSession() || params.get("spixDebug") === "1";
}

function currentWeek() {
  const pathMatch = window.location.pathname.match(
    /\/tot2\/week(\d+)(?:\/index\.html)?\/?$/i,
  );
  if (pathMatch) return Number(pathMatch[1]);

  const params = new URLSearchParams(window.location.search);
  const startWeek = Number(params.get("startWeek"));
  if (startWeek >= 1 && startWeek <= 5) return startWeek;

  const savedWeek = Number(sessionStorage.getItem("flow-currentWeek"));
  if (savedWeek >= 1 && savedWeek <= 5) return savedWeek;

  return 1;
}

function manifestUrlForWeek(week: number) {
  return `/opds/tot2-week${week}-manifest.json`;
}

function collectResources(manifest: WebPublicationManifest) {
  return [
    ...(manifest.links || []),
    ...(manifest.images || []),
    ...(manifest.resources || []),
  ].filter((item) => item.href);
}

function resolveManifestHref(href: string, manifestUrl: string) {
  try {
    return new URL(href, window.location.origin + manifestUrl).href;
  } catch {
    return null;
  }
}

function uniqueCacheableResources(manifest: WebPublicationManifest, manifestUrl: string) {
  const seen = new Set<string>();

  return collectResources(manifest)
    .map((item) => (item.href ? resolveManifestHref(item.href, manifestUrl) : null))
    .filter((href): href is string => {
      if (!href || seen.has(href)) return false;

      const url = new URL(href);
      const isCacheable =
        url.origin === window.location.origin || url.hostname === CLOUDFRONT_HOST;
      if (!isCacheable) return false;

      seen.add(href);
      return true;
    });
}

async function getServiceWorkerState() {
  if (!("serviceWorker" in navigator)) {
    return {
      supported: false,
      controller: false,
      active: false,
    };
  }

  const registration = await navigator.serviceWorker.getRegistration();
  return {
    supported: true,
    controller: Boolean(navigator.serviceWorker.controller),
    active: Boolean(registration?.active),
  };
}

async function countCachedResources(urls: string[]) {
  if (!("caches" in window)) return { cached: 0, cacheNames: "" };

  const cacheNames = await caches.keys();
  let cached = 0;

  await Promise.all(
    urls.map(async (url) => {
      const match = await caches.match(url, { ignoreVary: true });
      if (match) cached += 1;
    }),
  );

  return {
    cached,
    cacheNames: cacheNames.join(", "),
  };
}

function statusFromCounts(initialCached: number, currentCached: number, total: number) {
  if (total > 0 && initialCached >= total) return "ready-before-open" as const;
  if (currentCached > initialCached) return "warming-now" as const;
  if (initialCached === 0) return "empty-before-warmup" as const;
  return "partial" as const;
}

export default function ServiceWorkerSignalPanel() {
  const [state, setState] = useState<ServiceWorkerSignalState>(() => ({
    ...initialState,
    visible: shouldShowPanel(),
    week: currentWeek(),
  }));

  useEffect(() => {
    if (!state.visible) return;

    let cancelled = false;
    let resourceUrls: string[] = [];
    let initialCached = 0;

    async function snapshot(isInitial: boolean) {
      const sw = await getServiceWorkerState();
      const counts = await countCachedResources(resourceUrls);

      if (cancelled) return;
      if (isInitial) initialCached = counts.cached;

      const currentCached = counts.cached;
      setState((prev) => ({
        ...prev,
        ...sw,
        total: resourceUrls.length,
        initialCached,
        currentCached,
        cacheNames: counts.cacheNames || "none",
        status: statusFromCounts(initialCached, currentCached, resourceUrls.length),
      }));
    }

    async function run() {
      try {
        const week = currentWeek();
        const manifestUrl = manifestUrlForWeek(week);
        const response = await fetch(manifestUrl, { cache: "no-cache" });
        if (!response.ok) throw new Error(`Manifest ${response.status}`);

        const manifest = (await response.json()) as WebPublicationManifest;
        resourceUrls = uniqueCacheableResources(manifest, manifestUrl);

        if (cancelled) return;

        setState((prev) => ({
          ...prev,
          week,
          total: resourceUrls.length,
        }));

        await snapshot(true);
      } catch (error) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          status: "error",
          error: error instanceof Error ? error.message : "SW signal failed",
        }));
      }
    }

    run();
    const interval = window.setInterval(() => {
      if (resourceUrls.length) snapshot(false);
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [state.visible]);

  if (!state.visible) return null;

  const statusColor =
    state.status === "ready-before-open"
      ? "#7CFFB2"
      : state.status === "warming-now"
        ? "#ffe59a"
        : state.status === "error"
          ? "#ffb4b4"
          : "#d1d5db";

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 260,
        zIndex: 99997,
        background: "rgba(20, 33, 61, 0.94)",
        color: "#fff",
        borderRadius: 8,
        padding: "10px 12px",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <strong>SPIX service worker</strong>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: statusColor }}>{state.status}</span>
          <button
            type="button"
            onClick={() => setState((prev) => ({ ...prev, visible: false }))}
            style={{
              border: 0,
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
            }}
            aria-label="Close service worker signal"
          >
            x
          </button>
        </span>
      </div>
      <div style={{ marginTop: 6 }}>
        week {state.week} | SW {state.supported ? "yes" : "no"} | active{" "}
        {state.active ? "yes" : "no"} | controlled {state.controller ? "yes" : "no"}
      </div>
      <div style={{ marginTop: 4 }}>
        before warmup {state.initialCached}/{state.total} | now {state.currentCached}/
        {state.total}
      </div>
      <div
        style={{
          marginTop: 4,
          opacity: 0.85,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        caches: {state.cacheNames || "checking"}
      </div>
      {state.error && <div style={{ marginTop: 4, color: "#ffb4b4" }}>{state.error}</div>}
    </div>
  );
}
