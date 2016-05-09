/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation 4 Property Values (modelVersion 8.0.0)', function () {
  var WebpackageDocument;
  var fs;
  var path;
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs');

      path = require('path');
      WebpackageDocument = require('../../../lib/WebpackageDocument');
    });
    var webpackageDocument;
    describe('valid \'manifest.webpackage\'', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          console.log(JSON.stringify(error));
          validationState = false;
        };
        var onValidationError = function (errors) {
          console.log(JSON.stringify(errors));
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(true);
      });
    });

    describe('valid \'manifest.webpackage_requiredAttributesOnly\'', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_requiredAttributesOnly');
        manifestWebpackageString =
          fs.readFileSync(pathName, 'utf8');
      });

      it('should be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          console.log(JSON.stringify(error));
          validationState = false;
        };
        var onValidationError = function (errors) {
          console.log(JSON.stringify(errors));
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(true);
      });
    });

    describe('unsupportedModelVersion', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_invalidModelVersion');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should NOT be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          error.should.not.be.null;
          validationState = false;
        };
        var onValidationError = function (errors) {
          // do nothing, as we expect a modelVersion error
          assert.fail(errors, null, 'Errors not expected.');
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });

    describe('valid \'manifest.webpackage_invalidValues\'', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_invalidValues');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should NOT be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var errorsFound = [];
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          // console.log(JSON.stringify(error))
          assert.fail(error, null, 'Error not expected.');
        };
        var onValidationError = function (errors) {
          errors.forEach(function (element, index, array) {
            //    console.log(element.dataPath + ' > ' + element.message)
          });
          errorsFound = errors;
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        errorsFound.should.have.length(6);
        validationState.should.be.equal(false);
      });
    });
  });
});
