$(function () {
  // calling map function
  window.map = implementMap();
  createPins();
});

const createPins = () => {};
const renderPins = () => {
  renderPins();
};

//Pin form that can be called when rendering a marker
const $pinForm = `
  <form class="pinForm">
  <input type="hidden" name="owner_id" value="#" />
  <label for="title">Pin Name:</label><br><br>
  <input type="text" name="title" id="name" placeholder="New Pin" /><br><br>
  <label for="description">Description:</label><br><br>
  <textarea type="text" name="description" placeholder="description" /><br><br>
  <label for="img_url">Image URL:</label><br><br>
  <input type="text" name="image_url" id="image" placeholder="image url" /><br><br>
  <p class="submit_popup">Click the place on the map where you want to add a pin.</p>
  <label for="latitude" class="pinlat" hidden></label><br>
  <input type="text" class="pinlat" name="latitude" hidden />
  <label for="longitude" class="pinlng" hidden></label><br>
  <input type="text" class="pinlng" name="longitude" hidden/>
  <input type="text" id="form-map-id" name="map_id" hidden />
  <button class="submit_popup" type="submit" hidden>submit</button>
  <button class="cancel" type="cancel">cancel</button>
  </form>
  `;

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
