/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Compound.slots.slotId -Rule Validation (modelVersion 8.0.0)', function () {
  var WebpackageDocument
  var fs
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs')
      WebpackageDocument = require('../../../lib/WebpackageDocument')
    })
    var webpackageDocument
    describe('\'manifest.webpackage_invalidDueToDuplicateSlotId\'', function () {
      var manifestWebpackageString
      beforeEach(function () {
        manifestWebpackageString =
          fs.readFileSync(__dirname + '/../../resource/modelVersion-8.0.0/manifest.webpackage_invalidCompoundDueToDuplicateSlotId', 'utf8')
      })

      it('should NOT be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString)
        webpackageDocument = new WebpackageDocument(manifestWebpackageObject)
        var validationState
        var onSuccess = function () {
          validationState = true
        }
        var onUnsupportedModelVersionError = function (error) {
          // do nothing as we expect a validation error
          assert.fail(error, null, 'Error not expected.')
        }
        var onValidationError = function (errors) {
          // console.log(JSON.stringify(errors))
          errors.length.should.be.equal(1)
          JSON.stringify(errors).indexOf('RuleViolation').should.be.equal(2)
          validationState = false
        }
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError)
        validationState.should.be.equal(false)
      })
    })
  })
})
