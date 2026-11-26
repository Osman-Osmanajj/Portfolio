const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  navigation.classList.toggle('is-open', !isOpen);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
}));
const emailDialog = document.querySelector('#email-dialog');
const emailOpen = document.querySelector('#email-open');
const emailClose = document.querySelector('#email-close');
const emailCopy = document.querySelector('#email-copy');
const copyStatus = document.querySelector('#copy-status');

emailOpen?.addEventListener('click', () => {
  copyStatus.textContent = '';
  emailDialog.showModal();
});
emailClose?.addEventListener('click', () => emailDialog.close());
emailDialog?.addEventListener('click', event => {
  if (event.target === emailDialog) emailDialog.close();
});
emailDialog?.addEventListener('close', () => emailOpen.focus());
emailCopy?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector('#email-text').textContent.trim());
    copyStatus.textContent = 'Email address copied.';
    emailCopy.textContent = 'Copied';
    window.setTimeout(() => { emailCopy.textContent = 'Copy'; }, 2200);
  } catch {
    copyStatus.textContent = 'Select the email address above to copy it.';
  }
});

const slider = document.querySelector('#project-slider');
const previousButton = document.querySelector('#project-prev');
const nextButton = document.querySelector('#project-next');
const position = document.querySelector('#slider-position');
const progress = document.querySelector('#slider-progress');

if (slider && previousButton && nextButton && position && progress) {
  const cards = [...slider.querySelectorAll('.project-card')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pendingFrame = false;

  function cardStep() {
    return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : slider.clientWidth;
  }

  function visibleCards() {
    const width = cards[0].getBoundingClientRect().width;
    return Math.max(1, Math.round(slider.clientWidth / width));
  }

  function updateSlider() {
    pendingFrame = false;
    const maxFirst = Math.max(0, cards.length - visibleCards());
    const first = Math.min(
      maxFirst,
      Math.round(slider.scrollLeft / cardStep())
    );
    const last = Math.min(cards.length, first + visibleCards());
    const twoDigits = number => String(number).padStart(2, '0');
    position.textContent = (first === last - 1 ? twoDigits(first + 1) :
      `${twoDigits(first + 1)}–${twoDigits(last)}`) + ` / ${twoDigits(cards.length)}`;
    previousButton.disabled = first === 0;
    nextButton.disabled = first === maxFirst;
    progress.style.width = `${Math.min(100, (slider.scrollLeft + slider.clientWidth) / slider.scrollWidth * 100)}%`;
  }

  function scheduleUpdate() {
    if (!pendingFrame) {
      pendingFrame = true;
      requestAnimationFrame(updateSlider);
    }
  }

  function move(direction) {
    slider.scrollBy({
      left: direction * cardStep(),
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  }

  previousButton.addEventListener('click', () => move(-1));
  nextButton.addEventListener('click', () => move(1));
  slider.addEventListener('scroll', scheduleUpdate, { passive: true });
  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  new ResizeObserver(scheduleUpdate).observe(slider);
  updateSlider();
}
