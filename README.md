# FitFlow

A personal fitness companion built with React. Track weight, monitor BMI and goal progress, set reminders, and chat with a local AI assistant powered by **Ollama (Llama 3)** — all in a dark, mobile-first UI with smooth Framer Motion animations.

## Features

- **Onboarding** — Quick profile setup (name, height, weight, goal, optional calorie deficit)
- **Home dashboard** — Greeting card, current/goal weight stats, BMI and progress rings, quick weight logging, upcoming reminders
- **Weight tracker** — Chart with 7d / 30d / 90d / all ranges, entry history, add/delete logs
- **Goals** — Progress ring, history-based and deficit-based projections, milestone tracking
- **AI chat** — Llama 3 via Ollama with RAG context from a local fitness knowledge base (free, runs on your machine)
- **Reminders** — Configurable meal, water, and snack notifications (in-tab while the app is open)
- **PWA** — Installable progressive web app with offline asset caching
- **Responsive layout** — Bottom nav on mobile, sidebar navigation on desktop (≥1024px)

## Tech Stack

| Layer | Tools |
|-------|-------|
| UI | React 19, Vite 8 |
| Routing | React Router (HashRouter) |
| State | Zustand + localStorage persistence |
| Charts | Chart.js + react-chartjs-2 |
| Animations | Framer Motion (`LazyMotion` + shared variants) |
| Chatbot | Ollama + Llama 3 (local LLM), RAG retrieval |
| Dates | dayjs |
| Testing | Vitest, Testing Library |
| PWA | vite-plugin-pwa / Workbox |

## Animation System

Animations are layered in-place without layout changes. Shared config lives in `src/animations/variants.js`.

| Area | Behavior |
|------|----------|
| Page transitions | Fade + slide via `AnimatePresence` on route changes |
| Background | Animated gradient blobs (`AnimatedBackground`) |
| Cards | Hover scale (1.03) + shadow lift |
| Buttons | Tap compression + ripple feedback |
| Inputs | Focus glow animation |
| Icons | Hover rotate/pulse; notification bell ping |
| Lists | Staggered children (weight history, milestones) |
| Charts | Mount fade + grow |
| Progress rings | Animated stroke from 0 → target value |
| Toasts | Slide-in + fade notification banner |
| Chat | Message slide-up; typing indicator dot wave |

Performance: `LazyMotion` with `domAnimation`, transform/opacity-first animations, and `will-change` on heavy layers only.

## Project Structure

```
src/
├── animations/       # Shared Framer Motion variants
├── components/       # Reusable UI (Header, BottomNav, StatCard, etc.)
├── data/             # Chat knowledge base (JSON)
├── hooks/            # Notification scheduler
├── pages/            # Home, Tracker, Goals, Chat, Onboarding
├── store/            # Zustand stores (user, weight, notifications)
├── styles/           # Global CSS + breakpoints
└── utils/            # BMI, goal projection, chatbot retrieval, Ollama client
```

## Chatbot (Ollama + Llama 3)

The chat uses a **RAG** (retrieval-augmented generation) pipeline:

1. Your question is matched against `src/data/knowledge-base.json` (top 3 chunks).
2. Those chunks are injected into a system prompt.
3. Conversation history + prompt are sent to **Ollama** running locally.
4. **Llama 3** generates a natural-language reply.

No paid API keys — inference runs on your machine via [Ollama](https://ollama.com).

### Ollama setup

```bash
# Install Ollama from https://ollama.com, then:
ollama pull llama3
```

Keep Ollama running while using the Chat screen. In dev, Vite proxies `/api/ollama` → `http://localhost:11434`.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- [Ollama](https://ollama.com) with the `llama3` model (for chat)

### Install & run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run tests once (CI-friendly) |

## Data & Privacy

All user data (profile, weight entries, reminder settings) is stored in the browser via `localStorage`. Chat messages are sent only to your **local Ollama** instance — not to a cloud API. Use **Switch User** in the profile sheet to clear all data and restart onboarding.

## Tests

Unit tests cover core utilities:

- `src/utils/bmi.js` — BMI calculation and categories
- `src/utils/goal.js` — Goal projection helpers
- `src/utils/chatbot.js` — Knowledge-base retrieval (RAG)
- `src/utils/ollama.js` — Ollama / Llama 3 chat client

```bash
npm run test:run
```

## License

Private project — not published to npm.
