// Keep this small addition independent of the compiled Review Studio application.
function addFinderLink() {
  const header = document.querySelector('#root header');
  if (!header || header.querySelector('[data-place-id-finder]')) return Boolean(header);
  const link = document.createElement('a');
  link.href = './place-id-finder.html';
  link.textContent = 'Place ID Finder ↗';
  link.dataset.placeIdFinder = '';
  link.className = 'button secondary';
  link.style.cssText = 'text-decoration:none;margin-left:auto;margin-right:12px;font-size:12px';
  header.insertBefore(link, header.lastElementChild);
  return true;
}
if (!addFinderLink()) {
  const observer = new MutationObserver(() => {
    if (addFinderLink()) observer.disconnect();
  });
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
}
