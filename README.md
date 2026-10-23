# IMAI Review Studio — public compiled distribution

Public build assets only. Source repository remains private.

## Place ID Finder

`place-id-finder.html` is a standalone tool linked from Review Studio's header.
It uses the current Google Maps Place Autocomplete widget, map and advanced
marker pattern documented at:
https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder

Configure `googleMapsApiKey` in `config.js` to enable live search. The browser
key must belong to a billing-enabled Google Cloud project with **Maps JavaScript
API** and **Places API (New)** enabled. Restrict application access to Websites
with `https://google.imai.my/*`, and restrict API access to those two APIs.
Use a separate restricted development key for local testing.

Optional: set `googleMapsMapId` in the same configuration object to a JavaScript
map ID from your project. Otherwise Google's `DEMO_MAP_ID` is used.

Without a key the finder displays setup guidance and links to Google's official
finder. It does not send search requests or pretend to return live results.
The generator's existing manual Place ID workflow remains available.

After setup, test a real business, check its address, copy its ID, and paste it
into the generator's manual Place ID field. Verify the generated review link.
