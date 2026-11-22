# MathClass Network

A peer-led study network for math students. React + TypeScript + Vite, served at
[mathclass.uk](https://mathclass.uk).

## Stack

- React 19 with React Router 7 (client-side routing)
- TypeScript (strict) and Vite
- One hand-written global stylesheet — no UI framework
- Deployed to GitHub Pages via GitHub Actions

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

## Checks and build

```bash
npm run typecheck  # tsc --noEmit
npm run build      # typecheck, vite build, SPA fallback, social card
npm run preview    # serve the production build
```

Two small build scripts run after Vite:

- `scripts/spa-fallback.mjs` copies the built `index.html` to `dist/404.html`. GitHub
  Pages serves that file for unknown paths, which lets React Router render deep links
  such as `/classes/geometry` instead of a Pages 404.
- `scripts/build-og.mjs` renders `dist/og-image.png` (1200×630) from flat shapes using
  only Node's `zlib`. The social card stays in sync with the brand palette and the repo
  stays free of binary assets.

The dependency lockfile is not committed yet, so CI installs with `npm install`. Once the
dependency set is fixed, commit `package-lock.json`, remove it from `.gitignore` and switch
the workflow to `npm ci` for reproducible installs.

## Deploy

1. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. `.github/workflows/deploy.yml` builds the site and publishes `dist/`.
3. The custom domain is pinned by `public/CNAME` (`mathclass.uk`).

## Domain (mathclass.uk)

Point DNS at GitHub Pages, then enable HTTPS in **Settings → Pages**:

| Type  | Name | Value                  |
| ----- | ---- | ---------------------- |
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | `NOTAM-bobk.github.io` |

## Routes

| Path             | Page                                  |
| ---------------- | ------------------------------------- |
| `/`              | Home, daily problem, topic explorer   |
| `/classes`       | Class catalogue with filters + search |
| `/classes/:slug` | Class room detail                     |
| `/community`     | Rooms, rules, sessions, FAQ           |
| `*`              | 404                                   |

## Structure

```
src/
  components/   Nav, Footer, Layout, ProblemCard, TopicTabs, ClassCard, Brand
  data/         class catalogue, daily problems, sample topics, site constants
  lib/          SEO hook, scroll reveal hook
  pages/        Home, Classes, ClassDetail, Community, NotFound
  styles.css    design tokens and all component styles
public/         CNAME, robots.txt, sitemap.xml, manifest, favicon
scripts/        SPA fallback for Pages, social card generator
```

## Content notes

Class unit counts and the session timetable are placeholders for the foundation release.
There is no backend yet: rooms, posting and accounts are the next layer.
