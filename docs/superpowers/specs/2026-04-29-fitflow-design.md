# FitFlow — Design Specification
**Date:** 2026-04-29
**Status:** Approved

---

## 1. Overview

FitFlow is a frontend-only, mobile-first Progressive Web App (PWA) built with React + Vite. It tracks weight, calculates BMI, projects fitness goals, schedules health reminders, and provides an embedded AI chatbot powered by a static RAG knowledge base. All data is persisted in `localStorage`. There is no backend, no database, and no external API.

---

## 2. Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast DX, native ESM, PWA plugin available |
| State | Zustand (persist middleware) | Selector-scoped subscriptions, localStorage sync without boilerplate |
| Routing | React Router v6 — `HashRouter` | Back button works in PWA, no server rewrite needed |
| Charts | Chart.js + react-chartjs-2 | Mature, canvas-based, good mobile perf |
| Animations | framer-motion | Layout transitions, card entrance, progress rings |
| Dates | dayjs | Lightweight, immutable date math |
| PWA | vite-plugin-pwa (Workbox) | Auto-generates manifest + service worker, handles cache versioning |

---

## 3. Branding

- **App name:** FitFlow
- **Logo:** Minimal flowing wave + dumbbell icon (SVG)
- **Colors:**
  - Primary: `#22C55E` (green)
  - Secondary: `#0F172A` (dark slate)
  - Accent: `#38BDF8` (sky blue)
  - Background: `#F8FAFC`
  - Text: `#0F172A`
- **Typography:** System font stack, mobile-legible sizes (base 16px)

---

## 4. Project Structure

```
fitflow/
├── public/
│   └── icons/                        # 192x192, 512x512 PNG (PWA install required)
├── src/
│   ├── main.jsx
│   ├── App.jsx                        # HashRouter, onboarding gate, lazy page imports
│   ├── store/
│   │   ├── userStore.js               # profile, height, onboardingWeight, goalWeight, calorieDeficit
│   │   ├── weightStore.js             # entries[], derived currentWeight selector
│   │   └── notificationStore.js      # reminders[], permissionState
│   ├── hooks/
│   │   ├── useGoal.js                 # projectByHistory + projectByDeficit
│   │   └── useNotificationScheduler.js  # wall-clock setTimeout chains
│   ├── pages/
│   │   ├── Onboarding.jsx             # first-run wizard
│   │   ├── Home.jsx                   # Dashboard + BMI card
│   │   ├── Tracker.jsx                # Weight chart + entry input
│   │   ├── Goals.jsx                  # goal projection (both modes)
│   │   └── Chat.jsx                   # lazy-loaded chatbot
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── Header.jsx                 # bell icon → NotificationModal
│   │   ├── NotificationModal.jsx      # reminder list + time pickers + permission prompt
│   │   ├── NotificationBanner.jsx     # in-app fallback banner
│   │   ├── ProgressRing.jsx           # SVG ring for BMI / goal %
│   │   ├── StatCard.jsx
│   │   └── WeightChart.jsx            # Chart.js wrapper, React.memo
│   ├── data/
│   │   └── knowledge-base.json        # { id, text, embedding: number[] }[]
│   ├── utils/
│   │   ├── bmi.js                     # calcBMI(weightKg, heightCm) → { value, category }
│   │   ├── goal.js                    # projectByHistory(entries, goal), projectByDeficit(deficit, delta)
│   │   └── chatbot.js                 # cosineSimilarity, retrieveChunks, assembleResponse
│   └── styles/
│       ├── index.css                  # CSS custom properties, resets
│       └── breakpoints.css            # --bp-tablet: 768px, --bp-desktop: 1024px
├── index.html
├── vite.config.js                     # vite-plugin-pwa config
└── package.json
```

---

## 5. State Architecture

### 5.1 userStore (Zustand + persist)
```
{
  name: string,
  heightCm: number,
  onboardingWeight: number,   // seed only — not updated after onboarding
  goalWeight: number,
  calorieDeficit: number | null,
  onboardingComplete: boolean
}
```
Persisted to `localStorage` key: `fitflow_user`

### 5.2 weightStore (Zustand + persist)
```
{
  entries: { date: string (ISO), weight: number }[],
  // derived selector:
  currentWeight: () => entries.at(-1)?.weight ?? userStore.onboardingWeight
}
```
Persisted to `localStorage` key: `fitflow_weights`

`currentWeight` is always derived — never stored separately. Eliminates the onboarding-vs-log sync bug.

### 5.3 notificationStore (Zustand + persist)
```
{
  permissionState: 'default' | 'granted' | 'denied',
  reminders: [
    { id: string, label: string, defaultTime: string (HH:mm), customTime: string (HH:mm), enabled: boolean }
  ]
}
```
Default reminders: water (every 2h, 8:00–20:00), breakfast (08:00), lunch (13:00), dinner (19:00), morning snack (10:30), afternoon snack (16:00), green tea AM (09:00), green tea PM (15:00).
Persisted to `localStorage` key: `fitflow_notifications`

---

## 6. Routing

`HashRouter` with four routes:

| Path | Page | Note |
|---|---|---|
| `/` | `Home` | Dashboard + BMI summary card |
| `/tracker` | `Tracker` | Weight log + chart |
| `/goals` | `Goals` | Projection (history + caloric) |
| `/chat` | `Chat` | RAG chatbot — lazy loaded |

`App.jsx` checks `userStore.onboardingComplete` on mount. If `false`, renders `<Onboarding />` and redirects all routes to `/`. Once complete, standard navigation applies.

---

## 7. Pages

### 7.1 Onboarding
- Step 1: Name
- Step 2: Height (cm) + current weight (kg)
- Step 3: Goal weight (kg) + optional daily calorie deficit (kcal)
- Step 4: Confirm + "Let's go" CTA
- On complete: writes `userStore` + seeds first weight entry in `weightStore`, sets `onboardingComplete: true`

### 7.2 Home (Dashboard + BMI)
- Greeting card with user name
- Current weight stat card (derived from `weightStore`)
- BMI progress ring: `calcBMI(currentWeight, heightCm)` → value + category label + color band
- Quick-add weight input (writes to `weightStore`)
- Today's reminders summary (next 3 upcoming)

### 7.3 Tracker
- Weight entry form (date + weight, defaults to today)
- WeightChart with tab selector: 7d / 30d / 90d / All
- Moving average trend line overlay on chart
- Entry history list (deletable)

### 7.4 Goals
- Target weight + distance remaining
- **Mode A (default):** History-based projection — `projectByHistory(entries, goalWeight)` calculates average weekly delta from last 4 weeks, projects completion date. Shows "at your current rate" copy.
- **Mode B (caloric):** `projectByDeficit(calorieDeficit, weightDelta)` using 7,700 kcal ≈ 1 kg. Shown as secondary estimate if `calorieDeficit` is set.
- Goal progress ring (% toward target)
- Milestone markers on projected timeline

### 7.5 Chat (lazy-loaded)
- Text input + scrollable message list
- On send: `retrieveChunks(query, knowledgeBase, topK=3)` via cosine similarity on pre-computed embeddings
- `assembleResponse(chunks)` builds a readable answer from retrieved text
- No external API — fully offline
- Loading spinner while `knowledge-base.json` imports on first visit

---

## 8. Notifications

### Architecture
- `useNotificationScheduler` hook: on mount, iterates enabled reminders, computes milliseconds until each `customTime` using dayjs, sets a `setTimeout`. On fire: shows `Notification` if permission granted, shows `<NotificationBanner>` as in-app fallback regardless.
- Re-schedules itself for next-day same time after firing.
- Cleans up all timeouts on unmount.

### Permission Flow
- Permission is **never requested on app load**.
- When the user opens `NotificationModal` and enables the first reminder, the modal calls `Notification.requestPermission()`.
- If denied: shows explanation, disables all toggles, stores `permissionState: 'denied'`.
- If granted: stores `permissionState: 'granted'`, scheduler activates.

### Limitations (documented in UI)
- Notifications only fire while the app tab is open. Background delivery requires a push server (out of scope). A tooltip in `NotificationModal` explains this.

---

## 9. AI Chatbot (RAG)

### Knowledge Base Format
```json
[
  {
    "id": "hydration-001",
    "text": "Drinking 8 glasses of water per day supports metabolism and reduces hunger.",
    "embedding": [0.12, -0.34, ...]  // 50-dim pre-computed vector
  }
]
```
Topics: hydration, macronutrients, weight loss science, BMI interpretation, exercise basics, meal timing, sleep and recovery, green tea benefits.

### Retrieval
```js
cosineSimilarity(queryEmbedding, docEmbedding)  // dot product / (|a| * |b|)
retrieveChunks(query, kb, topK=3)               // returns top-K by similarity score
assembleResponse(chunks)                         // joins text with light template framing
```
Query embedding: a bag-of-words TF-IDF vector built at runtime from the query string against the knowledge base vocabulary. The query vector is padded/truncated to match the 50-dim pre-computed document embeddings. Cosine similarity then ranks documents. This is sufficient for demo-quality retrieval and requires zero runtime model weight.

---

## 10. Animations (framer-motion)

- Page transitions: `AnimatePresence` + slide-in on route change
- StatCards: fade + scale on mount
- ProgressRing: animated stroke-dashoffset on value change
- Onboarding steps: horizontal slide between steps
- Chat messages: fade-in per message

---

## 11. Responsiveness

- Mobile-first base styles (320px+)
- `--bp-tablet: 768px`: two-column stat card grid, side panel for chart controls
- `--bp-desktop: 1024px`: three-column dashboard layout, wider chart
- Bottom nav hidden on desktop → replaced with left sidebar nav
- CSS Grid + Flexbox, no third-party layout library

---

## 12. PWA

Configured via `vite-plugin-pwa` in `vite.config.js`:
- `manifest.json` auto-generated: name, short_name, icons (192/512), theme_color `#22C55E`, background_color `#F8FAFC`, display `standalone`
- Service worker: Workbox `GenerateSW` strategy
  - Cache strategy: `StaleWhileRevalidate` for all static assets
  - Cache name versioned, old caches purged on activation
  - `skipWaiting: true`, `clientsClaim: true`
- **Not committed to git** (generated at build time by Vite plugin)

---

## 13. Data Integrity Rules

1. `currentWeight` is always derived from `weightStore.entries.at(-1)`. Never read from `userStore` after onboarding.
2. Weight entries are sorted by date ascending before any chart or projection computation.
3. `onboardingWeight` in `userStore` is write-once — never updated after step 3 of onboarding.
4. Reminder `customTime` defaults to `defaultTime` on first creation, then is user-editable.
5. Deleting a weight entry recalculates all downstream derived values automatically (Zustand selector).

---

## 14. Out of Scope

- User authentication
- Cloud sync
- Multiple user profiles
- Push notifications (background, requires backend)
- Real ML embedding model at runtime
- Calorie/food logging
