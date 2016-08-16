/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 9.0.0) (not uniq dependencies schema)', function () {
  var WebpackageDocument;
  var fs;
  var path;
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs');
      path = require('path');
      WebpackageDocument = require('../../../lib/WebpackageDocument');
    });

    describe('validation for resource and deendencies as direct properties', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-9.0.0/manifest_error_deps.webpackage');
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
          console.log('error', error);
          assert.fail(error, null, 'No error expected.');
        };
        var onValidationError = function (errors) {
          validationState = false;
          console.log('errors', errors);
          errors.should.have.length(1);
          errors[0].should.be.equal('RuleViolation identified: Artifact \'my-compound\' contains multiple references to dependency \'com.hm.demos.aviator@1.0/component1\'');
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });
  });
});
