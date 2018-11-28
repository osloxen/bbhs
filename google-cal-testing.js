/*jshint esversion: 6 */
/*jslint node: true */

'use strict';


var async = require('async');
var moment = require('moment');
var PublicGoogleCalendar = require('public-google-calendar');

var goldDayCalendar = new PublicGoogleCalendar({ calendarId: 'ajfretm1425r1u05fgvem49t8c@group.calendar.google.com' });
var greenDayCalendar = new PublicGoogleCalendar({ calendarId: 'ajtvvqauv2vve92sso48bvr3bo@group.calendar.google.com' });
var unifiedDayCalendar = new PublicGoogleCalendar({ calendarId: 'bishopblanchet.org_4e772o7r2nma870gmbiqmpjqlk@group.calendar.google.com' });
var specialDayCalendar = new PublicGoogleCalendar({ calendarId: '50ul1lh5iev5tqfhl1cab6gke8@group.calendar.google.com' });
var athleticsAwayCalendar = new PublicGoogleCalendar({ calendarId: '9oounb9m5790te7qdeccr1acos@group.calendar.google.com' });
var athleticsHomeCalendar = new PublicGoogleCalendar({ calendarId: 'mp1du636dvotr2gf5honp0c1pk@group.calendar.google.com' });

athleticsAwayCalendar.getEvents(function(err, events) {
  // goldDayCalendar.getEvents(function(err, events) {
//unifiedDayCalendar.getEvents(function(err, events) {
  if (err) { return console.log(err.message); }


      for (var i=0;i<events.length;i++) {
        //console.log(events);
        var dateOfEvent = moment(events[i].start);

        var year = dateOfEvent.format('Y');
        var month = dateOfEvent.format('M');
        var day = dateOfEvent.format('D');

        if ((year == "2018") && (month == "9") && (day == "15")){
          // console.log(events[i].start);
          console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
          console.log(events[i]);
          console.log('W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*W*');
        }
      }

});
