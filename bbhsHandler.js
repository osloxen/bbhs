/*jshint esversion: 6 */
/*jslint node: true */

'use strict';

var async = require('async');

var spreadsheetAccess = require('localLinkLibraries/SpreadsheetAccess/spreadsheet-access.js');
var spreadsheetData = require('localLinkLibraries/SpreadsheetData/find-data.js');

var frontOfficeSheetId = '1pH14tv1a1LkVch08jDARjZvYEK0SOqijK-PZ7_s1P_8';


function lookUpSportSpreadsheetID(sportName) {

    switch (sportName) {
    case "girls-lacrosse":
        return '1VxO3XMj457ZOmfbJj-H1bd_awS4GYYhaamqZ_u-aVmE';
        break;
    case "baseball":
        return 'not yet created';
        break;
    case "track":
        return 'not yet created';
        break;
    default:
        return undefined
  }
}


exports.getSportAnnouncement = function(event, context, callback) {

  console.log('Inside getSportSheetData');

  console.log('event: ', event);
  console.log('pathParameters: ', event.pathParameters);

  var sportName = event.pathParameters.sport;

  var spreadsheetID = lookUpSportSpreadsheetID(sportName);

  async.waterfall([
          function(callback) {
          // do some more stuff ...

          spreadsheetAccess.getGoogleSpreadsheetDataOneColumn(
                            spreadsheetID,
                            3, // what sheet (tab) is wanted
                            2, // how many rows to fetch
                            callback);

        },
        function(spreadsheetData, callback) {
          console.log('inside getSportAnnouncements Waterfall: ',spreadsheetData);
          context.succeed(spreadsheetData);
          callback();
        }
  ]);
}



exports.getListOfSports = function(event, context, callback) {

  console.log('Inside getListOfSports');

  async.waterfall([
          function(callback) {

          console.log('spreadsheetAccess: ', spreadsheetAccess);

          spreadsheetAccess.getGoogleSpreadsheetDataOneColumn(
                            frontOfficeSheetId,
                            3, // what sheet (tab) is wanted
                            50, // how many rows to fetch
                            callback);

        },
        function(spreadsheetData, callback) {
          console.log('end of getListOfSports Waterfall: ',spreadsheetData);
          context.succeed(spreadsheetData);
          callback();
        }
  ]);
};



exports.getSportDetails = function(event, context, callback) {

  console.log('Inside getSportSheetData');

  console.log('event: ', event);
  console.log('pathParameters: ', event.pathParameters);

  var sportName = event.pathParameters.sport;

  async.waterfall([
          function(callback) {

          spreadsheetAccess.getGoogleSpreadsheetDataMultColumns(
                            frontOfficeSheetId,
                            3, // Sports - what sheet (tab) is wanted
                            50, // how many rows to fetch
                            4, // num columns [name, sheetLink, picturesLink, sheetId]
                            callback);

        },
        function(spreadsheetData, callback) {

          console.log('spreadsheetData: ', spreadsheetData);

          var bodyAsJson = JSON.parse(spreadsheetData.body);

          console.log('body as json: ', bodyAsJson);

          var positionOfSport = bodyAsJson.sheetDataArray.indexOf(sportName);

          console.log('positionOfSport: ', positionOfSport);

          var sportDetails = {};
          sportDetails.sport = sportName;

          if (positionOfSport == -1) {
            sportDetails.sheetLink = null;
            sportDetails.picturesLink = null;
            sportDetails.sheetId = null;
          } else {
            sportDetails.sheetLink = bodyAsJson.sheetDataArray[positionOfSport + 1];
            sportDetails.picturesLink = bodyAsJson.sheetDataArray[positionOfSport + 2];
            sportDetails.sheetId = bodyAsJson.sheetDataArray[positionOfSport + 3];
          }

          callback(null, sportDetails);

        },
        function(sportData, callback) {
          console.log('end of getSportSheetData Waterfall: ',sportData);

          const res = {
              "statusCode": 200,
              "headers": {
                'Content-Type': 'application/json',
                "X-Requested-With": '*',
                "Access-Control-Allow-Headers": 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": 'GET,HEAD,OPTIONS,POST,PUT'
              },
              "body": JSON.stringify(sportData) // body must be returned as a string
            };

          context.succeed(res);
          callback();
        }
  ]);
}; // end of getSportSheetData




exports.getListOfArtsActivities = function(event, context, callback) {

  console.log('Inside getListOfArtsActivities');

  async.waterfall([
          function(callback) {

          spreadsheetAccess.getGoogleSpreadsheetDataOneColumn(
                            frontOfficeSheetId,
                            4, // what sheet (tab) is wanted
                            50, // how many rows to fetch
                            callback);

        },
        function(spreadsheetData, callback) {
          console.log('end of getListOfArtsActivities Waterfall: ',spreadsheetData);
          context.succeed(spreadsheetData);
          callback();
        }
  ]);
};


exports.getListOfClubs = function(event, context, callback) {

  console.log('Inside getListOfClubs');

  async.waterfall([
          function(callback) {

          spreadsheetAccess.getGoogleSpreadsheetDataOneColumn(
                            frontOfficeSheetId,
                            5, // what sheet (tab) is wanted
                            50, // how many rows to fetch
                            callback);

        },
        function(spreadsheetData, callback) {
          console.log('end of getListOfClubs Waterfall: ',spreadsheetData);
          context.succeed(spreadsheetData);
          callback();
        }
  ]);
};
