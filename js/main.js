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
      allValues.push(value);
    }
  }
  var minValue = Math.min(...allValues)
  console.log(minValue)
  return minValue;
  //console.log(minValue);
};

function calcPropRadius(attValue){
  console.log(minValue)
  var minRadius = 5
  var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius
  //console.log(radius)
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

function pointToLayer(feature, latlng, attributes){

  var attribute = attributes[0];
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
  layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });
  return layer;
};

function createPropSymbols(data, attributes){

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(map);
};

function processData(data){
  var attributes = [];
  var properties = data.features[0].properties;
  for (var attribute in properties){
    if (attribute.indexOf("attendance_") > -1){
      attributes.push(attribute);
    }
  }
  return attributes;
};
function updatePropSymbols(attribute){
  map.eachLayer(function(layer){
    if (layer.feature && layer.feature.properties[attribute]){
      var props = layer.feature.properties;
      var radius = calcPropRadius(props[attribute]);
      layer.setRadius(radius);
      var popupContent = "<p><b>Museum:</b> " + props.Name + "</p>";
      var year = attribute.split("_")[1];
      popupContent += "<p><b>Attendance in " + year + ":</b> " + props[attribute] + " people</p>";
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
    }
  })
}
function createSequenceControls(attributes){
    //create range input element (slider)
    $("#panel").append('<input class="range-slider" type="range">');
    $('.range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    });
    $('#panel').append('<button class="step" id="reverse">Reverse</button>');
    $('#panel').append('<button class="step" id="forward">Forward</button>');
    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="img/forward.png">');
    $('.step').click(function(){
      var index = $('.range-slider').val();
      if ($(this).attr('id')=='forward'){
        index++;
        index = index > 6 ? 0 :index;
      } else if ($(this).attr('id')=='reverse'){
        index--;
        index = index < 0 ? 6 : index;
      };
      $('.range-slider').val(index);
      updatePropSymbols(attributes[index]);
    });
    $('.range-slider').on('input', function(){
      var index = $(this).val();
      //updatePropSymbols(attributes[index]);
      //console.log(index);
    });
};

//Step 2: Import GeoJSON data
function getData(mapid){
    $.ajax("data/museumdatabase.geojson",{
      dataType: "json",
      success: function(response){
        var attributes = processData(response);
        minValue = calcMinValue(response);
        createPropSymbols(response, attributes);
        createSequenceControls(attributes);
      }
    });
  };

$(document).ready(createMap);
