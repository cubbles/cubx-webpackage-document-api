/* globals before*/
'use strict';

before(function (done) {
  require('chai').should();
  global.assert = require('assert');
  done();
});
