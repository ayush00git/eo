# Backend — Environment Configuration

This document explains every variable in `.env.example` and where it's used in the codebase. Copy `.env.example` to `.env` and fill in real values before running the backend.

## Variables

| Variable | Used in | Purpose |
|---|---|---|
| `DB_URI` | `src/config/db-config.js` | MongoDB connection string used to connect to the database. |
| `BACKEND_PORT` | `src/config/server-config.js` | Port the Express server listens on. |
| `JWT_SECRET_KEY` | `src/config/server-config.js` → `authService.js`, `adminAuthService.js` | Secret used to sign and verify JWT auth tokens (both regular users and admins). |
| `JWT_EXPIRE` | `src/config/server-config.js` → `authService.js`, `adminAuthService.js` | Expiry duration passed to `jwt.sign()` for issued tokens, e.g. `24h`. Controls how long a login/verification token stays valid. |
| `ADMIN_EMAIL` | `src/config/mail-config.js`, `authService.js` | The Gmail account nodemailer authenticates as (`auth.user`) and the address used as the `from` sender when sending mail (e.g. verification emails). |
| `ADMIN_EMAIL_PASSWORD` | `src/config/mail-config.js` | The app password for the `ADMIN_EMAIL` Gmail account, used as nodemailer's `auth.pass`. |
| `FRONT_URL` | `authService.js` | Base URL of the frontend app, used to build links sent in emails (e.g. the account-verification link `${FRONT_URL}/verify-account?account=<token>`). |

## Config loading

- `src/config/server-config.js` reads `process.env` (via `dotenv`) and re-exports the values above, plus `ADMIN_CREATE_FLAG` — an in-memory flag (not env-backed) used by `adminAuthController.js` to track whether the one-time admin account has been created.
- `src/config/mail-config.js` builds the nodemailer transporter (Gmail) from `ADMIN_EMAIL` / `ADMIN_EMAIL_PASSWORD`.
- `src/config/db-config.js` builds the Mongo connection from `DB_URI`.
- `src/config/index.js` re-exports all of the above as a single entry point (`serverConfig`, `mailConfig`, `dbConfig`, ...).

## Notes / history

- `EXPIRES_IN` and `ADMIN_EMAIL2` / `ADMIN_EMAIL_PASSWORD2` previously existed in `server-config.js` but were never wired into any code path (no second mail account or refresh-token flow was implemented). They've been removed to keep config in sync with actual usage. If a secondary admin mailbox or a refresh-token flow is added later, reintroduce the relevant variables at that point.
