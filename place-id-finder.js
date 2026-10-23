// Uses Google's Place ID Finder pattern (Apache 2.0 sample):
// https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
const byId = (id) => document.getElementById(id);
const status = byId('finder-status');
let selectionVersion = 0;
let marker;
let infoWindow;

function showUnavailable(message) {
  status.textContent = message;
  status.dataset.error = '';
  byId('setup-state').hidden = false;
  byId('search-container').hidden = true;
  byId('finder-map').hidden = true;
  byId('place-result').hidden = true;
  selectionVersion++;
}

function loadMaps(key) {
  if (window.google?.maps?.importLibrary) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => reject(new Error('Google Maps took too long to load. Please reload and try again.')), 20000);
    window.imaiFinderReady = () => { clearTimeout(timer); resolve(); delete window.imaiFinderReady; };
    script.onerror = () => { clearTimeout(timer); reject(new Error('Google Maps could not load. Check your connection and try again.')); };
    const params = new URLSearchParams({ key, v: 'weekly', loading: 'async', callback: 'imaiFinderReady' });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    document.head.append(script);
  });
}

async function init() {
  const key = window.IMAI_CONFIG?.googleMapsApiKey?.trim();
  if (!key) {
    status.textContent = '';
    byId('setup-state').hidden = false;
    return;
  }
  window.gm_authFailure = () => showUnavailable('Google Maps could not authorise this site. Please use the official finder below while the connection is checked.');
  try {
    await loadMaps(key);
    const [{ Map, InfoWindow }, { AdvancedMarkerElement }, { PlaceAutocompleteElement }] = await Promise.all([
      google.maps.importLibrary('maps'), google.maps.importLibrary('marker'), google.maps.importLibrary('places'),
    ]);
    if (status.hasAttribute('data-error')) return;
    byId('finder-map').hidden = false;
    const map = new Map(byId('finder-map'), {
      center: { lat: 3.139, lng: 101.6869 }, zoom: 12,
      mapId: window.IMAI_CONFIG?.googleMapsMapId || 'DEMO_MAP_ID',
      clickableIcons: false, mapTypeControl: false, streetViewControl: false,
      gestureHandling: 'cooperative',
    });
    const autocomplete = new PlaceAutocompleteElement();
    autocomplete.setAttribute('aria-labelledby', 'search-label');
    byId('autocomplete').append(autocomplete);
    byId('search-container').hidden = false;
    status.textContent = 'Search for a business and select a suggestion to see its Place ID.';
    map.addListener('bounds_changed', () => {
      const bounds = map.getBounds();
      if (bounds) autocomplete.locationBias = bounds;
    });
    infoWindow = new InfoWindow();
    marker = new AdvancedMarkerElement({ map, gmpClickable: true });
    marker.addEventListener('gmp-click', () => { if (marker.position) infoWindow.open({ map, anchor: marker }); });
    autocomplete.addEventListener('gmp-error', () => showUnavailable('Search is currently unavailable. Please use the official finder below.'));
    autocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
      const version = ++selectionVersion;
      infoWindow.close();
      marker.position = null;
      byId('place-result').hidden = true;
      status.textContent = 'Loading business details…';
      try {
        const place = placePrediction.toPlace();
        await place.fetchFields({ fields: ['id', 'displayName', 'formattedAddress', 'location', 'viewport'] });
        if (version !== selectionVersion) return;
        if (!place.id || !place.location) throw new Error('This result has no usable Place ID or map location. Please choose another business.');
        byId('result-name').textContent = place.displayName || 'Selected business';
        byId('result-address').textContent = place.formattedAddress || '';
        byId('result-id').value = place.id;
        byId('copy-status').textContent = '';
        byId('view-place').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName || place.id)}&query_place_id=${encodeURIComponent(place.id)}`;
        const content = document.createElement('div');
        for (const text of [place.displayName, `Place ID: ${place.id}`, place.formattedAddress]) {
          const line = document.createElement('div');
          line.textContent = text || '';
          content.append(line);
        }
        infoWindow.setContent(content);
        marker.position = place.location;
        if (place.viewport) map.fitBounds(place.viewport);
        else { map.setCenter(place.location); map.setZoom(17); }
        infoWindow.open({ map, anchor: marker });
        byId('place-result').hidden = false;
        status.textContent = 'Place ID found. Check the business name and address below.';
      } catch (error) {
        if (version === selectionVersion) status.textContent = error instanceof Error ? error.message : 'Could not load this place. Please try again.';
      }
    });
  } catch (error) {
    showUnavailable(error instanceof Error ? error.message : 'Google Maps could not load. Please try again.');
  }
}

byId('copy-id').addEventListener('click', async () => {
  const field = byId('result-id');
  if (!field.value) return;
  try {
    await navigator.clipboard.writeText(field.value);
    byId('copy-status').textContent = 'Place ID copied.';
  } catch {
    field.focus(); field.select();
    byId('copy-status').textContent = 'Copy is unavailable here. The Place ID is selected; press Ctrl+C or copy it manually.';
  }
});
void init();
