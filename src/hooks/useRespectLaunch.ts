import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  parseRespectLaunchParams,
  sendXAPIStatement,
  getProgress,
  saveProgress,
  saveWeekResponses,
  getWeekResponses,
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
  const sessionStartedAtRef = useRef<number>(Date.now());

  if (!paramsRef.current) {
    const fromURL = parseRespectLaunchParams(location.search);
    if (fromURL) {
      sessionStorage.setItem(RESPECT_LAUNCH_PARAMS_KEY, JSON.stringify(fromURL));
      paramsRef.current = fromURL;
    } else {
      const stored = sessionStorage.getItem(RESPECT_LAUNCH_PARAMS_KEY);
      if (stored) {
        try {
          paramsRef.current = JSON.parse(stored);
        } catch {
          // Ignore corrupt storage.
        }
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
    if (!paramsRef.current || sessionStorage.getItem(RESPECT_LAUNCHED_KEY)) return;
    sessionStorage.setItem(RESPECT_LAUNCHED_KEY, "1");
    sendXAPIStatement(paramsRef.current, XAPI_VERBS.launched).catch(() => {});
  }, []);

  const getElapsedDuration = useCallback(() => {
    return toIsoDuration(sessionStartedAtRef.current);
  }, []);

  const sendCompleted = useCallback((scoreScaled?: number) => {
    if (!paramsRef.current) return Promise.resolve();
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.completed, {
      completion: true,
      duration: getElapsedDuration(),
      ...(scoreScaled !== undefined ? { score: { scaled: scoreScaled } } : {}),
    }).catch(() => {});
  }, [getElapsedDuration]);

  const sendProgressed = useCallback((progress: number) => {
    if (!paramsRef.current) return Promise.resolve();
    const boundedProgress = Math.max(0, Math.min(progress, 1));
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.progressed, {
      completion: false,
      extensions: {
        [PROGRESS_EXTENSION]: boundedProgress,
      },
    }).catch(() => {});
  }, []);

  const sendPassed = useCallback((result: XAPIResult = {}) => {
    if (!paramsRef.current) return Promise.resolve();
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.passed, {
      ...result,
      completion: true,
      success: true,
      duration: result.duration ?? getElapsedDuration(),
    }).catch(() => {});
  }, [getElapsedDuration]);

  const sendFailed = useCallback((result: XAPIResult = {}) => {
    if (!paramsRef.current) return Promise.resolve();
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.failed, {
      ...result,
      completion: true,
      success: false,
      duration: result.duration ?? getElapsedDuration(),
    }).catch(() => {});
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

    const handleBeforeUnload = () => {
      void sendTerminated({}, true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      void sendTerminated();
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

  const saveResponses = (week: number, responses: WeekResponses): Promise<void> => {
    if (!paramsRef.current) return Promise.resolve();
    return saveWeekResponses(paramsRef.current, week, responses);
  };

  const loadResponses = (week: number): Promise<WeekResponses | null> => {
    if (!paramsRef.current) return Promise.resolve(null);
    return getWeekResponses(paramsRef.current, week);
  };

  return {
    launchParams: paramsRef.current,
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
