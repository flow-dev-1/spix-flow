import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getProgress,
  getRespectLaunchRoute,
  parseRespectLaunchParams,
  saveWeekResponses,
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

describe("RESPECT State API", () => {
  it("uses the course root and course slug for week response state", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );

    await saveWeekResponses(launchParams, 1, {
      activities: [{ page: 2, answer: "test" }],
      assessments: [],
    });

    const requestUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(requestUrl.searchParams.get("activityId")).toBe(
      "https://spix.flowonline.app/tot",
    );
    expect(requestUrl.searchParams.get("stateId")).toBe("tot-flowResponses-week1");
  });

  it("does not PUT an identical response payload twice", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );
    const params = { ...launchParams, registration: "dedupe-registration" };
    const responses = { activities: [{ page: 4, answer: "same" }], assessments: [] };

    await Promise.all([
      saveWeekResponses(params, 2, responses),
      saveWeekResponses(params, 2, responses),
      saveWeekResponses(params, 2, responses),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
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
