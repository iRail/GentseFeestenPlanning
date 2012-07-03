/*
 * Data
 */
var dates = {
	14 : {
		name : 'donderdag 14',
		number: 14,
	},
	15 : {
		name : 'vrijdag 15',
		number: 15,
	},
	16 : {
		name : 'zaterdag 16',
		number: 16,
	},
	17 : {
		name : 'zondag 17',
		number: 17,
	},
	18 : {
		name : 'maandag 18',
		number: 18,
	},
	19 : {
		name : 'dinsdag 19',
		number: 19,
	},
	20 : {
		name : 'woensdag 20',
		number: 20
	},
	21 : {
		name : 'donderdag 21',
		number: 21
	},
	22 : {
		name : 'vrijdag 22',
		number: 22
	},
	23 : {
		name : 'zaterdag 23',
		number: 23
	}
};
/*
 * Get events for specific day
 */
function getEvents(day, cbSuccess, cbError) {
	if (day < 14 || day > 23)
		cbError("Invalid day requested")

	if (!Modernizr.localstorage) {
		cbError("No localStorage accessible")
		return
	}

	// Manage current day
	var cachedData = $.parseJSON(localStorage.getItem("day_" + day));
	if (cachedData == null) {
		$.ajax({
			url : 'js/data/' + day + '.json',
			async : false,
			dataType : 'json',
			success : function(data) {
				// TODO: QUOTA_EXCEEDED, remove previous days?
				data=data["201207"+day];
				
				// adding the id's to the data
				for(var i=0;i<data.length;i++){
                                    data[i].id=i;
				}
				
				localStorage.setItem("day_" + day, JSON.stringify(data));
				cbSuccess(data)
			}
		});
	} else {
		cbSuccess(cachedData)
	}
}

/*
 * Gets the Id of a given item
 */
function getIdOfItem(item){
    return item.id;
}

/*
 * Returns the item for a given id
 */
function getItemById(data, id){
    return data[id];
}

/*
 * Adding an event to favourites
 */
function addFavourite(event, day, cbSucces, cbError) {
	if (!Modernizr.geolocation) {
		cbError("No HTML5 geolocation available")
		return

		

	}
	if (localStorage['day_' + day + 'favourites'] == undefined) {
		favouriteEvents = [];
		favouriteEvents.push(event);
		localStorage['day_' + day + 'favourites'] = JSON
				.stringify(favouriteEvents);
	} else {
		favouriteEvents = JSON.parse(localStorage['day_' + day + 'favourites']);
		favouriteEvents.push(event);
		localStorage['day_' + day + 'favourites'] = JSON
				.stringify(favouriteEvents);
	}
}

/*
 * Return favourites for a specific day
 */
function getFavourites(day, cbSucces, cbError) {
	if(localStorage['day_' + day + 'favourites'] != undefined) {
		return JSON.parse(localStorage['day_' + day + 'favourites']);
	} else {
		return [];
	}
}

/*
 * Fetch geolocation
 */
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
			cbError("Time-out")
			break;
		default:
			cbError("Unknown error")
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
			cbError("Couldn't fetch location")
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
			cbError("Couldn't fetch location")
		}
	});
}

/*
 * Auxiliary
 */

/*
 * Calculate distance
 */
var distance = function(lat1, lat2, lon1, lon2) {
	var R = 6371; // KM
	var dLat = (lat2 - lat1) * Math.PI / 180;// Radians
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
			+ Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
			* Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}