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
//days start on Jan 22 2020 (01-22-2020)
function calcMinValue(data){
  var allValues = [];
  for(var hub of data.features){
    for(var day = 1; day <=38; day+=1){
      var value = hub.properties[day];
      allValues.push(value);
    }
  }
  var minValue = Math.min(...allValues)
  console.log(minValue)
  return minValue;

};

function calcPropRadius(attValue){
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
  var popupContent = "<p><b>City/Province/State:</b> " + feature.properties.Location + "</p>";
  popupContent += "<p><b>Country or Region:</b> " + feature.properties.CountryRegion + "</p>";
  var day = attribute[0];
  popupContent += "<p><b>Cases in "+day+":</b> "+feature.properties[attribute]+"</p>";
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
  //console.log(properties)
  for (var attribute in properties){
    if (attribute.indexOf("1") > -1){
      attributes.push(attribute);
    }else if (attribute.indexOf("2") > -1) {
      attributes.push(attributes)
    }else if (attribute.indexOf("3") > -1) {
      attributes.push(attributes)
    }else if (attribute.indexOf("4") > -1) {
      attributes.push(attributes)
    }else if (attribute.indexOf("5") > -1) {
      attributes.push(attributes)
    }else if (attribute.indexOf("6") > -1) {
      attributes.push(attributes)
    }else if (attribute.indexOf("7") > -1) {
      attributes.push(attributes)
    }else if (attribute.indexOf("8") > -1) {
      attributes.push(attributes)
    }else if (attribute.indexOf("9") > -1) {
      attributes.push(attributes)
    }
  }
  //console.log(attributes)
  return attributes;
};
function updatePropSymbols(attribute){
  map.eachLayer(function(layer){
    if (layer.feature && layer.feature.properties[attribute]){
      var props = layer.feature.properties;
      var radius = calcPropRadius(props[attribute]);
      layer.setRadius(radius);
      var popupContent = "<p><b>City:</b> " + props.Location + "</p>";
      popupContnet += "<p><b>Country or Region:</b> " + props.CountryRegion + "</p>"
      var day = attribute[2];
      //console.log(day)
      popupContent += "<p><b>Cases in " + day + ":</b> " + props[attribute] + " people</p>";
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
    }
  })
}
function createSequenceControls(attributes){
    //create range input element (slider)
    $("#panel").append('<input class="range-slider" type="range">');
    $('.range-slider').attr({
        max: 38,
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
        index = index > 38 ? 0 :index;
      } else if ($(this).attr('id')=='reverse'){
        index--;
        index = index < 0 ? 38 : index;
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
    $.ajax("data/coronacsv.geojson",{
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
