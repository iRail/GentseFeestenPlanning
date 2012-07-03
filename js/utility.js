function getLocation(cbSuccess, cbError, cached) {
	if (typeof cached === "undefined")
		cached = true
	var age = 0
	if (cached)
		age = 600000

		// Check if we have geolocation capabilities
	if (!Modernizr.geolocation) {
		cbError("No HTML5 geolocation available")
		return

	}

	// Fetch a position
	navigator.geolocation.getCurrentPosition(function(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;

		cbSuccess(position.coords.latitude, position.coords.longitude,
				position.coords.accuracy)
	}, function(error) {
		switch (error.code) {
		case error.TIMEOUT:
			cbError("time-out")
			break;
		default:
			cbError("unknown error")
		}
		;
	}, {
		maximumAge : age, // Maximum 10 minutes old
		timeout : 10000
	// Time-out after 10 seconds
	});
}

/*
 * 
 */
var geocoder = new google.maps.Geocoder();
function getLocationByAddress(address, cbSuccess, cbError) {
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			cbSuccess(results[0].geometry.location.lat(),
					results[0].geometry.location.lng(),
					results[0].formatted_address)
		} else {
			cbError("Couldn't fetch location.")
		}
	});
}

/*
 * 
 */
function getAddressByLocation(latitude, longitude, cbSuccess, cbError) {
	geocoder.geocode({
		'latLng' : new google.maps.LatLng(latitude, longitude)
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			cbSuccess(results[0].formatted_address)
		} else {
			cbError("Couldn't fetch location.")
		}
	});
}