var map = L.map('mapid').setView([39.74739,-105], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYnJvZHltYW5xdWVuIiwiYSI6ImNrNmpyOTloczAwamgzZnFxYWh3ajYzaDMifQ.6CFEgY3Fd0NQ5EqkpzvspA'
}).addTo(map);
function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.popupContent){
    layer.bindPopup(feature.properties.popupContent);
  }
}
var geojsonFeature = {  //creates a geoJson feature
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

L.geoJson(geojsonFeature, {
  onEachFeature: onEachFeature
}).addTo(map);

L.geoJSON(geojsonFeature).addTo(map); //adds geojson Feature to map
var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature); //adds GeoJson data to layer

var myLines = [{  //creates LineString variable
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {  //creates custom style
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
L.geoJSON(myLines, {  //sets a geojson feature with myLines and myStyle
    style: myStyle
}).addTo(map)  //adds this geojson feature to map

var states = [{  //creates geojson polygon features to represent states
    "type": "Feature",
    "properties": {"party": "Republican"}, //adds political party to properties
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

L.geoJSON(states, {
    style: function(feature) {  //sets geoJSON style of the states features
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"}; //colors Republican red
            case 'Democrat':   return {color: "#0000ff"}; //colors Democrat blue
        }
    }
}).addTo(map);

var geojsonMarkerOptions = { //sets geojson marker options
    radius: 8,
    fillColor: "#ff0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions); //creates circle marker at geojsonfeature with parameters set by geojsonMarkerOptions
    }
}).addTo(map);

var someFeatures = [{ //sets a two geojson features
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;  //shows geojson someFeatures with property "show_on_map : true" on map
    }
}).addTo(map);
