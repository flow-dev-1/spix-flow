import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getProgress,
  getWeekResponses,
  getRespectLaunchRoute,
  parseRespectLaunchParams,
  saveWeekResponses,
  sendXAPIStatement,
  XAPI_VERBS,
  type RespectLaunchParams,
} from "./xapi";

const actor = JSON.stringify({
  objectType: "Agent",
  account: { homePage: "https://ke.onrespect.app", name: "learner-1" },
});

const launchParams: RespectLaunchParams = {
  endpoint: "https://respect.example/xapi/",
  auth: "Basic abc123",
  actor,
  registration: "550e8400-e29b-41d4-a716-446655440000",
  activityId: "https://spix.flowonline.app/tot/week1/index.html",
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("RESPECT launch parsing", () => {
  it("accepts standard Rustici launch parameters without respectLaunchVersion", () => {
    const query = new URLSearchParams({
      endpoint: "https://respect.example/xapi/",
      auth: "Basic abc123",
      actor,
      registration: "550e8400-e29b-41d4-a716-446655440000",
      activity_id: "https://spix.flowonline.app/transition/week7/index.html",
    });

    expect(parseRespectLaunchParams(`?${query}`)).toMatchObject({
      endpoint: "https://respect.example/xapi/",
      activityId: "https://spix.flowonline.app/transition/week7/index.html",
    });
  });

  it("ignores an ordinary non-RESPECT query string", () => {
    expect(parseRespectLaunchParams("?startWeek=2")).toBeNull();
  });
});

describe("RESPECT learning-unit routing", () => {
  it.each([
    ["https://spix.flowonline.app/tot/week6/index.html", "/tot/week6/index.html"],
    ["https://spix.flowonline.app/tot2/week3/", "/tot2/week3/index.html"],
    ["https://spix.flowonline.app/transition/week10", "/transition/week10/index.html"],
    ["https://spix.flowonline.app/transition2/week4/index.html", "/transition2/week4/index.html"],
  ])("routes %s", (activityId, expectedRoute) => {
    expect(getRespectLaunchRoute(activityId)).toBe(expectedRoute);
  });

  it("rejects an activity outside the SPIX course routes", () => {
    expect(getRespectLaunchRoute("https://example.com/unknown/week1/index.html")).toBeNull();
  });
});

describe("RESPECT response persistence", () => {
  it("saves responses as a responded statement", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    const params = { ...launchParams, registration: "response-save-registration" };

    await expect(saveWeekResponses(params, 1, {
      activities: [{ page: 2, answer: "test" }],
      assessments: [],
    })).resolves.toBe(true);

    const [requestUrl, request] = fetchMock.mock.calls[0];
    const statement = JSON.parse(String(request?.body));
    expect(request?.method).toBe("POST");
    expect(String(requestUrl)).toBe("https://respect.example/xapi/statements");
    expect(statement.verb).toEqual(XAPI_VERBS.responded);
    expect(statement.result.extensions).toMatchObject({
      "https://spix.flowonline.app/xapi/extensions/week-responses": {
        week: 1,
        responses: {
          activities: [{ page: 2, answer: "test" }],
          assessments: [],
        },
      },
    });
  });

  it("does not POST an identical delivered response payload twice", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    const params = { ...launchParams, registration: "response-dedupe-registration" };
    const responses = { activities: [{ page: 4, answer: "same" }], assessments: [] };

    await saveWeekResponses(params, 2, responses);
    await saveWeekResponses(params, 2, responses);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("loads the latest responses from responded statements", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      statements: [{
        result: {
          extensions: {
            "https://spix.flowonline.app/xapi/extensions/week-responses": {
              week: 1,
              responses: { activities: [{ page: 2 }], assessments: [{ id: 1 }] },
            },
          },
        },
      }],
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));

    await expect(getWeekResponses(launchParams, 1)).resolves.toEqual({
      activities: [{ page: 2 }],
      assessments: [{ id: 1 }],
    });
  });

  it("treats an LRS 404 as empty state instead of importing browser progress", async () => {
    localStorage.setItem(
      "tot-flowProgress",
      JSON.stringify({ currentWeek: 6, currentPage: 10, currentStep: 1 }),
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 404 }));

    await expect(getProgress(launchParams)).resolves.toBeNull();
  });
});
describe("xAPI statement delivery", () => {
  it("uses an idempotent POST body when a statement ID is supplied", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );

    await expect(sendXAPIStatement(
      launchParams,
      XAPI_VERBS.completed,
      { completion: true },
      { statementId: "ca4597a4-4517-4c91-b65d-0a20f93b11ef" },
    )).resolves.toBe(true);

    const [requestUrl, request] = fetchMock.mock.calls[0];
    expect(request?.method).toBe("POST");
    expect(String(requestUrl)).toBe("https://respect.example/xapi/statements");
    expect(JSON.parse(String(request?.body))).toMatchObject({
      id: "ca4597a4-4517-4c91-b65d-0a20f93b11ef",
      verb: XAPI_VERBS.completed,
    });
  });

  it("reuses the exact statement body on retry", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const statementId = "573ab492-b5cd-4846-9917-bd283e532819";

    await sendXAPIStatement(launchParams, XAPI_VERBS.completed, {
      completion: true,
      duration: "PT1M",
    }, { statementId });
    await sendXAPIStatement(launchParams, XAPI_VERBS.completed, {
      completion: true,
      duration: "PT2M",
    }, { statementId });

    expect(fetchMock.mock.calls[0][1]?.body).toBe(fetchMock.mock.calls[1][1]?.body);
  });
  it("reports a non-2xx response as undelivered so it can be retried", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 503 }),
    );
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(sendXAPIStatement(
      launchParams,
      XAPI_VERBS.progressed,
      { completion: false },
      { statementId: "81eb690e-cb17-4a63-92de-cc0567ec6899" },
    )).resolves.toBe(false);
  });
});
