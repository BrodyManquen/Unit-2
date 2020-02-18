//Leaflet Quick Start Guide
var mymap = L.map('mapid').setView([51.505,-0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYnJvZHltYW5xdWVuIiwiYSI6ImNrNmpyOTloczAwamgzZnFxYWh3ajYzaDMifQ.6CFEgY3Fd0NQ5EqkpzvspA'
}).addTo(mymap);

var marker = L.marker([51.5, -0.09]).addTo(mymap); //displays a clickable icon on the map

var circle = L.circle([51.508, -0.11],{ //Draws circle overlay on map
    color: 'red',
    fillColor: '#f03',
    fillOpacity : 0.5,
    radius : 500
}).addTo(mymap);

var polygon = L.polygon([ //draws polygon overlay on map
    [51.509,-0.08],
    [51.503,-0.06],
    [51.51,-0.047]
]).addTo(mymap);

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup(); //sets popup to marker
circle.bindPopup("I am a circle."); //sets popup to cirlce
polygon.bindPopup("I am a polygon."); //sets popup to polygon

var popup = L.popup() //creates popup opened at map initialization
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

var popup = L.popup(); //sets generic popup variable

function onMapClick(e) {  //creates event listener describing what'll happen when a place is clicked on the map
    popup
        .setLatLng(e.latlng) //sets latlng to latlng of the click
        .setContent("You clicked the map at " + e.latlng.toString()) //sets text of popup
        .openOn(mymap); //opens popup on map
}

mymap.on('click', onMapClick); //sets onMapClick event to run when mymap is clicked
