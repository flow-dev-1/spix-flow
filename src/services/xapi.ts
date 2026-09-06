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

const statementDeliveryErrors = new Map<string, string>();

export function getXAPIStatementDeliveryError(verbId: string): string | null {
  return statementDeliveryErrors.get(verbId) ?? null;
}

/** Send an xAPI statement to the LRS. */
export async function sendXAPIStatement(
  params: RespectLaunchParams,
  verb: { id: string; display: Record<string, string> },
  result?: XAPIResult,
  options?: { keepalive?: boolean; statementId?: string },
): Promise<boolean> {
  if (!params.endpoint || !params.auth) return false;

  let actorObj: object;
  try {
    actorObj = JSON.parse(params.actor);
  } catch {
    actorObj = { objectType: "Agent", name: params.givenName ?? "Learner" };
  }

  const newStatement = {
    ...(options?.statementId ? { id: options.statementId } : {}),
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

  let statement = newStatement;
  if (options?.statementId) {
    const statementCacheKey = `respect-xapi-statement:${options.statementId}`;
    try {
      const cachedStatement = sessionStorage.getItem(statementCacheKey);
      if (cachedStatement) {
        statement = JSON.parse(cachedStatement);
      } else {
        sessionStorage.setItem(statementCacheKey, JSON.stringify(newStatement));
      }
    } catch {
      // Continue with the in-memory statement when storage is unavailable.
    }
  }

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

    if (response.ok || response.status === 409) {
      statementDeliveryErrors.delete(verb.id);
      return true;
    }

    const responseBody = (await response.text()).trim().replace(/\s+/g, " ").slice(0, 160);
    const errorDetail = `HTTP ${response.status}${responseBody ? `: ${responseBody}` : ""}`;
    statementDeliveryErrors.set(verb.id, errorDetail);
    console.warn(`xAPI statement failed: ${errorDetail}`);
    return false;
  } catch (error) {
    const errorDetail = error instanceof Error ? error.message : String(error);
    statementDeliveryErrors.set(verb.id, `Network error: ${errorDetail}`);
    console.warn("xAPI statement failed", error);
    return false;
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
  responded: {
    id: "http://adlnet.gov/expapi/verbs/responded",
    display: { "en-US": "responded" },
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

const WEEK_RESPONSES_EXTENSION = "https://spix.flowonline.app/xapi/extensions/week-responses";
const lastWeekResponseDelivery = new Map<string, {
  payload: string;
  statementId: string;
  delivered: boolean;
}>();

function statementsUrl(params: RespectLaunchParams): string {
  return params.endpoint.endsWith("/")
    ? `${params.endpoint}statements`
    : `${params.endpoint}/statements`;
}

const lastStatePayload = new Map<string, string>();

async function putJsonState(url: string, auth: string, value: unknown): Promise<boolean> {
  const payload = JSON.stringify(value);
  if (lastStatePayload.get(url) === payload) return true;
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
    return response.ok;
  } catch (error) {
    if (lastStatePayload.get(url) === payload) lastStatePayload.delete(url);
    throw error;
  }
}

/** Save the latest week responses as an xAPI statement supported by RESPECT. */
export async function saveWeekResponses(
  params: RespectLaunchParams,
  week: number,
  responses: WeekResponses,
): Promise<boolean> {
  if (!params.endpoint || !params.auth) return false;

  const payload = JSON.stringify(responses);
  const deliveryKey = `${params.registration}::${params.activityId}::${week}`;
  const previous = lastWeekResponseDelivery.get(deliveryKey);
  if (previous?.payload === payload && previous.delivered) return true;

  const statementId = previous?.payload === payload
    ? previous.statementId
    : crypto.randomUUID();
  lastWeekResponseDelivery.set(deliveryKey, { payload, statementId, delivered: false });

  const delivered = await sendXAPIStatement(
    params,
    XAPI_VERBS.responded,
    {
      extensions: {
        [WEEK_RESPONSES_EXTENSION]: { week, responses },
      },
    },
    { statementId },
  );
  lastWeekResponseDelivery.set(deliveryKey, { payload, statementId, delivered });
  return delivered;
}

/** Retrieve the latest saved week responses from RESPECT's Statements API. */
export async function getWeekResponses(
  params: RespectLaunchParams,
  week: number,
): Promise<WeekResponses | null> {
  if (!params.endpoint || !params.auth) return null;

  const query = new URLSearchParams({
    agent: params.actor,
    activity: params.activityId,
    verb: XAPI_VERBS.responded.id,
    ascending: "false",
    limit: "25",
    ...(params.registration ? { registration: params.registration } : {}),
  });

  try {
    const response = await fetch(`${statementsUrl(params)}?${query}`, {
      method: "GET",
      headers: STATE_HEADERS(params.auth),
    });
    if (!response.ok) return null;

    const body = await response.json();
    const statements = Array.isArray(body) ? body : (body?.statements ?? []);
    for (const statement of statements) {
      const saved = statement?.result?.extensions?.[WEEK_RESPONSES_EXTENSION];
      if (saved?.week === week && saved.responses) {
        return saved.responses as WeekResponses;
      }
    }
    return null;
  } catch {
    return null;
  }
}