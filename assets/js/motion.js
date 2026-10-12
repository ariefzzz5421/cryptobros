const INTERACTIVE = 'button, a.btn, .seg-btn, .source-link, .source-button, .landing-cta, .landing-route, .nft-read-link';

export function initMotion() {
  document.addEventListener('pointerdown', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = event.target.closest(INTERACTIVE);
    if (!target || target.matches('[disabled], [aria-disabled="true"]')) return;
    const bounds = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'interaction-ripple';
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    target.classList.add('has-interaction-ripple');
    target.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }, { passive: true });
}
