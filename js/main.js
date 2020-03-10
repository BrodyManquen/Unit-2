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
  var popupContent = "<p><b>City/Province:</b> " + feature.properties.Location + "</p>";
  popupContent += "<p><b>Region/Country:</b> " + feature.properties.Region + "</p>";
  var day = attribute[0];
  popupContent += "<p><b>COVID-19 cases :</b> "+feature.properties[attribute]+" people</p>";
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
  var SequenceControl = L.Control.extend({
    options: {
      position: 'bottomleft'
    },
    onAdd: function() {
      var container = L.DomUtil.create('div', 'sequence-control-container');
      $(container).append('<input class="range-slider" type="range">');
      $(container).append('<button class="step" id="reverse" img src = "img/reverse.png" title="Reverse">Reverse</button>');
      $(container).append('<button class="step" id="forward" img src = "img/forward.png" title="Forward">Forward</button>');
      L.DomEvent.disableClickPropagation(container);
      return container;
    }
  });
  map.addControl(new SequenceControl());
  $(reverse).html('<img src="img/reverse.png">');
  $(forward).html('<img src="img/forward.png">');
  $('.range-slider').attr({
    max: 13,
    min: 0,
    value: 0,
    step: 1
  });
  $('.step').click(function(){
    var index = $('.range-slider').val();
    if ($(this).attr('id')=='forward'){
      index++;
      index = index > 13 ? 0 :index;
    }else if ($(this).attr('id')=='reverse'){
      index--;
      index = index < 0 ? 13 : index;
    };
    $('.range-slider').val(index);
    updatePropSymbols(attributes[index])
  });
  $('.range-slider').click(function(){
    var index = $('.range-slider').val();
    updatePropSymbols(attributes[index])
  })
  createLegend()
}

function createLegend(attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        onAdd: function () {
            // create the control container with a particular class name
            var index = $('.range-slider').val();
            var container = L.DomUtil.create('div', 'legend-control-container');
            if (index == 0){
              var date = "1/25/2020";
            }else if (index == 1) {
              var date = "1/26/2020"
            }else if (index == 2) {
              var date = "1/27/2020"
            }else if (index == 3) {
              var date = "1/28/2020"
            }else if (index == 4) {
              var date = "1/29/2020"
            }else if (index == 5) {
              var date = "1/30/2020"
            }else if (index == 6) {
              var date = "1/31/2020"
            }else if (index == 7) {
              var date = "2/1/2020"
            }else if (index == 8) {
              var date = "2/2/2020"
            }else if (index == 9) {
              var date = "2/3/2020"
            }else if (index == 10) {
              var date = "2/4/2020"
            }else if (index == 11) {
              var date = "2/5/2020"
            }else if (index == 12) {
              var date = "2/6/2020"
            }else if(index == 13) {
              var date = "2/7/2020"
            };
            $(container).append ("<p><b>Reported COVID-19 (Coronavirus) cases on " + date + "</b></p>");
            var legendContent = "<p><b>Reported COVID-19 (Coronavirus) cases on " + date + "</b></p>";
            return container;
            return legendContent;

            console.log(legendContent)
            return div;
        }
    });

    map.addControl(new LegendControl());
};

function addDescript(){
  $("#description").append('<p><b>Reported COVID-19 (Coronavirus) cases in Mainland China outside of Hubei Province (1/25/2020 - 2/7/2020)</p></b>')
}
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
      popupContent += "<p><b>COVID-19 cases :</b> " + props[attribute] + " people</p>";
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
      }
  })
createLegend()
}

function createMap(){
  map = L.map("mapid", {
    center: [30.9756, 112.2707],
    zoom: 5
  });
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://systems.jhu.edu/research/public-health/ncov/">Mapping 2019-nCoV Johns Hopkins CSSE</a> <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiYnJvZHltYW5xdWVuIiwiYSI6ImNrNmpyOTloczAwamgzZnFxYWh3ajYzaDMifQ.6CFEgY3Fd0NQ5EqkpzvspA'
  }).addTo(map);
  getData();
};

//Add non-scalable
function wuhan(){
  var circle = L.circle([30.583332, 114.283333],{
    fillColor: "#FD5555",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    radius: 500
  }).addTo(map);
};

function getData(mapid){
    $.ajax("data/chinaCorona.geojson",{
      dataType: "json",
      success: function(response){
        var attributes = processData(response);
        minValue = calcMinValue(response);
        createPropSymbols(response, attributes);
        createSequenceControls(attributes);
        addDescript();
      }
    });
  };

$(document).ready(createMap);
