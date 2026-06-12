# Deployment — AeroMind

AeroMind is a **static site**: a single `index.html` plus docs and assets. There is **no build step** and **no server code**, so it deploys anywhere that serves files. This guide covers local checks, four deploy paths, post-deploy verification, an offline (CDN-free) fallback, and troubleshooting.

---

## 0. Deploy-readiness — already verified

These checks were run against this repo and **passed**:

- ✅ **Inline JavaScript compiles cleanly** — `node dev/_check.js` → *Syntax OK (44,427 chars)*.
- ✅ **Exactly one external dependency** — `index.html` loads only:
  `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`. Everything else (CSS, JS, the 3D scene) is inline.
- ✅ **All internal documentation links resolve** (`README.md`, `case-study.md`, `docs/`).
- ✅ **No secrets, no env vars, no backend** — nothing to configure.

> The single CDN dependency is the only thing that can break a deploy. If your hosting target may block public CDNs (corporate, air-gapped, offline), use the **[CDN-free fallback](#5-cdn-free--offline-fallback-vendor-threejs)** in §5.

---

## 1. Pre-deployment checklist (run locally)

```bash
# from the repo root
node dev/_check.js          # 1) JS syntax must print "Syntax OK"
npx serve .                 # 2) serve over http (better than file://)
#   → open the printed URL (e.g. http://localhost:3000) and smoke-test §4
```

Manual pre-flight:

- [ ] `node dev/_check.js` prints **Syntax OK**.
- [ ] Page loads with the start screen and **Launch Simulator** button.
- [ ] Browser DevTools **Console shows no red errors**.
- [ ] DevTools **Network tab** shows `three.min.js` returning **200**.
- [ ] Flying works (`W/A/S/D/Q/E/Space/Shift`), HUD numbers update, explanation feed reacts.

> Opening `index.html` directly via `file://` works in most browsers, but a local server (`npx serve .`, or VS Code "Live Server") avoids any file-protocol quirks and matches production behavior.

---

## 2. Option A — GitHub → Vercel (recommended)

Best for a portfolio: free, HTTPS by default, auto-redeploys on every push, clean URL.

### 2a. Push to GitHub

```bash
cd aeromind-drone-simulator
git init
git add .
git commit -m "AeroMind: drone avionics training simulator"
git branch -M main
# create an empty repo named aeromind-drone-simulator on github.com first, then:
git remote add origin https://github.com/<your-username>/aeromind-drone-simulator.git
git push -u origin main
```

### 2b. Import into Vercel

1. Go to **vercel.com → Add New… → Project**.
2. **Import** the `aeromind-drone-simulator` repository.
3. Framework Preset: **Other**. Build Command: **leave empty**. Output Directory: **leave empty** (root). Install Command: **leave empty**.
4. Click **Deploy**.

Vercel serves `index.html` at the root. Your live URL will look like `aeromind-drone-simulator.vercel.app`. Every `git push` to `main` triggers a new deployment.

> **CLI alternative:** `npm i -g vercel` → `vercel` (preview) → `vercel --prod` (production), run from the repo root. Accept the defaults; there is no build to configure.

A minimal `vercel.json` is optional. Only add one if you want custom headers/caching:

```json
{ "cleanUrls": true }
```

---

## 3. Option B — Netlify (fastest, no Git required)

- **Drag-and-drop:** go to **app.netlify.com → Sites → "Deploy manually"** and drag the `aeromind-drone-simulator` **folder** onto the drop zone. Live in seconds.
- **Git-connected:** New site from Git → pick the repo → Build command: *(none)*, Publish directory: `.`/root → Deploy.

---

## 4. Option C — GitHub Pages

1. Push the repo to GitHub (see §2a).
2. Repo **Settings → Pages**.
3. **Source:** *Deploy from a branch*. **Branch:** `main`, folder **`/ (root)`**. Save.
4. Wait ~1 minute. Site is at `https://<your-username>.github.io/aeromind-drone-simulator/`.

> GitHub Pages serves from a subpath. AeroMind uses **no absolute paths** (the only asset is an absolute CDN URL), so it works under a subpath without changes.

---

## 5. Generic static host / local preview

Because it's plain files, AeroMind also runs on Cloudflare Pages, Firebase Hosting, S3 + CloudFront, Render static sites, or any web server. Just publish the folder so `index.html` is at the served root. Quick local servers:

```bash
npx serve .                 # Node
python3 -m http.server 8000 # Python  → http://localhost:8000
```

---

## 6. Post-deployment smoke test (run on the LIVE url)

- [ ] Live URL loads over **HTTPS** and shows the start screen.
- [ ] **Console has no errors**; **Network** shows `three.min.js` = **200** (not blocked).
- [ ] **Launch Simulator** starts a flight; the drone, propellers, and HUD render.
- [ ] Each axis behaves: `W/S` pitch, `A/D` roll, `Q/E` yaw, `Space/Shift` throttle.
- [ ] HUD updates (altitude, heading, battery drains, mode), warnings appear in scenarios.
- [ ] **Anatomy** mode: clicking parts shows tooltips.
- [ ] A lesson's objectives auto-complete and the **score/debrief** toast appears.
- [ ] Loads on a second device / mobile (expect reduced layout; keyboard control needs a desktop).
- [ ] **Hard refresh** (Ctrl/Cmd+Shift+R) to confirm no stale cache.

If anything fails, see §8.

---

## 7. CDN-free / offline fallback (vendor Three.js)

If your host blocks public CDNs, or you want the demo to work fully offline, bundle Three.js into the repo so there are **zero network dependencies**.

```bash
cd aeromind-drone-simulator
mkdir -p vendor
# download the exact version the app expects (r128):
curl -L -o vendor/three.min.js \
  https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
```

Then edit `index.html` — change the one script tag from the CDN URL to the local copy:

```html
<!-- before -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<!-- after -->
<script src="vendor/three.min.js"></script>
```

Re-run `node dev/_check.js`, re-test §1, commit `vendor/three.min.js`, and redeploy. The app is now self-contained.

> Pin to **r128** specifically — the simulator uses APIs and the global `THREE` build matching that version (e.g. `sRGBEncoding`, classic non-module build). Don't silently upgrade.

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| **Blank / black screen, "THREE not loaded" message** | CDN blocked or offline | Use the **vendored** Three.js (§7), or unblock `cdnjs.cloudflare.com` |
| Page loads but nothing renders, console `THREE is undefined` | Script order changed, or wrong version | Keep the Three.js tag **before** the inline script; pin **r128** |
| Controls do nothing | Window not focused / clicked into | Click the page once; ensure no other element has focus |
| Works on `file://` but blank when hosted | Mixed content (http page loading https CDN, or vice-versa) | Serve the site over **HTTPS**; the CDN URL is already https |
| `.html` downloads instead of rendering | Wrong MIME type on a custom server | Configure server to serve `text/html`; Vercel/Netlify/Pages do this automatically |
| Choppy / low frame rate | Low-power GPU, shadows heavy | Expected on weak hardware; it still functions. (Future: add a quality toggle to disable shadows.) |
| Mobile: can't fly | No physical keyboard | Use a desktop for flight; mobile shows the UI. (Future: add on-screen touch sticks.) |
| Stale version after redeploy | Browser cache | Hard refresh (Ctrl/Cmd+Shift+R) |

---

## 9. Custom domain (optional)

- **Vercel:** Project → **Settings → Domains → Add**, then point your DNS (`CNAME` to `cname.vercel-dns.com`, or use Vercel nameservers). HTTPS is automatic.
- **Netlify:** Site → **Domain management → Add custom domain**, follow DNS instructions. HTTPS automatic.
- **GitHub Pages:** Settings → Pages → **Custom domain**, add a `CNAME` record at your DNS provider.

---

## 10. Optional — CI syntax check (GitHub Actions)

Catch a broken edit before it deploys. Save as `.github/workflows/check.yml`:

```yaml
name: check
on: [push, pull_request]
jobs:
  syntax:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: node dev/_check.js
```

---

### TL;DR

```bash
node dev/_check.js                      # 1. verify
git init && git add . && git commit -m "AeroMind"
git push  # to your GitHub repo
# 2. import repo in Vercel → Framework: Other → Deploy (no build settings)
# 3. open the live URL and run the §6 smoke test
```
