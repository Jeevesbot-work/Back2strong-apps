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

## Still to bring in (orphans — deployed manually, no repo yet)

These exist only as manual Drop/CLI deploys; their source is **not** in any repo.
They can't be auto-pulled from the Claude sandbox (network policy blocks fetching
the live sites, and Netlify's API has no file-download). Bring each in **on demand**:
when you want to work on one, either rebuild it fresh inside `apps/<folder>` or drop
the original source in — then it's in the monorepo and fully editable.

| Source | What it is | Host | Target folder | Status |
|---|---|---|---|---|
| `back2strong.online` | Marketing website | Netlify | `apps/website` | bring in on demand |
| "The Drift Check" (`back2strong-drift-check`) | Lead-magnet positions quiz | Netlify | `apps/drift-check` | bring in on demand |
| `milly-5678` | Personal app (daughter) | Netlify | `apps/milly` | **empty deploy** — likely skip |
| `b2s-command-center` | Admin/command backend | Vercel (CLI) | — | likely superseded by `apps/edge/app/admin` |

Netlify site IDs (for re-pointing later): solihull-rugby `546a5f69-1561-4e0b-9137-c58953ea0ef3`,
back2strongonline `1cf731c6-4568-41b4-a8f5-6d96d6ccff0c`, drift-check `02efe024-86f3-454f-a3d2-34d2f9ad12f2`.

## Deploy re-pointing (config, not code — do in dashboards)

Once source is unified, point each host at this repo + the app's subfolder:
- **Vercel (edge):** Root Directory → `apps/edge`; move `app.back2strong.online`; then archive `Jeevesbot-work/edge-app`.
- **Netlify:** each site → Base directory → its `apps/<app>` folder.

See [`CLAUDE.md`](CLAUDE.md) for conventions.
