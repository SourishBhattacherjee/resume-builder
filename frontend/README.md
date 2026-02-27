# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Local dev servers

- Frontend (Vite): `http://localhost:5173`
- Backend (example): `http://localhost:5000` — set `PORT` in backend `.env`
- AI helper (FastAPI): `http://localhost:9000` — set `OPENAI_API_KEY` if available

## Backend API Endpoints

Base URL: `http://localhost:5000` (replace with your `PORT`/host)

- Users
  - POST `/register` — body: `{ fullName, email, password }`
  - POST `/login` — body: `{ email, password }` → returns `token`
  - GET `/profile` — headers: `Authorization: Bearer <token>`
  - POST `/send-otp` — body: `{ email }`
  - POST `/verify-otp` — body: `{ email, otp }`
  - POST `/reset-password` — body: `{ email, password }`

- Resumes
  - POST `/create/:id` — create a resume for user with id `:id`; body: `{ name, template }` (returns resume doc)
  - POST `/update/:id` — update resume with id `:id`; body: full resume object — also generates PDF/PNG and uploads to storage
  - DELETE `/delete/:id` — delete resume with id `:id` (removes files from storage)
  - GET `/get/:id` — list resumes for user id `:id`
  - GET `/download/:id` — download resume PDF for resume id `:id`
  - GET `/resume/:id` — get resume by resume id `:id`

- AI Helper proxy
  - POST `/ai/recommend` (on backend) — forwards to AI helper; body may contain `id` to fetch resume server-side and send to AI helper

## AI helper (FastAPI)

The project includes a separate small FastAPI service used to produce resume recommendations. By default the backend proxies requests to the AI helper at `http://localhost:9000/recommend`.

## Notes for developers

- Environment: set `PORT` for backend and `OPENAI_API_KEY` for the AI helper if you want OpenAI-powered suggestions.
- CORS: backend allows `http://localhost:5173` by default (see [backend/index.js](../backend/index.js)).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

