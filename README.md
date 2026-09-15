# NBC AGM 2026

Static AGM invitation experience.

## Routes

- `index.html` — opening experience
- `pages/countdown.html` — countdown transition
- `pages/grid.html` — invitation and F1 carousel
- `pages/rsvp.html` — RSVP form
- `pages/tickets/*.html` — organisation-specific grid passes

This repository contains no backend, database, build system, or deployment configuration.

## RSVP deployment requirement

`pages/rsvp.html` contains the public RSVP service URL. The service must be reachable by unauthenticated guests, accept a cross-origin JSON `POST`, persist the RSVP before responding, and return `200` JSON in this form:

```json
{ "success": true }
```

The browser deliberately does not show a confirmation for an opaque or unverified response. See `RSVP_SERVICE_CONTRACT.md` before deploying.
