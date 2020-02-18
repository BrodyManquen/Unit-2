var map;

function createMap(){
  map = L.map("mapid", {
    center: [20, 0],
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

function onEachFeature(feature, layer){
  var popupContent = "";
  if (feature.properties){
    for (var property in feature.properties){
      popupContent += "<p>" + property + ":" + feature.properties[property]+"\n"+"</p";
    }
    layer.bindPopup(popupContent);
  };
};

function getData(mapid){
  console.log("it displays the data on the map or else it gets the hose again")
   $.getJSON("data/museumdatabase.geojson", function(response){
               //create marker options
                   var geojsonMarkerOptions = {
                   radius: 8,
                   fillColor: "#ff7800",
                   color: "#000",
                   weight: 1,
                   opacity: 1,
                   fillOpacity: 0.8
               };

               //create a Leaflet GeoJSON layer and add it to the map
               L.geoJson(response, {
                   pointToLayer: function (feature, latlng){
                       return L.circleMarker(latlng, geojsonMarkerOptions);
                   },
                   onEachFeature: onEachFeature
               }).addTo(map);
           });

  };

$(document).ready(createMap);
