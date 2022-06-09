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

const setListeners = () => {
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    const email = $(this).find("#email").val();
    const password = $(this).find("#password").val();

    $.ajax({
      url: `/api/users/login`,
      data: { email, password },
      method: "POST",
      success: function (result) {
        console.log("data:", result);
        setPostLogin(result);
        getUserFavs(result.id);
      },
    });
  });

  $("#registerForm").on("submit", function (event) {
    event.preventDefault();
    const email = $(this).find("#email").val();
    const password = $(this).find("#password").val();

    $.ajax({
      url: `/api/users/register`,
      data: { email, password },
      method: "POST",
      success: function (result) {
        console.log("data1:", result);
        setPostRegister(result);
        getUserFavs(result.id);
      },
    });
  });

  $("#logoutBtn").on("click", function (event) {
    event.preventDefault();

    $.ajax({
      url: `/api/users/logout`,
      method: "POST",
      success: function (result) {
        setPostLogout();
        $("#side-nav-body").empty();
      },
    });
  });
};

const setPostLogin = (user) => {
  const loginModal = bootstrap.Modal.getInstance(
    document.getElementById("loginModal")
  );

  $("#wikimap-header-login").css("display", "none");
  $("#wikimap-header-logout").css("display", "block");
  $("#wikimap-header-login-user").text(user.username);
  $("#wikimap-sidebar")
    .css("visibility", "visible")
    .animate({ width: "200px", padding: "16px" });
  $(".wikimap-content").animate({ "padding-left": "200px" });

  if (loginModal != null) {
    loginModal.hide();
  }
};

const setPostRegister = (user) => {
  const registerModal = bootstrap.Modal.getInstance(
    document.getElementById("registerModal")
  );

  $("#wikimap-header-login").css("display", "none");
  $("#wikimap-header-logout").css("display", "block");
  $("#wikimap-header-login-user").text(user.username);
  $("#wikimap-sidebar")
    .css("visibility", "visible")
    .animate({ width: "200px", padding: "16px" });
  $(".wikimap-content").animate({ "padding-left": "200px" });

  if (registerModal != null) {
    registerModal.hide();
  }
};

const setPostLogout = () => {
  $("#wikimap-header-login").css("display", "block");
  $("#wikimap-header-logout").css("display", "none");
  $("#wikimap-sidebar")
    .css("visibility", "hidden")
    .animate({ width: "0", padding: "0" });
  $(".wikimap-content").animate({ "padding-left": "0" });
};

const getUserFavs = (user_id) => {
  return $.ajax({
    url: `/api/maps`,
    data: {
      user_id,
    },
    method: "GET",
    success: function (result) {
      let favs = "";

      result.forEach((element) => {
        favs += `
          <button
            type="button"
            class="list-group-item list-group-item-action bg-transparent text-white cities"
            data-lat="${element.latitude}"
            data-long="${element.longitude}"
          >
            ${element.name}
          </button>
        `;
      });

      $("#side-nav-body").append(favs);

      //sidebar maps
      $(".cities").on("click", function (event) {
        const lat = $(this).data("lat");
        const long = $(this).data("long");
        map.flyTo([lat, long], 12);
      });
    },
  });
};

const getUser = () => {
  $.ajax({
    url: `/api/users/me`,
    method: "GET",
    success: function (result) {
      setPostLogin(result);
      getUserFavs(result.id);
    },
    error: function (err) {},
  });
};

// generates pins on click
const createPins = () => {
  window.map.on("click", (event) => {
    let marker = new L.marker([event.latlng.lat, event.latlng.lng]);
    window.map.addLayer(marker);
    marker.bindPopup(renderPins()).openPopup();
    $("label.pinlat").show().text(`latitude: ${event.latlng.lat}`);
    $("label.pinlng").show().text(`longitude: ${event.latlng.lng}`);
    $("input.pinlat").val(event.latlng.lat);
    $("input.pinlng").val(event.latlng.lng);

    marker.getPopup().on("remove", function () {
      window.map.removeLayer(marker);
    });

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

// pins popup information
const pinInfo = (pin) => {
  const $pinDesc = `
  <div class="pin-info" data-pin="${pin.pin_id}">
  <label class="pin-info-title">${pin.title}</label>
  <label class="pin-info-description">${pin.description}</label>
  <img class="pin-info-img" src="${pin.image_url}" style="width: 400px"></img>
  <div class="pin-info-buttons">
  </div>
`;
  return $pinDesc;
};

// Incomplete get pins function
const getPins = () => {
  return $.get({
    url: `/api/pins`,
    success: function (result) {
      result.forEach(function (data) {
        const lat = data.latitude;
        const lng = data.longitude;
        L.marker([lat, lng]).addTo(map);
      });
    },
  });
};

$(function () {
  window.map = implementMap();
  window.markers = [];
  getUser();
  getPins();
  setListeners();
  createPins();
});
