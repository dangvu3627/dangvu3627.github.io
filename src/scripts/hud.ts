import { hudMap } from '../data/site';

const secEl = document.querySelector<HTMLElement>('[data-hud-sec]');
const altEl = document.querySelector<HTMLElement>('[data-hud-alt]');
const links = document.querySelectorAll<HTMLAnchorElement>('[data-nav]');
const footer = document.querySelector<HTMLElement>('footer[data-sec]');

let middle = 'hero'; // section crossing the middle of the viewport
let landed = false; // footer mostly in view (it is too short to reach the middle band)

function render(): void {
  const sec = landed && footer ? (footer.dataset.sec ?? middle) : middle;
  const entry = hudMap[sec];
  if (!entry) return;
  if (secEl) secEl.textContent = entry.label;
  if (altEl) altEl.textContent = `${entry.alt}m`;
  links.forEach((a) => {
    if (a.dataset.nav === sec) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
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
