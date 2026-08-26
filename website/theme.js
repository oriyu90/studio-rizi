// Resolve once before paint; OS changes also update artwork and browser chrome.
(() => {
  const requested = new URLSearchParams(location.search).get('theme');
  const forced = ['light', 'dark'].includes(requested) ? requested : null;
  const preference = matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() {
    const theme = forced || (preference.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = theme === 'dark' ? '#0d100d' : '#ffffff';
    });
    document.querySelectorAll('picture source').forEach(source => {
      if (!source.dataset.themeMedia && source.media.includes('prefers-color-scheme: dark')) {
        source.dataset.themeMedia = source.media;
      }
      if (source.dataset.themeMedia) source.media = forced ? (theme === 'dark' ? 'all' : 'not all') : source.dataset.themeMedia;
    });
  }
  applyTheme();
  document.addEventListener('DOMContentLoaded', applyTheme);
  if (preference.addEventListener) preference.addEventListener('change', applyTheme);
  else preference.addListener(applyTheme);
})();
