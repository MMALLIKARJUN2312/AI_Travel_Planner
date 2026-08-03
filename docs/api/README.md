# API Reference

Base URL: `http://localhost:5000` locally, or your deployed Render URL.
All `/api/*` routes return `{ success: boolean, message?: string, data?: T }`.
Validation and auth failures return `{ success: false, message: string }`
with an appropriate status code (`400`, `401`, `403`, `404`, `502`).

A ready-to-import Postman collection covering every endpoint below lives at
[`postman_collection.json`](./postman_collection.json) — it auto-captures
the access token from register/login into a collection variable, so every
other request just works after you run those two first.

## Auth — `/api/auth`

Rate-limited: 10 requests / 15 min per IP on `register`, `login`, and
`refresh` (relaxed automatically when `NODE_ENV=test`).

| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/register` | – | `{ name, email, password }` | `password` ≥8 chars. Returns `{ accessToken }`; sets `refreshToken` httpOnly cookie. |
| POST | `/login` | – | `{ email, password }` | Same response shape as register. |
| POST | `/refresh` | refresh cookie | – | Rotates the refresh token, returns a new `{ accessToken }`. |
| POST | `/logout` | refresh cookie | – | Revokes the current refresh token, clears the cookie. |

## Users — `/api/users`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/me` | Bearer | `{ id, name, email, role, createdAt }` for the authenticated user. |

## Trips — `/api/trips`

All routes require `Authorization: Bearer <accessToken>`. Every trip is
scoped to the authenticated user — a trip owned by another user 404s rather
than 403s, so existence of other users' trips is never leaked.

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/` | `{ destination, numberOfDays, budgetType, interests[] }` | Generates the full itinerary/budget/hotels/risk assessment via AI. `budgetType`: `BUDGET`\|`MID_RANGE`\|`LUXURY`. Slowest endpoint (real Gemini calls take 10–30s). |
| GET | `/` | – | All of the caller's trips, newest first. |
| GET | `/:id` | – | Single trip. 404 if missing or not owned by the caller. |
| PUT | `/:id` | any subset of `{ destination, numberOfDays, budgetType, interests }` | Updates trip metadata only — does not touch the itinerary. |
| DELETE | `/:id` | – | Permanent. |
| POST | `/:id/regenerate-day` | `{ dayNumber, instruction? }` | Replaces one day's plan via AI; `instruction` is free text steering the regeneration (e.g. *"more outdoor activities"*). |
| PATCH | `/:id/itinerary/:dayNumber/activities` | `{ action: "add", slot, activity }` \| `{ action: "remove", slot, activityId }` \| `{ action: "reorder", slot, activityIds[] }` | Manual (non-AI) itinerary edits. `slot`: `morning`\|`afternoon`\|`evening`. |
| POST | `/:id/itinerary/:dayNumber/activities/:activityId/regenerate` | `{ slot, instruction? }` | Replaces a single activity via AI, keeping its position and `_id`. Powers both the per-activity "Regenerate" action and the risk advisor's "Swap in" flow. |
| PUT | `/:id/itinerary/:dayNumber` | `{ title, morning[], afternoon[], evening[], tips[], estimatedCost }` | Overwrites a day with an arbitrary client-supplied payload — used internally to implement "Undo" after a regenerate. |
| POST | `/:id/hotels/refresh` | – | Regenerates `hotelSuggestions` via AI. *(Implemented and tested; not yet wired to a button in the UI — see Known Limitations.)* |

### Example: create a trip

```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "destination": "Tokyo, Japan",
    "numberOfDays": 3,
    "budgetType": "MID_RANGE",
    "interests": ["Food", "Culture"]
  }'
```

### Health check

`GET /health` (no `/api` prefix, no auth) → `{ success, database: "connected"|"disconnected"|..., uptime }`.
Used as the Render health-check path.
