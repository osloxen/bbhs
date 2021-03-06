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
var unifiedDayCalendar = new PublicGoogleCalendar({ calendarId: 'bishopblanchet.org_4e772o7r2nma870gmbiqmpjqlk@group.calendar.google.com' });
var specialDayCalendar = new PublicGoogleCalendar({ calendarId: '50ul1lh5iev5tqfhl1cab6gke8@group.calendar.google.com' });

var moment = require('moment');
var momentTZ = require('moment-timezone');
var _ = require('lodash');
var request = require('request');

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
  if (lowerCaseSummaryString.indexOf("jv") >= 0) {
    return "jv";
  } else if ((lowerCaseSummaryString.indexOf("fresh") >= 0) ||
             (lowerCaseSummaryString.indexOf("jvc") >= 0) ||
             (lowerCaseSummaryString.indexOf("frosh") >= 0)) {
    return "jvc";
  } else {
    return "varsity";
  }
}


function assignSport(summaryString) {

  // Soccer is sometimes written without gender so adding months to pick the right one
  var today = moment();
  var month = today.format('M');

  var lowerCaseSummaryString = summaryString.toLowerCase();

  if (lowerCaseSummaryString.indexOf("baseball") >= 0) {
    return "baseball";
  } else if (lowerCaseSummaryString.indexOf("track") >= 0) {
    return "track";
  } else if (lowerCaseSummaryString.indexOf("softball") >= 0) {
    return "softball";
  } else if ((lowerCaseSummaryString.indexOf("soccer") >= 0) &&
             (month <= 6)){
    return "boys-soccer";
  } else if ((lowerCaseSummaryString.indexOf("soccer") >= 0) &&
              (month >= 6)) {
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
  } else if (lowerCaseSummaryString.indexOf("volleyball") >= 0) {
    return "volleyball";
  } else if (lowerCaseSummaryString.indexOf("football") >= 0) {
    return "football";
  } else if (lowerCaseSummaryString.indexOf("swimming") >= 0) {
    return "swimming";
  } else if (lowerCaseSummaryString.indexOf("golf") >= 0) {
    return "golf";
  } else if (lowerCaseSummaryString.indexOf("cross country") >= 0) {
    return "cross-country";
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

  // var lowerCaseSummaryString = summaryString.toLowerCase();
  //
  // if (lowerCaseSummaryString.indexOf("girls") >= 0) {
  //   return "girls";
  // } else if (lowerCaseSummaryString.indexOf("boys") >= 0) {
  //   return "boys";
  // } else if (lowerCaseSummaryString.indexOf("softball") >= 0) {
  //   return "girls";
  // } else {
  //   return "undefined";
  // }

  return null;
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
    self.unifiedDaysSchedule = [];
    self.specialDaysSchedule = [];
    self.typeOfDaySchedule = [];
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
        if ((year == "2018") && ((month == "8") ||
                                 (month == "9") ||
                                 (month == "10") ||
                                 (month == "11") ||
                                 (month == "12"))) {
//        if ((year == "2018") &&  (month == "6")) {
  //        if ((year == "2018") && ((month == "4"))) {
    //    if ((year == "2018") && (month == "3") && (day == "10")) {

          var today = momentTZ().tz("America/Los_Angeles");

          if (event.rawStartTime != undefined) {
//            var startTimeObject = momentTZ(event.rawStartTime).tz("America/Los_Angeles");
            console.log('rawStartTime =-> ', event.rawStartTime);
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

    console.log('The first event =-> ', events[0]);
    console.log('Number of events =-> ', events.length);

    events.forEach(function (event) {

      var dateOfEvent = moment(event.start);

      var year = dateOfEvent.format('Y');
      var month = dateOfEvent.format('M');
      var day = dateOfEvent.format('D');

      var currentEvent = {};

      if ((year == "2018") || (year == "2019")) {
        // if ((year == "2018") && ((month == "8") ||
        //                         (month == "9") ||
        //                         (month == "10") ||
        //                         (month == "11") ||
        //                         (month == "12"))) {
  //      if ((year == "2018") &&  (month == "6")) {
  //    if ((year == "2018") && (month == "3") && (day == "10")) {

        //console.log('Found event within date range =-> ', event.summary);

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
        //currentEvent.gender = assignGender(event.summary);
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


  this.addAllTypeOfDayToCalendarList = function(callback) {

    console.log('inside addAllTypeOfDayToCalendarList');

    self.typeOfDaySchedule = [];

    self.typeOfDaySchedule = self.typeOfDaySchedule.concat(self.greenDaysSchedule);
    self.typeOfDaySchedule = self.typeOfDaySchedule.concat(self.goldDaysSchedule);
    self.typeOfDaySchedule = self.typeOfDaySchedule.concat(self.unifiedDaysSchedule);
    self.typeOfDaySchedule = self.typeOfDaySchedule.concat(self.specialDaysSchedule);

    console.log('typeOfDaySchedule after combining =-> ', self.typeOfDaySchedule);

    callback();
  }  // end of addAllTypeOfDayToCalendarList




  this.getAllSpecialDaysCalendarData = function(callback) {

    console.log('inside getAllSpecialDaysCalendarData!!!');

    var specialCalendarOptions = {
      url: 'https://www.googleapis.com/calendar/v3/calendars/50ul1lh5iev5tqfhl1cab6gke8@group.calendar.google.com/events?key=AIzaSyCMWI8Yaxv1m3aiT9oLbQBXi9xIdTm_D2E&maxResults=2500',
      headers: {
        'User-Agend': 'request'
      }
    };


    function requestCallback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.summary);
        console.log('number of events =-> ', info.items.length);

        info.items.forEach( (event) => {
          var dateOfEvent = undefined;

          if ((event.start != undefined) &&
              (event.start.date != undefined)) {

            dateOfEvent = moment(event.start.date);

            var year = dateOfEvent.format('Y');

            if (year >= 2018) {
              var addThisDay = {};
              addThisDay.summary = event.summary;
              addThisDay.eventDate = dateOfEvent.format('YYYY-MM-DD');
              self.specialDaysSchedule.push(addThisDay);
            }
          }


        });

        // following should be called after above forEach is done.
        callback();

      } else {
        console.log('ERROR WITH REST CALL TO GET TYPE OF DAY.  Google API call.');
        console.log('This should page me 24 7');
      }
    }


    request(specialCalendarOptions,requestCallback);

  } // end of this.getAllSpecialDaysCalendarData




  this.getGreenDayCalendarData = function(callback) {

    console.log('inside getGreenDayCalendarData!!!');

    var greenCalendarOptions = {
      url: 'https://www.googleapis.com/calendar/v3/calendars/ajtvvqauv2vve92sso48bvr3bo@group.calendar.google.com/events?key=AIzaSyCMWI8Yaxv1m3aiT9oLbQBXi9xIdTm_D2E&maxResults=2500',
      headers: {
        'User-Agend': 'request'
      }
    };


    function requestCallback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.summary);
        console.log('number of events =-> ', info.items.length);

        info.items.forEach( (event) => {
          var dateOfEvent = undefined;

          if ((event.start != undefined) &&
              (event.start.date != undefined)) {

            dateOfEvent = moment(event.start.date);

            var year = dateOfEvent.format('Y');

            if (year >= 2018) {
              var addThisDay = {};
              addThisDay.summary = event.summary;
              addThisDay.eventDate = dateOfEvent.format('YYYY-MM-DD');
              self.greenDaysSchedule.push(addThisDay);
            }
          }


        });

        // following should be called after above forEach is done.
        callback();

      } else {
        console.log('ERROR WITH REST CALL TO GET TYPE OF DAY.  Google API call.');
        console.log('This should page me 24 7');
      }
    }


    request(greenCalendarOptions,requestCallback);

  } // end of this.getGreenDayCalendarData


  this.getGoldDayCalendarData = function(callback) {

    console.log('inside getGoldDayCalendarData');

    var goldCalendarOptions = {
      url: 'https://www.googleapis.com/calendar/v3/calendars/ajfretm1425r1u05fgvem49t8c@group.calendar.google.com/events?key=AIzaSyCMWI8Yaxv1m3aiT9oLbQBXi9xIdTm_D2E&maxResults=2500',
      headers: {
        'User-Agend': 'request'
      }
    };


    function requestCallback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.summary);
        console.log('number of events =-> ', info.items.length);

        info.items.forEach( (event) => {
          var dateOfEvent = undefined;

          if ((event.start != undefined) &&
              (event.start.date != undefined)) {

            dateOfEvent = moment(event.start.date);

            var year = dateOfEvent.format('Y');

            if (year >= 2018) {
              var addThisDay = {};
              addThisDay.summary = event.summary;
              addThisDay.eventDate = dateOfEvent.format('YYYY-MM-DD');
              self.goldDaysSchedule.push(addThisDay);
            }
          }


        });

        // following should be called after above forEach is done.
        callback();

      } else {
        console.log('ERROR WITH REST CALL TO GET TYPE OF DAY.  Google API call.');
        console.log('This should page me 24 7');
      }
    }


    request(goldCalendarOptions,requestCallback);


  } // end of this.getGoldDayCalendarData




  this.getUnifiedDayCalendarData = function(callback) {

    console.log('inside getUnifiedDayCalendarData');


    var unifiedCalendarOptions = {
      url: 'https://www.googleapis.com/calendar/v3/calendars/bishopblanchet.org_4e772o7r2nma870gmbiqmpjqlk@group.calendar.google.com/events?key=AIzaSyCMWI8Yaxv1m3aiT9oLbQBXi9xIdTm_D2E&maxResults=2500',
      headers: {
        'User-Agend': 'request'
      }
    };


    function requestCallback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.summary);
        console.log('number of events =-> ', info.items.length);

        info.items.forEach( (event) => {
          var dateOfEvent = undefined;

          if ((event.start != undefined) &&
              (event.start.date != undefined)) {

            dateOfEvent = moment(event.start.date);

            var year = dateOfEvent.format('Y');

            if (year >= 2018) {
              var addThisDay = {};
              addThisDay.summary = event.summary;
              addThisDay.eventDate = dateOfEvent.format('YYYY-MM-DD');
              self.unifiedDaysSchedule.push(addThisDay);
            }
          }


        });

        // following should be called after above forEach is done.
        callback();

      } else {
        console.log('ERROR WITH REST CALL TO GET TYPE OF DAY.  Google API call.');
        console.log('This should page me 24 7');
      }
    }


    request(unifiedCalendarOptions,requestCallback);



  } // end of this.getUnifiedDayCalendarData



  this.debugPrintGreenAndGold = function(callback) {

    console.log('inside debugPrintGreenAndGold');
    console.log('GREEN: ', self.greenDaysSchedule);
    console.log('GOLD: ', self.goldDaysSchedule);
    console.log('UNIFIED: ', self.unifiedDaysSchedule);
    console.log('SPECIAL: ', self.specialDaysSchedule);

    callback();
  } // end of debugPrintGreenAndGold


  this.combineGoldandGreenDaySchedules = function(callback) {

    // TODO:  Take time to figure out what variables you want to use for final or in process.
    self.finalFilteredSchedule = self.goldDaysSchedule.concat(self.greenDaysSchedule);
    self.schedule = self.finalFilteredSchedule;

    console.log('Combined GREEN and GOLD day calendars =-> ', self.schedule);

    callback();
  } // end of combineGoldandGreenDaySchedules






  this.getSpecialDayCalendarData = function(callback) {

    console.log('inside getSpecialDayCalendarData');

    specialDayCalendar.getEvents(function(err, events) {
      if (err) { return console.log(err.message); }

      processCalenderData(self.schedule, events);

      callback();
    });

  } // end of this.getSpecialDayCalendarData



  this.combineGoldGreenAndUnifiedDaySchedules = function(callback) {

    // TODO:  Take time to figure out what variables you want to use for final or in process.
    self.schedule = self.unifiedDaysSchedule.concat(self.schedule);

    console.log('Combined GREEN, GOLD and UNIFIED calendars =-> ', self.schedule);

    callback();
  } // end of combineGoldandGreenDaySchedules




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

    console.log('number of items before filter: ', self.schedule.length);
    console.log('before filter: ', self.schedule);

    self.sportFilteredSchedule = self.schedule.filter((eventInstance) =>
                                  eventInstance.sport == sport);

    console.log('number of items in sport filtered schedule: ', self.sportFilteredSchedule.length);
    console.log('sportFilteredSchedule: ', self.sportFilteredSchedule);

    self.dateAndSportFilteredSchedule = self.sportFilteredSchedule.filter((eventInstance) => {

      var dateInQuestion = moment(eventInstance.eventDate);
      var today = moment();
      var yesterday = moment().subtract(2, 'days');
      // moment("12-25-1995", "MM-DD-YYYY");

      if (dateInQuestion.isSameOrAfter(yesterday)) {
        return true;
      }
    });

    // TODO previous 2 filters could become 1 filter for date and sport

    console.log('sport AND today after filter length: ', self.dateAndSportFilteredSchedule.length);
    console.log('sport AND today or after filter =-> ', self.dateAndSportFilteredSchedule);

    self.squadDateAndSportFilteredSchedule = self.dateAndSportFilteredSchedule.filter((eventInstance) =>
                                  eventInstance.squad == squad);

    // self.finalFilteredSchedule = self.squadDateAndSportFilteredSchedule.filter((eventInstance) =>
    //                               eventInstance.eventType == eventType);


    //self.finalFilteredSchedule = self.sportFilteredSchedule;

    //self.finalFilteredSchedule = self.dateAndSportFilteredSchedule;

    self.finalFilteredSchedule = self.squadDateAndSportFilteredSchedule;

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

    function assignTypeOfDay(day) {

      console.log('called function assignTypeOfDay');
      console.log('day = ', day.format('YYYY-MM-DD'));

      if ((day.format('dddd') == 'Saturday') ||
          (day.format('dddd') == 'Sunday')) {

            var returnThisObject = {
                eventDate : day.format('YYYY-MM-DD'),
                summary: 'Weekend'
              };
            return returnThisObject;
        } else {

          var returnThisObject = {
              eventDate : day.format('YYYY-MM-DD'),
              summary: 'Unified Day'
            };
          return returnThisObject;
        }
    }

    self.schedLookAhead = [];

    var today = moment();
    var tomorrow = moment().add(1, 'days');
    var dayAfterTomorrow = moment().add(2, 'days');


    console.log('Today: ', today.format('YYYY-MM-DD'));
    console.log('Tomorrow: ', tomorrow.format('YYYY-MM-DD'));

    console.log('Schedule: ', self.schedule);

    self.schedLookAhead = self.schedule.filter((event) =>
                            ((event.eventDate == today.format('YYYY-MM-DD')) ||
                            (event.eventDate == tomorrow.format('YYYY-MM-DD')) ||
                            (event.eventDate == dayAfterTomorrow.format('YYYY-MM-DD'))));

    // Notice the NOT or (!)
    if (!_.find(self.schedLookAhead, function(o) { return o.eventDate == today.format('YYYY-MM-DD'); })) {
      console.log('Did NOT find today =-> ', today.format('YYYY-MM-DD'));
      self.schedLookAhead.push(assignTypeOfDay(today));
    }

    if (!_.find(self.schedLookAhead, function(o) { return o.eventDate == tomorrow.format('YYYY-MM-DD'); })) {
      console.log('Did NOT find tomorrow =-> ', tomorrow.format('YYYY-MM-DD'));
      self.schedLookAhead.push(assignTypeOfDay(tomorrow));
    }

    if (!_.find(self.schedLookAhead, function(o) { return o.eventDate == dayAfterTomorrow.format('YYYY-MM-DD'); })) {
      console.log('Did NOT find day after tomorrow =-> ', dayAfterTomorrow.format('YYYY-MM-DD'));
      self.schedLookAhead.push(assignTypeOfDay(dayAfterTomorrow));
    }

    console.log('schedLookAhead: ', self.schedLookAhead);

    callback();
  }



  this.updateFinalResultsAfterFilter = function(callback) {

    console.log('Inside updateFinalResultsAfterFilter');

    var listWithoutUndefinedKeys = _.filter(self.schedLookAhead, function(o) {
                                                  if (o.location != undefined) {
                                                    return o;
                                                  }
                                                });

    self.finalFilteredSchedule = listWithoutUndefinedKeys;

    //self.finalFilteredSchedule = self.schedLookAhead;
    console.log('self.finalFilteredSchedule =-> ', self.finalFilteredSchedule);

    callback();
  }


  this.returnTodayTomorrowAndDayAfter = function(callback) {

    console.log('inside returnTodayTomorrowAndDayAfter');

    let today     = moment(new Date());
    let tomorrow  = moment(new Date()).add(1,'days');
    let dayAfterTomorrow = moment(new Date()).add(2, 'days');

    console.log('typeOfDaySchedule =-> ', self.typeOfDaySchedule);
    console.log('dayAfterTomorrow =-> ', dayAfterTomorrow.format('YYYY-MM-DD'));

    var typeOfDayToday = _.find(self.typeOfDaySchedule, { 'eventDate': today.format('YYYY-MM-DD') });
    var typeOfDayTomorrow = _.find(self.typeOfDaySchedule, { 'eventDate': tomorrow.format('YYYY-MM-DD') });
    var typeOfDayDayAfterTomorrow = _.find(self.typeOfDaySchedule, { 'eventDate': dayAfterTomorrow.format('YYYY-MM-DD') });
    // var typeOfDayDayAfterTomorrow = _.find(self.typeOfDaySchedule,
    //                                         function(o) { return o.start == dayAfterTomorrow.format('YYYY-MM-DD'); });



    if ((today.weekday() == 6) ||
        (today.weekday() == 0)) {
          var dayObject = {};
          dayObject.summary = "weekend";
          dayObject.eventDate = today.format('YYYY-MM-DD');
          typeOfDayToday = dayObject;
    }

    if ((tomorrow.weekday() == 6) ||
        (tomorrow.weekday() == 0)) {
          var dayObject = {};
          dayObject.summary = "weekend";
          dayObject.eventDate = tomorrow.format('YYYY-MM-DD');
          typeOfDayTomorrow = dayObject;
    }

    if ((dayAfterTomorrow.weekday() == 6) ||
        (dayAfterTomorrow.weekday() == 0)) {
          var dayObject = {};
          dayObject.summary = "weekend";
          dayObject.eventDate = dayAfterTomorrow.format('YYYY-MM-DD');
          typeOfDayDayAfterTomorrow = dayObject;
    }

    self.finalFilteredSchedule = [];
    self.finalFilteredSchedule.push(typeOfDayToday);
    self.finalFilteredSchedule.push(typeOfDayTomorrow);
    self.finalFilteredSchedule.push(typeOfDayDayAfterTomorrow);

    callback();
  }



  this.callTheCallback = function(callback) {

    console.log('inside returnData');
    console.log('self.finalFilteredSchedule: ', self.finalFilteredSchedule);

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
    getGoogleCalendarData.getUnifiedDayCalendarData,
    getGoogleCalendarData.getAllSpecialDaysCalendarData,
    getGoogleCalendarData.debugPrintGreenAndGold,
    getGoogleCalendarData.addAllTypeOfDayToCalendarList,
    // getGoogleCalendarData.combineGoldandGreenDaySchedules,
    // getGoogleCalendarData.combineGoldGreenAndUnifiedDaySchedules,
    // getGoogleCalendarData.filterForNumberOfDays,
    // getGoogleCalendarData.updateFinalResultsAfterFilter,
    // getGoogleCalendarData.sortTheArray,
    getGoogleCalendarData.returnTodayTomorrowAndDayAfter,
    getGoogleCalendarData.callTheCallback
  ]
);

}; // end of getDayDetails
