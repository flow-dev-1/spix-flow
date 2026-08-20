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

## Current Reference Documents

The original RESPECT reference PDF is here:

```txt
C:\Users\MY PC\Downloads\RESPECT xAPI Reference.pdf
```

Main understanding from the document:

- RESPECT launches SPIX-flow with URL query params.
- SPIX-flow must send xAPI statements back to the LRS endpoint supplied in those params.
- Normal local/FLOW usage must continue to work if RESPECT params are absent.

The current upstream integration contract is:

```txt
https://github.com/UstadMobile/Respect/blob/main/README_ADD_YOUR_APP.md
https://github.com/UstadMobile/Respect/wiki/xAPI-Recommended-Reading
```

It additionally requires a launchable-app manifest, an OPDS default collection,
one publication manifest and `tincan.xml` per learning unit, and xAPI launch handling.

## RESPECT Launch Params

SPIX-flow reads the standard Rustici launch parameters:

```txt
endpoint
auth
actor
registration
activity_id
```

`respectLaunchVersion` remains supported but is optional. Standard launches are
recognized when `endpoint`, `auth`, `actor`, and `activity_id` are present.

Optional params already supported in SPIX-flow:

```txt
endpoint_oneroster
given_name
locale
```

Ordinary URLs without either a version marker or the standard launch parameter
set remain non-RESPECT sessions and skip xAPI calls gracefully.

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

## Discovery Metadata

The source metadata is in:

```txt
public/launchable-app.json
public/respect-manifest.json
public/opds/index.json
public/opds/*-manifest.json
public/opds/*-tincan.xml
```

`respect-manifest.json` is retained as a compatibility URL but now contains the
same current launchable-app schema as `launchable-app.json`.

Generate and normalize all metadata with:

```txt
npm run respect:prepare
```

The generator is:

```txt
scripts/prepare-respect-metadata.cjs
```

It currently prepares 26 learning units across TOT1, TOT2, Transition 1, and
Transition 2. The normal production build runs it automatically before Vite.

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

- Standard Rustici launches no longer depend on `respectLaunchVersion`.
- `activity_id` routes to its actual SPIX course and week instead of always TOT2.
- Launch routing is restricted to SPIX production activity identifiers.
- All advertised courses send completion/pass lifecycle statements.
- Completion/pass statements are guarded so another week cannot be reported
  against the originally launched learning-unit activity ID.
- Login no longer sends a duplicate `launched` statement; the shared launch hook
  owns that lifecycle event.

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

## Current Completion Rule

Each published week is one RESPECT learning unit. Reaching that week's final
screen sends `completed` and `passed` for the launched `activity_id`. TOT2's
final assessment can additionally send its actual score and pass/fail result.

Scored statements use:

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

## Remaining Verification

1. Add `https://spix.flowonline.app/launchable-app.json` to a real RESPECT
   launcher and confirm all 26 units are discovered.
2. Launch at least one week from each course and confirm course/week routing.
3. Confirm the launcher LRS accepts `launched`, `completed`, `passed`, and
   `terminated`, including CORS preflight from the production origin.
4. Confirm offline download succeeds for each publication's `resources` list.
5. Run verification.
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
http://localhost:8080/?endpoint=http://localhost:34197/xapi/&auth=abc123&registration=550e8400-e29b-41d4-a716-446655440000&activity_id=https://spix.flowonline.app/tot2/week1/index.html&actor={"objectType":"Agent","name":"Test Learner","account":{"homePage":"https://ke.onrespect.app","name":"learner-1"}}
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
