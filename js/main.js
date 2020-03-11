var map;
var dataStats = {};

function processData(data){  //processes Data
  var attributes = [];
  var properties = data.features[0].properties;  //grabs each property in geojson
  for (var attribute in properties){
    if (attribute.indexOf("1") > -1){
      attributes.push(attribute); //pushes each attribute to attributes list
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

function calcStats(data){  //calculates Statistics
  var allValues = [];
  for(var hub of data.features){  //iterates through all geojson features
    for(var day = 1; day <=13; day+=1){
      var value = hub.properties[day];  //pushes all values of reported COVID 19 cases to allValues
      allValues.push(value);
    };
  };
  dataStats.min = Math.min(...allValues);
  dataStats.max = Math.max(...allValues);  //Performs summary statistics on allValues
  //var minValue = Math.min(...allValues);
  var sum = allValues.reduce(function(a, b){return a+b});
  dataStats.mean = sum/allValues.length;
  //return minValue;
};

function createPropSymbols(data, attributes){  //create Proportional Symbols

  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes); //calls PointToLayer for initial time sequence
    }
  }).addTo(map);
  createLegend(); //updates legend
};

function pointToLayer(feature, latlng, attributes){   //adds point features to layer as prop symbol
  var attribute = attributes[0];
  var options = { //sets appearance
    fillColor: "#FD5555",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.6
  };
  var attValue = Number(feature.properties[attribute]);  //gets attribute value for each point at time stamp
  options.radius = calcPropRadius(attValue);  //determine radius of symbol
  var layer = L.circleMarker(latlng, options);  //adds circle marker
  var popupContent = "<p><b>City/Province:</b> " + feature.properties.Location + "</p>";
  popupContent += "<p><b>Region/Country:</b> " + feature.properties.Region + "</p>";
  var day = attribute[0];
  popupContent += "<p><b>COVID-19 cases :</b> "+feature.properties[attribute]+" people</p>";  //create popupContent
  layer.bindPopup(popupContent, { //binds Popup info to points
        offset: new L.Point(0,-options.radius) //offsets popup slightly
    });
  return layer;

};

function calcPropRadius(attValue){
  var minRadius = 4.5
  var radius = 1.0083 * Math.pow(attValue/dataStats.min,0.5715) * minRadius
  return radius;
};

function createSequenceControls(attributes){  //creates Sequence Bar
  var SequenceControl = L.Control.extend({
    options: {
      position: 'bottomleft' //places slider in bottom left
    },
    onAdd: function() {
      var container = L.DomUtil.create('div', 'sequence-control-container'); //creates container
      $(container).append('<input class="range-slider" type="range">'); //creates  slider range
      $(container).append('<button class="step" id="reverse" img src = "img/reverse.png" title="Reverse">Reverse</button>'); //creates reverse button
      $(container).append('<button class="step" id="forward" img src = "img/forward.png" title="Forward">Forward</button>'); //create forward button
      L.DomEvent.disableClickPropagation(container); //disallows clicking through slider
      return container;
    }
  });
  map.addControl(new SequenceControl()); //adds to map
  $(reverse).html('<img src="img/reverse.png">');
  $(forward).html('<img src="img/forward.png">'); //sets button images
  $('.range-slider').attr({ //sets slider attributes
    max: 13, //slider max index
    min: 0, //slider min index
    value: 0, //slider initial position
    step: 1 //increment per click
  });
  $('.step').click(function(){ //event listener for each step
    var index = $('.range-slider').val();  //sets index value to value of slider
    if ($(this).attr('id')=='forward'){  //if click forward, increase index
      index++;
      index = index > 13 ? 0 :index; //if click past 13, revert to 0
    }else if ($(this).attr('id')=='reverse'){ //if click reverse, decrease index
      index--;
      index = index < 0 ? 13 : index;
    };
    $('.range-slider').val(index);  //sets range slider to index
    updatePropSymbols(attributes[index]) //updates prop symbols per click
  });
  $('.range-slider').click(function(){ //updates prop symbols if click place on slider
    var index = $('.range-slider').val();
    updatePropSymbols(attributes[index])
  })
  createLegend(); //creates legend for initial timestamp
}

function createLegend(attributes){
    var LegendControl = L.Control.extend({  //creates control extension
        options: {
            position: 'bottomright' //places in bottom right
        },
        onAdd: function () { //does these things on add to map
          //map.legend = this;
            // create the control container with a particular class name
            var index = $('.range-slider').val();
            var legend = L.DomUtil.create('div', 'legend-control-container'); //creates div
            var temporal = '<div class="temporalLegend" width="250px" height="15px">'; //sets temporal legend div
            $(legend).append(temporal); //appends to legend
            if (index == 0){
              var date = "1/25/2020"; // gets date names for each Index, as name in GEOJson not helpful
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
            var legendContent = "<p><b>Reported COVID-19 cases on " + date + "</b></p>"; //sets temporalLegend name
            var temporalContent = $('div.temporalLegend').html(legendContent); //adds temporal legend name to temporal div

            //Attribute Legend
            var svg = '<svg class="attribute-legend" width="130px" height="130px">'; //svg legend info
            var circles = ['max', 'mean', 'min'];
            for (var i=0; i<circles.length; i++){ //grabs max, mean, min to add as svg legend elements
              var radius = calcPropRadius(dataStats[circles[i]]); //grabs radius of max, mean, min
              var cy = 129 - radius; //sets y position of circles in legend
              svg += '<circle class="legend-circle" id="' + circles[i] + '" r="'+radius+'"cy="'+cy+'"" fill="#FD5555" fill-opacity="0.8" stroke="#000" cx="60"/>'; //adds svg to legend
              var textY = i*20+80;
              svg += '<text id="'+circles[i]+'-text" x="125" y="'+textY+'">'+Math.round(dataStats[circles[i]]*100)/100+" people"+'</text>' //adds svg labels to legend
            };
            svg += "</svg>" //closes svg
            var svgLegend = $("div.legend-control-container").append(svg) //appends <svg> to legend
            return(legend);
        }
    });
    map.addControl(new LegendControl());
  }

function updateLegend(){   /////Currently, is the same as createLegend because I cannot figure out how to
  var LegendControl = L.Control.extend({   //update the legend without either A. causing multiple legends to appear or
      options: {                          // B. stop the legend from updating altogether -- unsure how to fix this
          position: 'bottomright'
      },
      onAdd: function () {
        map.legend = this;

          // create the control container with a particular class name
          var index = $('.range-slider').val();
          var legend = L.DomUtil.create('div', 'legend-control-container');
          //LegendControl.removeFrom(map);
          var temporal = '<div class="temporalLegend" width="250px" height="15px">';
          $(legend).append(temporal);
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
          var legendContent = "<p><b>Reported COVID-19 cases on " + date + "</b></p>";
          var temporalContent = $('div.temporalLegend').html(legendContent);

          //Attribute Legend
          var svg = '<svg class="attribute-legend" width="200px" height="130px">';
          var circles = ['max', 'mean', 'min'];
          for (var i=0; i<circles.length; i++){
            var radius = calcPropRadius(dataStats[circles[i]]);
            var cy = 129 - radius;
            svg += '<circle class="legend-circle" id="' + circles[i] + '" r="'+radius+'"cy="'+cy+'"" fill="#FD5555" fill-opacity="0.8" stroke="#000" cx="60"/>';
            var textY = i*20+80;
            svg += '<text id="'+circles[i]+'-text" x="125" y="'+textY+'">'+Math.round(dataStats[circles[i]]*100)/100+"people"+'</text>'
            };
          svg += "</svg>"
          var svgLegend = $("div.legend-control-container").append(svg)
          return(legend);
      },
      onRemove: function(){
        console.log('pie jesu domine')
      }
  });

  map.addControl(new LegendControl());
};

function addDescript(){ //adds title
  $("#description").append('<p><b>Reported COVID-19 (Coronavirus) cases in selected Mainland Chinese provinces outside of Hubei (1/25/2020 - 2/7/2020)</p></b>')
}

function updatePropSymbols(attribute){ //dynamic update to proportional symbols
  map.eachLayer(function(layer){
    if (layer.feature && layer.feature.properties[attribute]){
      var props = layer.feature.properties; //grabs properties of each layer
      var radius = calcPropRadius(props[attribute]); //calculates new radius
      layer.setRadius(radius); //sets new radii to symbols
      var popupContent = "<p><b>City/Province:</b> " + props.Location + "</p>";
      popupContent += "<p><b>Region/Country:</b> " + props.Region + "</p>"
      var day = attribute[2];
      popupContent += "<p><b>COVID-19 cases :</b> " + props[attribute] + " people</p>"; //changes popup information
      popup = layer.getPopup();
      popup.setContent(popupContent).update();
      //calcStats();
    };
  });
  updateLegend(); //updates legend
};

function createMap(){ //creates map
  var nEast = [51.0, 143.0]
  var sWest = [9.666664, 80.0]
  bounds = L.latLngBounds(sWest, nEast); //sets panning boundaries
  map = L.map("mapid", {
    maxBounds: bounds,
    minZoom: 5,
    maxZoom: 5, //sets zoom information
    center: [30.9756, 112.2707], //centers map
    zoom: 6
  });

  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', { //sets basemap
      //attribution: 'Map data &copy; <a href="https://systems.jhu.edu/research/public-health/ncov/">Mapping 2019-nCoV Johns Hopkins CSSE</a> <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      attribution: '&copy; <a href="https://systems.jhu.edu/research/public-health/ncov/">Mapping 2019-nCoV Johns Hopkins CSSE</a> <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 8
      //id: 'mapbox/streets-v11',
      //accessToken: 'pk.eyJ1IjoiYnJvZHltYW5xdWVuIiwiYSI6ImNrNmpyOTloczAwamgzZnFxYWh3ajYzaDMifQ.6CFEgY3Fd0NQ5EqkpzvspA'
  }).addTo(map);
  getData(); //grabs data when map constructed
};

function getData(mapid){  //data calculation
    $.ajax("data/chinaCorona.geojson",{ //grabs geojson
      dataType: "json",
      success: function(response){
        var attributes = processData(response); //runs through scripts
        calcStats(response);
        createPropSymbols(response, attributes);
        createSequenceControls(attributes);
        addDescript();
      }
    });
  };

$(document).ready(createMap); //creates map
