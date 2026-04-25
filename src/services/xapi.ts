/**
 * Minimal xAPI service for RESPECT launcher integration.
 * Sends statements to the endpoint provided via URL params at launch time.
 * Spec: https://github.com/RusticiSoftware/launch/blob/master/lms_lrs.md
 */

export interface RespectLaunchParams {
  respectLaunchVersion: string;
  endpoint: string;       // xAPI LRS endpoint
  auth: string;           // Bearer token
  actor: string;          // JSON-stringified xAPI actor
  registration: string;
  activityId: string;     // activity_id param
  endpointOneroster?: string;
  givenName?: string;
  locale?: string;
}

/** Parse RESPECT launch params from the current URL search string. */
export function parseRespectLaunchParams(search: string): RespectLaunchParams | null {
  const params = new URLSearchParams(search);
  const version = params.get("respectLaunchVersion");
  if (!version) return null;

  const endpoint = params.get("endpoint") ?? "";
  const auth = params.get("auth") ?? "";
  const actor = params.get("actor") ?? "";
  const registration = params.get("registration") ?? "";
  const activityId = params.get("activity_id") ?? "";
  const endpointOneroster = params.get("endpoint_oneroster") ?? undefined;
  const givenName = params.get("given_name") ?? undefined;
  const locale = params.get("locale") ?? undefined;

  return { respectLaunchVersion: version, endpoint, auth, actor, registration, activityId, endpointOneroster, givenName, locale };
}

/** Send an xAPI statement to the LRS. */
export async function sendXAPIStatement(
  params: RespectLaunchParams,
  verb: { id: string; display: Record<string, string> },
  result?: { completion?: boolean; success?: boolean; score?: { scaled: number } },
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

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // auth is the full Authorization header value per the Rustici launch spec
      // (already includes scheme, e.g. "Basic dXNlcjpwYXNz")
      Authorization: params.auth,
      "X-Experience-API-Version": "1.0.3",
    },
    body: JSON.stringify(statement),
  });
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
};

export interface LearnerProgress {
  currentWeek: number;
  currentPage: number;
  currentStep: number;
  highestWeek?: number;
}

function stateUrl(params: RespectLaunchParams): string {
  const base = params.endpoint.endsWith("/") ? params.endpoint : `${params.endpoint}/`;
  const q = new URLSearchParams({
    activityId: params.activityId || "https://spix.flowonline.app/tot2",
    agent: params.actor,
    stateId: "flowProgress",
    ...(params.registration ? { registration: params.registration } : {}),
  });
  return `${base}activities/state?${q.toString()}`;
}

const STATE_HEADERS = (auth: string) => ({
  "Content-Type": "application/json",
  Authorization: auth,
  "X-Experience-API-Version": "1.0.3",
});

/** Retrieve saved learner progress from the LRS State API. Returns null if none found. */
export async function getProgress(
  params: RespectLaunchParams,
): Promise<LearnerProgress | null> {
  const localGet = () => {
    try {
      const saved = localStorage.getItem("flowProgress");
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
    if (res.status === 404) return localGet();
    if (!res.ok) return localGet();
    return (await res.json()) as LearnerProgress;
  } catch {
    return localGet();
  }
}

/** Save learner progress to the LRS State API. */
export async function saveProgress(
  params: RespectLaunchParams,
  progress: LearnerProgress,
): Promise<void> {
  try {
    localStorage.setItem("flowProgress", JSON.stringify(progress));
  } catch {
    // ignore
  }

  if (!params.endpoint || !params.auth) return;
  try {
    await fetch(stateUrl(params), {
      method: "PUT",
      headers: STATE_HEADERS(params.auth),
      body: JSON.stringify(progress),
    });
  } catch {
    // non-fatal
  }
}

export interface WeekResponses {
  activities: any[];
  assessments: any[];
}

function weekResponsesUrl(params: RespectLaunchParams, week: number): string {
  const base = params.endpoint.endsWith("/") ? params.endpoint : `${params.endpoint}/`;
  const q = new URLSearchParams({
    activityId: params.activityId || "https://spix.flowonline.app/tot2",
    agent: params.actor,
    stateId: `flowResponses-week${week}`,
    ...(params.registration ? { registration: params.registration } : {}),
  });
  return `${base}activities/state?${q.toString()}`;
}

/** Save user responses (activities & assessments) for a given week to the LRS State API. */
export async function saveWeekResponses(
  params: RespectLaunchParams,
  week: number,
  responses: WeekResponses,
): Promise<void> {
  if (!params.endpoint || !params.auth) return;
  try {
    await fetch(weekResponsesUrl(params, week), {
      method: "PUT",
      headers: STATE_HEADERS(params.auth),
      body: JSON.stringify(responses),
    });
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
    return (await res.json()) as WeekResponses;
  } catch {
    return null;
  }
}
