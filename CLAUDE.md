# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Build for production (output: dist/)
npm run preview   # Preview production build
npm run lint      # Lint and auto-fix .vue, .js files
```

## Environment

The API base URL is configured via `VITE_API_URL` (defaults to `http://localhost:64934/api`). Copy `.env.example` to `.env` to override. The Vite dev server proxies `/api` to `http://localhost:64934` — the backend must be running for full functionality.

## Architecture

**Request flow:** Views call service functions → services call the shared Axios instance (`src/services/api.js`) → responses flow back. The Axios instance auto-attaches the JWT from `localStorage` and redirects to `/login` on 401.

**Auth:** `src/stores/auth.js` (Pinia) holds `user`, `token`, and `isAuthenticated`. Token is persisted to `localStorage`. The router guard in `src/router/index.js` enforces `meta.requiresAuth` — unauthenticated users are redirected to login with a `?redirect=` param. Authenticated users hitting public routes (`meta.public`) are redirected to home.

**Services layer** (`src/services/`):
- `api.js` — Axios instance (interceptors, base URL)
- `authService.js` — `/auth/*` endpoints (login, register, me, change-password)
- `pessoaFisicaService.js` — CRUD for individuals
- `pessoaJuridicaService.js` — CRUD for companies
- `auxiliaryService.js` — lookup data: estados, cidades, CEP, tipos de telefone/endereço eletrônico, estado civil, nacionalidade, profissão (CBO)

**Views pattern:** Each entity (PessoaFisica, PessoaJuridica) has three views under `src/views/<Entity>/`: `ListaView.vue`, `FormView.vue` (shared for create and edit — detects edit mode via route param `:id`), and `DetalhesView.vue`.

**Layout:** `LayoutApp.vue` wraps all authenticated views. `LoadingSpinner.vue` is the shared loading component.

**Styling:** Tailwind CSS with custom utility classes defined in `src/assets/main.css`: `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-danger`, `.card`, `.input-field`, `.badge-*`. Fonts: DM Sans (primary), JetBrains Mono (mono). Color palette: blue (`#0ea5e9`) primary, purple (`#d946ef`) secondary.

**Path alias:** `@` resolves to `src/`.

## README.md
Please read if you need more info: @README.md