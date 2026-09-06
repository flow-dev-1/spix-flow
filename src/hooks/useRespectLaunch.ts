import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  parseRespectLaunchParams,
  sendXAPIStatement,
  getProgress,
  saveProgress,
  saveWeekResponses,
  getWeekResponses,
  getRespectLaunchTarget,
  XAPI_VERBS,
  RESPECT_LAUNCH_PARAMS_KEY,
  RESPECT_LAUNCHED_KEY,
  RESPECT_SESSION_STARTED_AT_KEY,
  type RespectLaunchParams,
  type LearnerProgress,
  type WeekResponses,
  type XAPIResult,
} from "@/services/xapi";

const PROGRESS_EXTENSION = "https://w3id.org/xapi/video/extensions/progress";

function launchKey(params: RespectLaunchParams) {
  return `${params.registration || "no-registration"}::${params.activityId || "no-activity"}`;
}

function toIsoDuration(startedAt: number, endedAt = Date.now()) {
  const elapsedSeconds = Math.max(0, Math.round((endedAt - startedAt) / 1000));
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds || (!hours && !minutes) ? `${seconds}S` : ""}`;
}

/**
 * Detects a RESPECT launcher session from URL params (respectLaunchVersion=1).
 * Persists the params for the lifetime of the session via sessionStorage so
 * they survive React re-renders and SPA navigation.
 */
export function useRespectLaunch() {
  const location = useLocation();
  const paramsRef = useRef<RespectLaunchParams | null>(null);
  const terminatedRef = useRef(false);
  const launchKeyRef = useRef<string | null>(null);
  const sessionStartedAtRef = useRef<number>(Date.now());

  const fromURL = parseRespectLaunchParams(location.search);
  if (fromURL) {
    const nextLaunchKey = launchKey(fromURL);
    if (launchKeyRef.current !== nextLaunchKey) {
      sessionStorage.setItem(RESPECT_LAUNCH_PARAMS_KEY, JSON.stringify(fromURL));
      sessionStorage.setItem(RESPECT_SESSION_STARTED_AT_KEY, String(Date.now()));
      paramsRef.current = fromURL;
      launchKeyRef.current = nextLaunchKey;
      terminatedRef.current = false;
    }
  } else if (!paramsRef.current) {
    const stored = sessionStorage.getItem(RESPECT_LAUNCH_PARAMS_KEY);
    if (stored) {
      try {
        paramsRef.current = JSON.parse(stored);
        launchKeyRef.current = launchKey(paramsRef.current);
      } catch {
        // Ignore corrupt storage.
      }
    }
  }

  if (paramsRef.current) {
    const storedStartedAt = Number(sessionStorage.getItem(RESPECT_SESSION_STARTED_AT_KEY));
    const startedAt = storedStartedAt || Date.now();
    sessionStorage.setItem(RESPECT_SESSION_STARTED_AT_KEY, String(startedAt));
    sessionStartedAtRef.current = startedAt;
  }

  useEffect(() => {
    if (!paramsRef.current) return;
    const launchedKey = `${RESPECT_LAUNCHED_KEY}:${launchKey(paramsRef.current)}`;
    if (sessionStorage.getItem(launchedKey)) return;
    sessionStorage.setItem(launchedKey, "1");
    sendXAPIStatement(paramsRef.current, XAPI_VERBS.launched).catch(() => {});
  }, [location.search]);

  const getElapsedDuration = useCallback(() => {
    return toIsoDuration(sessionStartedAtRef.current);
  }, []);

  const sendCompleted = useCallback((scoreScaled?: number, statementId?: string) => {
    if (!paramsRef.current) return Promise.resolve(false);
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.completed, {
      completion: true,
      duration: getElapsedDuration(),
      ...(scoreScaled !== undefined ? { score: { scaled: scoreScaled } } : {}),
    }, { statementId }).catch(() => false);
  }, [getElapsedDuration]);

  const sendProgressed = useCallback((progress: number, statementId?: string) => {
    if (!paramsRef.current) return Promise.resolve(false);
    const boundedProgress = Math.max(0, Math.min(progress, 1));
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.progressed, {
      completion: false,
      extensions: {
        [PROGRESS_EXTENSION]: boundedProgress,
      },
    }, { statementId }).catch(() => false);
  }, []);

  const sendPassed = useCallback((result: XAPIResult = {}, statementId?: string) => {
    if (!paramsRef.current) return Promise.resolve(false);
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.passed, {
      ...result,
      completion: true,
      success: true,
      duration: result.duration ?? getElapsedDuration(),
    }, { statementId }).catch(() => false);
  }, [getElapsedDuration]);

  const sendFailed = useCallback((result: XAPIResult = {}) => {
    if (!paramsRef.current) return Promise.resolve();
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.failed, {
      ...result,
      completion: true,
      success: false,
      duration: result.duration ?? getElapsedDuration(),
    }).then(() => undefined).catch(() => {});
  }, [getElapsedDuration]);

  const sendTerminated = useCallback((result: XAPIResult = {}, keepalive = false) => {
    if (!paramsRef.current || terminatedRef.current) return Promise.resolve();
    terminatedRef.current = true;

    return sendXAPIStatement(
      paramsRef.current,
      XAPI_VERBS.terminated,
      {
        duration: toIsoDuration(sessionStartedAtRef.current),
        ...result,
      },
      { keepalive },
    ).catch(() => {});
  }, []);

  useEffect(() => {
    if (!paramsRef.current) return;

    const handleSessionExit = () => {
      void sendTerminated({}, true);
    };

    window.addEventListener("beforeunload", handleSessionExit, { capture: true });
    window.addEventListener("pagehide", handleSessionExit, { capture: true });

    return () => {
      window.removeEventListener("beforeunload", handleSessionExit, { capture: true });
      window.removeEventListener("pagehide", handleSessionExit, { capture: true });
    };
  }, [sendTerminated]);

  const restoreProgress = (): Promise<LearnerProgress | null> => {
    if (!paramsRef.current) return Promise.resolve(null);
    return getProgress(paramsRef.current);
  };

  const persistProgress = (progress: LearnerProgress): Promise<void> => {
    if (!paramsRef.current) return Promise.resolve();
    return saveProgress(paramsRef.current, progress);
  };

  const saveResponses = (week: number, responses: WeekResponses): Promise<boolean> => {
    if (!paramsRef.current) return Promise.resolve(false);
    return saveWeekResponses(paramsRef.current, week, responses);
  };

  const loadResponses = (week: number): Promise<WeekResponses | null> => {
    if (!paramsRef.current) return Promise.resolve(null);
    return getWeekResponses(paramsRef.current, week);
  };

  return {
    launchParams: paramsRef.current,
    launchTarget: getRespectLaunchTarget(paramsRef.current?.activityId ?? ""),
    isRespectSession: !!paramsRef.current,
    sendCompleted,
    sendProgressed,
    sendPassed,
    sendFailed,
    sendTerminated,
    restoreProgress,
    persistProgress,
    saveResponses,
    loadResponses,
  };
}
