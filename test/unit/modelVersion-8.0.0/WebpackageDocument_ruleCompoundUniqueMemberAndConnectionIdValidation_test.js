/* global require,describe,beforeEach,it,assert */
describe('WebpackageDocument Compound.connections.connectionId -Rule Validation (modelVersion 8.0.0)', function () {
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
    describe('\'manifest.webpackage_invalidDueToDuplicateConnectionId\'', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage_invalidCompoundDueToDuplicateMemberAndConnectionIds');
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
          // do nothing as we expect a validation error
          assert.fail(error, null, 'Error not expected.');
        };
        var onValidationError = function (errors) {
          // console.log(JSON.stringify(errors))
          errors.length.should.be.equal(2);
          JSON.stringify(errors[ 0 ]).indexOf('RuleViolation').should.be.equal(1);
          JSON.stringify(errors[ 1 ]).indexOf('RuleViolation').should.be.equal(1);
          validationState = false;
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(false);
      });
    });
  });
});
