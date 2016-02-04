/*globals __dirname  */
'use strict';
(function () {
  var schema
  var fs = require('fs')
  schema = fs.readFileSync(__dirname + '/manifestWebpackage-8.0.0.schema', 'utf8')
  module.exports = JSON.parse(schema)
}())
