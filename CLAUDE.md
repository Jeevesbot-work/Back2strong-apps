# Working in this repo (read me first)

This is a **monorepo**: one folder per app under `apps/`. Each app is self-contained — never cross-wire them.

## The apps and where things live

- **`apps/edge`** — the **Edge / Back2Strong** app. Next.js 14 (app router), Supabase backend, deploys to **Vercel** (`app.back2strong.online`).
  - Daily check-in: `apps/edge/app/checkin`
  - Admin / command centre: `apps/edge/app/admin`
  - Other client areas: `sleep`, `breathwork`, `weekly-review`, `profile`, `checkin`.
  - **This is where nutrition/meal logging and the weigh-in belong** — the weigh-in goes at the **end of the daily check-in** (`app/checkin`), and shows for coaches in `app/admin`.
- **`apps/solihull-rugby`** — a *separate* static rugby S&C app (`index.html`) + coach dashboard (`coach.html`) + a Netlify function. Deploys to **Netlify**. Unrelated to Back2Strong — do not confuse the two.
- **`apps/pricing-calculator`** — Stratford Spraying Solutions pricing calculator (`uksa-pricing.html`). Static, Netlify.

## Conventions

- **Branches:** `claude/<app>-<feature>` — e.g. `claude/edge-checkin-weighin`.
- Keep changes inside the one app folder they belong to.
- When the user names a feature (check-in, command centre, meals, weigh-in, readiness) they almost always mean **`apps/edge`**.

## Deploy config

- **Vercel** projects set **Root Directory = `apps/<app>`**.
- **Netlify** sites set **Base directory = `apps/<app>`**.
