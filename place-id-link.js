// Embed the interactive finder published by Google; do not copy its API key.
const finderUrl = 'https://maps-docs-team.web.app/samples/places-placeid-finder/dist/';
function addFinder() {
  const root = document.getElementById('root');
  const header = root.querySelector('header');
  const workspace = root.querySelector('.workspace');
  if (!header || !workspace) return false;
  if (root.querySelector('#place-id-finder')) return true;
  const section = document.createElement('section');
  section.id = 'place-id-finder';
  section.setAttribute('aria-label', 'Find a business Place ID on Google Maps');
  section.style.cssText = 'scroll-margin-top:20px;border-bottom:1px solid #d9e5e2';
  const intro = document.createElement('div');
  intro.className = 'search-block';
  const heading = document.createElement('h2');
  heading.textContent = 'Find your business on Google Maps';
  heading.style.cssText = 'font-size:20px;margin:0 0 8px';
  const help = document.createElement('p');
  help.textContent = 'Type your business name in the map search bar. Select the correct address, copy the Place ID shown on the map, then enter it in the field below.';
  help.style.cssText = 'color:#58716e;font-size:14px;line-height:1.6;margin:0';
  intro.append(heading, help);
  const frame = document.createElement('iframe');
  frame.src = finderUrl;
  frame.title = 'Google Maps Place ID Finder — search business name';
  frame.style.cssText = 'display:block;width:100%;height:480px;border:0;background:#edf8f5';
  frame.allowFullscreen = true;
  const note = document.createElement('p');
  note.textContent = 'Interactive Place ID Finder provided and hosted by Google. Search results appear inside the map.';
  note.style.cssText = 'padding:12px 24px;margin:0;font-size:12px;color:#58716e';
  section.append(intro, frame, note);
  workspace.prepend(section);
  const setup = workspace.querySelector('.setup-state');
  if (setup) setup.remove();
  const manual = workspace.querySelector('details');
  if (manual) manual.open = true;
  const link = document.createElement('a');
  link.href = '#place-id-finder';
  link.textContent = 'Place ID Finder ↓';
  link.className = 'button secondary';
  link.style.cssText = 'text-decoration:none;margin-left:auto;margin-right:12px;font-size:12px';
  header.insertBefore(link, header.lastElementChild);
  return true;
}
if (!addFinder()) {
  const observer = new MutationObserver(() => { if (addFinder()) observer.disconnect(); });
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
}
