$(function () {
  const map = L.map("map");

  // Function that generates a map
  const implementMap = () => {
    // generates a map
    map.setView([43.6478463, -79.3807361], 12);

    // tile layer retrieved from OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
  };

  const getUserFavs = (user_id) => {
    $.ajax({
      url: `/api/maps`,
      data: {
        user_id,
      },
      method: "GET",
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

  const redirectMap = (lat, lng) => {
    map.flyTo([lat, lng], 12);
  };

  const setListeners = () => {
    map.on("click", (event) => {
      const markArr = [];
      const marker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);

      console.log(event);

      markArr.push(marker);

      L.popup()
        .setLatLng(event.latlng)
        .setContent("You saved this location", event.latlng)
        .openOn(map);

      $.ajax({
        url: `/api/pins`,
        data: {
          owner_id: 1,
          title: "Test 1",
          description: "Test 1",
          latitude: "47.115",
          longitude: "-73.005",
          image_url: "test.com",
          map_id: 1,
        },
        method: "POST",
      });
      console.log(markArr);
    });
  };

  const initialize = () => {
    implementMap();
    setListeners();
    getUserFavs(1);
  };

  initialize();
});
