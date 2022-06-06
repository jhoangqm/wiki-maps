$(function () {
  // calling map function
  let map = implementMap();

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
  const map = L.map("map").setView([43.6478463, -79.3807361], 16);

  // tile layer retrieved from OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  return map;
};
