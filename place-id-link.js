// Embed the interactive finder published by Google; do not copy its API key.
const finderUrl = 'https://maps-docs-team.web.app/samples/places-placeid-finder/dist/';
function addFinder() {
  const root = document.getElementById('root');
  const header = root.querySelector('header');
  const workspace = root.querySelector('.workspace');
  if (!header || !workspace) return false;
  if (window.IMAI_CONFIG?.googleMapsApiKey?.trim()) return enhanceNativeFinder(root, header, workspace);
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
function enhanceNativeFinder(root, header, workspace) {
  const search = workspace.querySelector('.search-block');
  const map = workspace.querySelector('.map-wrap');
  if (!search || !map) return false;
  if (root.querySelector('#quick-review-output')) return true;
  search.id = 'place-id-finder';
  const note = document.createElement('p');
  note.textContent = 'Search a business name and select the correct address, or click a business icon on the map. Its Place ID and review link appear here automatically.';
  note.style.cssText = 'font-size:13px;color:#58716e;line-height:1.6';
  search.append(note);
  const panel = document.createElement('section');
  panel.id = 'quick-review-output';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Quick review link');
  panel.style.cssText = 'padding:0 30px 24px';
  const name = document.createElement('strong');
  const address = document.createElement('p');
  address.style.cssText = 'font-size:13px;color:#58716e;margin:5px 0 12px';
  const idLabel = document.createElement('label');
  idLabel.htmlFor = 'quick-place-id'; idLabel.textContent = 'Place ID';
  const id = document.createElement('input');
  id.id = 'quick-place-id'; id.readOnly = true;
  const urlLabel = document.createElement('label');
  urlLabel.htmlFor = 'quick-review-url'; urlLabel.textContent = 'Google review link';
  const url = document.createElement('input');
  url.id = 'quick-review-url'; url.readOnly = true;
  const copied = document.createElement('p');
  copied.setAttribute('role', 'status');
  copied.style.cssText = 'font-size:12px;margin:0;color:#087953';
  for (const [label, field, caption] of [[idLabel,id,'Copy ID'],[urlLabel,url,'Copy review link']]) {
    const row = document.createElement('div'); row.className = 'copy-field';
    const button = document.createElement('button'); button.type = 'button'; button.textContent = caption;
    button.addEventListener('click', async () => {
      if (panel.hidden || !field.value) return;
      try { await navigator.clipboard.writeText(field.value); copied.textContent = 'Copied.'; }
      catch { field.focus(); field.select(); copied.textContent = 'Select and copy the highlighted text.'; }
    });
    row.append(field,button);
    if (field === id) panel.append(name,address);
    panel.append(label,row);
  }
  panel.append(copied);
  workspace.insertBefore(panel,map);
  let currentId = '';
  const sync = () => {
    const result = root.querySelector('.result');
    const fields = result?.querySelectorAll('.copy-field input');
    const placeId = fields?.[1]?.value || '';
    if (!placeId || placeId === currentId) return;
    currentId = placeId;
    id.value = placeId;
    url.value = 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(placeId);
    name.textContent = result.querySelector('h2')?.textContent || 'Selected business';
    address.textContent = result.querySelector('.result-head p')?.textContent || '';
    copied.textContent = '';
    panel.hidden = false;
  };
  new MutationObserver(sync).observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['value']});
  sync();
  const input = search.querySelector('input');
  input?.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    const options = search.querySelectorAll('.suggestions [role="option"]');
    if (options.length === 1) { event.preventDefault(); options[0].click(); }
    else if (options.length > 1) { event.preventDefault(); options[0].focus(); }
  });
  const link = document.createElement('a');
  link.href = '#place-id-finder'; link.textContent = 'Quick search ↓'; link.className = 'button secondary';
  link.style.cssText = 'text-decoration:none;margin-left:auto;margin-right:12px;font-size:12px';
  header.insertBefore(link,header.lastElementChild);
  return true;
}
if (!addFinder()) {
  const observer = new MutationObserver(() => { if (addFinder()) observer.disconnect(); });
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
}
