// <div id="map"></div>
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function displayMap(inputData) {
    
    // Puts the place and time in a popup for the feature
    function onEachFeature(feature, layer) {

        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + 
          "</p><br><p>Magnitude:" + feature.properties.mag + "</p>");
    }

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

    function createCircles(feature){
        magnitude = feature.properties.mag;
        var color = getColor(magnitude);
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

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v9",
    accessToken: API_KEY
    });

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
        // ,"Fault Lines": faultLines
    };

    var myMap = L.map("map", {
        center: [
          0, 0
        ],
        zoom: 2,
        layers: [lightmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // var legend = L.control({position: 'bottomright'});
    // legend.onAdd = function (myMap) {

    // var div = L.DomUtil.create('div', 'info legend');
    // labels = ['<strong>Categories</strong>'],
    // categories = ['0-1','1-2','2-3','3-4','4-5','5+'];

    // for (var i = 0; i < categories.length; i++) {

    //         div.innerHTML += 
    //         labels.push(
    //             '<i style="background:' + getColor(i+0.1) + '"></i>' +
    //         (categories[i] ? categories[i] : '+'));

    //     }
    //     div.innerHTML = labels.join('<br>');
    // return div;
    // };
    // legend.addTo(myMap);

    /*Legend specific*/
    var legend = L.control({ position: "bottomright" });

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

d3.json(url, function(response) {
    displayMap(response.features);
});

