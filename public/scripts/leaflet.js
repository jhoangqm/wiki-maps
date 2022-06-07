$(function () {
  // calling map function
  let map = implementMap();

  //sidebar maps
  $('#calgary').on('click', function (event) {
    map.flyTo([51.0486, -114.0708], 12)
  });
  $('#montreal').on('click', function (event) {
    map.flyTo([45.5017, -73.5673], 12)
  });
  $('#toronto').on('click', function (event) {
    map.flyTo([43.6501, -79.38], 12)
  });
  $('#ottawa').on('click', function (event) {
    map.flyTo([45.4215, -75.6972], 12)
  });
  $('#vancouver').on('click', function (event) {
    map.flyTo([49.2827, -123.1207], 12)
  });

  // generates pins on click

  let markArr = [];
  map.on("click", (event) => {
    let marker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);
    markArr.push(marker);
    console.log(markArr);
  });

  var popup = L.popup();

  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent("You saved this location", e.latlng)
      .openOn(map);
  }

  map.on("click", onMapClick);
});

// Function that generates a map
const implementMap = () => {
  // generates a map
  const map = L.map("map").setView([43.6478463, -79.3807361], 12);

  // tile layer retrieved from OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  return map;
};

