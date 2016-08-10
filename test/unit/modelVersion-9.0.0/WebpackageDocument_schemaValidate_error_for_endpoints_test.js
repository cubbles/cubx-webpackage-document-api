/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 9.0.0)', function () {
  var WebpackageDocument;
  var fs;
  var path;
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs');
      path = require('path');
      WebpackageDocument = require('../../../lib/WebpackageDocument');
    });

    describe('validation of repeatedValues', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-9.0.0/manifest_error.webpackage');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should be get error', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        var webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          assert.fail(error, null, 'No error not expected.');
        };
        var onValidationError = function (errors) {
          validationState = false;
          console.log('errors', errors);
          errors[ 0 ].should.have.property('message', 'Missing required property: resources');
          errors[ 0 ].should.have.property('dataPath', '/artifacts/compoundComponents/0');
          errors[ 1 ].should.have.property('message', 'Additional properties not allowed');
          errors[ 1 ].should.have.property('dataPath', '/artifacts/compoundComponents/0/endpoints');
          errors[ 2 ].should.have.property('message', 'Missing required property: resources');
          errors[ 2 ].should.have.property('dataPath', '/artifacts/elementaryComponents/0');
          errors[ 3 ].should.have.property('message', 'Additional properties not allowed');
          errors[ 3 ].should.have.property('dataPath', '/artifacts/elementaryComponents/0/endpoints');
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });
  });
});
