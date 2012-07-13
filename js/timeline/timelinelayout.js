
      var VERTICALSPACE_HOUR=100;//in px;
      //var WIDHT_OF_ELEMENT=100;
      var MIN_SIZE_OF_ELEMENT=200;
	  var MAX_SIZE_OF_ELEMENT=300;
      
      var PLACE_FOR_HOURS=55;
	  
	  var H_MARGIN=15;
    
      /**
      * favorites = array of objects
      * those objects have some fields, e.g.:
      *  - Begin:14:30
      *  - Einde:01:00
      */
      function updateTimeline(favorites){
          // calculate the bounds of the timeline
          var bounds=calculateTimelineBounds(favorites);
          //alert(bounds);
          
          var lowerInt=numberForDayHour(bounds[0], bounds[1]);
          var higherInt=numberForDayHour(bounds[2], bounds[3]);
          
          var multipleSameTimeArray=new Array();
      
          // order them in columns...
          $.each(favorites, function(favIndex, favorite){
              var startInt=numberForDayHour(favorite.Datum, favorite.Begin)-lowerInt;
              var endInt=numberForDayHour(favorite.Datum, favorite.Einde)-lowerInt;
             
			  
              if(endInt<startInt){endInt=endInt+24*60;/* eindigt na middernacht...*/}
              
              //save to favorite
              favorite.numberStartInt=startInt;
              favorite.numberEndInt=endInt;
              
              // try to place it (search the column)
              var placeFound=false;
              for(var i=0;i<multipleSameTimeArray.length && !placeFound;i++){
                  var column = multipleSameTimeArray[i];
                  var canPlaceInThisColumn=true;
                  for(var r=startInt;r<endInt;r++){
                      if(column[r]==true){
                          canPlaceInThisColumn=false;
                      }
                  }
                  if(canPlaceInThisColumn){
                      placeFound=true;
                      //save to favorite
                      favorite.placedInColumn=i;
                      //mark the place used
                      for(var r=startInt;r<endInt;r++){
                          column[r]=true;
                      }
                  }
              }
              
              if(!placeFound){
                  //no place found, add new column and mark the place used in new column
                  var column=new Array();
                  for(var r=startInt;r<higherInt;r++){
                      column[r]=(r>=startInt && r<endInt);
                  }
                  
                  favorite.placedInColumn=multipleSameTimeArray.length;
                  multipleSameTimeArray[multipleSameTimeArray.length]=column;
              }
          });
          
          //now clear the component
          $('#timelinediv').empty();
          
          //there are x columns and we have y space... -> ...
          var columnCount = multipleSameTimeArray.length;
          var spaceInComponent = $('#timelinediv').innerWidth()-PLACE_FOR_HOURS-H_MARGIN;
          var spacePerColumn=spaceInComponent/columnCount;
          if(spacePerColumn<MIN_SIZE_OF_ELEMENT){
              spacePerColumn=MIN_SIZE_OF_ELEMENT;
          }
		  else if(spacePerColumn>MAX_SIZE_OF_ELEMENT){
		  	spacePerColumn=MAX_SIZE_OF_ELEMENT;
		  }
          
          //now place them in the webpage
          $.each(favorites, function(favIndex, favorite){
              var startInt=favorite.numberStartInt;
              var endInt=favorite.numberEndInt;
              var placedColumn=favorite.placedInColumn;
			  var id = favorite.id;
          
              //alert("size in hours:"+((endInt-startInt)/60));
              
              var objectHtmlString=timelineDisplayForObject(
                  favorite, 
                  startInt*VERTICALSPACE_HOUR/60, 
                  PLACE_FOR_HOURS+spacePerColumn*placedColumn, 
                  (endInt-startInt)*VERTICALSPACE_HOUR/60, 
                  spacePerColumn, id);
              
              var htmlObject=$(objectHtmlString);
              
              $('#timelinediv').append(htmlObject);
           });
           
           //add hours to the schema
           var EVERY=30;
           var lastDone=undefined;
           var startHourDisplay=Math.floor(lowerInt/EVERY)*EVERY;
		   if(higherInt<26500){
		   	higherInt += 400;
		   }
           for(var r=startHourDisplay;r<higherInt;r+=EVERY){
               var hourmin=r%(24*60);
               var min=r%60;
               var hour=(hourmin-min)/60;
			   
               var objectHtmlString=timelineDisplayForTime(""+hour+":"+min, hour, min, (r-lowerInt)*VERTICALSPACE_HOUR/60);	
			   var htmlObject=$(objectHtmlString);
               
               $('#timelinediv').append(htmlObject);
			   
           }
		   setChar();
      }
      
      /**
      * 
      */
      function calculateTimelineBounds(favorites){
          var lowerBoundDay=undefined;//type: int
          var lowerBoundDayString=undefined;//type: string
          var lowerBoundHour=undefined;//type: int
          var lowerBoundHourString=undefined;//type: string
          
          var upperBoundDay=undefined;//type: int
          var upperBoundDayString=undefined;//type: string
          var upperBoundHour=undefined;//type: int
          var upperBoundHourString=undefined;//type: string
          
          var lowerBoundMinutes=undefined;
          $.each(favorites, function(favIndex, favorite){
              /* parse favorite */
              var DateStart=favorite.Datum;
              var DateEnd=favorite.Datum;
              var favoDayNumberBegin=numberForDay(favorite.Datum);
              var favoDayNumberEnd=favoDayNumberBegin;
              var favoHourNumberBegin=numberForHour(favorite.Begin);
              var favoHourNumberEnd=numberForHour(favorite.Einde);
              
              if(favoHourNumberEnd<favoHourNumberBegin){
                //new day...
                favoDayNumberEnd=favoDayNumberEnd+1;
                DateEnd=nextDay(DateEnd);
              }

              /* lower bound - day and hour */
              if(lowerBoundDay==undefined || lowerBoundDay>favoDayNumberBegin){
                  lowerBoundDay=favoDayNumberBegin;
                  lowerBoundDayString=DateStart;
                  
                  lowerBoundHour=favoHourNumberBegin;
                  lowerBoundHourString=favorite.Begin;
              }else if(lowerBoundDay==favoDayNumberBegin && favoHourNumberBegin<lowerBoundHour){
                  lowerBoundHour=favoHourNumberBegin;
                  lowerBoundHourString=favorite.Begin;
              }
              
              /* upper bound - day and hour */
              if(upperBoundDay==undefined || upperBoundDay<favoDayNumberEnd){
                  upperBoundDay=favoDayNumberEnd;
                  upperBoundDayString=DateEnd;
                  
                  upperBoundHour=favoHourNumberEnd;
                  upperBoundHourString=favorite.Einde;
              }else if(upperBoundDay==favoDayNumberEnd && favoHourNumberEnd>upperBoundHour){
                  upperBoundHour=favoHourNumberEnd;
                  upperBoundHourString=favorite.Einde;
              }
          });
          
          return [lowerBoundDayString, lowerBoundHourString, upperBoundDayString, upperBoundHourString];
      }
      
      /* Converts dayStrings to an unique id (int). (which can be sorted)
       * The int of a day after another day should be exactly one higher.
       * This implementation supposes that the events are in the same month.
       */
      function numberForDay(dayString){
          var dayArray = dayString.split('/');
          return Number(dayArray[0]);
      }
      
      /* Converts hourString into an unique id (int). (minutes)*/
      function numberForHour(hourString){
          var hourArray = hourString.split(':');
          return Number(hourArray[1])+Number(hourArray[0])*60;
      }
      
	  function fillTimelineWithDates(){
	  	 for(var r=(8*60);r<(14*60);r+=30){
               var hourmin=r%(24*60);
               var min=r%60;
               var hour=(hourmin-min)/60;
			   
               var objectHtmlString=timelineDisplayForTime(""+hour+":"+min, hour, min, (r-(8*60))*VERTICALSPACE_HOUR/60);	
			   var htmlObject=$(objectHtmlString);
               
               $('#timelinediv').append(htmlObject);
           }
		   
	  }
      
		
	 function checkIfTimelineDataExists(favorites){
	 	if(favorites.length != 0 ){
        	updateTimeline(favorites);
		}
		else{
			htmlString = '<div class="error"><a href="searchresults.html"><img src="images/add.svg" alt="error" id="errorImg" /><p>Events toevoegen.</a><p></div>';
			$("#timelinediv").html(htmlString);
			fillTimelineWithDates();
		}
	 }
	  
      /* Converts dayString and hourString into an unique id */
      function numberForDayHour(dayString, hourString){
          return numberForDay(dayString)*24*60+numberForHour(hourString);
      }
      
      /* Returns the string representation of the next day...
       * This implementation supposes that the events are in the same month.
       */
      function nextDay(dayString){
          var dayArray = dayString.split('/');
          return (Number(dayArray[0])+1)+"/"+dayArray[1]+"/"+dayArray[2];
      }