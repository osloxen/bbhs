/*jshint esversion: 6 */
/*jslint node: true */

'use strict';

process.env.TZ = 'America/Los_Angeles';

var async = require('async');
var cleanArray = require('clean-array');
var moment = require('moment');

var spreadsheetAccess = require('localLinkLibraries/SpreadsheetAccess/spreadsheet-access.js');
var findSpreadsheetData = require('localLinkLibraries/SpreadsheetData/find-data.js');
var convertSpreadsheetData = require('localLinkLibraries/SpreadsheetData/convert-data.js');
var googleCalendarData = require('localLinkLibraries/GoogleCalendarData/calendar-event-access.js');
var util = require('./utilities');

var frontOfficeSheetId = '1pH14tv1a1LkVch08jDARjZvYEK0SOqijK-PZ7_s1P_8';


exports.getTypeOfDayFromSheet = function(event, context, callback) {

  console.log('Inside getTypeOfDayFromSheet');

  console.log('event: ', event);
  //console.log('pathParameters: ', event.pathParameters);
  //console.log('query string parameters: ', event.queryStringParameters);

  async.waterfall([
          function(callback) {

            spreadsheetAccess.getGoogleSpreadsheetDataMultColumns(
                                frontOfficeSheetId,
                                1, // sheet number
                                6, // max row maxRowNeeded
                                2, // number of columns needed
                                callback);

        },
        function(typeOfDayData, callback) {

          console.log('typeOfDayData Data: ', typeOfDayData);

          var bodyAsJson = JSON.parse(typeOfDayData.body);

          console.log('body as json: ', bodyAsJson);

          var overrideToday = false;
          var overrideTomorrow = false;

          console.log('checking for override...');
          console.log('checking Today =-> ', bodyAsJson.sheetDataArray[3]);
          console.log('checking Tomorrow =-> ', bodyAsJson.sheetDataArray[7]);

          if (bodyAsJson.sheetDataArray[3] == '') {
            console.log('Test for empty quotes on override worked for TODAY');
          }

          if (bodyAsJson.sheetDataArray[3] != '') {
            console.log('HUMAN DETECTED!!! Override found for type of day TODAY');
            overrideToday = true;
          } else {
            console.log('no override found.');
          }

          if (bodyAsJson.sheetDataArray[7] != '') {
            console.log('HUMAN DETECTED!!! Override found for type of day TOMORROW');
            overrideTomorrow = true;
          } else {
            console.log('no override found.');
          }

          callback(null, bodyAsJson.sheetDataArray, overrideToday, overrideTomorrow);

        },
        function(arrayOfTypeOfDay, overrideToday, overrideTomorrow, callback) {
          console.log('overrideToday =-> ', overrideToday);
          console.log('overrideTomorrow =-> ', overrideTomorrow);
          console.log('array =-> ', arrayOfTypeOfDay);

          callback(null, arrayOfTypeOfDay, overrideToday, overrideTomorrow);
        },
        function(arrayOfTypeOfDay, overrideToday, overrideTomorrow, callback) {
              var typeOfDay = {};

              console.log('type of day data --> ', arrayOfTypeOfDay);

              console.log('Type of day TODAY Google Calendar => ', arrayOfTypeOfDay[2]);
              console.log('Type of day TOMORROW Google Calendar => ', arrayOfTypeOfDay[6]);
              console.log('Type of day TODAY override => ', arrayOfTypeOfDay[3]);
              console.log('Type of day TOMORROW override => ', arrayOfTypeOfDay[7]);

              if (overrideToday) {
                typeOfDay.today = arrayOfTypeOfDay[3];
              } else {
                typeOfDay.today = arrayOfTypeOfDay[2];
              }

              if (overrideTomorrow) {
                typeOfDay.tomorrow = arrayOfTypeOfDay[7];
              } else {
                typeOfDay.tomorrow = arrayOfTypeOfDay[6];
              }

              callback(null, typeOfDay);
          },

        function(typeOfDayObject, callback) {
          console.log('end of getTypeOfDayFromSheet Waterfall: ',typeOfDayObject);

          const res = {
              "statusCode": 200,
              "headers": util.getHeaders(),
              "body": JSON.stringify(typeOfDayObject) // body must be returned as a string
            };

          context.succeed(res);
          callback();
        }
  ]);
}; // end of getTypeOfDayFromSheet
