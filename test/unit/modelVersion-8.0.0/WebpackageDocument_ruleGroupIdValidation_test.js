/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument groupId -Rule Validation (modelVersion 8.0.0)', function () {
  var WebpackageDocument
  var fs
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs')
      WebpackageDocument = require('../../../lib/WebpackageDocument')
    })
    var webpackageDocument
    describe('invalid \'manifest.webpackage_invalidGroupId\'', function () {
      var manifestWebpackageString
      beforeEach(function () {
        manifestWebpackageString =
          fs.readFileSync(__dirname + '/../../resource/modelVersion-8.0.0/manifest.webpackage_invalidGroupId', 'utf8')
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
          validationState = false
        }
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError)
        validationState.should.be.equal(false)
      })
    })
    //
    describe('valid \'manifest.webpackage_groupId-cubx\'', function () {
      var manifestWebpackageString
      beforeEach(function () {
        manifestWebpackageString =
          fs.readFileSync(__dirname + '/../../resource/modelVersion-8.0.0/manifest.webpackage_groupId-cubx', 'utf8')
      })

      it('should be validated successfully', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString)
        webpackageDocument = new WebpackageDocument(manifestWebpackageObject)
        var validationState
        var onSuccess = function () {
          validationState = true
        }
        var onUnsupportedModelVersionError = function (error) {
          // do nothing as we expect a validation error
          console.error(error)
        }
        var onValidationError = function (errors) {
          // console.log(JSON.stringify(errors))
          validationState = false
        }
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError)
        validationState.should.be.equal(true)
      })
    })
    //
    describe('valid \'manifest.webpackage_groupId-cubx.core\'', function () {
      var manifestWebpackageString
      beforeEach(function () {
        manifestWebpackageString =
          fs.readFileSync(__dirname + '/../../resource/modelVersion-8.0.0/manifest.webpackage_groupId-cubx.core', 'utf8')
      })

      it('should be validated successfully', function () {
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
          validationState = false
        }
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError)
        validationState.should.be.equal(true)
      })
    })
  })
})
