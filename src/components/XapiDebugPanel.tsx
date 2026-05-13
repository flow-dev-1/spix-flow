import { useEffect, useMemo, useState } from "react";
import {
  parseRespectLaunchParams,
  type RespectLaunchParams,
} from "@/services/xapi";

type XapiDebugState = {
  visible: boolean;
  endpoint: string;
  hasAuth: boolean;
  hasActor: boolean;
  hasRegistration: boolean;
  putStatus?: string;
  getStatus?: string;
  roundTrip?: "idle" | "ok" | "failed";
  error?: string;
};

const initialState: XapiDebugState = {
  visible: false,
  endpoint: "",
  hasAuth: false,
  hasActor: false,
  hasRegistration: false,
  roundTrip: "idle",
};

function getStoredLaunchParams() {
  try {
    const stored = sessionStorage.getItem("respect-launch-params");
    return stored ? (JSON.parse(stored) as RespectLaunchParams) : null;
  } catch {
    return null;
  }
}

function getLaunchParams() {
  return parseRespectLaunchParams(window.location.search) || getStoredLaunchParams();
}

function shouldShowPanel(params: RespectLaunchParams | null) {
  const searchParams = new URLSearchParams(window.location.search);
  return Boolean(params) || searchParams.get("spixDebug") === "1";
}

function stateUrl(params: RespectLaunchParams) {
  const base = params.endpoint.endsWith("/") ? params.endpoint : `${params.endpoint}/`;
  const query = new URLSearchParams({
    activityId: params.activityId || "https://spix.flowonline.app/tot2",
    agent: params.actor || JSON.stringify({ objectType: "Agent", name: "SPIX Debug" }),
    stateId: "spix-xapi-debug",
    ...(params.registration ? { registration: params.registration } : {}),
  });

  return `${base}activities/state?${query.toString()}`;
}

function xapiHeaders(auth: string) {
  return {
    "Content-Type": "application/json",
    Authorization: auth,
    "X-Experience-API-Version": "1.0.3",
  };
}

export default function XapiDebugPanel() {
  const launchParams = useMemo(getLaunchParams, []);
  const [state, setState] = useState<XapiDebugState>(() => ({
    ...initialState,
    visible: shouldShowPanel(launchParams),
    endpoint: launchParams?.endpoint || "",
    hasAuth: Boolean(launchParams?.auth),
    hasActor: Boolean(launchParams?.actor),
    hasRegistration: Boolean(launchParams?.registration),
  }));

  useEffect(() => {
    if (!launchParams || !state.visible) return;

    if (!launchParams.endpoint || !launchParams.auth) {
      setState((prev) => ({
        ...prev,
        roundTrip: "failed",
        error: "Missing endpoint or auth from RESPECT launch.",
      }));
      return;
    }

    let cancelled = false;

    async function runRoundTrip(params: RespectLaunchParams) {
      const payload = {
        source: "spix-xapi-debug",
        checkedAt: new Date().toISOString(),
        url: window.location.href,
      };

      try {
        const url = stateUrl(params);
        const putResponse = await fetch(url, {
          method: "PUT",
          headers: xapiHeaders(params.auth),
          body: JSON.stringify(payload),
        });

        if (cancelled) return;

        setState((prev) => ({
          ...prev,
          putStatus: `${putResponse.status} ${putResponse.statusText || ""}`.trim(),
        }));

        const getResponse = await fetch(url, {
          method: "GET",
          headers: xapiHeaders(params.auth),
        });

        if (cancelled) return;

        let roundTrip: XapiDebugState["roundTrip"] = "failed";
        if (getResponse.ok) {
          const savedPayload = await getResponse.json();
          roundTrip = savedPayload?.source === payload.source ? "ok" : "failed";
        }

        setState((prev) => ({
          ...prev,
          getStatus: `${getResponse.status} ${getResponse.statusText || ""}`.trim(),
          roundTrip,
          error: roundTrip === "ok" ? undefined : "GET did not return the debug payload.",
        }));
      } catch (error) {
        if (cancelled) return;

        setState((prev) => ({
          ...prev,
          roundTrip: "failed",
          error: error instanceof Error ? error.message : "xAPI debug failed",
        }));
      }
    }

    runRoundTrip(launchParams);

    return () => {
      cancelled = true;
    };
  }, [launchParams, state.visible]);

  if (!state.visible) return null;

  const statusColor =
    state.roundTrip === "ok"
      ? "#7CFFB2"
      : state.roundTrip === "failed"
        ? "#ffb4b4"
        : "#ffe59a";

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 136,
        zIndex: 99998,
        background: "rgba(17, 24, 39, 0.94)",
        color: "#fff",
        borderRadius: 8,
        padding: "10px 12px",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <strong>SPIX xAPI debug</strong>
        <span style={{ color: statusColor }}>{state.roundTrip}</span>
      </div>
      <div
        style={{
          marginTop: 6,
          opacity: 0.9,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        endpoint: {state.endpoint || "missing"}
      </div>
      <div style={{ marginTop: 4 }}>
        auth {state.hasAuth ? "yes" : "no"} | actor {state.hasActor ? "yes" : "no"} |
        registration {state.hasRegistration ? "yes" : "no"}
      </div>
      <div style={{ marginTop: 4 }}>
        PUT {state.putStatus || "pending"} | GET {state.getStatus || "pending"}
      </div>
      {state.error && <div style={{ marginTop: 4, color: "#ffb4b4" }}>{state.error}</div>}
    </div>
  );
}
