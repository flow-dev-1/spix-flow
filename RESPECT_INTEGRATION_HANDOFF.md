# RESPECT xAPI Integration Handoff

This document is the working handoff for continuing the RESPECT integration in `spix-flow`.

## Project Location

Use this app, not the main FLOW `Frontend` app:

```txt
C:\Users\MY PC\Desktop\App\FLOW\spix-flow
```

The accidentally created file in the wrong app was removed:

```txt
Frontend/src/utils/respectXapi.js
```

## Reference Document

The RESPECT reference PDF is here:

```txt
C:\Users\MY PC\Downloads\RESPECT xAPI Reference.pdf
```

Main understanding from the document:

- RESPECT launches SPIX-flow with URL query params.
- SPIX-flow must send xAPI statements back to the LRS endpoint supplied in those params.
- Normal local/FLOW usage must continue to work if RESPECT params are absent.

## RESPECT Launch Params

SPIX-flow should read:

```txt
respectLaunchVersion
endpoint
auth
actor
registration
activity_id
```

Optional params already supported in SPIX-flow:

```txt
endpoint_oneroster
given_name
locale
```

If `respectLaunchVersion` is missing, treat it as a non-RESPECT session and skip xAPI calls gracefully.

## Existing SPIX-flow Files

SPIX-flow already has a RESPECT/xAPI layer:

```txt
src/services/xapi.ts
src/hooks/useRespectLaunch.ts
src/pages/Login.tsx
```

`useRespectLaunch.ts` already:

- parses RESPECT params
- saves them in `sessionStorage`
- sends `launched` once
- exposes helpers for completion/progress
- supports progress and weekly response persistence via xAPI State API

## Changes Already Made

Updated:

```txt
spix-flow/src/services/xapi.ts
```

Changes:

- Auth header now matches the RESPECT PDF:

```txt
Authorization: Basic {auth}
```

If `auth` already starts with `Basic` or `Bearer`, it is used as-is.

- xAPI send failures are now non-fatal. They log a warning and do not break the course.
- Added missing xAPI verbs:

```txt
passed
failed
terminated
```

- Expanded result typing to allow:

```txt
duration
score.scaled
score.raw
score.min
score.max
extensions
```

## xAPI Statement Shape

Statements should look like:

```ts
{
  actor,
  verb: {
    id: "http://adlnet.gov/expapi/verbs/{verb}",
    display: { "en-US": "{verb label}" }
  },
  object: {
    objectType: "Activity",
    id: activity_id
  },
  context: {
    registration
  },
  result,
  timestamp
}
```

POST target:

```txt
{endpoint}/statements
```

Headers:

```txt
Content-Type: application/json
Authorization: Basic {auth}
X-Experience-API-Version: 1.0.3
```

## Events To Support

Minimum expected events:

```txt
launched
progressed
completed
passed
failed
terminated
```

Already partly supported:

- `launched`
- `progressed`
- `completed`

New verbs exist in `XAPI_VERBS`, but still need wiring where appropriate:

- `passed`
- `failed`
- `terminated`

## Recommended Next Steps

1. Review `src/hooks/useRespectLaunch.ts`.
   - Add helper methods for:

```txt
sendPassed
sendFailed
sendTerminated
```

2. Add `terminated` tracking.
   - Use route unmount and/or `beforeunload`.
   - Include duration if available.

3. Decide completion rule.
   Recommended rule:

```txt
completed = learner reaches the final screen of the launched lesson/activity
```

Do not treat the whole course as completed unless RESPECT launches the whole course as one activity.

4. Wire one course first.
   Start with the RESPECT-launched SPIX-flow course, likely one of:

```txt
src/courses/TOT2/index.tsx
src/courses/TOT/index.tsx
```

5. Progress tracking.
   `sendProgressed(scoreScaled)` currently uses a score-shaped result.
   Consider changing or adding a method that sends RESPECT-style progress extension:

```ts
{
  extensions: {
    "https://w3id.org/xapi/video/extensions/progress": 0.45
  }
}
```

6. Scored activities.
   On scored assessments, call:

```txt
passed
failed
```

with:

```ts
{
  score: {
    scaled: 0.85,
    raw: 85,
    min: 0,
    max: 100
  },
  success: true,
  completion: true,
  duration: "PT5M30S"
}
```

7. Run verification.
   Useful commands from `spix-flow`:

```txt
npm run build
npm run lint
```

If Node is not on PATH, use:

```txt
& 'C:\Program Files\nodejs\npm.cmd' run build
```

## Test URL Shape

Use a URL like this for local testing:

```txt
http://localhost:5173/login?respectLaunchVersion=1&endpoint=http://localhost:34197/xapi/&auth=abc123&registration=550e8400-e29b-41d4-a716-446655440000&activity_id=https://spix-flow/course/lesson-1&actor={"objectType":"Agent","name":"Test Learner","account":{"homePage":"https://ke.onrespect.app","name":"learner-1"}}
```

In practice, URL-encode the `actor` JSON.

## Important Caution

Do not implement this in:

```txt
Frontend
Backend
Admin-Client
```

The RESPECT integration belongs in:

```txt
spix-flow
```
