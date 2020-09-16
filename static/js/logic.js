// <div id="map"></div>
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function displayMap(inputData) {
    
    // Puts the place and time in a popup for the feature
    function onEachFeature(feature, layer) {

        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + 
          "</p><br><p>Magnitude:" + feature.properties.mag + "</p>");
    }

    function createCircles(feature){
        magnitude = feature.properties.mag
        // for (var i = 0; i < feature.length; i++) {
        var color = "";

        if (magnitude > 5) {
            color = '#FF0000';
        }
        else if (magnitude > 4) {
            color = '#FF6600';
        }
        else if (magnitude > 3) {
            color = '#FF9900';
        }
        else if (magnitude > 2) {
            color = '#FFCC00';
        }
        else if (magnitude > 1) {
            color = '#FFFF00';
        }
        else {
            color = '#00FF00';
        }
        // }

        var geojsonMarkerOptions = {
            radius: magnitude * 5,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var latlng = L.latLng([feature.geometry.coordinates[1],feature.geometry.coordinates[0]])
        console.log(latlng);
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }

    // create GeoJSON layer
    var earthquakes = L.geoJSON(inputData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircles
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
    });

    var myMap = L.map("map", {
        center: [
          0, 0
        ],
        zoom: 2,
        layers: [lightmap, earthquakes]
      });
}

d3.json(url, function(response) {
    displayMap(response.features);
});