/**
 * Minimal xAPI service for RESPECT launcher integration.
 * Sends statements to the endpoint provided via URL params at launch time.
 * Spec: https://github.com/RusticiSoftware/launch/blob/master/lms_lrs.md
 */

export interface RespectLaunchParams {
  respectLaunchVersion?: string;
  endpoint: string;       // xAPI LRS endpoint
  auth: string;           // RESPECT auth parameter value
  actor: string;          // JSON-stringified xAPI actor
  registration: string;
  activityId: string;     // activity_id param
  endpointOneroster?: string;
  givenName?: string;
  locale?: string;
}

export const RESPECT_LAUNCH_PARAMS_KEY = "respect-launch-params";
export const RESPECT_LAUNCHED_KEY = "respect-xapi-launched";
export const RESPECT_SESSION_STARTED_AT_KEY = "respect-session-started-at";

export interface XAPIResult {
  completion?: boolean;
  success?: boolean;
  duration?: string;
  score?: {
    scaled?: number;
    raw?: number;
    min?: number;
    max?: number;
  };
  extensions?: Record<string, unknown>;
}

/** Parse RESPECT launch params from the current URL search string. */
export function parseRespectLaunchParams(search: string): RespectLaunchParams | null {
  const params = new URLSearchParams(search);
  const version = params.get("respectLaunchVersion") ?? undefined;
  const endpoint = params.get("endpoint") ?? "";
  const auth = params.get("auth") ?? "";
  const actor = params.get("actor") ?? "";
  const registration = params.get("registration") ?? "";
  const activityId = params.get("activity_id") ?? "";
  const endpointOneroster = params.get("endpoint_oneroster") ?? undefined;
  const givenName = params.get("given_name") ?? undefined;
  const locale = params.get("locale") ?? undefined;

  const hasRusticiLaunchParams = endpoint && auth && actor && activityId;
  if (!version && !hasRusticiLaunchParams) return null;

  return { respectLaunchVersion: version, endpoint, auth, actor, registration, activityId, endpointOneroster, givenName, locale };
}

const COURSE_ROUTES = new Set(["tot", "tot2", "transition", "transition2"]);

export interface RespectLaunchTarget {
  course: string;
  week: number;
  route: string;
}

/** Resolve the SPIX learning unit represented by a RESPECT activity_id. */
export function getRespectLaunchTarget(activityId: string): RespectLaunchTarget | null {
  if (!activityId) return null;

  try {
    const activityUrl = new URL(activityId, "https://spix.flowonline.app");
    if (activityUrl.origin !== "https://spix.flowonline.app") return null;
    const match = activityUrl.pathname.match(
      /^\/(tot|tot2|transition|transition2)\/week(\d+)(?:\/index\.html)?\/?$/i,
    );
    if (!match) return null;

    const course = match[1].toLowerCase();
    const week = Number(match[2]);
    if (!COURSE_ROUTES.has(course) || !Number.isInteger(week) || week < 1) return null;
    return { course, week, route: `/${course}/week${week}/index.html` };
  } catch {
    return null;
  }
}

export function getRespectLaunchRoute(activityId: string): string | null {
  return getRespectLaunchTarget(activityId)?.route ?? null;
}

export function getStoredRespectLaunchParams(): RespectLaunchParams | null {
  const stored = sessionStorage.getItem(RESPECT_LAUNCH_PARAMS_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as RespectLaunchParams;
  } catch {
    return null;
  }
}

function authHeader(auth: string): string {
  return /^(Basic|Bearer)\s+/i.test(auth) ? auth : `Basic ${auth}`;
}

function getCourseStateIdentity(activityId: string) {
  const target = getRespectLaunchTarget(activityId);
  if (target) {
    return {
      activityId: `https://spix.flowonline.app/${target.course}`,
      courseSlug: target.course,
    };
  }

  return {
    activityId: activityId || "https://spix.flowonline.app/tot2",
    courseSlug: "tot2",
  };
}

/** Send an xAPI statement to the LRS. */
export async function sendXAPIStatement(
  params: RespectLaunchParams,
  verb: { id: string; display: Record<string, string> },
  result?: XAPIResult,
  options?: { keepalive?: boolean },
): Promise<void> {
  if (!params.endpoint || !params.auth) return;

  let actorObj: object;
  try {
    actorObj = JSON.parse(params.actor);
  } catch {
    actorObj = { objectType: "Agent", name: params.givenName ?? "Learner" };
  }

  const statement = {
    actor: actorObj,
    verb,
    object: {
      objectType: "Activity",
      id: params.activityId || "https://spix.flowonline.app/tot2",
    },
    timestamp: new Date().toISOString(),
    ...(result ? { result } : {}),
    ...(params.registration ? { context: { registration: params.registration } } : {}),
  };

  const url = params.endpoint.endsWith("/")
    ? `${params.endpoint}statements`
    : `${params.endpoint}/statements`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(params.auth),
        "X-Experience-API-Version": "1.0.3",
      },
      keepalive: options?.keepalive,
      body: JSON.stringify(statement),
    });

    if (!response.ok) {
      console.warn(`xAPI statement failed with status ${response.status}`);
    }
  } catch (error) {
    console.warn("xAPI statement failed", error);
  }
}

export const XAPI_VERBS = {
  launched: {
    id: "http://adlnet.gov/expapi/verbs/launched",
    display: { "en-US": "launched" },
  },
  completed: {
    id: "http://adlnet.gov/expapi/verbs/completed",
    display: { "en-US": "completed" },
  },
  progressed: {
    id: "http://adlnet.gov/expapi/verbs/progressed",
    display: { "en-US": "progressed" },
  },
  passed: {
    id: "http://adlnet.gov/expapi/verbs/passed",
    display: { "en-US": "passed" },
  },
  failed: {
    id: "http://adlnet.gov/expapi/verbs/failed",
    display: { "en-US": "failed" },
  },
  terminated: {
    id: "http://adlnet.gov/expapi/verbs/terminated",
    display: { "en-US": "terminated" },
  },
};

export interface LearnerProgress {
  currentWeek: number;
  currentPage: number;
  currentStep: number;
  highestWeek?: number;
}

function stateUrl(params: RespectLaunchParams): string {
  const base = params.endpoint.endsWith("/") ? params.endpoint : `${params.endpoint}/`;
  const { activityId } = getCourseStateIdentity(params.activityId);
    
  const q = new URLSearchParams({
    activityId,
    agent: params.actor,
    stateId: "flowProgress",
    ...(params.registration ? { registration: params.registration } : {}),
  });
  return `${base}activities/state?${q.toString()}`;
}

const STATE_HEADERS = (auth: string) => ({
  "Content-Type": "application/json",
  Authorization: authHeader(auth),
  "X-Experience-API-Version": "1.0.3",
});

/** Retrieve saved learner progress from the LRS State API. Returns null if none found. */
export async function getProgress(
  params: RespectLaunchParams,
): Promise<LearnerProgress | null> {
  const { courseSlug } = getCourseStateIdentity(params.activityId);

  const localGet = () => {
    try {
      const saved = localStorage.getItem(`${courseSlug}-flowProgress`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  if (!params.endpoint || !params.auth) return localGet();

  try {
    const res = await fetch(stateUrl(params), {
      method: "GET",
      headers: STATE_HEADERS(params.auth),
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const progress = (await res.json()) as LearnerProgress;
    lastStatePayload.set(stateUrl(params), JSON.stringify(progress));
    return progress;
  } catch {
    return null;
  }
}

/** Save learner progress to the LRS State API. */
export async function saveProgress(
  params: RespectLaunchParams,
  progress: LearnerProgress,
): Promise<void> {
  try {
    const { courseSlug } = getCourseStateIdentity(params.activityId);
    localStorage.setItem(`${courseSlug}-flowProgress`, JSON.stringify(progress));
  } catch {
    // ignore
  }

  if (!params.endpoint || !params.auth) return;
  try {
    await putJsonState(stateUrl(params), params.auth, progress);
  } catch {
    // non-fatal
  }
}

export interface WeekResponses {
  activities: unknown[];
  assessments: unknown[];
}

function weekResponsesUrl(params: RespectLaunchParams, week: number): string {
  const base = params.endpoint.endsWith("/") ? params.endpoint : `${params.endpoint}/`;
  const { activityId, courseSlug } = getCourseStateIdentity(params.activityId);
    
  const q = new URLSearchParams({
    activityId,
    agent: params.actor,
    stateId: `${courseSlug}-flowResponses-week${week}`,
    ...(params.registration ? { registration: params.registration } : {}),
  });
  return `${base}activities/state?${q.toString()}`;
}

const lastStatePayload = new Map<string, string>();

async function putJsonState(url: string, auth: string, value: unknown): Promise<void> {
  const payload = JSON.stringify(value);
  if (lastStatePayload.get(url) === payload) return;
  lastStatePayload.set(url, payload);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: STATE_HEADERS(auth),
      body: payload,
    });

    if (!response.ok && lastStatePayload.get(url) === payload) {
      lastStatePayload.delete(url);
    }
  } catch (error) {
    if (lastStatePayload.get(url) === payload) lastStatePayload.delete(url);
    throw error;
  }
}

/** Save user responses (activities & assessments) for a given week to the LRS State API. */
export async function saveWeekResponses(
  params: RespectLaunchParams,
  week: number,
  responses: WeekResponses,
): Promise<void> {
  if (!params.endpoint || !params.auth) return;
  try {
    await putJsonState(weekResponsesUrl(params, week), params.auth, responses);
  } catch {
    // non-fatal
  }
}

/** Retrieve saved user responses for a given week from the LRS State API. Returns null if none found. */
export async function getWeekResponses(
  params: RespectLaunchParams,
  week: number,
): Promise<WeekResponses | null> {
  if (!params.endpoint || !params.auth) return null;
  try {
    const res = await fetch(weekResponsesUrl(params, week), {
      method: "GET",
      headers: STATE_HEADERS(params.auth),
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const responses = (await res.json()) as WeekResponses;
    lastStatePayload.set(weekResponsesUrl(params, week), JSON.stringify(responses));
    return responses;
  } catch {
    return null;
  }
}
