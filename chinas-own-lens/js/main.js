// Mapbox Access Token
L.mapbox.accessToken = "pk.eyJ1IjoibWpmb3N0ZXI4MyIsImEiOiJ5ekh3M2VzIn0.OT046Cq9nPMRMLuqibZY3A";

// Creation of Map Object
var map = L.map("map", {attributionControl: false, zoomControl: false, minZoom: 5, maxZoom: 14});
map.setView([33.024947, 114.890781], 6);

var hash = new L.Hash(map);

// Style and position zoon
new L.Control.Zoom({ position: 'topright' }).addTo(map);

// Global Variables
var basemapLayer = L.mapbox.tileLayer("mjfoster83.loekpjp8");
var bounds = map.getBounds();
var panelStatus = "open";
var dataNotInBounds = new L.FeatureGroup();
var dataPath = "data/allPosts_pollution.geojson";
var jsonInBounds = null;
var filterValue = "showAll";
var img = null;
var alt = null;
var index = null;
var imglat = null;
var imglng = null;
var updatedHeight = null;
var panelHeight = null;

// Data in Bounds Variable and Marker Cluster
var dataInBounds = new L.MarkerClusterGroup({
  polygonOptions: {
    stroke: 7, opacity: 0, fill: false
  }
});

// On Window Load
$(window).load(function(){
  bbox = map.getBounds();
  getData();
  // Add layers to map
  dataInBounds.addTo(map);
  basemapLayer.addTo(map);
  if ($.cookie('modal_shown') == null) {
    $.cookie('modal_shown', 'yes', { expires: 1, path: '/' });
    $('#aboutModal').modal('show');
  };
});

// Camera Icon
var cameraIcon = L.icon({
  iconUrl: 'img/camera_icon_simple.png',
  iconAnchor: [10, 8],
  popupAnchor: [0, -4]
});

var customMarker = L.Marker.extend({
  icon: cameraIcon,
  newIndex: "index here"
});

function onMouseOver(e) {
  owl.trigger("owl.goTo", dataInBounds.getLayers().indexOf(e.layer));
  $("#picture_"+e.layer.feature.properties.Index).toggleClass('highlighted');
}

function onMouseOut(e) {
  $("#picture_"+e.layer.feature.properties.Index).toggleClass('highlighted');
}

function onClick(e) {
  owl.trigger("owl.goTo", dataInBounds.getLayers().indexOf(e.layer));
}

// Initial Get Data Function
function getData(){
  console.log("Data is being retrieved");
  if ( filterValue === "showAll" ){
    $.getJSON(dataPath, function(data){
      L.geoJson(data, {
        onEachFeature: function(feature,layer){
          var a = layer.getLatLng();
          if( bbox._southWest.lng <= a.lng && a.lng <= bbox._northEast.lng && bbox._southWest.lat <= a.lat && a.lat <= bbox._northEast.lat ) {
            dataInBounds.addLayer(layer);
          } else {
            dataNotInBounds.addLayer(layer);
          }
        }, pointToLayer: function (feature, latlng) {
            var myCustomMarker = new customMarker(latlng,{
              icon: cameraIcon,
              newIndex: feature.properties.index
            });
            return myCustomMarker;
        }
      });
      jsonInBounds = dataInBounds.toGeoJSON();
      setPostGallery();
      console.log("GetData()");
      console.log(dataInBounds.getLayers());
      dataInBounds.on('click', function(e) {
        if (map.getZoom() < 9){
          map.setView(e.layer.getLatLng(), 11);
        };
        onClick(e);
      });
      dataInBounds.on('mouseover', function(e) {
        onMouseOver(e);
      });
      dataInBounds.on('mouseout', function(e) {
        onMouseOut(e);
      });
    });
  } else if( filterValue === "pollution"){
    refreshData();   
  } else if( filterValue === "airpollution"){
    refreshData(); 
  } else if( filterValue === "algalbloom"){
    refreshData();
  } else if( filterValue === "activechimney"){
    refreshData();
  } else if( filterValue === "haze"){
    refreshData();
  } else if( filterValue === "PM2_5"){
    refreshData();
  } else if( filterValue === "pollutionpics"){
    refreshData();
  } else if( filterValue === "particulatematter"){
    refreshData();
  } else if( filterValue === "sewage"){
    refreshData();
  } else if( filterValue === "smog"){
    refreshData();
  } else if( filterValue === "soot"){
    refreshData();
  } else if( filterValue === "takepollutionpics"){
    refreshData();
  } else if( filterValue === "yellowdust"){
    refreshData();
  }
};

// Event Listeners
// Show all
$('input[value=showAll]').click(function(){
  console.log("Show All Clicked!");
  filterValue = "showAll";
  owl.data('owlCarousel').destroy();
  resetMap();
});

// Active Chimney
$('input[value=activechimney]').click(function(){
  console.log("Active Chimney Clicked!");
  filterValue = "activechimney";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Air Pollution
$('input[value=airpollution]').click(function(){
  console.log("Air Pollution Clicked!");
  filterValue = "airpollution";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Algal Bloom
$('input[value=algalBloom]').click(function(){
  console.log("Algal Bloom Clicked!");
  filterValue = "algalbloom";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Haze
$('input[value=haze]').click(function(){
  console.log("Haze Clicked!");
  filterValue = "haze";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Particulate Matter
$('input[value=particulatematter]').click(function(){
  console.log("Particulate Matter Clicked!");
  filterValue = "particulatematter";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// PM 2.5
$('input[value=PM2_5]').click(function(){
  console.log("PM 2.5 Clicked!");
  filterValue = "PM2_5";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Pollution
$('input[value=pollution]').click(function(){
  console.log("Pollution Clicked!");
  filterValue = "pollution";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Pollution Pics
$('input[value=pollutionpics]').click(function(){
  console.log("Pollution Pics Clicked!");
  filterValue = "pollutionpics";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Sewage
$('input[value=sewage]').click(function(){
  console.log("Sewage Clicked!");
  filterValue = "sewage";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Smog
$('input[value=smog]').click(function(){
  console.log("Smog Clicked!");
  filterValue = "smog";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Soot
$('input[value=soot]').click(function(){
  console.log("Soot Clicked!");
  filterValue = "soot";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Take Pollution Pics
$('input[value=takepollutionpics]').click(function(){
  console.log("Take Pollution Pics Clicked!");
  filterValue = "takepollutionpics";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Yellow Dust
$('input[value=yellowdust]').click(function(){
  console.log("Yellow Dust Clicked!");
  filterValue = "yellowdust";
  owl.data('owlCarousel').destroy();
  resetMap();  
});

// Refresh data function for filtering
function refreshData(){
  $.getJSON(dataPath, function(data){
    L.geoJson(data, {
      onEachFeature: function(feature,layer){
        var a = layer.getLatLng();
        if( bbox._southWest.lng <= a.lng && a.lng <= bbox._northEast.lng && bbox._southWest.lat <= a.lat && a.lat <= bbox._northEast.lat && feature.properties.Category === filterValue) {
          console.log("Point is in bounding box and is in the " + filterValue + " category");
          console.log(feature.properties.Category);
          dataInBounds.addLayer(layer);
        } else {
          console.log("Point is not in bounding box or is not in the " + filterValue + " category");
          dataNotInBounds.addLayer(layer);
        }
      }, pointToLayer: function (feature, latlng) {
            var myCustomMarker = new customMarker(latlng,{
              icon: cameraIcon,
              newIndex: feature.properties.index
            });
            return myCustomMarker;
        }
      });
      jsonInBounds = dataInBounds.toGeoJSON();
      setPostGallery();
      console.log("RefreshData()");
      console.log(dataInBounds.getLayers());
      dataInBounds.on('click', function(e) {
        if (map.getZoom() < 9){
          map.setView(e.layer.getLatLng(), 11);
        };
        onClick(e);
      });
      dataInBounds.on('mouseover', function(e) {
        onMouseOver(e);
      });
      dataInBounds.on('mouseout', function(e) {
        onMouseOut(e);
      });
    });
}

// Slide out Panel
$('#photoPanelOpen').click(function(){
  $('#photoPanel #photoDashboard').slideToggle('slow', function(){
    if($('#photoPanel #photoDashboard').is(':hidden')){
      $('#photoPanelOpen').html('Show Posts');
      updatedHeight = $(window).height() - 110;
      $("#map").height(updatedHeight);
      map.invalidateSize();
    }else{
      $('#photoPanelOpen').html('Hide Posts');
      updatedHeight = $(window).height() - 292;
      $("#map").height(updatedHeight);
      map.invalidateSize();
    }
  })  
});

// Slide out Filters
$('#openFilters').click(function () {
  if(!$('#filterCheckboxes').is(':visible')) {
    $('#filterCheckboxes').slideToggle("slow");
    $('#filterCheckboxesForm').css({
      "border-top-left-radius" : "0em",
      "border-top-right-radius" : "0em",
      "border-top": "thin solid #ccc"
    });
    $('#showAllMenuForm').css({
      "border-bottom-left-radius" : "0em",
      "border-bottom-right-radius" : "0em"
    });
  }
});

// Close Filters
$('#showAll').click(function () {
  if($('#filterCheckboxes').is(':visible')) {
    $('#filterCheckboxes').slideToggle("slow");
    $('#showAllMenuForm').css({
      "border-bottom-left-radius" : "4px",
      "border-bottom-right-radius" : "4px"
    });
  }
});

// Carousel creation
var owl = $("#postGallery");

function setPostGallery(){
  console.log("Setting Post Gallery");
  owl.owlCarousel({
    jsonLoad : jsonInBounds,
    jsonSuccess : customDataSuccess,
    pagination: false,
    itemsCustom : [
      [0, 2],
      [450, 3],
      [600, 4],
      [700, 5],
      [850, 6],
      [1000, 7],
      [1150, 8],
      [1300, 9],
      [1450, 10],
      [1600, 11],
      [1750, 12],
      [1900, 13],
      [2050, 14],
      [2200, 15],
      [2350, 16]
    ]
  });
};

function customDataSuccess(data){
  var content = "";
  for(var i in data["features"]){     
    img = "data/all/picture_" + data["features"][i].properties.Index + ".jpg";
    alt = data["features"][i].properties.CityName;
    imgDesc = data["features"][i].properties.image_description;
    sname = data["features"][i].properties.screenname;
    index = data["features"][i].properties.Index;
    imglat = data["features"][i].geometry.coordinates[1];
    imglng = data["features"][i].geometry.coordinates[0];
    if( bbox._southWest.lng <= imglng && imglng <= bbox._northEast.lng && bbox._southWest.lat <= imglat && imglat <= bbox._northEast.lat ) {
      console.log("Image is in bounding box");
      content += "<div id='"+index+"'><a href='#' class='item link' data-toggle='modal' data-target='#exampleModal'><img class='thumb' id=\"picture_" + index + "\" src=\"" +img+ "\" alt=\"" +alt+ "\" imgDesc=\"" +imgDesc+ "\" sname=\"" +sname+ "\">#"+alt+"</a></div>";
    } else {
      console.log("Image is not in bounding box");
    }
  }
  owl.html(content);
};

// Get map bounding box values
var bbox = map.getBounds();
var boundingArray = [bbox._northEast.lat, bbox._northEast.lng, bbox._southWest.lat, bbox._southWest.lng];

// Refresh map on map move
map.on('dragend', function(e){
  resetMap();
  console.log("move end runs!");
});

// Refresh map on map resize
map.on('resize', function(e){
  resetMap();
  console.log("resize runs!");
});

// Refresh map on map resize
map.on('zoomend', function(e){
  resetMap();
  console.log("zoom end runs!");
});

function resetMap(){
  console.log("Resetting map");
  if (owl.data('owlCarousel') != undefined){
    owl.data('owlCarousel').destroy();
  }
  if (map.hasLayer(dataInBounds)){
    map.removeLayer(dataInBounds);
    console.log("Data in Bounds removed");
  };
  jsonInBounds = null;
  dataInBounds = new L.MarkerClusterGroup({
    polygonOptions: {
      stroke: 7, opacity: 0, fill: false
    }
  });
  bbox = map.getBounds();
  getData();
  dataInBounds.addTo(map);
}

// Modal Popup Gallery
var button = null;

$('#exampleModal').on('show.bs.modal', function (event) {
  button = $(event.relatedTarget) // Button that triggered the modal
  console.log(button);
  var modal = $(this);
  modal.find('.modal-body').empty();
  modal.find('.modal-footer').empty();
  var modalImage = button.context.outerHTML;
  modal.find('.modal-title').html($(modalImage).find('img').attr('alt'));
  modal.find('.modal-body').append("<img class='resized' src=" + $(modalImage).find('img').attr('src') + ">");
  modal.find('.modal-body').append("<p class='postDesc' style='margin-bottom: 0px'><span>Screenname: </span> " + $(modalImage).find('img').attr('sname') + "</p>");
  modal.find('.modal-body').append("<p class='postDesc' style='margin-top: 0px'><span>Description: </span>" + $(modalImage).find('img').attr('imgdesc') + "</p>");
  modal.find('.modal-footer').append("<button type='button' class='btn btn-default' data-dismiss='modal'>Back to Map</button>");
  modal.find('.modal-footer').append("<a href='gallery.html' class='btn btn-primary' role='button'>View Gallery</a>");
});

$(".show-modal").click(function() {
  $('#aboutModal').modal('show');
});
