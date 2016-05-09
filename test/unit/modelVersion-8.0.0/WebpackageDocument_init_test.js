/*global require,describe,beforeEach,it*/
var expect = require('chai').expect;
describe('WebpackageDocument Initialization (modelVersion 8.0.0)', function () {
  var WebpackageDocument;
  var fs;
  var path;
  describe('init', function () {
    beforeEach(function () {
      fs = require('fs');
      path = require('path');
      WebpackageDocument = require('../../../lib/WebpackageDocument');
    });
    var webpackageDocument;
    describe('document construction', function () {
      var manifestWebpackageString;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
      });

      it('should work with parameter as object', function () {
        var manifestWebpackageObject = JSON.parse(manifestWebpackageString);
        webpackageDocument = new WebpackageDocument(manifestWebpackageObject);
        var validationState;
        var id;
        var onSuccess = function (generatedId) {
          validationState = true;
          id = generatedId;
        };
        var onUnsupportedModelVersionError = function (error) {
          console.log(JSON.stringify(error));
          validationState = false;
        };
        var onValidationError = function (errors) {
          console.log(JSON.stringify(errors));
          validationState = false;
        };
        webpackageDocument.generateId(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(true);
        id.should.be.equal('org.example.my-webpackage@0.2.0');
      });

      it('should work with parameter as a JSON string', function () {
        webpackageDocument = new WebpackageDocument(manifestWebpackageString);
        var validationState;
        var id;
        var onSuccess = function (generatedId) {
          validationState = true;
          id = generatedId;
        };
        var onUnsupportedModelVersionError = function (error) {
          console.log(JSON.stringify(error));
          validationState = false;
        };
        var onValidationError = function (errors) {
          console.log(JSON.stringify(errors));
          validationState = false;
        };
        webpackageDocument.generateId(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(true);
        id.should.be.equal('org.example.my-webpackage@0.2.0');
      });
    });
  });

  describe('helper methods', function () {
    describe('#_createId', function () {
      var obj;
      var manifestWebpackageString;
      var webpackageDocument;
      beforeEach(function () {
        var pathName = path.resolve(__dirname, '../../resource/modelVersion-8.0.0/manifest.webpackage');
        manifestWebpackageString = fs.readFileSync(pathName, 'utf8');
        obj = JSON.parse(manifestWebpackageString);
        webpackageDocument = new WebpackageDocument(obj);
      });
      it('return value should be a defined value', function () {
        var validationState;
        var id;
        var onSuccess = function (generatedId) {
          validationState = true;
          id = generatedId;
        };
        var onUnsupportedModelVersionError = function (error) {
          console.log(JSON.stringify(error));
          validationState = false;
        };
        var onValidationError = function (errors) {
          console.log(JSON.stringify(errors));
          validationState = false;
        };
        webpackageDocument.generateId(onSuccess, onUnsupportedModelVersionError, onValidationError);
        validationState.should.be.equal(true);
        id.should.be.equal('org.example.my-webpackage@0.2.0');
      });
    });

    describe('#_handleJsonOrObjectParameter', function () {
      var json = '{ "test": "testString"}';
      it('return value schould be an object, if the parameter is json string', function () {
        WebpackageDocument._handleJsonOrObjectParameter(json).should.be.a('object');
      });
      it('return value schould be an object,if the parameter is an object', function () {
        WebpackageDocument._handleJsonOrObjectParameter(json).should.be.a('object');
      });
      it('return value schould have a property "test"', function () {
        WebpackageDocument._handleJsonOrObjectParameter(json).should.have.ownProperty('test');
      });
      it('return value schould have a property "test" with value', function () {
        WebpackageDocument._handleJsonOrObjectParameter(json).test.should.equal('testString');
      });
      it('should throw an exection, if the parameter not object or JSON string', function () {
        expect(function () {
          WebpackageDocument._handleJsonOrObjectParameter(5);
        }).throw(TypeError);
        expect(function () {
          WebpackageDocument._handleJsonOrObjectParameter('string');
        }).throw(TypeError);
      });
    });

    describe('#_createWebPackageDocument', function () {
      var obj;
      var webpackageDocument;
      beforeEach(function () {
        obj = {
          test1: 'testString',
          test2: {
            test3: true
          }
        };
        webpackageDocument = new WebpackageDocument(obj);
      });

      it('Attribute is available  on Object', function () {
        webpackageDocument.document.should.have.property('test1');
        webpackageDocument.document.should.have.property('test2');
        webpackageDocument.document.should.have.deep.property('test2.test3', true);
      });
    });
  });
});
