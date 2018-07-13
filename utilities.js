'use strict';

var AWS = require('aws-sdk');
var lambda = new AWS.Lambda;

var async = require('async');
var _ = require('lodash');

module.exports.getHeaders = () => {

  var headers = {
    'Content-Type': 'application/json',
    "X-Requested-With": '*',
    "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": 'GET,PUT,POST,DELETE'
  };

  return headers;
}; // end of getHeaders
