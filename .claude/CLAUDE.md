# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with Turbopack
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Environment Variables

```
REFRESH_TOKEN_SECRET=<JWT_SECRET>
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
NEXT_PUBLIC_GA_ID=G-Y06WQ3X919
```

## Architecture

**SD Matrimony** — Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, pnpm.

### Role-based routing

Three user roles with separate route segments and auth flows:
- `/user` — member dashboard (matches, profile, liked, unlocked, payment)
- `/admin` — admin panel (user management, married tracking, image extractor)
- `/super-admin` — super-admin portal (analytics, admin management, payment oversight)
- `/auth/[role]/signin|signup` — role-specific auth pages
- `/(public)` — public info pages

`src/middleware.ts` enforces access control before every request: validates the refresh token JWT (`REFRESH_TOKEN_SECRET`), checks approval status, and redirects to role-specific signin or status pages (`/auth/pending`, `/auth/rejected`, `/auth/verify`).

### Data fetching

All server state is managed with **TanStack React Query v5** (`refetchOnWindowFocus: false`). Hooks live in `src/hooks/` and call action wrappers in `src/actions/`, which in turn call the service layer.

**Service layer** (`src/services/send-api-req/`):
- Creates per-request axios instances
- Request interceptor: injects `Authorization: Bearer <access_token>` from cookie
- Response interceptor: unwraps `response.data`, handles errors
- On 401: silently refreshes via `/access-token` (withCredentials), queues inflight requests, replays them after refresh
- Server-side requests use `getServerSideToken()` from `src/server/`

API endpoints are centralized in `src/services/send-api-req/end-points.ts`.

### State management

- **React Query** — all remote/async data
- **Zustand** (`src/store/ui.ts`) — UI-only state (modals, reminders); reminder state is persisted to localStorage
- **js-cookie** — client-side JWT storage (access token: 30 min, refresh token: 7 days set by backend as HttpOnly)

### Token / auth flow

1. Login → backend returns `access_token` + sets HttpOnly refresh token cookie
2. Middleware reads refresh token cookie, verifies JWT, checks `exp` and approval status
3. Client reads access token from cookie via `src/actions/token.ts`
4. On 401, service layer POSTs `/access-token` to get new access token silently

### UI components

Uses **shadcn/ui** (components.json, base color: slate, CSS variables). Components are in `src/components/ui/`. Add new shadcn components with `pnpm dlx shadcn@latest add <component>`. Custom/feature components live under `src/components/` organized by domain (`auth/`, `admin/`, `user-profile/`, `common/`).

### Validation & forms

**React Hook Form** + **Zod** schemas defined in `src/utils/user-schema.ts`. Enums and select options are in `src/utils/enums.ts`.

### Path alias

`@/` maps to `src/`. Use this for all internal imports.
