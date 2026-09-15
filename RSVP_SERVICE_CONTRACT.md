# RSVP service contract

The static invitation can only confirm an RSVP after the service confirms persistence. Configure the endpoint in the `rsvp-endpoint` meta tag in `pages/rsvp.html` to meet this contract.

- Public guests must be able to call it without a Google or organisation login.
- Accept `POST` JSON with `name`, `organisation`, `email`, `phone`, `attendance`, `passId`, and event fields.
- Validate and persist the record before replying.
- Return HTTP 200 and JSON `{ "success": true }` only after persistence succeeds.
- Return a non-2xx status and a generic JSON error for validation or server errors; do not leak implementation details.
- Allow CORS only from the final invitation domain, with `POST` and `Content-Type` permitted.
- Deduplicate by `passId` (or an equivalent idempotency key). Notifications and email should run after persistence and must not delay the success response.

The currently configured Google Apps Script URL redirects an unauthenticated `GET` to Google sign-in (audited 15 September 2026). Its deployment/access settings and response headers must be corrected outside this repository before the RSVP can be released.
