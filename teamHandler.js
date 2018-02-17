/*jshint esversion: 6 */
/*jslint node: true */

'use strict';

var async = require('async');

var spreadsheetAccess = require('localLinkLibraries/SpreadsheetAccess/spreadsheet-access.js');
var spreadsheetAccess = require('localLinkLibraries/SpreadsheetData/find-data.js');

var frontOfficeSheetId = '1pH14tv1a1LkVch08jDARjZvYEK0SOqijK-PZ7_s1P_8';






exports.getListOfSports = function(event, context, callback) {

  var spreadsheetID = frontOfficeSheetId;

  console.log('Inside getListOfSports');

  async.waterfall([
          function(spreadsheetID, callback) {

          spreadsheetAccess.getGoogleSpreadsheetDataOneColumn(
                            spreadsheetID,
                            3, // what sheet (tab) is wanted
                            50, // how many rows to fetch
                            null, // num columns not used.
                            callback);

        },
        function(spreadsheetData, callback) {
          console.log('end of getListOfSports Waterfall: ',spreadsheetData);
          context.succeed(spreadsheetData);
          callback();
        }
  ]);
};



exports.getSportSheetData = function(event, context, callback) {

  var spreadsheetID = frontOfficeSheetId;

  console.log('Inside getSportSheetData');

  console.log('event: ', event);
  //var sport =

  async.waterfall([
          function(spreadsheetID, callback) {

          spreadsheetAccess.getGoogleSpreadsheetDataMultColumns(
                            spreadsheetID,
                            3, // Sports - what sheet (tab) is wanted
                            50, // how many rows to fetch
                            4, // num columns [name, sheetLink, picturesLink, sheetId]
                            callback);

        },
        function(spreadsheetData, callback) {
          var sheetIdFound = spreadsheetData.filter(function(sport) {
            // BUGBUG this needs to be generic!  Figure out EVENT
            return sport.name == "Girls Lacrosse";
          });
        },
        function(sportData, callback) {
          console.log('end of getSportSheetData Waterfall: ',sportData);
          context.succeed(sportData);
          callback();
        }
  ]);
}; // end of getSportSheetData




exports.getListOfArtsActivities = function(event, context, callback) {

  var spreadsheetID = frontOfficeSheetId;

  console.log('Inside getListOfArtsActivities');

  async.waterfall([
          function(spreadsheetID, callback) {

          spreadsheetAccess.getGoogleSpreadsheetDataOneColumn(
                            spreadsheetID,
                            4, // what sheet (tab) is wanted
                            50, // how many rows to fetch
                            null, // num columns not used.
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

  var spreadsheetID = frontOfficeSheetId;

  console.log('Inside getListOfClubs');

  async.waterfall([
          function(spreadsheetID, callback) {

          spreadsheetAccess.getGoogleSpreadsheetDataOneColumn(
                            spreadsheetID,
                            5, // what sheet (tab) is wanted
                            50, // how many rows to fetch
                            null, // num columns not used.
                            callback);

        },
        function(spreadsheetData, callback) {
          console.log('end of getListOfClubs Waterfall: ',spreadsheetData);
          context.succeed(spreadsheetData);
          callback();
        }
  ]);
};
