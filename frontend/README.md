# Frontend

The frontend reads and writes workspace data through a REST API. It has no seeded records or browser persistence. The API base defaults to `/api`; set `VITE_API_BASE_URL` to the backend origin or path when it is hosted separately.

## API contract

All collection endpoints return JSON arrays and all create/update endpoints return the persisted record, including its server-assigned ID and timestamps. Errors should use a non-2xx status and a useful text or JSON response body.

| Method | Endpoint | Request / response |
| --- | --- | --- |
| GET, POST | `/customers` | `Customer[]`; POST accepts `name`, `email`, and `company` |
| PUT | `/customers/{id}` | Accepts customer editable fields; returns `Customer` |
| GET, POST | `/plans` | `Plan[]`; POST accepts plan fields except `id` |
| PUT, DELETE | `/plans/{id}` | PUT accepts plan fields except `id`; returns `Plan` |
| GET, POST | `/subscriptions` | `Subscription[]`; POST accepts `customerId`, `planId`, `interval`, and `status` |
| PUT | `/subscriptions/{id}` | Accepts `customerId`, `planId`, `interval`, and `status`; returns `Subscription` |
| GET | `/invoices` | `Invoice[]` |
| PATCH | `/invoices/{id}` | Accepts `{ "status": "Paid" }` (or another supported invoice status); returns `Invoice` |
| GET | `/invoices/{id}/download` | Returns the invoice file as binary data |
| GET, PUT | `/preferences` | Returns or accepts `WorkspacePreferences` |
| GET | `/analytics/revenue?period={period}` | Returns `{ "month": string, "revenue": number }[]`; period is `30 days`, `6 months`, or `12 months` |

The backend should validate customer and plan references and calculate subscription amounts from the persisted plan and billing interval. The `Customer`, `Plan`, `Subscription`, `Invoice`, and `WorkspacePreferences` field definitions are in `src/types/index.ts`.

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
