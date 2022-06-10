let currentMap;
let map;
let markArr = [];
const defaultMapCoordinates = {
  lat: 43.6478463,
  lng: -79.3807361,
};

// Function that generates a map
const implementMap = (lat, lng) => {
  // generates a map
  map = L.map("map").setView([lat, lng], 12);

  // tile layer retrieved from OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
};

const setListeners = () => {
  // This is the login event
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    const email = $(this).find("#loginEmail").val();
    const password = $(this).find("#loginPassword").val();

    $.ajax({
      url: `/api/users/login`,
      data: { email, password },
      method: "POST",
      success: function (result) {
        setPostLogin(result);
        getUserFavs(result.id);
      },
    });
  });

  // This is the register event
  $("#registerForm").on("submit", function (event) {
    event.preventDefault();
    const email = $(this).find("#registerEmail").val();
    const password = $(this).find("#registerPassword").val();

    $.ajax({
      url: `/api/users/register`,
      data: { email, password },
      method: "POST",
      success: function (result) {
        setPostRegister(result);
        getUserFavs(result.id);
      },
    });
  });

  // This is logout event
  $("#logoutBtn").on("click", function (event) {
    event.preventDefault();

    $.ajax({
      url: `/api/users/logout`,
      method: "POST",
      success: function (result) {
        setPostLogout();
        $("#side-nav-body").empty();

        markArr.forEach((element) => {
          map.removeLayer(element);
        });

        markArr = [];
      },
    });
  });

  // Creates map on form submission NOT COMPLETE
  $("#newmapForm").on("submit", function (event) {
    event.preventDefault();
    const name = $(this).find("#dropdown-cities").val();
    console.log(name);
    return $.ajax({
      url: `/api/maps/`,
      data: { name },
      type: "application/json",
      method: "POST",
      success: function (result) {
        location.reload();
      },
    });
  });

  // Creates a pin on click
  map.on("click", function (event) {
    const coordinates = {
      lat: event.latlng.lat,
      lng: event.latlng.lng,
    };
    const marker = new L.marker([coordinates.lat, coordinates.lng]);
    map.addLayer(marker);
    markArr.push(marker);
    marker.bindPopup(renderPins()).openPopup();

    $("#pinForm").on("submit", function (event) {
      event.preventDefault();
      const title = $(this).find("#title").val();
      const description = $(this).find("#description").val();
      const image_url = $(this).find("#image_url").val();

      $.ajax({
        url: "/api/pins",
        method: "POST",
        data: {
          title,
          description,
          image_url,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          map_id: currentMap,
        },
        success: function (data) {
          markArr.push(marker);
          marker.closePopup();
          marker.unbindPopup();

          marker.on("click", function (event) {
            renderPins(data);
            console.log(data);
          });
        },
      });
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
      let coordinates = {
        lat: defaultMapCoordinates.lat,
        lng: defaultMapCoordinates.lng,
      };

      if (result.length > 0) {
        result.forEach((element, index) => {
          let selectedMap = "text-light";
          if (index === 0) {
            selectedMap = "text-warning";
          }

          favs += `
            <button
              type="button"
              class="list-group-item list-group-item-action bg-transparent cities ${selectedMap}"
              data-lat="${element.latitude}"
              data-lng="${element.longitude}"
              data-id="${element.id}"
            >
              ${element.name}
            </button>
          `;
        });

        currentMap = result[0].id;
      }

      $("#side-nav-body").append(favs);

      if (result.length > 0) {
        coordinates = {
          lat: result[0].latitude,
          lng: result[0].longitude,
        };

        getPins(currentMap);
      }

      if (map == null) {
        implementMap(coordinates.lat, coordinates.lng);
        setListeners();
      } else {
        map.flyTo([coordinates.lat, coordinates.lng], 12);
      }

      //sidebar maps
      $(".cities").on("click", function (event) {
        const lat = $(this).data("lat");
        const lng = $(this).data("lng");

        $(`button[data-id="${$(this).data("id")}"]`)
          .addClass("text-warning")
          .removeClass("text-light");
        $(`button[data-id="${currentMap}"]`)
          .addClass("text-light")
          .removeClass("text-warning");

        currentMap = $(this).data("id");

        markArr.forEach((element) => {
          map.removeLayer(element);
        });

        getPins(currentMap, lat, lng);

        map.flyTo([lat, lng], 12);
      });
    },
  });
};

// GET pins function
const getPins = (currentMapId, lat, lng) => {
  $.ajax({
    url: "/api/pins",
    method: "GET",
    data: { map_id: currentMapId },
    success: function (data) {
      data.forEach((element) => {
        let marker = new L.marker([element.latitude, element.longitude]);
        map.addLayer(marker);
        markArr.push(marker);

        marker.on("click", function (event) {
          marker.bindPopup(pinInfo(element)).openPopup();

          // EDIT pin button currently working on this
          $(".edit-pin-btn").on("click", function (event) {
            const pin_id = $(this).closest(".pin-info").attr("data-id");
            console.log("pin_id: ", pin_id);
            $.ajax({
              url: `/api/pins`,
              method: "GET",
              data: { map_id: currentMapId },
              success: function (data) {
                marker.bindPopup(pinEdit(element));
                // After opening the edit form
                $(".edit-pin-form-button").on("click", function (e) {
                  return $.ajax({
                    url: `/api/pins/${pin_id}`,
                    method: "patch",
                    data,
                    success: function (editedData) {
                      marker.bindPopup(editedData.data).closePopup();
                    },
                    error: (err) => {
                      alert(err.responseJSON.message);
                    },
                  });
                });
              },
            });
          });

          // DELETE pin button
          $(".pin-info-buttons .delete-pin-btn").on("click", function (event) {
            const pin = $(this).closest(".pin-info");
            const pin_id = pin.attr("data-id");
            console.log("test", pin_id);
            return $.ajax({
              url: `/api/pins/${pin_id}`,
              method: "delete",
              success: function (data) {
                location.reload(data);
              },
            });
          });
        });
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
    error: function (err) {
      implementMap(defaultMapCoordinates.lat, defaultMapCoordinates.lng);
      setListeners();
    },
  });
};

//Pin form that can be called when rendering a marker
const renderPins = (pin) => {
  let buttonDisplayClass = "";
  let currentPin = {
    title: "",
    description: "",
    image_url: "",
  };

  if (pin != null) {
    currentPin = pin;
    buttonDisplayClass = "d-none";
  }

  return `
    <form id="pinForm" class="pin-form-container">
      <div class="mb-3 row">
        <div class="col">
          <input type="text" class="form-control" id="title" placeholder="New Pin" value="${currentPin.title}">
        </div>
      </div>
      <div class="mb-3 row">
        <div class="col">
          <input type="text" class="form-control" id="description" placeholder="Description" value="${currentPin.description}">
        </div>
      </div>
      <div class="mb-3 row">
        <div class="col">
          <input type="text" class="form-control" id="image_url" placeholder="Image URL" value="${currentPin.image_url}">
        </div>
      </div>
      <div class="mb-3 row ${buttonDisplayClass}">
        <div class="col d-flex justify-content-end">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>
  `;
};

// pins popup information
const pinInfo = (pin) => {
  const $pinDesc = `
  <div data-id="${pin.id}" class="pin-info"}">
  <label class="pin-info-title">${pin.title}</label><br><br>
  <label class="pin-info-description">Description: ${pin.description}</label><br><br>
  <img class="pin-info-img" src="${pin.image_url}" style="width: 100%"></img>
  <div class="pin-info-buttons">
  <button id=deletePinButton class="delete-pin-btn btn btn-primary">Delete</button>
  <button class="edit-pin-btn btn btn-primary">Edit</button>
  </div>
`;
  return $pinDesc;
};

// Pin edit form which is generated when clicking edit on pinInfo
const pinEdit = (pin) => {
  const $pinForm = `
    <div class="pin-form-container">
      <p class="add-pin-header">Edit pin</p>
      <form class="edit-pin-form">
        <input type="text" id="title" name="title" placeholder="Title" value="${pin.title}"></input><br><br>
        <input type="textarea" id="description" name="description" placeholder="Description" value="${pin.description}"></input><br><br>
        <input type="text" id="image_url" name="image_url" placeholder="Image URL" value="${pin.image_url}"></input><br><br>
          <button class="edit-pin-form-button btn btn-primary">Edit</button>
      </form>
    </div>
  `;
  return $pinForm;
};

$(function () {
  getUser();
});
