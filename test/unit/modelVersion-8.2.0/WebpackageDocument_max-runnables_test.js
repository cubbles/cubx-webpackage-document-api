/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 8.2.0)', function () {
  var WebpackageDocument
  var fs
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs')
      WebpackageDocument = require('../../../lib/WebpackageDocument')
    })
    describe('runnables on webpackage and all on the artifacts', function () {
      var manifestWebpackageString
      beforeEach(function () {
        manifestWebpackageString =
          fs.readFileSync(__dirname +
            '/../../resource/modelVersion-8.2.0/manifest-max-runnables.webpackage', 'utf8')
      })

      it('should be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString)
        var webpackageDocument = new WebpackageDocument(manifestWebpackageObject)
        var validationState
        var onSuccess = function () {
          validationState = true
        }
        var onUnsupportedModelVersionError = function (error) {
          assert.fail(error, null, 'No error not expected.')
        }
        var onValidationError = function (errors) {
          assert.fail(errors, null, 'No error not expected.')
        }
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError)
        validationState.should.be.equal(true)
      })
    })
  })
})
