url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function displayMap(inputData, inputData2) {
    // Puts the place and time in a popup for the feature
    function onEachFeature(feature, layer) {
        // add a popup to each marker
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + 
          "</p><br><p>Magnitude:" + feature.properties.mag + "</p>");
    }

    // function to get the color of the marker based on the magnitude of the earthquake
    function getColor(magnitude) {
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
        return color;
    }

    // function to create the circular markers with size and color based on the earthquake magnitude
    function createCircles(feature){
        magnitude = feature.properties.mag;
        var color = getColor(magnitude);

        // set the style settings for the markers
        var geojsonMarkerOptions = {
            radius: magnitude * 5,
            fillColor: color,
            color: color,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        // get the latitude and longitude of the earthquake
        var latlng = L.latLng([feature.geometry.coordinates[1],feature.geometry.coordinates[0]])
        
        // return the created circular marker
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }

    // create layer groups for the overlay layers
    var earthquakes = L.layerGroup();
    var faultLines = L.layerGroup();

    // create earthquake GeoJSON layer
    L.geoJSON(inputData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircles
    }).addTo(earthquakes);

    // create faultline GeoJSON layer
     L.geoJSON(inputData2, {
         fillOpacity: 0
    }).addTo(faultLines);

    // create the Base Layer with a light background
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // create the Base Layer with an outdoor background
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v9",
        accessToken: API_KEY
    });

    // create the Base Layer with a satellite background
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-streets-v9",
        accessToken: API_KEY
    });

    // Create a baseMaps object
    var baseMaps = {
        "Satellite": satellite,
        "Grayscale": lightmap,
        "Outdoors": outdoors
    };
    
    // Create an overlay object
    var overlayMaps = {
        "Earthquakes": earthquakes
        ,"Fault Lines": faultLines
    };

    // Create the map with the default settings
    var myMap = L.map("map", {
        center: [
          0, 0
        ],
        zoom: 2,
        layers: [lightmap, earthquakes]
    });

    // add the control to the map where the user can choose the layers they wish to display
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    /*Legend specific*/
    var legend = L.control({ position: "bottomright" });

    // create the color and value display of the legend
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i style="background: #00FF00"></i><span>0-1</span><br>';
        div.innerHTML += '<i style="background: #FFFF00"></i><span>1-2</span><br>';
        div.innerHTML += '<i style="background: #FFCC00"></i><span>2-3</span><br>';
        div.innerHTML += '<i style="background: #FF9900"></i><span>3-4</span><br>';
        div.innerHTML += '<i style="background: #FF6600"></i><span>4-5</span><br>';
        div.innerHTML += '<i style="background: #FF0000"></i><span>5+</span><br>';

        return div;
      };
      
      legend.addTo(myMap);
}

// read in the earthquake data
d3.json(url, function(response) {
    // read in the faultline data
    d3.json('static/data/plates.json', function(plateData){
        // call the displayMap function, passing the two data sets
        displayMap(response.features, plateData.features);
    });
});

