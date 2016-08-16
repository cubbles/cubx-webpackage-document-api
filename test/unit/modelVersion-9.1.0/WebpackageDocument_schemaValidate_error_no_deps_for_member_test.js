/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 9.1.0) (missing dependencies for members)', function () {
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
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-9.1.0/manifest_error_members_deps.webpackage');
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
          console.log('error', error);
          assert.fail(error, null, 'No error expected.');
        };
        var onValidationError = function (errors) {
          validationState = false;
          console.log('errors', errors);
          errors.should.be.length(3);
          errors[0].should.be.equal('RuleViolation identified: Member of "my-compound" with memberId "vehiclesPerChargingstationCorrelator" and artifactId "generic" has no corresponding dependency');
          errors[1].should.be.equal('RuleViolation identified: Member of "my-compound" with memberId "vehiclePerSharingstationCorrelator" and artifactId "generic" has no corresponding dependency');
          errors[2].should.be.equal('RuleViolation identified: Member of "my-compound" with memberId "stationView" and artifactId "station-view" has no corresponding dependency');
        };
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError);

        validationState.should.be.equal(false);
      });
    });
  });
});
