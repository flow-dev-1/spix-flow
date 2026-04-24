import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  parseRespectLaunchParams,
  sendXAPIStatement,
  getProgress,
  saveProgress,
  saveWeekResponses,
  getWeekResponses,
  XAPI_VERBS,
  type RespectLaunchParams,
  type LearnerProgress,
  type WeekResponses,
} from "@/services/xapi";

/**
 * Detects a RESPECT launcher session from URL params (respectLaunchVersion=1).
 * Persists the params for the lifetime of the session via sessionStorage so
 * they survive React re-renders and SPA navigation (the launcher appends them
 * once on initial load).
 *
 * Returns { launchParams, sendCompleted, sendProgressed, restoreProgress, saveProgress }
 * is null when not running inside a RESPECT launcher.
 */
export function useRespectLaunch() {
  const location = useLocation();
  const paramsRef = useRef<RespectLaunchParams | null>(null);

  // Read from URL or sessionStorage once
  if (!paramsRef.current) {
    const fromURL = parseRespectLaunchParams(location.search);
    if (fromURL) {
      sessionStorage.setItem("respect-launch-params", JSON.stringify(fromURL));
      paramsRef.current = fromURL;
    } else {
      const stored = sessionStorage.getItem("respect-launch-params");
      if (stored) {
        try {
          paramsRef.current = JSON.parse(stored);
        } catch {
          // ignore corrupt storage
        }
      }
    }
  }

  // Send "launched" statement once per session
  useEffect(() => {
    if (!paramsRef.current) return;
    sendXAPIStatement(paramsRef.current, XAPI_VERBS.launched).catch(() => {});
    // Intentionally no cleanup — fire once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendCompleted = (scoreScaled?: number) => {
    if (!paramsRef.current) return Promise.resolve();
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.completed, {
      completion: true,
      success: true,
      ...(scoreScaled !== undefined ? { score: { scaled: scoreScaled } } : {}),
    }).catch(() => {});
  };

  const sendProgressed = (scoreScaled: number) => {
    if (!paramsRef.current) return Promise.resolve();
    return sendXAPIStatement(paramsRef.current, XAPI_VERBS.progressed, {
      completion: false,
      score: { scaled: scoreScaled },
    }).catch(() => {});
  };

  /** Fetch saved position from the LRS. Returns null outside a RESPECT session. */
  const restoreProgress = (): Promise<LearnerProgress | null> => {
    if (!paramsRef.current) return Promise.resolve(null);
    return getProgress(paramsRef.current);
  };

  /** Persist current position to the LRS State API. No-op outside a RESPECT session. */
  const persistProgress = (progress: LearnerProgress): Promise<void> => {
    if (!paramsRef.current) return Promise.resolve();
    return saveProgress(paramsRef.current, progress);
  };

  /** Save user responses for a given week to the LRS State API. No-op outside a RESPECT session. */
  const saveResponses = (week: number, responses: WeekResponses): Promise<void> => {
    if (!paramsRef.current) return Promise.resolve();
    return saveWeekResponses(paramsRef.current, week, responses);
  };

  /** Load user responses for a given week from the LRS State API. Returns null outside a RESPECT session. */
  const loadResponses = (week: number): Promise<WeekResponses | null> => {
    if (!paramsRef.current) return Promise.resolve(null);
    return getWeekResponses(paramsRef.current, week);
  };

  return {
    launchParams: paramsRef.current,
    isRespectSession: !!paramsRef.current,
    sendCompleted,
    sendProgressed,
    restoreProgress,
    persistProgress,
    saveResponses,
    loadResponses,
  };
}
