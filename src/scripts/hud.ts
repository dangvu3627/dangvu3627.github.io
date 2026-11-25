import { hudMap } from '../data/site';

const secEl = document.querySelector<HTMLElement>('[data-hud-sec]');
const altEl = document.querySelector<HTMLElement>('[data-hud-alt]');
const links = document.querySelectorAll<HTMLAnchorElement>('[data-nav]');

function activate(sec: string): void {
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
      if (e.isIntersecting) activate((e.target as HTMLElement).dataset.sec ?? '');
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
);

document.querySelectorAll<HTMLElement>('[data-sec]').forEach((el) => io.observe(el));
