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

## Decision (confirmed 2026-08-20): Option B — one account, repos stay separate

Everything lands under **Jeevesbot-work** as separate, cleanly-named repos. No code
merge, no monorepo — so **no live deployment breaks**. Rename map:

| From | To |
|---|---|
| `nicosmada3-web/Back2strong-apps` | `Jeevesbot-work/back2strong-web` |
| `Jeevesbot-work/edge-app` | `Jeevesbot-work/back2strong-edge` |
| `Jeevesbot-work/jeeves-bot` | keep as `jeeves-bot` (it's a separate Telegram bot, not a Back2Strong product) — or `back2strong-bot` if you want it in the family |

> A true monorepo was the other option; it was rejected because it would have forced a
> reconfigure of Vercel / GitHub Pages / Railway — including the live client app — for no
> real gain. "One account, one PAT, one place to look" is what actually solves the pain.

## Execution steps (Option B)

All of this needs both logins, so it's done by you on github.com — Claude in this
session is scoped to nicosmada3-web and can't transfer or rename repos.

### 1. Transfer the one repo that lives on the wrong account
- Log into **nicosmada3-web** → `Back2strong-apps` → Settings → bottom → **Transfer ownership** → to **Jeevesbot-work**.
- Log into **Jeevesbot-work** → **accept** the transfer.

### 2. Rename for clarity (Jeevesbot-work → each repo → Settings → rename)
- `Back2strong-apps` → **`back2strong-web`**
- `edge-app` → **`back2strong-edge`**
- `jeeves-bot` → leave as-is (or `back2strong-bot`)

### 3. Confirm the fine-grained PAT covers all three
Jeevesbot-work → Settings → Developer settings → the PAT → **Repository access** →
include `back2strong-web`, `back2strong-edge`, `jeeves-bot` (Contents: read/write).

### 4. Repoint your local clones (on YOUR machine, real terminal)
```bash
# back2strong-web (was nicosmada3-web/Back2strong-apps)
cd path/to/Back2strong-apps
git remote set-url origin https://github.com/Jeevesbot-work/back2strong-web.git
git fetch origin && git push

# back2strong-edge (was edge-app)
cd path/to/edge-app
git remote set-url origin https://github.com/Jeevesbot-work/back2strong-edge.git
git fetch origin && git push
cd .. && mv edge-app back2strong-edge   # optional: fold the folder name to match

# jeeves-bot — no owner change, no action needed unless you renamed it
```

### 5. Retire nicosmada3-web — LAST, and delete nothing until confirmed
Once all three are confirmed live from Jeevesbot-work, stop using nicosmada3-web.
Don't delete the account or any repo until everything is verified working.

## Things that DON'T break, and the one that shifts
- GitHub keeps a **redirect** after both transfer and rename, so existing git remotes,
  Vercel/Netlify/Railway app connections, and links keep resolving. Reconnect each host
  to the new name at leisure for cleanliness — nothing is urgent.
- **One real shift:** transferring `Back2strong-apps` moves its GitHub Pages default URL
  from `nicosmada3-web.github.io/Back2strong-apps/` to the Jeevesbot-work equivalent. If a
  **custom domain** (e.g. back2strong.online) fronts it, that's unaffected. If anything
  links the raw `github.io` URL, update it after the transfer.

## If you want Claude to do the machine-side parts
This session can't reach Jeevesbot-work for writes. To have Claude do step 4 (and touch
`jeeves-bot` at all), start a Claude Code session whose **initial repo is a Jeevesbot-work
repo** — then it's authorized on that account.
