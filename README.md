# back2strong-apps

**One repo. Every app. One place.** This is the unified home for all the apps so there's never again a "which repo is that in / does Claude have access" moment.

## Apps

| Folder | App | Stack | Hosting | Live URL |
|---|---|---|---|---|
| [`apps/edge`](apps/edge) | **Edge / Back2Strong** — client app (daily check-in, meals, sleep, breathwork, weekly review) + `/admin` command centre | Next.js 14 + Supabase | Vercel | `app.back2strong.online` |
| [`apps/solihull-rugby`](apps/solihull-rugby) | **Solihull School Rugby** — S&C training app + `coach.html` dashboard | Static React (compiled) + Netlify function | Netlify | — |
| [`apps/pricing-calculator`](apps/pricing-calculator) | **Stratford Spraying Solutions** — pricing calculator | Static HTML | Netlify | — |

## Where this came from (migration record)

- `apps/edge` — imported from `Jeevesbot-work/edge-app` (was deploying on Vercel from `main`).
- `apps/solihull-rugby` + `apps/pricing-calculator` — imported from `nicosmada3-web/Revenue-agent-` at clean `main` (`f257488`).
- The old repos are kept (archive, **not delete**) until every live deploy is re-pointed here and verified.

## Finishing the move (deploy re-pointing — dashboard steps)

These need clicks in Vercel/Netlify; they can't be done from code alone:

- **Vercel (edge):** point the `edge-app` project at this repo and set **Root Directory → `apps/edge`**. Move the `app.back2strong.online` domain across. Then archive `Jeevesbot-work/edge-app`.
- **Netlify (solihull + pricing):** create/repoint each site to this repo with **Base directory → `apps/solihull-rugby`** (and `apps/pricing-calculator`), updating publish/functions paths.
- **`b2s-command-center`** (a Vercel project with *no* repo — CLI-deployed) still needs its source recovered or rebuilt inside `apps/`.

See [`CLAUDE.md`](CLAUDE.md) for conventions.
