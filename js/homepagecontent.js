/*
 homepagecontent.js

 Created by Jeppe on 2012-07-03.
 Copyright 2012 by iRail vzw/asbl. All rights reserved.
 */

/**
 * Used dates
 */
var dates = {
	1 : {
		name : '14 juli',
		page : 'index',
		id : 14
	},
	2 : {
		name : '15 juli',
		page : 'index',
		id : 15
	},
	3 : {
		name : '16 juli',
		page : 'index',
		id : 16
	},
	4 : {
		name : '17 juli',
		page : 'index',
		id : 17
	},
        5 : {
		name : '18 juli',
		page : 'index',
		id : 1
	},
	6 : {
		name : '19 juli',
		page : 'index',
		id : 2
	},
	7 : {
		name : '20 juli',
		page : 'index',
		id : 3
	},
	8 : {
		name : '21 juli',
		page : 'index',
		id : 4
	},
        9 : {
		name : '22 juli',
		page : 'index',
		id : 4
	},
        10 : {
		name : '23 juli',
		page : 'index',
		id : 4
	}
};

$(document).ready(function(){
    fillWithDates();
})

function fillWithDates(){
    var htmlString = "";
    
    $.each(dates, function(key, value){
        htmlString += "<li>" + value.name + "</li>";
    });
    
    $("#dates").html(htmlString);
}


