/* globals before */
'use strict';

before(function (done) {
  var chai = require('chai');
  chai.should();
  global.assert = require('assert');
  global.expect = require('chai').expect;
  global.sinon = require('sinon');
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  done();
});
