# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from inside `retail-ui/`.

```bash
npm install          # install dependencies
npm start            # dev server on :3000
npm test             # Jest in CI mode (--watchAll=false)
npm run build        # production build
```

## Local dev setup

Two env files control the API base URL — both are committed:

| File | Used when | `REACT_APP_API_URL` |
|---|---|---|
| `.env.development` | `npm start` | `http://localhost:8080` |
| `.env.production` | `npm run build` | `""` (empty — nginx proxy handles it) |

The backend must be running on `:8080` for API calls to work locally. Start it with `docker-compose up` from `retail/` or `./mvnw spring-boot:run`.

## Architecture

**Entry point:** `src/App.jsx` — mounts `<AuthProvider>` → `<CartProvider>` → `<Router>`. All routes are declared here.

**State is in two contexts** (never in component-local state for auth/cart):

- `src/context/AuthContext.jsx` — JWT token stored in `localStorage` under `accessToken`. On mount, fetches `/api/v1/customers/me` to rehydrate `user`. Exposes `{ user, login, logout, setAuthData }`. `user.role` drives route guards.
- `src/context/CartContext.jsx` — fetches `/api/v1/cart` whenever `user` changes. All mutations go through `handleAction('ADD'|'REMOVE'|'CLEAR')`. Exposes `{ cartItems, cartCount, totalItems, addToCart, removeFromCart, clearCart, refreshCart }`.

**Route guards:**
- `ProtectedRoute` — redirects to `/login` if no `user`
- `AdminRoute` — redirects to `/` if `user.role !== 'ROLE_ADMIN'`

**API layer:** `src/api/index.js` — single Axios instance; request interceptor attaches `Authorization: Bearer <token>` from `localStorage` on every call. Add new endpoints here only.

**Styling:** Bootstrap 5 + react-bootstrap for layout/components. Custom CSS variables and all component-specific styles live in `src/styles/custom.css`. No Tailwind — class names like `grid grid-cols-*` are dead in this codebase.

**Design tokens** (from `custom.css`):
- Primary blue: `#3b82f6` (`--color-primary`)
- Secondary/dark: `#1e293b` (`--color-secondary`)
- Background: `#f8fafc` (`--color-bg`)

## Production build (Docker / GKE)

```bash
docker build -t suissitakwa/retail-ui:dev-latest .
```

Multi-stage Dockerfile: Node 20 build → nginx:stable-alpine serve. `nginx.conf` proxies `/api/**` and `/auth/**` to `retail-backend.retail-dev.svc.cluster.local:8080` — so `.env.production` leaves `REACT_APP_API_URL` empty and nginx resolves routing in-cluster.

## Admin pages

`src/pages/admin/` contains `AdminDashboard`, `AdminProducts`, `AdminOrders`, `AdminCustomers`. All are wrapped in `<AdminRoute>`. Admin calls use the same Axios instance (token is attached automatically).

## Git conventions

Branch names describe the task: `feat/ui-redesign-home-shop-navbar`.  
Commit messages: one short line, no bullet list body.
