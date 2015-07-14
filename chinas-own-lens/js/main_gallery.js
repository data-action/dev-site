var testdata = null;
var $container = null;
var picsPerPage = 50;
var $body = $("body");

$(document).ajaxStart(function() {
  $body.addClass("loading");
});

$(document).ajaxStop(function() {
  $body.removeClass("loading");
});

var allGeoJsonFeatures;
var isIsotopeInit = false;
var iso = null;

$(window).load(function(){
	$('input[type="radio"]').prop('checked', false);
	$('input[data-filter="*"]').prop('checked', true);
	testdata = $.getJSON("data/allPosts_pollution.geojson", function(geoJson) {
		allGeoJsonFeatures = geoJson['features'];
		renderPageWithFeatures(allGeoJsonFeatures,1);
		initializeHandlers();

	});	
});

var buttonFunction = function(clickedID){
	
	var filterVal = getFilterName();
	// alert(typeof filterVal);
	console.log(filterVal);
	if (filterVal != '*'){
		console.log('it went ok');
		newFilteredFeatures = getResultsForFilter(allGeoJsonFeatures, filterVal);
		console.log(newFilteredFeatures);
		renderPageWithFeatures(newFilteredFeatures,clickedID);
		// console.log('filter value is'+filterVal);		
		initializeHandlers();
	} else{
		console.log('filter value is null');
		renderPageWithFeatures(allGeoJsonFeatures,clickedID);
		initializeHandlers();	
		
	}
};

var getListNum = function(features){
	numPages = Math.ceil(features.length/picsPerPage);
	var listPages = document.getElementById('listPages');
	while (listPages.firstChild) {
	    listPages.removeChild(listPages.firstChild);}
	if (numPages > 0) {
	    for (i=1; i < numPages+1; i++) {
	        $('<li class = "paginationButton" id ='+i+'><button onclick="buttonFunction('+i+')">'+i+'<//button></li>').appendTo('.pagination');
    }}
};

var renderPageWithFeatures = function(features,num,beg,end) {
	getListNum(features);
	features = features.slice(picsPerPage*(num-1), picsPerPage*num); //remove me for all data
	populateImageElements(features);
	initializeGallery();

	iso.layout();
		
};


	
var populateImageElements = function(features) {
	$('.imageContainer').isotope('destroy');
	$('.imageContainer .item').remove();
	// $('.imageContainer').isotope('destroy');


	if (iso) {
		iso.reloadItems();
	}

	$.each(features, function(index, value) {
		var fileName = "data/all/picture_" + value.properties.Index + ".jpg";

		// only lazy load after the first N	
		var imgSrcAttr;
		if (index < 20) { //temp turn off lazy load
			imgSrcAttr = "src='" + fileName + "'";
			
		} else {
		 	imgSrcAttr = "data-original='" + fileName + "'";
		}
		
		var extraAttribs = value.properties.City + " " + value.properties.Category + " " + value.properties.Index + "' id=" + value.properties.Index;
		var html = "  <a class='item " + extraAttribs + "' href='#' data-toggle='modal' data-target='#exampleModal'" + ">" + 
		  		   "    <img " + imgSrcAttr + " city='"+value.properties.CityName+"' imgdesc='"+value.properties.image_description+"' sname='"+value.properties.screenname+"' lat='" + value.geometry.coordinates[1] + "' lon='"+value.geometry.coordinates[0]+"'>" + 
		  		   "  </a>";
		$(".imageContainer").append(html);
	});


	//use this block if we aren't using lazy load
	$("img").one("load", function() {
  		layoutItems();
	}).each(function() {
  		if(this.complete) $(this).load();
	});

	$(".imageContainer img").lazyload({
	    event : 'scroll',
	    effect : "fadeIn",
	    threshold:200,

	    load:function(a,b,c){
	
	    	$('.imageContainer').isotope('layout');
	    }
	 });
};

var layoutItems = function() {
	if (iso) {
		iso.layout();
	}
};

var initializeGallery = function() {
	$container = $('.imageContainer');
	window.$container = $container;

	$container.isotope({
		// main isotope options
	 	itemSelector: '.item',
	 	layoutMode:'masonry',
	 	transitionDuration: 0,
	 	percentPosition: true,
	 	masonry: {
	  		columnWidth: 400,
	  		isFitWidth: true
	 	}
	});

	iso = $container.data('isotope');
	isIsotopeInit = true;

	$('.imageContainer').isotope('layout');
};
var getFilterName = function(){
	var selectedVal = "";
	var selected = $("input[type='radio']:checked");
	if (selected.length > 0) {
	    selectedVal = selected.attr('data-filter');
	}
	return selectedVal;

};

var getResultsForFilter = function (features, filterValue) {
	var filteredFeatures = [];
	if (!filterValue) {
	  return features;
	}

	for (var index = 0; index < features.length; index++){
		var item = features[index];

		if(item['properties']['Category'] == filterValue.substring(1)) {
			filteredFeatures.push(item);
		}
	}

	return filteredFeatures;
};

var getHashFilter = function() {
  var hash = location.hash;
  // get filter=filterName
  var matches = location.hash.match( /filter=([^&]+)/i );
  var hashFilter = matches && matches[1];
  return hashFilter && decodeURIComponent( hashFilter );
};

var initializeHandlers = function() {

	$('#filters').on('click', 'input', function() {
		var filterValue = $( this ).attr('data-filter');

		if (filterValue == '*') {
			filterValue = null;
		} 
		filteredFeatures = getResultsForFilter(allGeoJsonFeatures, filterValue);
		renderPageWithFeatures(filteredFeatures,1);

		// location.hash = 'filter=' + encodeURIComponent( filterValue );
	});

	$(window).on( 'hashchange', onHashchange );
	// trigger event handler to init Isotope
	onHashchange();

	$(".show-modal").click(function() {
	  $('#aboutModal').modal('show');
	});

	$('#exampleModal').on('show.bs.modal', function (event) {
	  button = $(event.relatedTarget) // Button that triggered the modal
	  var modal = $(this);
	  modal.find('.modal-body').empty();
	  modal.find('.modal-footer').empty();
	  var modalImage = button.context.outerHTML;
	  modal.find('.modal-title').html($(modalImage).find('img').attr('city'));
	  modal.find('.modal-body').append("<img class='resized' src=" + $(modalImage).find('img').attr('src') + ">");
	  modal.find('.modal-body').append("<p class='postDesc' style='margin-bottom: 0px'><span>Screenname: </span> " + $(modalImage).find('img').attr('sname') + "</p>");
	  modal.find('.modal-body').append("<p class='postDesc' style='margin-top: 0px'><span>Description: </span>" + $(modalImage).find('img').attr('imgdesc') + "</p>");
	  modal.find('.modal-footer').append("<button type='button' class='btn btn-default' data-dismiss='modal'>Back to Gallery</button>");
	  modal.find('.modal-footer').append("<a href='index.html#11/" + $(modalImage).find('img').attr('lat') + "/" + $(modalImage).find('img').attr('lon') + "' class='btn btn-primary' role='button'>View on Map</a>");
	});
};

var onHashchange = function() {
	var hashFilter = getHashFilter();
	
	if ( !hashFilter && isIsotopeInit ) {
	  return;
	}

	//TODO: Call the render page based on the filter
};


          
          