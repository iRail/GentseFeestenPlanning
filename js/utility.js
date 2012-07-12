// SOME TO DO THINGS NOT TO FORGET:
/* finish solveConflicts(); 					-//- DONE 08/07/12
/* tell users which day he's looking at			-//- DONE 10/07/12
/* show users date of today higlighted
/* show users the name field ain't required
/* solve filter 								-//- DONE 11/07/12
/* solve double events							-//- DONE 11/07/12
/* mark events as favorite
/* lijntje welk uur het is
/* DAY PICKER HIGHER ON S2,...


/*
 * Data
 */
var dates = {
	14 : {
		name : 'zaterdag 14',
		sname: 'za 14',
		number: 14,
	},
	15 : {
		name : 'zondag 15',
		sname: 'zo 15',
		number: 15,
	},
	16 : {
		name : 'maandag 16',
		sname: 'ma 16',
		number: 16,
	},
	17 : {
		name : 'dinsdag 17',
		sname: 'di 17',
		number: 17,
	},
	18 : {
		name : 'woensdag 18',
		sname: 'woe 18',
		number: 18,
	},
	19 : {
		name : 'donderdag 19',
		sname: 'do 19',
		number: 19,
	},
	20 : {
		name : 'vrijdag 20',
		sname: 'vr 20',
		number: 20
	},
	21 : {
		name : 'zaterdag 21',
		sname: 'za 21',
		number: 21
	},
	22 : {
		name : 'zondag 22',
		sname: 'zo 22',
		number: 22
	},
	23 : {
		name : 'maandag 23',
		sname: 'ma 23',
		number: 23
	}
};

/*
 * GET events for specific day
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
			url : 'http://data.appsforghent.be/gentsefeesten/201207' + day + '.json',
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
 * RETURNS events for specific day without callback
 */
function getEvents2(day) {
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
			url : 'http://data.appsforghent.be/gentsefeesten/201207' + day + '.json',
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
				return cachedData;
			}
		});
	} else {
		return cachedData;
	}
}

/*
 * Gets the Id of a given item
 */
function getIdOfItem(item){
    return item.id;
}


/*
 * Fix time digits, returns e.g. 11:00 instead of 11:0
 */
function setTimeDigits(timeString){
    var timeSplitted = timeString.split(':');
	if(timeSplitted[1].length == 1){
		return timeString + "0";
	}
	else{
		return timeString;
	}
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
function addFavourite(event, day, id, cbSucces, cbError) {
	if (!Modernizr.geolocation) {
		cbError("No HTML5 geolocation available")
		return

		

	}
	if (localStorage['day_' + day + 'favourites'] == undefined) {
		favouriteEvents = [];
		favouriteEvents.push(event);
		localStorage['day_' + day + 'favourites'] = JSON
				.stringify(favouriteEvents);
		cbSucces(id);
	} else {
		favouriteEvents = JSON.parse(localStorage['day_' + day + 'favourites']);
		favouriteEvents.push(event);
		localStorage['day_' + day + 'favourites'] = JSON
				.stringify(favouriteEvents);
		cbSucces(id);
	}
}



/*
* Function triggered when event is added to favourites. Function makes it visibile.
*/
function addedToFavourites(id){
	var classname = "founditem" + id;
	var onclick = $("." + classname + " .resultbutton a").attr("onclick");
	$("." + classname + " .resultbutton").addClass('added').html("toegevoegd");
	$("." + classname + " .resultbutton a").disabled = true;
}

/*
 * Return favourites for a specific day
 */
function getFavourites(day, cbSucces, cbError) {
	if(localStorage['day_' + day + 'favourites'] != undefined) {
		return JSON.parse(localStorage['day_' + day + 'favourites']);
	} else {
		return null;
	}
}

/*
 * Store a value in HTML5 Session Storage and escape it WARNING: Not escaped
 */
function setSessionValue(key, value) {
	sessionStorage[key] = value;
}

/*
 * Get a value from HTML5 Session Storage and escape it
 */
function getSessionValue(key) {
	return sessionStorage[key];
}

/*
 * Fetch geolocation
 */
function getLocation(data) {

		// Check if we have geolocation capabilities
	if (!Modernizr.geolocation) {
		cbError("No HTML5 geolocation available")
		return
	}

	// Fetch a position
	navigator.geolocation.watchPosition(function(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		setLiveMap(latitude, longitude, data);
		
	
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
		enableHighAccuracy:true, maximumAge:30000, timeout:27000
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
* SETS A PLACE ON A  MAP LIVE
*/
function setLiveMap(lati, long, data){
	var eventLat = lati; 
	var eventLong = long;
	var filtered_data = filter(data, long, lati);

	initialize();
		/* SET MARKER */
		
		function initialize() {
			var myLatlng = new google.maps.LatLng(eventLat,eventLong);
			var myOptions = {
				zoom: 17,
				center: myLatlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			
			titleMarker = "test";
			
			var map = new google.maps.Map(document.getElementById("livemap"), myOptions);
			
			
			
			var filtered_data = filter(data, long, lati);
			
			// Parse locations into markers
			$.each(filtered_data, function(index, value){
				var latAndLong = new google.maps.LatLng(value.latitude, value.longitude);
				var markerLocation = new google.maps.Marker({
					position: latAndLong,
					title:"test",
					map:map
				});
				
				// To add the marker to the map, call setMap();
				markerLocation.setMap(map);
			});
		
		}

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
 * Calculate distance
 */
	function distance(lat1, lat2, lon1, lon2) {
		var R = 6371; // KM
		var dLat = (lat2 - lat1) * Math.PI / 180; 
		var dLon = (lon2 - lon1) * Math.PI / 180;
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
				+ Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
				* Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}


/*
 * Submit function of filterform
 */

function filterResults(){
	// Set filters to localstorage
	var formName = $("#searchTitle").val();
	var beginHour = $("#beginHour").val();
	var beginMin = $("#beginMin").val();
	
	var endHour = $("#endHour").val();
	var endMin = $("#endMin").val();
	
	var beginTime = beginHour + beginMin;
	var endTime = endHour + endMin;
	//var beginTime = beginMin + "" + beginHour;

	searchResults(formName, beginTime, endTime);
};

/*
 *  Converts hourString into an unique id (int). (hhmm)
 */
function numberForHourString(hourString){
          var hourArray = hourString.split(':');
          var hourString = hourArray[0] + "" + hourArray[1];
		  while(hourString.charAt(0) == "0"){
		  	hourString = hourString.substring(1);
			
		  }
		  if(hourString == ""){
		  	return "0";
		  }
		  return hourString;
		  
      }

/*
 * Makes sure the end hour is later than the start hour
 */
function solveConflicts(time){
	
	// get data from ddl's
	var beginHour = $("#beginHour").val();
	var beginMin = $("#beginMin").val();
			
	var endHour = $("#endHour").val();
	var endMin = $("#endMin").val();
	
	switch(time){
		case 'begin':
			// set begin and end time in one var (eg 12:30 -> 1230)
			var beginTime = "" + beginHour + beginMin;
			var beginTime = parseInt(beginTime);
			var endTime = "" + endHour + endMin;
			var endTime = parseInt(endTime);
			
			// sets endhour always +15 minutes compared to beginhour-input by user
			if(beginTime >= endTime){
				beginMin = parseInt(beginMin);
				if(beginMin < 45){
					beginMin += 15;
					$("#endHour").val(beginHour);
					$("#endMin").val(""+beginMin);
				}
				else{
					beginHour = parseInt(beginHour) + 1;
					$("#endHour").val(beginHour);
					$("#endMin").val("00");
				}
			}
			break;
			
		case 'end':
			// set begin and end time in one var (eg 12:30 -> 1230)
			var beginTime = "" + beginHour + beginMin;
			var beginTime = parseInt(beginTime);
			var endTime = "" + endHour + endMin;
			var endTime = parseInt(endTime);
			// makes sure user doesnt select an endhour-value before the beginvalue
			if(beginTime > endTime){
				beginMin = parseInt(beginMin);
				if(beginMin < 45){
					beginMin += 15;
					$("#endHour").val(beginHour);
					$("#endMin").val(""+beginMin);
				}
				else{
					beginHour = parseInt(beginHour) + 1;
					$("#endHour").val(beginHour);
					$("#endMin").val("00");
				}
			}
			break;
	}
	
	filterResults();
}



/*
* Function called when you click on delete
*/
function deleteFavourite(id){
	var day = $.parseJSON(getSessionValue('date'));
	var favorites = getFavourites(day);
	findAndRemove(favorites, "id", id, day, afterTimelineDelete);
};


/*
* Function for getting more info on event
*/
function getInfo(day, property, value, callback) {
	var dataSet = getEvents2(day);
	$.each(dataSet, function(index, result) {
      if(result[property] == value) {
          //Remove from array
          callback(result);
		  //window.alert(string);
      }    
   });
}


/*
*
*/
function timelineInfo(item){
	//window.alert(item.Omschrijving);
	$("#moreInfo").show();
	$("#infocontainer h2").html(item.Titel);
	$("#infocontainer p").html(item.Omschrijving);
	setMap(item, 'extra_map');
}

/*
* SETS A PLACE ON A  MAP
*/
function setMap(data, div){
	var eventLat = data.latitude; 
	var eventLong = data.longitude;
	
	initialize();
	
	function initialize() {
		var myLatlng = new google.maps.LatLng(eventLat,eventLong);
		var myOptions = {
			zoom: 18,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		
		/* SET MARKER */
		titleMarker = data.Title;
		q
		var map = new google.maps.Map(document.getElementById(div), myOptions);
	
		var marker = new google.maps.Marker({
			position: myLatlng,
			title:titleMarker
			});
	
	// To add the marker to the map, call setMap();
		marker.setMap(map);
		  }

}


/*
* Switch between info and map
*/
function switchInfo(show){
	$("#extra_info").toggle();
	$("#extra_map").toggle();
}

/*
* Function for deleting favourites
*/
function findAndRemove(array, property, value, day, callback) {
	
	$.each(array, function(index, result) {
      if(result[property] == value) {
          //Remove from array
          array.splice(index, 1);
		  localStorage['day_' + day + 'favourites'] = JSON
				.stringify(array);
		  callback(array);
      }    
   });
}

function setDateOnMenu(shortday){
	$("#daychooser").html(shortday);
}

// FUNCTION GETS TRIGGERED AFTER DELETE ON TIMELINE
function afterTimelineDelete(favorites){
	//IF FAVORITES EXISTS, ADD THEM TO TIMELINE
		if(favorites != 0){
        	checkIfTimelineDataExists(favorites);
		}
		else{
			$("#timelinediv").empty();
		}
}

// LOAD EVENTS BY DAY FOR DAY-MENU IN TIMELINE
function getEventsByDay(_day, sday){
	setSessionValue("date",_day);
	day = _day;
	setDateOnMenu(sday);
	dayChooser();
	setTimeline(day);
}

// FUNCTION FOR THE DAY CHOOSER IN TIMELINE
function dayChooser(){
	if($("#mask").length){
		$("#daychooser").css("background-position","center 0");
		$("#mask").remove();
		$("#hiddenDates").hide();
		$("#footer").animate({"height":"53"},300);
	}
	else{
		$("#daychooser").css("background-position","center 53px");
		var height = $("#hiddenDates").height() + 90;
		$("#body").append("<div id='mask'></div>");
		$("#footer").animate({"height":height},300);
		$("#hiddenDates").show();
	}
}
