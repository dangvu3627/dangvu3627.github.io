import { hudMap } from '../data/site';

const secEl = document.querySelector<HTMLElement>('[data-hud-sec]');
const track = document.querySelector<HTMLElement>('[data-nav-track]');
const pill = document.querySelector<HTMLElement>('[data-nav-pill]');
const nav = track?.parentElement ?? null;
const links = document.querySelectorAll<HTMLAnchorElement>('[data-nav]');
const footer = document.querySelector<HTMLElement>('footer[data-sec]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

let middle = 'hero'; // section crossing the middle of the viewport
let landed = false; // footer mostly in view (it is too short to reach the middle band)
let current = '';

/** Clip the active-style copy down to the active link; zero width at the first link when none is active. */
function placePill(active: HTMLAnchorElement | undefined): void {
  if (!track || !pill) return;
  const first = links[0];
  const left = active ? active.offsetLeft : (first?.offsetLeft ?? 0);
  const width = active ? active.offsetWidth : 0;
  const right = track.offsetWidth - left - width;
  // 4px top/bottom: a 36px pill as in the mockup, inside a 44px hit area.
  pill.style.clipPath = `inset(4px ${right}px 4px ${left}px round 6px)`;
}

function render(): void {
  const sec = landed && footer ? (footer.dataset.sec ?? middle) : middle;
  const entry = hudMap[sec];
  if (!entry || sec === current) return;
  current = sec;
  if (secEl) secEl.textContent = entry.label;
  let active: HTMLAnchorElement | undefined;
  links.forEach((a) => {
    if (a.dataset.nav === sec) {
      a.setAttribute('aria-current', 'true');
      active = a;
    } else a.removeAttribute('aria-current');
  });
  placePill(active);
  // On narrow screens the nav scrolls sideways: keep the active link in view.
  if (active && nav && nav.scrollWidth > nav.clientWidth) {
    nav.scrollTo({
      left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2,
      behavior: reduce.matches ? 'auto' : 'smooth',
    });
  }
}

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) middle = (e.target as HTMLElement).dataset.sec ?? middle;
    }
    render();
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
document.querySelectorAll<HTMLElement>('[data-sec]').forEach((el) => io.observe(el));

if (footer) {
  new IntersectionObserver(
    ([e]) => {
      landed = !!e && e.intersectionRatio >= 0.6;
      render();
    },
    { threshold: [0, 0.6, 1] },
  ).observe(footer);
}

// Re-measure when the layout changes (fonts swapping in, resize, nav wrapping).
if (track && pill) {
  const remeasure = (): void => placePill([...links].find((a) => a.hasAttribute('aria-current')));
  new ResizeObserver(remeasure).observe(track);
  // Enable the transition only after the first placement, so nothing animates on load.
  requestAnimationFrame(() => requestAnimationFrame(() => pill.setAttribute('data-ready', '')));
}
