# Sam Vu · Portfolio (Drone HUD, dark)

Single-page static portfolio built with Astro 5, TypeScript and plain CSS. Full spec: `Portfolio site build spec (Drone HUD, dark).md`.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 (shows a TODO where the About paragraph is empty) |
| `npm run build` | `astro check` + static build to `dist/` |
| `npm run preview` | Serve the built site |
| `npm run format` | Prettier |

## Updating content

All copy lives in `src/data/site.ts`. Components hold no text.

- **About paragraph:** set `profile.about`.
- **Portrait:** add `public/img/sam.jpg` (4:5, 560×700). Until then a placeholder shows.
- **Resume:** add `public/resume.pdf`. The Resume button links to it.
- **Project screenshots:** add `public/img/projects/<name>.webp` (960×480), matching each project's `image`. Missing files show a placeholder with the project name.
- A project with `url: null` renders as a plain (non-link) card.

## Deploying

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`. In the repo settings, set **Pages → Source** to **GitHub Actions**. The site URL is set in `astro.config.mjs` (`site`) and `public/robots.txt`; change both if you use a custom domain.

Lighthouse CI (`.github/workflows/lighthouse.yml`, `lighthouserc.json`) runs on pull requests and fails below 95 in any category.

## Open Graph image

`public/og.png` is rendered once from `tools/og.html` at 1200×630 with a headless browser. Re-render it if the name or tagline changes.
