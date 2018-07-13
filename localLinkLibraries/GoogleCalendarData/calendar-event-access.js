/*jshint esversion: 6 */
/*jslint node: true */

'use strict';


var async = require('async');
var PublicGoogleCalendar = require('public-google-calendar');
var athleticsAwayCalendar = new PublicGoogleCalendar({ calendarId: '9oounb9m5790te7qdeccr1acos@group.calendar.google.com' });
var athleticsHomeCalendar = new PublicGoogleCalendar({ calendarId: 'mp1du636dvotr2gf5honp0c1pk@group.calendar.google.com' });
var artsCalendar = new PublicGoogleCalendar({ calendarId: '43j670bpge31ga6sq6tvea58r4@group.calendar.google.com' });
var activitiesCalendar = new PublicGoogleCalendar({ calendarId: '6m67tvpmmadgsg0cgplgehqo3c@group.calendar.google.com' });

var goldDayCalendar = new PublicGoogleCalendar({ calendarId: 'ajfretm1425r1u05fgvem49t8c@group.calendar.google.com' });
var greenDayCalendar = new PublicGoogleCalendar({ calendarId: 'ajtvvqauv2vve92sso48bvr3bo@group.calendar.google.com' });
var unifiedDayCalendar = new PublicGoogleCalendar({ calendarId: '4e772o7r2nma870gmbiqmpjqlk@group.calendar.google.com' });
var specialDayCalendar = new PublicGoogleCalendar({ calendarId: '50ul1lh5iev5tqfhl1cab6gke8@group.calendar.google.com' });

var moment = require('moment');
var momentTZ = require('moment-timezone');


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
    return "boys-soccer";
  } else if ((lowerCaseSummaryString.indexOf("soccer") >= 0) &&
              (lowerCaseSummaryString.indexOf("girls") >= 0)) {
    return "girls-soccer";
  } else if (lowerCaseSummaryString.indexOf("tennis") >= 0) {
    return "tennis";
  } else if (((lowerCaseSummaryString.indexOf("lacrosse") >= 0) ||
              (lowerCaseSummaryString.indexOf("lax") >= 0)) &&
              (lowerCaseSummaryString.indexOf("boys") >= 0)) {
    return "boys-lax";
  } else if (((lowerCaseSummaryString.indexOf("lacrosse") >= 0) ||
              (lowerCaseSummaryString.indexOf("lax") >= 0)) &&
              (lowerCaseSummaryString.indexOf("girls") >= 0)) {
    return "girls-lax";
  } else if (lowerCaseSummaryString.indexOf("cheer") >= 0) {
    return "cheer";
  } else {
    return "undefined";
  }
}


function assignClub(summaryString) {

  var lowerCaseSummaryString = summaryString.toLowerCase();

  if (lowerCaseSummaryString.indexOf("math") >= 0) {
    return "math";
  } else if (lowerCaseSummaryString.indexOf("cheer") >= 0) {
    return "cheer";
  } else if (lowerCaseSummaryString.indexOf("art") >= 0) {
    return "art-club";
  } else if (lowerCaseSummaryString.indexOf("drivers ed") >= 0) {
    return "drivers-ed";
  } else if (lowerCaseSummaryString.indexOf("dance team") >= 0) {
    return "dance-team";
  } else if (lowerCaseSummaryString.indexOf("fbla") >= 0) {
    return "fbla";
  } else if (lowerCaseSummaryString.indexOf("latin")  >= 0) {
    return "latin-club";
  } else if (lowerCaseSummaryString.indexOf("spanish")  >= 0) {
    return "spanish-club";
  } else if (lowerCaseSummaryString.indexOf("robot")  >= 0) {
    return "robotics";
  } else if (lowerCaseSummaryString.indexOf("ping pong")  >= 0) {
    return "ping-pong";
  } else if ((lowerCaseSummaryString.indexOf("seniors") >= 0) ||
              (lowerCaseSummaryString.indexOf("graduates") >= 0) ||
              (lowerCaseSummaryString.indexOf("last blast") >= 0) ||
              (lowerCaseSummaryString.indexOf("graduation") >= 0)) {
    return "graduates";
  } else if ((lowerCaseSummaryString.indexOf("improv") >= 0) ||
              (lowerCaseSummaryString.indexOf("costume") >= 0) ||
              (lowerCaseSummaryString.indexOf("drama") >= 0) ||
              (lowerCaseSummaryString.indexOf("musical") >= 0) ||
              (lowerCaseSummaryString.indexOf("make up")  >= 0)) {
    return "drama";
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
  } else if (lowerCaseSummaryString.indexOf("softball") >= 0) {
    return "girls";
  } else {
    return "undefined";
  }
}




function GetGoogleCalendarData( sport,
                                squad,
                                gender,
                                eventType,
                                callerCallback) {

  var self = this;

  self.callerCallback = callerCallback;

  this.initialize = function(callback) {

    console.log('inside initialize');
    console.log('Sport: ', sport);
    console.log('Squad: ', squad);
    console.log('Gender: ', gender);
    console.log('Event Type: ', eventType);

    self.schedule = [];
    self.goldDaysSchedule = [];
    self.greenDaysSchedule = [];
    self.alexaResponse = null;

    callback();
  };


  // Use this function to determine if it is a green or gold or unified day.
    function processTypeOfDay(arrayToPopulate, events) {

      console.log('inside processTypeOfDay');

      console.log('events --> ', events);
      console.log('length of array --> ', events.length);
      console.log('first event --> ', events[0]);

      events.forEach(function (event) {

        var dateOfEvent = null;

        if (event.rawStartTime != undefined) {
//          dateOfEvent = momentTZ(event.rawStartTime).tz("America/Los_Angeles").utcOffset(-12);
          dateOfEvent = moment(event.rawStartTime);
        } else {
//          dateOfEvent = momentTZ(event.start).tz("America/Los_Angeles").utcOffset(-12);
          dateOfEvent = moment(event.start);
        }

        var year = dateOfEvent.format('Y');
        var month = dateOfEvent.format('M');
        var day = dateOfEvent.format('D');

        var currentEvent = {};

    //    if (year == "2018") {
//        if ((year == "2018") && ((month == "4") || (month == "5") || (month == "6"))) {
        if ((year == "2018") &&  (month == "6")) {
  //        if ((year == "2018") && ((month == "4"))) {
    //    if ((year == "2018") && (month == "3") && (day == "10")) {

          var today = momentTZ().tz("America/Los_Angeles");

          if (event.rawStartTime != undefined) {
//            var startTimeObject = momentTZ(event.rawStartTime).tz("America/Los_Angeles");
            var startTimeObject = moment(event.rawStartTime);
          } else {
//            var startTimeObject = momentTZ(event.start).tz("America/Los_Angeles");
            var startTimeObject = moment(event.start);
          }

          var eventDate = startTimeObject.format("YYYY-MM-DD");

          currentEvent.eventDate = eventDate;
          currentEvent.summary = event.summary;

          arrayToPopulate.push(currentEvent);
        }

      });

    }  // end of processTypeOfDay





  function processCalenderData(arrayToPopulate, events) {

    console.log('inside processCalenderData');

    console.log(events[0]);

    events.forEach(function (event) {

      var dateOfEvent = moment(event.start);

      var year = dateOfEvent.format('Y');
      var month = dateOfEvent.format('M');
      var day = dateOfEvent.format('D');

      var currentEvent = {};

  //    if (year == "2018") {
  //      if ((year == "2018") && ((month == "4") || (month == "5") || (month == "6"))) {
        if ((year == "2018") &&  (month == "6")) {
  //    if ((year == "2018") && (month == "3") && (day == "10")) {

        currentEvent.sport = assignSport(event.summary);
        currentEvent.club = assignClub(event.summary);

        var today = momentTZ().tz("America/Los_Angeles");

        var startTimeObject = moment(event.start).utcOffset(-7);

        var startTime = startTimeObject.format("h a");
        var eventDate = startTimeObject.format("YYYY-MM-DD");
        var endTimeObject = momentTZ(event.end).tz("America/Los_Angeles");
        //var endTimeObject = moment(event.end).utcOffset(-7);
        var endTime = endTimeObject.format("h a");

        currentEvent.squad = assignSquad(event.summary);
        currentEvent.gender = assignGender(event.summary);
        currentEvent.eventType = "game";
        currentEvent.startTime = startTime;
        currentEvent.endTime = endTime;
        currentEvent.eventDate = eventDate;
        currentEvent.awayOrHome = awayOrHome(event.summary);
        currentEvent.location = event.location;
        currentEvent.summary = event.summary;
        currentEvent.description = event.description;

        arrayToPopulate.push(currentEvent);
      }

    });
  } // end of processCalenderData


  this.getSchoolActivitiesData = function(callback) {

    console.log('inside getSchoolActivitiesData');

    activitiesCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      callback();
    });

  } // end of this.getSchoolActivitiesData




  this.getArtCalendarData = function(callback) {

    console.log('inside getArtCalendarData');

    artsCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      self.finalFilteredSchedule = self.schedule;  //TODO This is a shortcut!!!

      callback();
    });

  } // end of this.getArtCalendarData



  this.getGreenDayCalendarData = function(callback) {

    console.log('inside getGreenDayCalendarData!!!');

    greenDayCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      console.log('All Green Days: ', events);

      processTypeOfDay(self.greenDaysSchedule, events);

      var deleteMeAddEvent = {};
      deleteMeAddEvent.eventDate = "2018-06-11";
      deleteMeAddEvent.summary = "Green Day";

      self.greenDaysSchedule.push(deleteMeAddEvent);

      callback();
    });

  } // end of this.getGreenDayCalendarData


  this.getGoldDayCalendarData = function(callback) {

    console.log('inside getGoldDayCalendarData');

    goldDayCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      console.log('All Gold Days!!!: ', events);

      processTypeOfDay(self.goldDaysSchedule, events);

      callback();
    });

  } // end of this.getGoldDayCalendarData


  this.debugPrintGreenAndGold = function(callback) {

    console.log('inside debugPrintGreenAndGold');
    console.log('GREEN: ', self.greenDaysSchedule);
    console.log('GOLD: ', self.goldDaysSchedule);

    callback();
  } // end of debugPrintGreenAndGold


  this.combineGoldandGreenDaySchedules = function(callback) {

    // TODO:  Take time to figure out what variables you want to use for final or in process.
    self.finalFilteredSchedule = self.goldDaysSchedule.concat(self.greenDaysSchedule);
    self.schedule = self.finalFilteredSchedule;

    callback();
  } // end of combineGoldandGreenDaySchedules



  this.getUnifiedDayCalendarData = function(callback) {

    console.log('inside getUnifiedDayCalendarData');

    unifiedDayCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      self.finalFilteredSchedule = self.schedule;  //TODO This is a shortcut!!!

      callback();
    });

  } // end of this.getUnifiedDayCalendarData


  this.getSpecialDayCalendarData = function(callback) {

    console.log('inside getSpecialDayCalendarData');

    specialDayCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      self.finalFilteredSchedule = self.schedule;  //TODO This is a shortcut!!!

      callback();
    });

  } // end of this.getSpecialDayCalendarData








  this.getSportsAwaySchedule = function(callback) {

    console.log('inside getCalendarData');

    athleticsAwayCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      callback();
    });

  } // end of this.getCalendarData




  this.getSportsHomeSchedule = function(callback) {

    console.log('inside getCalendarData');

    athleticsHomeCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      callback();
    });

  } // end of this.getSportsHomeSchedule



  this.filterTheSchedule = function(callback) {

    console.log('inside filterTheSchedule');

    console.log('sport: ', sport);
    console.log('squad: ', squad);

    console.log('before filter: ', self.schedule);

    self.sportFilteredSchedule = self.schedule.filter((eventInstance) =>
                                  eventInstance.sport == sport);

    console.log('sportFilteredSchedule: ', self.sportFilteredSchedule);

    self.squadFilteredSchedule = self.sportFilteredSchedule.filter((eventInstance) =>
                                  eventInstance.squad == squad);

    self.finalFilteredSchedule = self.squadFilteredSchedule.filter((eventInstance) =>
                                  eventInstance.eventType == eventType);

    callback();
  }



  this.filterTheScheduleForActivity = function(callback) {

    console.log('inside filterTheScheduleForActivity');

    console.log('Activity: ', sport);  // object calls first parameter "sport"

    console.log('before filter: ', self.schedule);

    self.activityFilteredSchedule = self.schedule.filter((eventInstance) =>
                                  eventInstance.club == sport);

    console.log('activityFilteredSchedule: ', self.activityFilteredSchedule);

    self.finalFilteredSchedule = self.activityFilteredSchedule;

    callback();
  }



  this.sortTheArray = function(callback) {

    //self.finalFilteredSchedule = self.finalFilteredSchedule.reverse();

    self.finalFilteredSchedule.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.eventDate) - new Date(b.eventDate);
    });

    callback();
  }


  this.getListOfAllActivities = function(callback) {

    self.listOfUndefinedActivities = [];

    console.log(self.finalFilteredSchedule);
    console.log(self.finalFilteredSchedule[0]);

    for (var i = 0;i<self.finalFilteredSchedule.length;i++) {

        if (self.finalFilteredSchedule[i].club == 'undefined') {

          console.log('summary: ', self.finalFilteredSchedule[i].summary);
          self.listOfUndefinedActivities.push(self.finalFilteredSchedule[i].summary);

        }
//        console.log('club: ', eventInstance.club);

    }

    callback();
  }


  this.sendBackUndefinedActivities = function(callback) {

    console.log('before assignment: ', self.finalFilteredSchedule);

    self.finalFilteredSchedule = self.listOfUndefinedActivities;

    console.log('after assignment: ', self.finalFilteredSchedule);

    callback();
  }





  this.filterForNumberOfDays = function(callback) {

    console.log('inside filterForNumberOfDays');

    self.schedLookAhead = [];

    //moment().tz("America/Los_Angeles").format();

    // var today = momentTZ().tz("America/Los_Angeles");
    // var tomorrow = momentTZ().tz("America/Los_Angeles").add(1, 'days');
    // var dayAfterTomorrow = momentTZ().tz("America/Los_Angeles").add(2, 'days');

    var today = moment();
    var tomorrow = moment().add(1, 'days');
    var dayAfterTomorrow = moment().add(2, 'days');


    console.log('Today: ', today.format('YYYY-MM-DD'));
    console.log('Tomorrow: ', tomorrow.format('YYYY-MM-DD'));

    console.log('Schedule: ', self.schedule);

    self.schedLookAhead = self.schedule.filter((event) =>
                            ((event.eventDate == today.format('YYYY-MM-DD')) ||
                            (event.eventDate == tomorrow.format('YYYY-MM-DD'))));

    console.log('schedLookAhead: ', self.schedLookAhead);

    callback();
  }



  this.updateFinalResultsAfterFilter = function(callback) {

    self.finalFilteredSchedule = self.schedLookAhead;

    callback();
  }



  this.callTheCallback = function(callback) {

    console.log('inside returnData');

    self.callerCallback(null, self.finalFilteredSchedule);
  }

} // end of GetGoogleCalendarData




exports.getGoogleSportsCalendarData = function(sport,
                                                squad,
                                                gender,
                                                eventType,
                                                callerCallback) {

  console.log('*** inside getGoogleSportsCalendarData ***');
  console.log('Using this Sport: ', sport);
  console.log('Using this Squad: ', squad);
  console.log('Using this gender: ', gender);
  console.log('Event Type: ', eventType);

  var getGoogleCalendarData = new GetGoogleCalendarData(sport,
                                                  squad,
                                                  gender,
                                                  eventType,
                                                  callerCallback);

  async.waterfall([

    // IT ALL BEGINS HERE
    getGoogleCalendarData.initialize,
    getGoogleCalendarData.getSportsAwaySchedule,
    getGoogleCalendarData.getSportsHomeSchedule,
    getGoogleCalendarData.filterTheSchedule,
    getGoogleCalendarData.sortTheArray,
    getGoogleCalendarData.callTheCallback
  ]
);

}; // end of getGoogleSportsCalendarData



exports.getGoogleActivitiesCalendarData = function(activity, callerCallback) {

  console.log('*** inside getGoogleActivitiesCalendarData ***');


  var getGoogleCalendarData = new GetGoogleCalendarData(activity,
                                                  null,
                                                  null,
                                                  null,
                                                  callerCallback);

  async.waterfall([

    // IT ALL BEGINS HERE
    getGoogleCalendarData.initialize,
    getGoogleCalendarData.getSchoolActivitiesData,
    getGoogleCalendarData.getArtCalendarData,
    getGoogleCalendarData.filterTheScheduleForActivity,
    getGoogleCalendarData.sortTheArray,
    getGoogleCalendarData.callTheCallback
  ]
);

}; // end of getGoogleActivitiesCalendarData



exports.getAllGoogleActivitiesCalendarData = function(callerCallback) {

  console.log('*** inside getAllGoogleActivitiesCalendarData ***');


  var getGoogleCalendarData = new GetGoogleCalendarData(null,
                                                  null,
                                                  null,
                                                  null,
                                                  callerCallback);

  async.waterfall([

    // IT ALL BEGINS HERE
    getGoogleCalendarData.initialize,
    getGoogleCalendarData.getSchoolActivitiesData,
    getGoogleCalendarData.getArtCalendarData,
    getGoogleCalendarData.sortTheArray,
    getGoogleCalendarData.getListOfAllActivities,
    getGoogleCalendarData.sendBackUndefinedActivities,
    getGoogleCalendarData.callTheCallback
  ]
);

}; // end of getAllGoogleActivitiesCalendarData



exports.getSchedSummaryLookAhead = function(numDays, callerCallback) {

  console.log('*** inside getSchedSummaryLookAhead ***');
  console.log('Look ahead this many days: ', numDays);  // <-- not hooked up currently


  var getGoogleCalendarData = new GetGoogleCalendarData(null,
                                                  null,
                                                  null,
                                                  null,
                                                  callerCallback);

  async.waterfall([

    // IT ALL BEGINS HERE
    getGoogleCalendarData.initialize,
    getGoogleCalendarData.getSportsAwaySchedule,
    getGoogleCalendarData.getSportsHomeSchedule,
    getGoogleCalendarData.getSchoolActivitiesData,
    getGoogleCalendarData.getArtCalendarData,
    //getGoogleCalendarData.getGreenDayCalendarData,
    //getGoogleCalendarData.getGoldDayCalendarData,
    //getGoogleCalendarData.getUnifiedDayCalendarData,
    getGoogleCalendarData.getSpecialDayCalendarData,
    getGoogleCalendarData.filterForNumberOfDays,
    getGoogleCalendarData.updateFinalResultsAfterFilter,
    getGoogleCalendarData.sortTheArray,
    getGoogleCalendarData.callTheCallback
  ]
);

}; // end of getSchedSummaryLookAhead


exports.getDayDetails = function(date, callerCallback) {

  console.log('*** inside getDayDetails ***');
  console.log('Get date details for: ', date);

  var getGoogleCalendarData = new GetGoogleCalendarData(null,
                                                  null,
                                                  null,
                                                  null,
                                                  callerCallback);

  async.waterfall([

    // IT ALL BEGINS HERE
    getGoogleCalendarData.initialize,
    getGoogleCalendarData.getGreenDayCalendarData,
    getGoogleCalendarData.getGoldDayCalendarData,
    getGoogleCalendarData.debugPrintGreenAndGold,
    //getGoogleCalendarData.getUnifiedDayCalendarData,   // not working
    //getGoogleCalendarData.getSpecialDayCalendarData,   // not working
    getGoogleCalendarData.combineGoldandGreenDaySchedules,
    getGoogleCalendarData.filterForNumberOfDays,
    getGoogleCalendarData.updateFinalResultsAfterFilter,
    getGoogleCalendarData.sortTheArray,
    getGoogleCalendarData.callTheCallback
  ]
);

}; // end of getDayDetails
