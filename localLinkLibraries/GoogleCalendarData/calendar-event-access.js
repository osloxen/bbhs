/*jshint esversion: 6 */
/*jslint node: true */

'use strict';


var async = require('async');
var PublicGoogleCalendar = require('public-google-calendar');
var athleticsAwayCalendar = new PublicGoogleCalendar({ calendarId: '9oounb9m5790te7qdeccr1acos@group.calendar.google.com' });
var athleticsHomeCalendar = new PublicGoogleCalendar({ calendarId: 'mp1du636dvotr2gf5honp0c1pk@group.calendar.google.com' });
var artsCalendar = new PublicGoogleCalendar({ calendarId: '43j670bpge31ga6sq6tvea58r4@group.calendar.google.com' });
var activitiesCalendar = new PublicGoogleCalendar({ calendarId: '6m67tvpmmadgsg0cgplgehqo3c@group.calendar.google.com' });

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




function GetGoogleCalendarData(sport,
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

    callback();
  };



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
      if ((year == "2018") && ((month == "4") || (month == "5") || (month == "6"))) {
  //    if ((year == "2018") && (month == "3") && (day == "10")) {

        currentEvent.sport = assignSport(event.summary);

        var startTimeObject = moment(event.start);
        var startTime = startTimeObject.format("h a");
        var eventDate = startTimeObject.format("MMMM DD");
        var endTimeObject = moment(event.end);
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

  }


  this.getSchoolActivitiesData = function(callback) {

    console.log('inside getCalendarData');

    activitiesCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      callback();
    });

  } // end of this.getSchoolActivitiesData




  this.getArtCalendarData = function(callback) {

    console.log('inside getCalendarData');

    artsCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      self.finalFilteredSchedule = self.schedule;  //TODO This is a shortcut!!!

      callback();
    });

  } // end of this.getArtCalendarData




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

    self.sportFilteredSchedule = self.schedule.filter((eventInstance) =>
                                  eventInstance.sport == sport);

    self.squadFilteredSchedule = self.sportFilteredSchedule.filter((eventInstance) =>
                                  eventInstance.squad == squad);

    //BUGBUG: TODO: Nasty decision here.  Is undefined always boys?  I don't think so.  Ugh.  So I try to pass through.
    if (gender == 'girls') {
      self.genderFilteredSchedule = self.squadFilteredSchedule.filter((eventInstance) =>
                                    eventInstance.gender == gender);
    } else {
      self.genderFilteredSchedule = self.squadFilteredSchedule;  // no gender filtering needed
    }

    self.finalFilteredSchedule = self.genderFilteredSchedule.filter((eventInstance) =>
                                  eventInstance.eventType == eventType);

    callback();
  }




  this.callTheCallback = function(callback) {

    console.log('inside returnData');

/*
    var fakeEvent = {};
    fakeEvent.startDate = "foobardate";
    var fakeSchedule = [];
    fakeSchedule.push(fakeEvent);
    self.schedule = fakeSchedule;
*/
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
    getGoogleCalendarData.callTheCallback
  ]
);

}; // end of getGoogleSportsCalendarData



exports.getGoogleActivitiesCalendarData = function(callerCallback) {

  console.log('*** inside getGoogleActivitiesCalendarData ***');


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
    //getGoogleCalendarData.filterTheSchedule,
    getGoogleCalendarData.callTheCallback
  ]
);

}; // end of getGoogleActivitiesCalendarData
