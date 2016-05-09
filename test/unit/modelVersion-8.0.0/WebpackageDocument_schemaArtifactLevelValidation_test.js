/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 8.0.0)', function () {
  var WebpackageDocument;
  var fs;
  var path;
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs');
      path = require('path');
      WebpackageDocument = require('../../../lib/WebpackageDocument');
    });

    describe('invalidBlockDeclaration by artifact-type', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_invalidArtifactDeclaration1');
        manifestWebpackageString =
          fs.readFileSync(pathName, 'utf8');
      });

      it('should NOT be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        var webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          // do nothing, as we expect a validation error
          assert.fail(error, null, 'Error not expected.');
        };
        var onValidationError = function (errors) {
          // console.log(JSON.stringify(errors))
          errors.length.should.be.equal(1);
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });

    describe('\'manifest.webpackage_invalidDueToDuplicateArtifactId\'', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_invalidArtifactDeclaration0');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should NOT be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        var webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          // do nothing as we expect a validation error
          assert.fail(error, null, 'Error not expected.');
        };
        var onValidationError = function (errors) {
          // console.log(errors.length)
          // console.log(JSON.stringify(errors))
          errors.length.should.be.equal(3);
          JSON.stringify(errors).indexOf('duplicated-appid').should.be.above(-1);
          JSON.stringify(errors).indexOf('duplicated-compound-id').should.be.above(-1);
          JSON.stringify(errors).indexOf('duplicated-id').should.be.above(-1);
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });

    describe('invalidArtifactDeclaration by artifact-name', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_invalidArtifactDeclaration2');
        manifestWebpackageString =
          fs.readFileSync(pathName, 'utf8');
      });

      it('should NOT be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        var webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          // do nothing, as we expect a validation error
          assert.fail(error, null, 'Error not expected.');
        };
        var onValidationError = function (errors) {
          // console.log(JSON.stringify(errors))
          errors.length.should.be.equal(3);
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });

    describe('invalidCompoundDeclaration', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_invalidArtifactDeclaration3');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should NOT be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        var webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          // do nothing, as we expect a validation error
          assert.fail(error, null, 'Error not expected.');
        };
        var onValidationError = function (errors) {
          // console.log(errors.length)
          // console.log(JSON.stringify(errors))
          errors.length.should.be.equal(4);
          JSON.stringify(errors).indexOf('Missing required property: memberId').should.be.above(-1);
          JSON.stringify(errors).indexOf('Missing required property: componentId').should.be.above(-1);
          JSON.stringify(errors).indexOf('/artifacts/compoundComponents/0/connections/0/source/memberId').should.be.above(-1);
          JSON.stringify(errors).indexOf('/artifacts/compoundComponents/0/endpoints/0/dependencies/0').should.be.above(-1);
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });

    describe('invalidUtilDeclaration due to missing any endpoint declaration', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_invalidUtilityDueToMissingAnyEndpoint');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should NOT be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        var webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var onSuccess = function () {
          validationState = true;
        };
        var onUnsupportedModelVersionError = function (error) {
          // do nothing, as we expect a validation error
          assert.fail(error, null, 'Error not expected.');
        };
        var onValidationError = function (errors) {
          // console.log(JSON.stringify(errors))
          errors.length.should.be.equal(1);
          JSON.stringify(errors).indexOf('/artifacts/utilities/0/endpoints').should.be.above(-1);
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });
  });
});
