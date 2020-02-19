var map;
var minValue;

function createMap(){
  map = L.map("mapid", {
    center: [0, 0],
    zoom: 2
  });

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiYnJvZHltYW5xdWVuIiwiYSI6ImNrNmpyOTloczAwamgzZnFxYWh3ajYzaDMifQ.6CFEgY3Fd0NQ5EqkpzvspA'
  }).addTo(map);
  getData();
};

function calcMinValue(data){
  var allValues = [];
  for(var museum of data.features){
    for(var year = 2012; year <=2017; year+=1){
      var value = museum.properties["attendance_" + String(year)];
      allValues.push(value)
    }
  }
  var minValue = Math.min(...allValues)
  return minValue
};

function calcPropRadius(attValue){
  var minRadius = 6
  var radius = 1.0083*Math.pow(attValue/minValue,0.5715)*minRadius
  return radius;
};

function onEachFeature(feature, layer){
  var popupContent = "";
  if (feature.properties){
    for (var property in feature.properties){
      popupContent += "<p>" + property + ":" + feature.properties[property]+"\n"+"</p";
    }
    layer.bindPopup(popupContent);
  };
};

function pointToLayer(feature, latlng){
  var attribute = "attendance_2012";
  var options = {
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  var attValue = Number(feature.properties[attribute]);
  options.radius = calcPropRadius(attValue);
  var layer = L.circleMarker(latlng, options);
  var popupContent = "<p><b>Museum:</b> " + feature.properties.Name + "</p>";
  var year = attribute.split("_")[1];
  popupContent += "<p><b>Attendance in "+year+":</b> "+feature.properties[attribute]+"</p>";
  layer.bindPopup(popupContent);
  return layer;
};

function createPropSymbols(data, mapid){
  L.geoJson(data, {
    pointToLayer: pointToLayer
  }).addTo(map);
};

// function getData(mapid){
//   console.log("it displays the data on the map or else it gets the hose again")
//    $.getJSON("data/museumdatabase.geojson", function(response){
//                //create marker options
//                    var geojsonMarkerOptions = {
//                    radius: 8,
//                    fillColor: "#ff7800",
//                    color: "#000",
//                    weight: 1,
//                    opacity: 1,
//                    fillOpacity: 0.8
//                };
//
//                //create a Leaflet GeoJSON layer and add it to the map
//                L.geoJson(response, {
//                    pointToLayer: function (feature, latlng){
//                        return L.circleMarker(latlng, geojsonMarkerOptions);
//                    },
//                    //onEachFeature: onEachFeature
//                }).addTo(map);
//            });
//
//   };

///// Create Proportional Symbols
// function createPropSymbols(data){
//
//     var attribute = "attendance_2012";
//     //create marker options
//     var geojsonMarkerOptions = {
//         radius: 8,
//         fillColor: "#ff7800",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8
//     };
//
//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(data, {
//         pointToLayer: function (feature, latlng) {
//             var attValue = Number(feature.properties[attribute]);
//             geojsonMarkerOptions.radius = calcPropRadius(attValue);
//             //console.log(feature.properties, attValue);
//             return L.circleMarker(latlng, geojsonMarkerOptions);
//         }
//     }).addTo(map);
// };

//Step 2: Import GeoJSON data
function getData(mapid){
    //load the data
    $.getJSON("data/museumdatabase.geojson", function(response){
            minValue = calcMinValue(response);
            //call function to create proportional symbols
            createPropSymbols(response);
    });
};

$(document).ready(createMap);
