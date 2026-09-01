(() => {
  const languageDetails = document.querySelector('.language-switcher');

  document.addEventListener('pointerdown', event => {
    if (languageDetails?.open && !languageDetails.contains(event.target)) {
      languageDetails.open = false;
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && languageDetails?.open) {
      languageDetails.open = false;
      languageDetails.querySelector('summary')?.focus();
    }
  });
})();
