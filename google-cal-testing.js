/*jshint esversion: 6 */
/*jslint node: true */

'use strict';

var CONFIG = {
  "calendarId": "yourdomain.1234@group.calendar.google.com"
}

var _ = require('lodash');
var request = require('request');

var async = require('async');
var moment = require('moment');
var PublicGoogleCalendar = require('public-google-calendar');

var goldDayCalendar = new PublicGoogleCalendar({ calendarId: 'ajfretm1425r1u05fgvem49t8c@group.calendar.google.com' });
var greenDayCalendar = new PublicGoogleCalendar({ calendarId: 'ajtvvqauv2vve92sso48bvr3bo@group.calendar.google.com' });
var unifiedDayCalendar = new PublicGoogleCalendar({ calendarId: 'bishopblanchet.org_4e772o7r2nma870gmbiqmpjqlk@group.calendar.google.com' });
var specialDayCalendar = new PublicGoogleCalendar({ calendarId: '50ul1lh5iev5tqfhl1cab6gke8@group.calendar.google.com' });
var athleticsAwayCalendar = new PublicGoogleCalendar({ calendarId: '9oounb9m5790te7qdeccr1acos@group.calendar.google.com' });
var athleticsHomeCalendar = new PublicGoogleCalendar({ calendarId: 'mp1du636dvotr2gf5honp0c1pk@group.calendar.google.com' });




var unifiedCalendarOptions = {
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
              console.log(event.summary);
              console.log(event.start);
              if (event.summary == undefined) {
                console.log(event);
              }
              console.log('**********');
            }
      }

      // if ((event.start != undefined) &&
      //     (event.start.date != undefined)) {
      //
      //   dateOfEvent = moment(event.start.date);
      //
      //   var year = dateOfEvent.format('Y');
      //
      //   if (year >= 2018) {
      //     var addThisDay = {};
      //     addThisDay.summary = event.summary;
      //     addThisDay.eventDate = dateOfEvent.format('YYYY-MM-DD');
      //     self.unifiedDaysSchedule.push(addThisDay);
      //   }
      // }


    });
  }
}

request(unifiedCalendarOptions,requestCallback);


// athleticsAwayCalendar.getEvents(function(err, events) {
  // goldDayCalendar.getEvents(function(err, events) {
//unifiedDayCalendar.getEvents(function(err, events) {
    // if (err) { return console.log(err.message); }
    //
    // console.log(events.length);
    //
    // events.forEach(function(event) {
    //   var dateOfEvent = moment(event.start);
    //   var year = dateOfEvent.format('Y');
    //   var month = dateOfEvent.format('M');
    //   var day = dateOfEvent.format('D');
    //   if ((year == 2018) && (month == 12)) {
    //     console.log('*************');
    //     console.log(event.summary);
    //     console.log(event.start);
    //     console.log('year: ', year);
    //     console.log('month: ', month);
    //     console.log('day: ', day);
    //     console.log('*************');
    //   }
    // })




  // var allLateStartObjects = _.filter(events, { 'summary':'Gold Day Late Start-9:30' });
  // console.log('number of gold days = ', allLateStartObjects.length);
  //
  // allLateStartObjects.forEach(function(event) {
  //   var dateOfEvent = moment(event.start);
  //   var year = dateOfEvent.format('Y');
  //   var month = dateOfEvent.format('M');
  //   if ((year == "2018") && (month == "11")) {
  //     console.log(event);
  //   }
  // })
  //
  //
  //     for (var i=0;i<events.length;i++) {
  //       //console.log(events);
  //       var dateOfEvent = moment(events[i].start);
  //
  //       var year = dateOfEvent.format('Y');
  //       var month = dateOfEvent.format('M');
  //       var day = dateOfEvent.format('D');
  //
  //       // if ((year == "2018") && (month == "12") && (day == "15")){
  //       if ((year == "2018") && (month == "11") && (day == "28")){
  //       // if ((year == "2018") && (month == "12")) {
  //         // console.log(events[i].start);
  //         console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  //         console.log(events[i]);
  //         console.log(events[i].baseEvent.rrule);
  //         console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
  //       }
  //     }

// });
