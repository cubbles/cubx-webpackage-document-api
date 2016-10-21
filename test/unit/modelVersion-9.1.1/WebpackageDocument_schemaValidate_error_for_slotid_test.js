/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 9.1.1) (not uniq dependencies schema)', function () {
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
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-9.1.1/manifest_error.webpackage');
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
          validationState = false;
          console.log('error', error);
          assert.fail(error, null, 'No error expected.');
        };
        var onValidationError = function (errors) {
          validationState = false;
          console.log('errors', errors);
          errors.should.have.length(2);
          errors[0].dataPath.should.be.equal('/artifacts/compoundComponents/0/slots/0/slotId');
          errors[0].message.should.be.equal('String does not match pattern: ^[a-z][a-zA-Z0-9]*$');
          errors[1].dataPath.should.be.equal('/artifacts/elementaryComponents/0/slots/0/slotId');
          errors[1].message.should.be.equal('String does not match pattern: ^[a-z][a-zA-Z0-9]*$');
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });
  });
});
