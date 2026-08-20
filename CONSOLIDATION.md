# GitHub account consolidation — runbook

**Decision:** keep **Jeevesbot-work** (nick@therevenueagent.co.uk) as the single account.
Retire **nicosmada3-web**. One account, one fine-grained PAT, no password autofill.

---

## Repo status (checked 2026-08-20)

| Repo | Owner today | Verdict | Action |
|---|---|---|---|
| `Back2strong-apps` | nicosmada3-web | **ACTIVE — not dead code.** Live Netlify apps: main site (`index.html`), UKSA pricing calculator (`uksa-pricing.html`), coaches hub (`coach.html` + `netlify/functions/coach-data.js`). Last commits 25 Jun 2026. | Transfer to Jeevesbot-work. **Keep it** — do NOT delete, do NOT rename to "legacy". |
| `edge-app` | Jeevesbot-work | Barry's Edge client app (Next.js, on Vercel). | Rename → `back2strong-edge`. |

> Not visible from this session (scoped to `nicosmada3-web/Back2strong-apps`): `Revenue-agent-` (the Solihull app) and any private repos under Jeevesbot-work. Handle those with the same pattern below.

---

## Do these on github.com (only you can — needs both logins)

1. Log into **nicosmada3-web** → `Back2strong-apps` → Settings → bottom → **Transfer ownership** → to your **Jeevesbot-work** username.
2. Log into **Jeevesbot-work** → **accept** the transfer.
3. Rename `edge-app` → **`back2strong-edge`** (Settings → rename).
4. Jeevesbot-work → Settings → confirm the fine-grained PAT's **repository access** now includes the transferred repo (Contents: read/write). Edit its repo list if it doesn't.

---

## Then, on YOUR machine (real terminal — NOT this cloud session)

After the transfer is accepted, repoint each local clone. Replace `Back2strong-apps` if
GitHub lowercased/changed the name on transfer — check the new URL on github.com first.

```bash
# --- Back2strong-apps clone ---
cd path/to/Back2strong-apps
git remote set-url origin https://github.com/Jeevesbot-work/Back2strong-apps.git
git remote -v                     # confirm it points at Jeevesbot-work
git fetch origin                  # confirm the PAT reads the new remote
git push -u origin HEAD           # confirm push works

# --- edge-app clone -> back2strong-edge ---
cd path/to/edge-app
git remote set-url origin https://github.com/Jeevesbot-work/back2strong-edge.git
git fetch origin && git push -u origin HEAD
cd .. && mv edge-app back2strong-edge   # optional: match the folder name to the repo
```

If `fetch`/`push` prompts for a password, that's the autofill problem — use the
fine-grained PAT as the password (username = `Jeevesbot-work`), and store it so it
sticks:

```bash
git config --global credential.helper store   # or 'osxkeychain' on macOS
```

---

## Going forward
- One account (Jeevesbot-work), one PAT, no browser password autofill.
- Every new Back2Strong / Revenue Agent repo is created under Jeevesbot-work from day one.
