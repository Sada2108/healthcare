# MammoCare

Breast health: from awareness to action.

A women-focused platform that helps women learn about breast health, check for warning signs, find screening centres near them, and complete follow-up. Community health workers (CHWs) can register women, track referrals, and send reminders.

## Problem and idea

Awareness does not always turn into screening and follow-up. This app guides women from learning to checking to finding a centre, and helps health workers track each woman's journey. It is calm, private, and uses simple words with large touch targets.

## Features

- Learn: article-style pages on breast health, with source credits
- Check Yourself: basic questions, symptoms, pain map, guided touch test, an "Other" box on every question that keeps her own words
- Result: Green / Yellow / Red / Red-urgent from fixed rules, plus AI guidance
- Centre finder: list and map, filters, verified badge (demo data)
- Referral tracker: Referred, Booked, Screened, Result, Follow-up
- CHW dashboard: registered, pending, dropped-off, reminders, notes, status updates
- English and Hindi
- Responsive: phone layout and laptop layout

## How the safety design works

- Fixed rules in `src/logic/result.ts` decide the result colour. AI never decides it.
- Her own "Other" words are kept exactly as typed and shown to the CHW.
- Unusual or unclear answers give at least Yellow.
- AI only explains. For Red and Red-urgent it does not offer reassuring explanations.
- If the AI fails or times out, safe fallback text is shown.
- The app never says she has or does not have cancer.
- Name and phone are never sent to the AI.

## Tech stack

| Technology | Role |
|---|---|
| React | UI framework |
| TypeScript | Type safety |
| Vite | Build and dev server |
| Tailwind CSS | Styling |
| react-router | Client-side routing |
| i18next | Translations (English, Hindi) |
| Leaflet + react-leaflet | Centre map |
| lucide-react | Icons |
| Vitest | Unit tests |
| Express | Small backend for AI guidance |
| Groq API | AI guidance (model set in `.env`) |

## Getting started

### Requirements

- Node.js 20+
- A Groq API key (only needed for live AI guidance; the app works without it)

### Steps

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in the values.
4. Run `npm run dev:all`.
5. Open the URL that Vite prints (usually `http://localhost:5173`).

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes (for live AI) | Groq API key. Read only by the backend. Never commit it. Never use a `VITE_` prefix. |
| `GROQ_MODEL` | No | Groq model name (default: `qwen/qwen3.8-27b`) |
| `PORT` | No | Backend port (default: `3001`) |

The API key is read only by the backend (`server/index.js`) and is never sent to the browser. The frontend does not use any `VITE_` prefixed variables. `.env` is listed in `.gitignore` and must not be committed.

Without a key, the app still works and shows safe fallback guidance instead of AI text.

## Scripts

| Script | Description |
|---|---|
| `dev` | Start the Vite dev server |
| `server` | Start the Express backend on port 3001 |
| `dev:all` | Run the backend and Vite together with concurrently |
| `build` | Type-check and build for production |
| `lint` | Run oxlint |
| `check:i18n` | Verify every `t('...')` key exists in both `en.json` and `hi.json` |
| `test` | Run Vitest unit tests |
| `preview` | Preview the production build |

## Project structure

```
src/
  pages/
    Home.tsx            - Home page with 4 big buttons
    Learn.tsx           - Article-style learn page
    Check.tsx           - 4-step check flow with shared answers state
    Result.tsx          - Result page with AI guidance card
    Centres.tsx         - List and map of centres (demo data)
    Referral.tsx        - Referral timeline
    chw/
      ChwHome.tsx       - CHW dashboard with counts and lists
      ChwAddWoman.tsx   - Add a woman form
      ChwWomanDetail.tsx- Woman profile with timeline, notes, actions
  components/
    PageShell.tsx       - Layout shell with top navbar (lg+) / bottom nav (mobile)
    BottomNav.tsx       - Floating bottom navigation pill
    LanguageSelector.tsx- English / Hindi switcher
    ProgressRing.tsx    - SVG progress ring
    OtherBox.tsx        - Free-text "Other" box
    Toast.tsx           - Toast notifications
  logic/
    result.ts           - Fixed rules that decide result colour
    chwStore.ts         - Shared CHW women state
    referral.ts         - Referral step helpers
  data/
    questions.ts        - Check flow questions
    centres.json        - Fictional demo centres
    women.json          - Dummy women
    learn.ts            - Learn article sections + sources
  i18n/
    en.json             - English UI text
    hi.json             - Hindi UI text
  ai/
    realAi.ts           - Calls /api/guidance with safe fallback
server/
  index.js              - Express backend, POST /api/guidance, calls Groq API
  prompt.js             - System prompt for the AI
```

## Testing

Run the unit tests:

```
npm run test
```

Run the i18n completeness check:

```
npm run check:i18n
```

The unit tests cover the result rules (each colour level), the AI fallback, JSON parsing of AI responses, and the learn data (every section has at least one source, every source id exists). `npm run check:i18n` fails if any `t('...')` key is missing from `en.json` or `hi.json`.

## Data and sources

Centres, women, and referral data are fictional demo data.

Learn content is summarised in simple words from:

- World Health Organization, Breast cancer fact sheet (3 July 2026): https://www.who.int/news-room/fact-sheets/detail/breast-cancer
- CDC, Symptoms of Breast Cancer (reviewed 22 Sept 2026): https://www.cdc.gov/breast-cancer/symptoms/index.html
- Breast Cancer Research Foundation, 10 Ways to Help Prevent Breast Cancer: https://www.bcrf.org/about-breast-cancer/breast-cancer-prevention-risk-reduction/
- ICMR, Breast cancer guidelines: https://www.icmr.gov.in/icmrobject/custom_data/pdf/resource-guidelines/Breast_Cancer.pdf
- Ministry of Health and Family Welfare (NPCDCS), clinical breast examination guidance: https://www.mohfw-dohfw.gov.in/static/uploads/2025/11/f9634bbf41f5865f4ec153409ddeca6e.pdf

Medical review: pending. Hindi text: needs native and medical review.

## Limitations

- Demo data only; no real centre database yet.
- No real login or database yet; state is managed in memory.
- No real SMS or WhatsApp reminders yet.
- AI can make mistakes; it only explains and never diagnoses.
- Not a diagnostic tool.
- Medical rules and content are not yet reviewed by a doctor.

## Roadmap

- Firebase login (phone OTP) and database
- Real verified centre data
- Real reminders (SMS or WhatsApp)
- More languages
- A chat box for free questions with the same safety rules
- Doctor-reviewed content
- Offline support

> This app gives general information only. It is not a medical device and does not diagnose. If you notice any change in your breasts, see a doctor.

## Contributing and licence

Contributing: [Your name / team]

Licence: [Licence to be added]

## Screenshots

![Home](docs/screenshots/home.png)
![Learn](docs/screenshots/learn.png)
![Check](docs/screenshots/check.png)
![Result](docs/screenshots/result.png)
![Centres](docs/screenshots/centres.png)
![CHW](docs/screenshots/chw.png)
