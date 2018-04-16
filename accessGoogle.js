/*jshint esversion: 6 */
/*jslint node: true */

'use strict';



var PublicGoogleCalendar = require('public-google-calendar');
var publicGoogleCalendar = new PublicGoogleCalendar({ calendarId: '9oounb9m5790te7qdeccr1acos@group.calendar.google.com' });

var goldDayCalendar = new PublicGoogleCalendar({ calendarId: 'ajfretm1425r1u05fgvem49t8c@group.calendar.google.com' });
var greenDayCalendar = new PublicGoogleCalendar({ calendarId: 'ajtvvqauv2vve92sso48bvr3bo@group.calendar.google.com' });
var unifiedDayCalendar = new PublicGoogleCalendar({ calendarId: 'bishopblanchet.org_4e772o7r2nma870gmbiqmpjqlk@group.calendar.google.com' });
var specialDayCalendar = new PublicGoogleCalendar({ calendarId: '50ul1lh5iev5tqfhl1cab6gke8@group.calendar.google.com' });

var moment = require('moment');



function awayOrHome(summaryString) {

  var lowerCaseSummaryString = summaryString.toLowerCase();

  if (lowerCaseSummaryString.indexOf("@") >= 0) {
    return "away";
  } else if (lowerCaseSummaryString.indexOf("vs") >= 0) {
    return "home";
  } else {
    return "unknown";
  }
}


function assignSquad(summaryString) {

  var lowerCaseSummaryString = summaryString.toLowerCase();

  // if ((lowerCaseSummaryString.indexOf("varsity")) ||
  //     (lowerCaseSummaryString.indexOf("/V")) >= 0) {
  if (lowerCaseSummaryString.indexOf("varsity") >= 0) {
    return "varsity";
  } else if (lowerCaseSummaryString.indexOf("jv") >= 0) {
    return "jv";
  } else if (lowerCaseSummaryString.indexOf("fresh") >= 0) {
    return "freshman";
  } else {
    return "undefined";
  }
}


function assignSport(summaryString) {

  var lowerCaseSummaryString = summaryString.toLowerCase();

  if (lowerCaseSummaryString.indexOf("baseball") >= 0) {
    return "baseball";
  } else if (lowerCaseSummaryString.indexOf("track") >= 0) {
    return "track";
  } else if (lowerCaseSummaryString.indexOf("softball") >= 0) {
    return "softball";
  } else if (lowerCaseSummaryString.indexOf("soccer") >= 0) {
    return "soccer";
  } else if (lowerCaseSummaryString.indexOf("tennis") >= 0) {
    return "tennis";
  } else if ((lowerCaseSummaryString.indexOf("lacrosse" >= 0)) ||
              (lowerCaseSummaryString.indexOf("lax") >= 0)) {
    return "lax";
  } else {
    return "undefined";
  }
}


function assignGender(summaryString) {

  var lowerCaseSummaryString = summaryString.toLowerCase();

  if (lowerCaseSummaryString.indexOf("girls") >= 0) {
    return "girls";
  } else if (lowerCaseSummaryString.indexOf("boys") >= 0) {
    return "boys";
  } else {
    return "undefined";
  }
}

// goldDayCalendar

//publicGoogleCalendar.getEvents(function(err, events) {
unifiedDayCalendar.getEvents(function(err, events) {
  if (err) { return console.log(err.message); }
  // events is now array of all calendar events
  //console.log(events);

/*
  console.log('size of array: ', events.length);
  console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  console.log('first item: ', events[0]);
  var dateOfEvent = moment(events[0].start);
  var year = dateOfEvent.format('Y');
  var month = dateOfEvent.format('M');
  var day = dateOfEvent.format('D');
  console.log('year: ', year);
  console.log('month: ', month);
  console.log('day: ', day);
  console.log('date from moment: ', dateOfEvent.format('M D'));
  console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  console.log('last item: ', events[events.length-1]);
  console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  console.log('index 1 item: ', events[1]);
  console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  console.log('index 2 item: ', events[2]);
  console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  console.log('index 3 item: ', events[3]);
  console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  console.log('index 4 item: ', events[4]);
  console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');

*/

var baseballSched = [];
var jvBaseballSched = [];
var sportsSchedule = [];

  events.forEach(function (event) {

    var dateOfEvent = moment(event.start);
    var year = dateOfEvent.format('Y');
    var month = dateOfEvent.format('M');
    var day = dateOfEvent.format('D');

    var currentEvent = {};

//    if (year == "2018") {
    if ((year == "2018") && ((month == "4") || (month == "5") || (month == "6"))) {
//    if ((year == "2018") && (month == "3") && (day == "10")) {
//      console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
//      console.log(event.summary);
//      console.log(event);
//      console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');

      currentEvent.sport = assignSport(event.summary);

      currentEvent.rawStartTime = event.start;

      var startTimeObject = moment(event.start);
      var startTime = startTimeObject.format("h a");
      var endTimeObject = moment(event.end);
      var endTime = endTimeObject.format("h a");

      currentEvent.squad = assignSquad(event.summary);
      currentEvent.gender = assignGender(event.summary);
      currentEvent.eventType = "game";
      currentEvent.startTime = startTime;
      currentEvent.endTime = endTime;
      currentEvent.awayOrHome = awayOrHome(event.summary);
      currentEvent.location = event.location;
      currentEvent.summary = event.summary;


      sportsSchedule.push(currentEvent);
/*
      if (event.summary.indexOf("Varsity Baseball") >= 0) {
        baseballSched.push(currentEvent);
      } else if (event.summary.indexOf("JV Baseball") >= 0) {
        jvBaseballSched.push(currentEvent);
      }
*/
    }

  });

  //console.log(baseballSched);
  //console.log(jvBaseballSched);




  console.log(sportsSchedule);

/*
  var marchEventFound = events.find(function (event) {

    return event.start === currentUrl;
  });
*/

});




unifiedDayCalendar.getEvents(function(err, events) {
  console.log('gold day');
  console.log(events);
});
