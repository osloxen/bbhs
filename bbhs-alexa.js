/*jshint esversion: 6 */
/*jslint node: true */

'use strict';

const Alexa = require('alexa-sdk');
var https = require('https');
var _ = require('lodash');

const APP_ID = 'amzn1.ask.skill.0fb2e614-1a7e-458d-ba4b-eaae08658d16';

var moment = require("moment");
var momentTZ = require('moment-timezone');
var today = moment().format('YYYY-MM-DD');
var tomorrow = moment().add(1,'d');
tomorrow = tomorrow.format('YYYY-MM-DD');


// 'STAFFINFO'
var state = null;
var currentStaffMember = {};
var currentEvent = {};
var currentClass = {};


//var url = "https://afe1vbusyj.execute-api.us-east-1.amazonaws.com/beta/mydemoresource";
//var urlSchoolData = "https://afe1vbusyj.execute-api.us-east-1.amazonaws.com/beta/st-catherine-name";
//var urlFacultyInfo = "https://afe1vbusyj.execute-api.us-east-1.amazonaws.com/beta/st-catherine-school/faculty/";
//var urlEventInfo = "https://afe1vbusyj.execute-api.us-east-1.amazonaws.com/beta/st-catherine-school/events/";
//var urlGetSchoolSchedInfo = "https://afe1vbusyj.execute-api.us-east-1.amazonaws.com/beta/st-catherine-school/schoolschedule/";

// UNDER HERE CURRENTLY BEING WORKED ON
// var urlGetAd = "https://tp6pumul78.execute-api.us-east-1.amazonaws.com/prod/version1/ad";

// UNDER HERE URL IS UPDATED
// var urlGetSchoolSchedInfo = "https://telbelahfa.execute-api.us-east-1.amazonaws.com/prodalexa/stc/school-schedule"
// var urlClassInfo = "https://telbelahfa.execute-api.us-east-1.amazonaws.com/prodalexa/stc/homework/"
// var urlGetSchoolLunch = "https://telbelahfa.execute-api.us-east-1.amazonaws.com/prodalexa/stc/lunch";
// var urlGetSportsInfo = "https://telbelahfa.execute-api.us-east-1.amazonaws.com/prodalexa/stc/sports/latest/";



function getGradeFromInput(input) {
  return input.match(/\d+/)[0];
}


function convertSportToUrlParameter(sport) {

  switch (sport) {
    case "girls lacrosse":
        return "girls-lax";
        break;
    case "boys lacrosse":
        return "boys-lax";
        break;
    case "boys soccer":
        return "boys-soccer";
        break;
    default:
        return sport;
  }
} // end of convertSportToUrlParameter


function processSport(sportFromAlexa) {

  if (sportFromAlexa == "girls sox") {
    return 'girls lacrosse';
  } else {
    return sportFromAlexa;
  }
}



function processSquad(squadFromAlexa) {

  if (squadFromAlexa == "barsotti") {
    return 'varsity';
  } else {
    return squadFromAlexa;
  }
}



const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to the Bishop Blanchet Alexa application. ' +
                    'You can ask questions like:  What type of day is today? '
                    , 'Hi!  You are in the Bishop Blanchet app.  You can ask me ' +
                    'about what kind of day it is, sports, clubs and the arts.');
    },
    'datetypeintent': function () {
      var self = this;

      console.log('from Alexa: ', this.event.request.intent.slots);

      var dateFromAlexa = this.event.request.intent.slots.date.value;

      var userRequestedDate = momentTZ(dateFromAlexa).tz("America/Los_Angeles");

      var tpeOfDayUrl = 'https://qnofocfk6k.execute-api.us-west-2.amazonaws.com/dev/day-details';

      https.get(tpeOfDayUrl, function(res) {
          console.log("Got response: " + res.statusCode);

          res.on('data', (d) => {
              process.stdout.write(d);
              var data = JSON.parse(d);
              console.log('Data is: ' + JSON.stringify(data));

              if ((userRequestedDate.isoWeekday() == 6) ||
                  (userRequestedDate.isoWeekday() == 7)) {
                    self.emit(':tell', dateFromAlexa + ' is a weekend.');
              } else if (data.schedule.length == 0) {
                    self.emit(':tell', dateFromAlexa + ' is a unified day.');
              } else {
                    self.emit(':tell', dateFromAlexa + ' is either a green or gold day.');
              }

            });
        });
    },
    'sportsinfointent': function () {
      var self = this;

      console.log('from Alexa: ', this.event.request.intent.slots);

      var sport = processSport(this.event.request.intent.slots.list_of_sports.value);
      var squad = processSquad(this.event.request.intent.slots.squadlevel.value);
      var eventType = this.event.request.intent.slots.eventtype.value;

      var sportsScheduleUrl = "https://qnofocfk6k.execute-api.us-west-2.amazonaws.com/dev/sports/schedule/"
      sportsScheduleUrl = sportsScheduleUrl + convertSportToUrlParameter(sport);
      sportsScheduleUrl = sportsScheduleUrl + "?squad=" + squad;
      sportsScheduleUrl = sportsScheduleUrl + "&eventType=" + eventType;
      console.log('Sports url used is: ', sportsScheduleUrl);

      https.get(sportsScheduleUrl, function(res) {
          console.log("Got response: " + res.statusCode);

          res.on('data', (d) => {
              process.stdout.write(d);
              var data = JSON.parse(d);
              console.log('Data is: ' + JSON.stringify(data));

              var scheduleInfo = data;

              var foundFirstInstance = _.find(scheduleInfo.schedule,
                  function(o) {
                    //var today = moment();
                    var eventDate = moment(o.eventDate);
                    return moment().diff(eventDate, 'days') <= 0; });

              if (foundFirstInstance != undefined) {
                self.emit(':tell', 'Here is what I found. ' +
                          'The next ' + sport + ' ' + eventType + ' is on ' + foundFirstInstance.eventDate +
                          ' ' + foundFirstInstance.summary +
                          '. The event starts at ' + foundFirstInstance.startTime +
                          ' and ends at ' + foundFirstInstance.endTime +
                          '. The location is ' + foundFirstInstance.location);
              } else {
                self.emit(':tell', 'I did not find anything on the schedule. ' +
                          'If you are looking for a playoff game try again soon. ' +
                          'If not then it may be that ' + sport + ' is out of season ' +
                          'or the season is too new and I do not have the schedule yet.');
              }


            });
        });



/*

      if (this.event.request.intent.slots.list_of_sports.value == undefined ||
          this.event.request.intent.slots.squadlevel.value == undefined ||
          this.event.request.intent.slots.eventtype.value == undefined) {

        this.emit(':tell', 'You did not give me all the information I need ' +
                  'to process your request.  I need to know what sport, ' +
                  'what competition level, for example varsity, and the type of event. ' +
                  'An event type is usually a game or practice. ');
      } else {

        var sport = processSport(this.event.request.intent.slots.list_of_sports.value);
        var squad = processSquad(this.event.request.intent.slots.squadlevel.value);
        var eventType = this.event.request.intent.slots.eventtype.value;

        var sportsScheduleUrl = "https://qnofocfk6k.execute-api.us-west-2.amazonaws.com/dev/sports/schedule/"
        sportsScheduleUrl = sportsScheduleUrl + convertSportToUrlParameter(sport);
        sportsScheduleUrl = sportsScheduleUrl + "?squad=" + squad;
        sportsScheduleUrl = sportsScheduleUrl + "&eventType=" + eventType;
        console.log('Sports url used is: ', sportsScheduleUrl);

        https.get(sportsScheduleUrl, function(res) {
            console.log("Got response: " + res.statusCode);

            res.on('data', (d) => {
                process.stdout.write(d);
                var data = JSON.parse(d);
                console.log('Data is: ' + JSON.stringify(data));

                var scheduleInfo = data;

                var foundFirstInstance = _.find(scheduleInfo.schedule,
                    function(o) {
                      //var today = moment();
                      var eventDate = moment(o.eventDate);
                      return moment().diff(eventDate, 'days') <= 0; });

                if (foundFirstInstance != undefined) {
                  self.emit(':tell', 'Here is what I found. ' +
                            'The next ' + sport + ' ' + eventType + ' is on ' + foundFirstInstance.eventDate +
                            ' ' + foundFirstInstance.summary +
                            '. The event starts at ' + foundFirstInstance.startTime +
                            ' and ends at ' + foundFirstInstance.endTime +
                            '. The location is ' + foundFirstInstance.location);
                } else {
                  self.emit(':tell', 'I did not find anything on the schedule. ' +
                            'If you are looking for a playoff game try again soon. ' +
                            'If not then it may be that ' + sport + ' is out of season ' +
                            'or the season is too new and I do not have the schedule yet.');
                }


              });
          });
      } // end of else
*/


    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'I appreciate you asking for help.  Make your question as ' +
            'simple as possible.  For example say something like: Alexa ask Blanchet ' +
            'what kind of day is it?  Always say Alexa ask Blanchet and then ' +
            'your request.';
        const reprompt = 'Having trouble?  Confused?  Computers can be frustrating and I am also a computer. ' +
            'My best recommendation is to ask one of the example questions.  I wish I could help more.';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Alright, I understand and will cancel.');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'I will now stop.  I have stopped.  Totally stopped here. ' +
                'I am now opposite of go.  Which is stopped.  I know when I need to stop.');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', 'Session is now ended.  I will be here when you need me. ');
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
