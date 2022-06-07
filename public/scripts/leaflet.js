$(function () {
  // calling map function
  window.map = implementMap();

  //sidebar maps
  $("#calgary").on("click", function (event) {
    map.flyTo([51.0486, -114.0708], 12);
  });
  $("#montreal").on("click", function (event) {
    map.flyTo([45.5017, -73.5673], 12);
  });
  $("#toronto").on("click", function (event) {
    map.flyTo([43.6501, -79.38], 12);
  });
  $("#ottawa").on("click", function (event) {
    map.flyTo([45.4215, -75.6972], 12);
  });
  $("#vancouver").on("click", function (event) {
    map.flyTo([49.2827, -123.1207], 12);
  });

  createPins();
});

// generates pins on click

const createPins = () => {
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
};

// This will be added later once I figure out the save pin to DB situation
// const renderPins = () => {
//   renderPins();
// };

// //Pin form that can be called when rendering a marker
// const $pinForm = `
//   <form class="pinForm">
//   <input type="hidden" name="owner_id" value="#" />
//   <label for="title">Pin Name:</label><br><br>
//   <input type="text" name="title" id="name" placeholder="New Pin" /><br><br>
//   <label for="description">Description:</label><br><br>
//   <textarea type="text" name="description" placeholder="description" /><br><br>
//   <label for="img_url">Image URL:</label><br><br>
//   <input type="text" name="image_url" id="image" placeholder="image url" /><br><br>
//   <p class="submit_popup">Click the place on the map where you want to add a pin.</p>
//   <label for="latitude" class="pinlat" hidden></label><br>
//   <input type="text" class="pinlat" name="latitude" hidden />
//   <label for="longitude" class="pinlng" hidden></label><br>
//   <input type="text" class="pinlng" name="longitude" hidden/>
//   <input type="text" id="form-map-id" name="map_id" hidden />
//   <button class="submit_popup" type="submit" hidden>submit</button>
//   <button class="cancel" type="cancel">cancel</button>
//   </form>
//   `;

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
