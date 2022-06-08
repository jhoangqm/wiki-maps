$(function () {
  // calling map function
  window.map = implementMap();
  window.markers = [];
  getPins();
  createPins();
  getUserFavs();
});

// Incomplete get pins function
const getPins = () => {
  return $.get({
    url: `/api/pins`,
    success: function (result) {
      result.forEach(function (data) {
        console.log(data);
        const lat = data.lat;
        const lng = data.lng;
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopUp(data);
        window.markers.push(marker);
        window.map.addLayer(marker);
      });
    },
  });
};

const getUserFavs = (user_id) => {
  return $.get({
    url: `/api/maps`,
    data: {
      user_id,
    },
    success: function (result) {
      let favs = "<ul>";

      result.forEach((element) => {
        favs += `
          <li>
            <button class="cities" data-lat="${element.latitude}" data-long="${element.longitude}">
              ${element.name}
            </button>
          </li>
        `;
      });

      favs += "</ul>";

      $(".side-nav-body").append(favs);

      //sidebar maps
      $(".cities").on("click", function (event) {
        const lat = $(this).data("lat");
        const long = $(this).data("long");
        map.flyTo([lat, long], 12);
      });
    },
  });
};

// generates pins on click
const createPins = () => {
  let markArr = [];
  window.map.on("click", (event) => {
    let marker = new L.marker([event.latlng.lat, event.latlng.lng]);
    window.map.addLayer(marker);
    markArr.push(marker);
    marker.bindPopup(renderPins()).openPopup();
    // $("label.pinlat").show().text(`latitude: ${event.latlng.lat}`);
    // $("label.pinlng").show().text(`longitude: ${event.latlng.lng}`);
    $("input.pinlat").val(event.latlng.lat);
    $("input.pinlng").val(event.latlng.lng);

    // marker.getPopup().on("remove", function () {
    //   window.map.removeLayer(marker);
    // });

    $(".pin-form").on("submit", function (e) {
      e.preventDefault();

      let content = $(this).serialize();
      console.log(content);

      return $.post(`/api/pins`, content, (data) => {
        console.log(data);
        window.markers.push(marker);
        marker.closePopup();
        marker.unbindPopup();
        marker.bindPopup(data.content);
        console.log(data.content);
      });
    });
  });

  // var popup = L.popup();

  // function onMapClick(e) {
  //   popup
  //     .setLatLng(e.latlng)
  //     .setContent("You saved this location", e.latlng)
  //     .openOn(map);
  // }

  // map.on("click", onMapClick);
};

//Pin form that can be called when rendering a marker
const renderPins = () => {
  const $pinForm = `
  <div class="pin-form-container">
  <form class="pin-form">
    <label for="title"> Pin Name:</label><br>
    <input type="text" name="title" id="name" placeholder="New Pin"/><br>
    <input type="textarea" name="description" placeholder="description"/><br>
    <input type="text" name="image_url" id="image" placeholder="image url" /><br>
    <label for="latitude" class="pinlat" hidden></label><br>
    <input type="text" class="pinlat" name="latitude" hidden />
    <label for="longitude" class="pinlng" hidden></label><br>
    <input type="text" class="pinlng" name="longitude" hidden/>
    <button class="submit" type="submit">submit</button>
  </form>
</div>
    `;
  return $pinForm;
};

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
