# Project: Breast health awareness-to-action platform (prototype)
Stack: React + TypeScript + Tailwind, react-router, i18next (en, hi, + 1), Leaflet.
Mobile-first PWA. Simple words, big buttons, low-literacy friendly.

## Safety rules (never break)
- The app NEVER diagnoses. Never say "you have cancer" or "you don't".
- Result colour comes ONLY from rules in src/logic/result.ts, never from AI.
- Red: new lump, skin dimpling/orange peel, nipple inversion/rash, bloody discharge, size/shape change.
- Red urgent: red, hot, swollen breast with fever.
- Yellow: high-risk history, persistent pain, or unusual/unsure "Other" answer.
- Green: no warning signs. Message: "stay breast-aware, get clinical breast exam from 30".
- Every question has an "Other: ____" text box. Save text exactly as written.
- Say "breast self-awareness", not "self-exam prevents cancer".
- Tone: calm, private, non-judgemental. "Most lumps are not cancer, but every new lump needs checking."

## Code rules
- All text in i18n files, no hard-coded strings.
- Dummy data in src/data/.
- Commit in small steps. Do not add co-author trailers to commits.