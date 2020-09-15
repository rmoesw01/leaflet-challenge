// <div id="map"></div>
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function displayMap(inputData) {

    // Puts the place and time in a popup for the feature
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + 
          "</p><br><p>Magnitude:" + feature.properties.mag + "</p>");
    }

    // create GeoJSON layer
    var earthquakes = L.geoJSON(inputData, {
        onEachFeature: onEachFeature
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [lightmap, earthquakes]
      });
}

d3.json(url, function(response) {
    displayMap(response.features);
});