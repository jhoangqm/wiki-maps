$(function () {
    const map = L.map("map").setView([43.6478463, -79.3807361], 16);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap"
    }).addTo(map);
  
    // let markersArray = [];
    // map.on("click", (event) => {
    //   var marker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);
    //   markersArray.push(marker);
    //   console.log(markersArray);
    // });
});