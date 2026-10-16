(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const portrait = document.querySelector('.portrait');
  const portraitWrap = document.querySelector('.portrait-wrap');
  const year = document.querySelector('#year');
  const navLinks = [...document.querySelectorAll('.nav-link')];

  year.textContent = new Date().getFullYear();

  try {
    if (localStorage.getItem('derek-site-theme') === 'dark') root.dataset.theme = 'dark';
  } catch (_) { /* Theme switching still works if storage is unavailable. */ }

  const updateThemeLabel = () => {
    const isDark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  };
  updateThemeLabel();

  themeButton.addEventListener('click', () => {
    const isDark = root.dataset.theme !== 'dark';
    if (isDark) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    try { localStorage.setItem('derek-site-theme', isDark ? 'dark' : 'light'); } catch (_) { /* Ignore blocked storage. */ }
    updateThemeLabel();
  });

  const showPortraitFallback = () => {
    portraitWrap.classList.remove('has-photo');
    portrait.hidden = true;
  };
  portrait.addEventListener('load', () => portraitWrap.classList.add('has-photo'));
  portrait.addEventListener('error', showPortraitFallback);
  if (portrait.complete && portrait.naturalWidth > 0) portraitWrap.classList.add('has-photo');
  else if (portrait.complete) showPortraitFallback();

  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    sections.forEach(section => observer.observe(section));
  }
})();
