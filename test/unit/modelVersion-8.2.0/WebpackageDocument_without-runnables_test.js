/*global require,describe,beforeEach,it,assert*/
describe('WebpackageDocument Schema Validation (modelVersion 8.2.0)', function () {
  var WebpackageDocument
  var fs
  describe('validate', function () {
    beforeEach(function () {
      fs = require('fs')
      WebpackageDocument = require('../../../lib/WebpackageDocument')
    })

    describe('without runnables webpackage and all on the artifacts', function () {
      var manifestWebpackageString
      beforeEach(function () {
        manifestWebpackageString =
          fs.readFileSync(__dirname +
            '/../../resource/modelVersion-8.2.0/manifest-without-runnables.webpackage', 'utf8')
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
          // console.log(errors)
          validationState = false
          errors.should.have.length(1)
          errors[ 0 ].should.have.property('message', 'Missing required property: runnables')
          errors[ 0 ].should.have.property('dataPath', '/artifacts/apps/0')
        }
        webpackageDocument.validate(onSuccess, onUnsupportedModelVersionError, onValidationError)
        validationState.should.be.equal(false)
      })
    })
  })
})
