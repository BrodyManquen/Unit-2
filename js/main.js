var map;
var minValue;

function processData(data){
  var attributes = [];
  var properties = data.features[0].properties;
  for (var attribute in properties){
    if (attribute.indexOf("1") > -1){
      attributes.push(attribute);
    }else if (attribute.indexOf("2") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("3") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("4") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("5") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("6") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("7") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("8") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("9") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("10") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("11") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("12") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("13") > -1) {
      attributes.push(attribute)
    }else if (attribute.indexOf("14") > -1) {
      attributes.push(attribute)
    };
  };
  return attributes;
};

function calcMinValue(data){
  var allValues = [];
  for(var hub of data.features){
    for(var day = 1; day <=13; day+=1){
      var value = hub.properties[day];
      allValues.push(value);
    };
  };
  var minValue = Math.min(...allValues);
  return minValue;
};

function createPropSymbols(data, attributes){

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(map);
};

function pointToLayer(feature, latlng, attributes){
  var attribute = attributes[0];
  var options = {
    fillColor: "#FD5555",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  var attValue = Number(feature.properties[attribute]);
  options.radius = calcPropRadius(attValue);
  var layer = L.circleMarker(latlng, options);
  var popupContent = "<p><b>City/Province/State:</b> " + feature.properties.Location + "</p>";
  popupContent += "<p><b>Region:</b> " + feature.properties.Region + "</p>";
  var day = attribute[0];
  popupContent += "<p><b>Cases in "+day+":</b> "+feature.properties[attribute]+"</p>";
  layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });
  return layer;
};

function calcPropRadius(attValue){
  var minRadius = 4
  var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius
  return radius;
};

function createSequenceControls(attributes){
    $("#panel").append('<input class="range-slider" type="range">');
    $('.range-slider').attr({
        max: 13,
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
        index = index > 13 ? 0 :index;
      } else if ($(this).attr('id')=='reverse'){
        index--;
        index = index < 0 ? 13 : index;
      };
      $('.range-slider').val(index);
      updatePropSymbols(attributes[index])
      console.log(index)
      console.log("Slider Control: ")
      console.log(attributes[index])
    });
    $('.range-slider').on('input', function(){
      var index = $(this).val();
    });
};

function updatePropSymbols(attribute){
  map.eachLayer(function(layer){
    if (layer.feature && layer.feature.properties[attribute]){
      var props = layer.feature.properties;
      var radius = calcPropRadius(props[attribute]);
      layer.setRadius(radius);
      var popupContent = "<p><b>City/Province:</b> " + props.Location + "</p>";
      popupContent += "<p><b>Region/Country:</b> " + props.Region + "</p>"
      console.log('Update prop symbol: '+ attribute)
      var day = attribute[2];
      popupContent += "<p><b>COVID-19 cases in :</b> " + props[attribute] + " people</p>";
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
    }
  })
}

function createMap(){
  map = L.map("mapid", {
    center: [30.9756, 112.2707],
    zoom: 5
  });
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiYnJvZHltYW5xdWVuIiwiYSI6ImNrNmpyOTloczAwamgzZnFxYWh3ajYzaDMifQ.6CFEgY3Fd0NQ5EqkpzvspA'
  }).addTo(map);
  getData();
};

//Add non-scalable

function getData(mapid){
    $.ajax("data/chinaCorona.geojson",{
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
