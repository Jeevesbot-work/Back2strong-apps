# Plan of action — consolidate everything into one home (nothing deleted)

_Checked live on 2026-08-20. Guiding rule from the brief: **migrate safely first, delete nothing, sort out structure afterward.**_

## What exists right now

| Repo | Account | What it is | Host | This session can… |
|---|---|---|---|---|
| `Back2strong-apps` | nicosmada3-web | Static site + UKSA pricing calculator + coach hub | GitHub Pages | **read + push** |
| `edge-app` | Jeevesbot-work | The real client app ("Barry's"). Next.js, ~150 MB coaching audio, 5 Supabase SQL migrations | Vercel + Supabase | read only (public) |
| `jeeves-bot` | Jeevesbot-work | Python Telegram bot | Railway | **nothing — private, cross-account, invisible here** |

Two hard constraints this session runs into:
- It is authenticated as **nicosmada3-web** and can only **push** to `Back2strong-apps`.
- It **cannot read `jeeves-bot`** at all (private + different account).

## The real decision: what does "one repo" mean?

These are three different runtimes on three different hosts. There are two honest shapes:

### Option A — One monorepo (what was literally asked)
All apps as subfolders of a single repo:
```
back2strong/
  apps/web/         ← current Back2strong-apps static site
  apps/edge/        ← edge-app (Next.js)
  apps/jeeves-bot/  ← Telegram bot
```
- ✅ Literally one repo, one place.
- ⚠️ **Breaks all three live deployments until each host is re-pointed** at its subfolder: Vercel (edge) → set Root Directory + reconnect repo; GitHub Pages/Netlify (web) → change publish dir; Railway (bot) → change root. The Vercel one touches a **live client app** — do it deliberately, not by accident.
- ⚠️ The ~150 MB of audio bloats the shared repo for everyone cloning it.

### Option B — One account, repos stay separate (recommended for live apps)
Move all three repos under **Jeevesbot-work**, rename cleanly, leave each deployment untouched:
- `Back2strong-apps` → `back2strong-web`
- `edge-app` → `back2strong-edge`
- `jeeves-bot` → keep, or `back2strong-bot`
- ✅ One account, one PAT, one place to look — the actual pain solved.
- ✅ Nothing breaks: each host keeps pointing at its repo (transfer preserves the URL redirect).
- ✅ This is just the transfer + rename flow already in `CONSOLIDATION.md`.

> "One simply named repo" and "stop the two-account mess" are both fully satisfied by **B** without risking the live client app. A is available if you genuinely want a single codebase.

## Safe migration — the part that loses nothing, done first

Regardless of A or B, step 1 is a **backup that can't lose anything**: a consolidated snapshot containing a full copy of every app, while the originals stay live and untouched.

- `edge-app` — already cloned read-only into this session; ready to copy in.
- `Back2strong-apps` — already here.
- `jeeves-bot` — **cannot be included from this session** (private/cross-account). Must come from a Jeevesbot-work session or be temporarily shared.

Because pushing the monorepo into `Back2strong-apps` would **break its live GitHub Pages site** (Pages serves from root), the snapshot should go to a **new** repo, not overwrite `Back2strong-apps`.

## Recommended sequence

1. **Decide A vs B** (see above).
2. **Backup snapshot** of everything reachable into one new repo — nothing deleted, nothing re-pointed yet.
3. **Get `jeeves-bot` in** from a Jeevesbot-work-authorized session (only place it's reachable).
4. **Land it under Jeevesbot-work**: either build directly there (Jeevesbot-work session) or build here and do a 2-click GitHub *Transfer ownership* at the end.
5. **Only then**, deliberately: re-point deployments (A) or transfer+rename repos (B).
6. **Retire nicosmada3-web** once everything is confirmed live from the new home. Delete nothing until then.

## Blocker to clear for a complete job
To include `jeeves-bot` and to push to Jeevesbot-work, the cleanest fix is to **start a Claude Code session whose initial repo is a Jeevesbot-work repo** (or run this consolidation from the Jeevesbot-work account). This session simply can't reach that account for writes.
