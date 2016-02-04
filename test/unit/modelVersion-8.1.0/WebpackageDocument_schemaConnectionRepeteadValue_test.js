/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 8.1.0)', function () {
  var WebpackageDocument
  var fs
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs')
      WebpackageDocument = require('../../../lib/WebpackageDocument')
    })

    describe('validation of repeatedValues', function () {
      var manifestWebpackageString
      beforeEach(function () {
        manifestWebpackageString =
          fs.readFileSync(__dirname +
            '/../../resource/modelVersion-8.1.0/manifest.webpackage', 'utf8')
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
          validationState = false
        }
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError)
        validationState.should.be.equal(true)
      })
    })
  })
})
