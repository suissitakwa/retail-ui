# Retail UI — React 19 Frontend

[![CI](https://github.com/suissitakwa/retail-ui/actions/workflows/main.yml/badge.svg)](https://github.com/suissitakwa/retail-ui/actions/workflows/main.yml)

Full-featured e-commerce frontend for the **Retail Platform** — built with React 19, deployed to **Netlify**, and styled with a custom dark theme (Novamart).

**Live:** [retail-novamart.netlify.app](https://retail-novamart.netlify.app) — API served by Railway backend

![Home page — Novamart dark theme](docs/screenshots/home.png)

<details>
<summary>Login page</summary>

![Login page](docs/screenshots/login.png)

</details>

**Backend API:** https://github.com/suissitakwa/retail  
**Microservices layer:** https://github.com/suissitakwa/retail-microservices  
**Infrastructure / CD:** https://github.com/suissitakwa/retail-infra  
**Portfolio:** https://portfolio-showcase--suissitakwa.replit.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 + React Router 7 |
| Styling | Bootstrap 5 + react-bootstrap + custom CSS variables (Novamart dark theme) |
| HTTP | Axios — two instances: monolith API + notification-service |
| Payments | Stripe.js (redirect flow) |
| Auth | JWT stored in `localStorage`; auto-attached via Axios interceptor |
| Build | Create React App → production bundle |
| Serving | nginx:stable-alpine (multi-stage Docker build) |
| Deployment | GKE (`retail-dev` namespace) via Jenkins CD |

---

## Features

**Customer**
- Browse products, search by keyword (`?q=`) or category
- Cart management (add / remove / clear) — persisted in backend
- Stripe checkout with success/cancel redirect handling
- Order history with status tracking
- Profile management (name, email, password)
- Notification bell — unread badge, mark-all-read, full-page notifications view (routed to notification-service)
- AI Copilot — natural-language order support chat (GPT-4o-mini backed)

**Admin**
- Analytics dashboard — KPI cards (total revenue, 30-day revenue, order count, customers), orders-by-status breakdown, top-5 products by units sold
- Product management — create / delete with category + inventory
- Order management — view all, delete
- Customer management — view all registered users

---

## Architecture

```
src/
├── api/index.js          # Two Axios instances: API (monolith) + NOTIF_API (notification-service)
├── context/
│   ├── AuthContext.jsx   # JWT token + user state; rehydrates on mount via /customers/me
│   └── CartContext.jsx   # Cart state; all mutations go through handleAction()
├── pages/
│   ├── admin/            # AdminDashboard, AdminProducts, AdminOrders, AdminCustomers
│   ├── Shop.jsx, Cart.jsx, Orders.jsx, Profile.jsx, Copilot.jsx …
│   └── ProtectedRoute.jsx / AdminRoute.jsx  # Role-based guards
└── styles/custom.css     # Novamart theme tokens + component overrides
```

**Routing flow:**
`App.jsx` → `<AuthProvider>` → `<CartProvider>` → `<Router>` → route declarations

**Auth:**
- JWT stored under `accessToken` in `localStorage`
- `AuthContext` exposes `{ user, login, logout, setAuthData }`
- `user.role` drives `ProtectedRoute` (customer) and `AdminRoute` (admin)

**Notifications dual-routing:**
```js
const NOTIF_API = axios.create({
  baseURL: process.env.REACT_APP_NOTIF_API_URL   // → notification-service :8086
         || process.env.REACT_APP_API_URL,        // fallback → monolith :8080
});
```
Set `REACT_APP_NOTIF_API_URL=http://localhost:8086` in `.env.development` to route to the microservice.

---

## Getting Started

### Prerequisites
- Node 20+
- Backend running on `:8080` (see [retail](https://github.com/suissitakwa/retail))

### Run locally

```bash
git clone https://github.com/suissitakwa/retail-ui.git
cd retail-ui
npm install
npm start        # dev server on :3000
```

### Environment variables

| File | `REACT_APP_API_URL` | `REACT_APP_NOTIF_API_URL` |
|---|---|---|
| `.env.development` | `http://localhost:8080` | `http://localhost:8086` |
| `.env.production` | `""` (nginx proxy when running in GKE) | GKE notification-service URL |

**Netlify live demo:** set `REACT_APP_API_URL=<your-railway-url>` in the Netlify dashboard under Site settings → Environment variables. Leave `REACT_APP_NOTIF_API_URL` unset (falls back to the same URL).

### Run tests

```bash
npm test         # Jest in CI mode
```

---

## Docker / Production Build

```bash
# Multi-stage build: Node 20 compile → nginx:stable-alpine serve
docker build -t suissitakwa/retail-ui:dev-latest .
```

nginx proxies `/api/**` and `/auth/**` to `retail-backend.retail-dev.svc.cluster.local:8080` inside the cluster.

---

## Related Repositories

| Repo | Purpose |
|---|---|
| [retail](https://github.com/suissitakwa/retail) | Spring Boot 3.5 monolith — REST API, Stripe, Kafka, Redis, JWT |
| [retail-microservices](https://github.com/suissitakwa/retail-microservices) | Spring Boot 4 / Java 21 — 8-service microservices layer |
| [retail-infra](https://github.com/suissitakwa/retail-infra) | Jenkins CD pipeline + GKE Kubernetes manifests |

---

**Author:** Takwa Suissi  
**Portfolio:** https://portfolio-showcase--suissitakwa.replit.app
