/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 10.0.0)', function () {
  var WebpackageDocument;
  var fs;
  var path;
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs');
      path = require('path');
      WebpackageDocument = require('../../../lib/WebpackageDocument');
    });

    describe('validation for manifest.webpackage', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-10.0.0/manifest.webpackage');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        var webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          validationState = false;
          console.log('error', error);
          assert.fail(error, null, 'No error expected.');
        };
        var onValidationError = function (errors) {
          validationState = false;
          console.log(errors);
          assert.fail(errors, null, 'No error expected.');
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(true);
      });
    });
  });
});
