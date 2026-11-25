# Portfolio site build spec (Drone HUD, dark)

Nov 25, 2026 · @D

Build a single-page, dark, scrollable portfolio for Sam Vu that looks like a drone camera feed (a heads-up display) but reads like a normal recruiter-friendly resume site. The visual source of truth is the [Drone HUD portfolio mockup](https://claude.ai/artifact/4eFvWmNsNX2CXKubh1FyCg); match it unless this spec says otherwise.

## Overview

**Goals**

- A recruiter finds name, school, resume, email, contact and the latest role within 5 seconds of load, without clicking anything.
- The drone HUD theme shows up in the frame, readouts and motion, never in the way of content.
- Fast and static: no backend, loads well on a phone.

**Non-goals**

- No 3D, three.js or video. The HUD is HTML, CSS and SVG.
- No CMS, blog,  or analytics in v1.
- No light theme in v1.

## Tech stack and setup

Use Astro with TypeScript and plain CSS, built to static files and deployed to GitHub Pages (or Vercel). There's no React and no UI library; the only client-side script is one small TypeScript file.

| Piece | Choice |
| --- | --- |
| Framework | Astro 5, static output |
| Language | TypeScript (strict) |
| Styling | Plain CSS with custom properties in `src/styles/tokens.css`; scoped `<style>` in components |
| Fonts | Inter (400/500/600/700) and JetBrains Mono (400/500), self-hosted via `@fontsource` |
| Client JS | `src/scripts/hud.ts`: section tracking only |
| Hosting | GitHub Pages via GitHub Actions; custom domain optional |
| Quality | Prettier, `astro check`, Lighthouse CI on pull requests |

File structure:

```
src/
  data/site.ts          # all content (Content data section)
  styles/tokens.css     # colours, type, spacing
  styles/global.css     # resets, scanlines, motion utilities
  components/
    HudBar.astro        # sticky top bar
    HeroFov.astro       # full FOV frame + crosshair
    SectionHeader.astro # "02 / EXPERIENCE" label + h2
    TargetCard.astro    # card with hover target brackets
    ExperienceItem.astro
    ProjectCard.astro
    SkillGroup.astro
  scripts/hud.ts        # IntersectionObserver for SEC/ALT readout
  pages/index.astro
public/
  resume.pdf
  img/sam.jpg           # portrait 4:5
  img/projects/*.webp   # 16:8 screenshots
```

## Design tokens

One near-black ground, off-white text, and a single red accent used only for HUD marks (record dot, crosshair centre, section labels, target brackets, focus ring).

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0a0b0c` | Page background |
| `--surface` | `#0e1012` | Cards |
| `--surface-2` | `#14171a` | Image placeholders, skill chips |
| `--line` | `#1c2024` | Section dividers, header border |
| `--line-card` | `#1f2428` | Card borders |
| `--line-strong` | `#3a4148` | Secondary button border, card hover border |
| `--text` | `#eef0f1` | Headings, primary text, HUD lines |
| `--text-2` | `#b9c0c6` | Body copy, HUD readouts |
| `--text-3` | `#8d969e` | Meta text (dates, labels); smallest allowed text colour |
| `--accent` | `#ff3b3b` | HUD marks only, never body text or large fills |

| Type role | Font | Size / line height | Weight |
| --- | --- | --- | --- |
| Hero name | Inter | clamp(44px, 7vw, 76px) / 1.0, letter-spacing -2px | 700 |
| Section h2 | Inter | 36px / 1.1, letter-spacing -0.8px | 700 |
| Card title | Inter | 18px / 1.4 | 600 |
| Body | Inter | 16px / 1.55 (15px in cards) | 400 |
| HUD readouts, labels, dates, tags | JetBrains Mono | 12–13px | 400–500 |

Other tokens:

- Content max width 1120px with 24px side padding.
- Section padding 96px top and bottom (64px under 600px).
- Card radius 6px, button radius 8px, chip radius 4px.
- Scanline overlay on the page: `repeating-linear-gradient(0deg, rgba(255,255,255,.028) 0 1px, transparent 1px 3px)`.

## Page structure

One page, top to bottom, in this order. Each section has an `id` (for anchor links) and a `data-sec` attribute (for the HUD readout).

1. **Sticky HUD bar** (`header`, always visible): see HUD components.
2. **Hero** (`#top`, `data-sec="hero"`, min-height 680px, or 560px under 600px): the full FOV frame. Centre column, max 760px:
   - Mono label "TARGET ACQUIRED" in `--text-3`.
   - h1 "Sam Vu".
   - One line: "Computer Science (Co-op) at the University of Waterloo · Digital Hardware Specialization · Embedded flight software at WARG".
   - The name block sits above the horizon line and the buttons below it, with a 120px gap that the crosshair sits in.
   - Buttons: Resume (filled `--text` on `--bg`, links to `/resume.pdf`), Email (`mailto:`), GitHub, LinkedIn (outlined).
3. **About** (`#about`): label "01 / ABOUT", h2 "About me".
   - Left: Sam's own paragraph (placeholder until he writes it), then a meta row: "B.CS (Co-op) · Sep 2026 – May 2031" and "President's Scholarship of Distinction (2026)".
   - Right: a 280px-wide 4:5 portrait with four red corner brackets 10px outside the image.
   - The columns stack under 760px, photo first.
4. **Experience** (`#experience`): label "02 / EXPERIENCE". One full-width card per role.
   - Left column (210px, mono): dates and location.
   - Right column: role (18px/600), organisation, bullet list.
5. **Projects** (`#projects`): label "03 / PROJECTS". Grid `repeat(auto-fill, minmax(min(100%, 460px), 1fr))`, gap 20px, so 2 columns on desktop and 1 on mobile.
   - Each card links to its repo: 16:8 screenshot, then name with the date right-aligned (mono), description, mono tech tags.
6. **Skills** (`#skills`): label "04 / SKILLS". Grid `minmax(min(100%, 320px), 1fr)`, so 3 columns on desktop. Each group has a mono uppercase label above a top rule, then chips.
7. **Contact footer** (`#contact`): label "05 / CONTACT", h2 "Let's talk.", email link, then GitHub, LinkedIn and © 2026 Sam Vu on the right in mono.

## HUD components

Three pieces carry the drone look. All of them are decorative except the HUD bar, so give them `aria-hidden="true"` and `pointer-events: none`.

**HudBar.astro** (sticky top bar)

- `position: sticky; top: 0; z-index: 10`, background `rgba(10,11,12,.82)` with `backdrop-filter: blur(10px)`, 1px bottom border `--line`. Mono 13px.
- Left: a blinking red dot (8px) and "Sam Vu" in Inter 600 15px, linking to `#top`.
- Centre: nav links About, Experience, Projects, Skills, Contact. The active link is filled (`--text` background, `--bg` text, radius 6px); the others are `--text-2`.
- Right: `SEC: <label>` and `ALT: <n>m`, values in `--text`, labels in `--text-3`.
- Under 600px it wraps to two rows: name and readouts on the first, nav scrolling horizontally on the second.

**HeroFov.astro** (full FOV frame)

- Inset from the hero edges by `max(24px, 4vw)` left and right, and 28px top and bottom.
- Four corner brackets: 64×40px, 2px `--text` border on two sides, 10px outer radius.
- Top readout row (mono 13px, `--text-2`), spread evenly: REC · RSSI: -72dBm · 02:28:00 · GPS: 14 · BAT: 23%. Bottom row: DIST: 1240m · GS: 119km/h. Left middle: V.S.: 0.0. Right middle: ALT: 154m.
- Horizon: two 2px lines from 16% to 84% of the width, broken by a 44px crosshair (an 88px vertical and an 88px horizontal 2px line) with a 10px red square at its centre.
- Under 600px, hide the side readouts and the bottom row, and shorten the horizon to 8%–92%.

**TargetCard.astro** (card with hover brackets)

- Base: `--surface`, 1px `--line-card` border, radius 6px.
- On hover and on `:focus-visible`, the border becomes `--line-strong`, the background `#111417`, and two red 14px corner brackets (top-left, bottom-right, 2px `--accent`) snap in from 6px outside to their resting place over 200ms.
- Brackets are `::before` and `::after` pseudo-elements, so there's no extra markup.
- Used by experience items and project cards.

## Motion

All motion is short and never blocks content: the hero is readable within 1s, and nothing waits on a loader. Under `prefers-reduced-motion: reduce`, every animation below is off and content shows in its final state.

| Effect | Trigger | Spec |
| --- | --- | --- |
| FOV frame expands | Page load | Frame scales 0.6 → 1 and fades in, 900ms, `cubic-bezier(.2,.7,.2,1)` |
| Hero text boots in | Page load | Each item rises 16px and fades in, 700ms, same easing, staggered at 500 / 600 / 700 / 850ms (label, name, line, buttons) |
| REC dot blinks | Always | Opacity 1 ↔ 0.15, 1.2s, `steps(1)` |
| Sections reveal | Scroll | Rise 16px and fade in as the section enters, via `animation-timeline: view(); animation-range: entry 0% cover 22%` |
| HUD readout updates | Scroll | SEC label and ALT change when a section crosses the middle of the viewport |
| Target brackets | Hover or focus on a card | Brackets slide 6px into place and fade in, 200ms |

Scroll reveal is CSS only. Browsers without scroll-driven animations show sections in place with no motion:

```css
@keyframes up { from { opacity: 0; transform: translateY(16px); } }
.reveal { animation: up linear both; animation-timeline: view(); animation-range: entry 0% cover 22%; }
@supports not (animation-timeline: view()) { .reveal { animation: none; } }
```

Section tracking in `src/scripts/hud.ts` (the only client JS):

- One `IntersectionObserver` with `rootMargin: '-45% 0px -50% 0px'` watches every `[data-sec]` element.
- When a section intersects, set the readout text, set `aria-current="true"` on its nav link, and remove it from the others.
- The SEC and ALT values come from this map; the drone "descends" as you scroll:

| data-sec | SEC label | ALT |
| --- | --- | --- |
| hero | TAKE-OFF | 154m |
| about | ABOUT | 120m |
| experience | EXPERIENCE | 90m |
| projects | PROJECTS | 60m |
| skills | SKILLS | 30m |
| contact | LANDED | 0m |

- The readout is wrapped in `aria-hidden="true"` so screen readers don't announce every change; the nav's `aria-current` carries the real state.
- Anchor links scroll smoothly via `html { scroll-behavior: smooth; scroll-padding-top: 72px; }`, turned off under reduced motion.

## Content data

All copy lives in `src/data/site.ts` so Sam can update the site without touching components. Use this file as written; it comes from his resume (November 2026). Leave out his phone number on purpose.

```ts
export const profile = {
  name: 'Sam Vu',
  tagline: 'Computer Science (Co-op) at the University of Waterloo · Digital Hardware Specialization · Embedded flight software at WARG',
  about: '', // Sam writes this; render a visible TODO in dev only
  education: 'B.CS (Co-op) · Sep 2026 – May 2031',
  award: "President's Scholarship of Distinction (2026)",
  email: 'dangvu3627@gmail.com',
  github: 'https://github.com/dangvu3627',
  linkedin: 'https://linkedin.com/in/sam-vu-waterloo/',
  resume: '/resume.pdf',
  photo: '/img/sam.jpg',
};

export const experience = [
  {
    role: 'Embedded Flight Software Developer',
    org: 'Waterloo Aerial Robotics Group (WARG)',
    dates: 'Sep 2026 – Present', place: 'Waterloo, ON',
    points: [
      'Developing a CAN blackbox logger in C on STM32 to record flight-system CAN traffic for debugging',
      'Wrote STM32 firmware reading an MCP3004 ADC over SPI and mapping each reading to a PWM output',
      'Coordinate asynchronously with the firmware team through Git feature branches and Confluence docs',
    ],
  },
  {
    role: 'Co-Lead, Sumobot Team',
    org: 'TDCH Robotics Club',
    dates: 'Sep 2025 – Nov 2025', place: 'Vaughan, ON',
    points: [
      'Co-led a 5-person team at the Ontario Tech University Sumobot competition, placing in the top 16',
      'Built a high-torque LEGO sumo robot with a 25:1 gear reduction to out-push opponents',
    ],
  },
];

export const projects = [
  { name: 'Arduino Quadcopter', date: 'Nov 2025', url: 'https://github.com/dangvu3627/Arduino-Drone', image: '/img/projects/quadcopter.webp',
    desc: 'Quadcopter built and flight-tested on an Arduino Nano with an MPU6050 IMU, plus a custom 6-channel 2.4 GHz controller and a receiver with a 1 s failsafe.',
    tags: ['C++', 'Arduino', 'nRF24L01', 'MPU6050', 'ESCs'] },
  { name: 'FarmBot', date: 'Nov 2026', url: 'https://github.com/dangvu3627/FarmBot', image: '/img/projects/farmbot.webp',
    desc: 'Battery-powered handheld game console on an ESP32 with a 128x64 OLED and rotary encoder; 30 Hz main loop and CRC-32-checked saves to flash.',
    tags: ['C++', 'ESP32', 'PlatformIO', 'I2C'] },
  { name: 'Split', date: 'Nov 2026', url: null, image: '/img/projects/split.webp',
    desc: 'Receipt-scanning bill-splitting app built by a 2-person team at a hackathon, with idempotent PayPal Orders API requests to block duplicate charges.',
    tags: ['Node.js', 'Gemini API', 'PayPal API'] },
  { name: 'Pyronac', date: 'Oct 2026', url: 'https://github.com/andrewl746/pyronac', image: '/img/projects/pyronac.webp',
    desc: 'NASA Space Apps Challenge 2026: built the frontend with a 6-person team in 48 hours and presented it to the judges.',
    tags: ['React', 'TypeScript'] },
];

export const skills = [
  { group: 'Languages', items: ['C', 'C++', 'Python', 'JavaScript'] },
  { group: 'Microcontrollers', items: ['STM32', 'ESP32', 'Arduino (ATmega328P)'] },
  { group: 'Protocols', items: ['CAN', 'SPI', 'I2C', 'UART', 'PWM', 'PPM', 'ADC'] },
  { group: 'Embedded concepts', items: ['Timer interrupts', 'Real-time loops', 'Failsafes', 'Flash/NVS', 'Debouncing'] },
  { group: 'Hardware', items: ['IMU (MPU6050)', 'ESCs', 'Motors', 'Servos', 'nRF24L01', 'OLED', 'Rotary encoders'] },
  { group: 'Developer tools', items: ['Git', 'STM32CubeIDE', 'PlatformIO', 'VS Code'] },
];
```

Rendering rules:

- A project with `url: null` renders as a plain card, not a link.
- A missing image file shows the `--surface-2` placeholder box with the project name, not a broken image.
- Skill group labels display in uppercase via CSS (`text-transform`), not in the data.

## Responsive, accessibility, performance and SEO

**Responsive**

- Test at 360, 390, 768, 1024, 1280 and 1440px wide. Nothing scrolls sideways at 360px.
- Breakpoints: 600px (HUD bar wraps, hero simplifies, section padding 64px) and 760px (About stacks, photo first).
- Buttons and nav links are at least 44px tall.

**Accessibility (WCAG 2.2 AA)**

- Text contrast is at least 4.5:1. No text is lighter than `--text-3`, and the red accent is never used for body text.
- Use real elements: `<header>`, `<nav>`, `<main>`, `<section>` with an `h2` each, `<footer>`, and `<a>` for every link.
- Add a skip link ("Skip to content") as the first focusable element.
- Focus ring: 2px `--accent` outline, 3px offset, on every interactive element.
- The HUD frame, crosshair, readouts and scanlines are `aria-hidden="true"`. The portrait has alt text "Portrait of Sam Vu".
- External links get `rel="noopener"`; the resume link opens the PDF in place.

**Performance budget**

| Metric | Target |
| --- | --- |
| Lighthouse (mobile): Performance, Accessibility, Best Practices, SEO | ≥ 95 each |
| Largest Contentful Paint | < 1.5s on a fast 4G profile |
| Cumulative Layout Shift | < 0.05 |
| Client JS | < 5 KB gzipped |
| Total page weight | < 600 KB including images |

- Images are WebP, sized to their slots (portrait 560×700, project screenshots 960×480), lazy-loaded below the hero.
- Fonts: subset to Latin, `font-display: swap`, preload Inter 700 and JetBrains Mono 400.

**SEO and sharing**

- Title "Sam Vu · Embedded & Hardware Portfolio"; a meta description built from the tagline.
- An Open Graph image (1200×630) showing the hero FOV frame with the name; build it once as a static PNG.
- Favicon: the red crosshair square on black.
- `sitemap.xml` and `robots.txt` via `@astrojs/sitemap`.

## Acceptance checklist and open items

The build is done when every box below is ticked; the open items are for Sam and don't block the build.

**Acceptance (for Claude Code)**

- [ ] Page matches the mockup's layout, colours and type at 1440px and 390px
- [ ] All content comes from `src/data/site.ts`; no copy is hard-coded in components
- [ ] Name, tagline, Resume and Email are visible above the fold at 1280×720 and 390×844
- [ ] Load animation finishes within 1.2s; no loader screen
- [ ] Sections reveal on scroll in Chrome and show statically in Safari/Firefox without scroll-timeline support
- [ ] SEC/ALT readout and active nav link update while scrolling
- [ ] Target brackets appear on hover and keyboard focus
- [ ] Reduced-motion setting turns off every animation and smooth scroll
- [ ] Keyboard-only walkthrough reaches every link in order with a visible focus ring
- [ ] Lighthouse mobile scores ≥ 95 in all four categories
- [ ] Deploys to GitHub Pages from `main` via GitHub Actions

**Open items for Sam**

- [ ] Write the About paragraph
- [ ] Add the portrait (4:5) and the resume PDF
- [ ] Add project screenshots (or photos of the hardware)
- [ ] Decide on a Split link (repo or Devpost), or leave it unlinked
- [ ] Make the FarmBot repo public, or drop its link
- [ ] Pick a domain, or use `dangvu3627.github.io`
