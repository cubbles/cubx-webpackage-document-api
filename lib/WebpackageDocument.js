/**
 * Created by hrbu on 18.09.2015.
 */

'use strict';
(function () {
  var validator = require('./WebpackageDocumentValidator');

  /**
   * @module WebpackageDocument
   */
  module.exports = WebpackageDocument;

  /**
   * @class WebPackageDocument
   * Construct the Webpackage Document.
   * @param { object | string} doc as Object or JSON-String
   * @throws TypeError if the passed #doc schema-validation failed.
   * @constructor WebpackageDocument
   */
  function WebpackageDocument (doc) {
    this.document = WebpackageDocument._handleJsonOrObjectParameter(doc);
  }

  /**
   * Validate the document against the json-Schema corresponding to the 'modelVersion' attribute.
   * @param {function} onSuccess
   * @param {function} onUnsupportedModelVersionError
   * @param {function} onValidationError
   * @memberOf  WebpackageDocument
   */

  WebpackageDocument.prototype.validate = function (onSuccess, onUnsupportedModelVersionError, onValidationError) {
    if (this._modelVersionExists()) {
      validator.validateDocument(this.document, onSuccess, onUnsupportedModelVersionError,
        onValidationError);
    } else {
      onUnsupportedModelVersionError(new TypeError('Expected a \'modelVersion\' within the document.'));
    }
  };

  /**
   * Set the modelVersion attribute in the webpackage document
   * @param {string} modelVersion the modelVersion of the webpackage
   */
  WebpackageDocument.prototype.setModelVersion = function (modelVersion) {
    this.document.modelVersion = modelVersion;
  };

  /**
   * Generate an Id to be used the Cubbles-Base document-id.
   * @memberOf WebpackageDocument
   * @param {function} onSuccess callback with the generated Id as parameter
   * @param {function} onUnsupportedModelVersionError callback with a TypeError as parameter
   * @param {function} onValidationError callback with an array of validationErrors as paramter
   */
  WebpackageDocument.prototype.generateId = function (onSuccess, onUnsupportedModelVersionError, onValidationError) {
    var id = this.document.groupId + '.' + this.document.name + '@' + this.document.version;
    // if groupId is empty
    while (id.charAt(0) === '.') {
      id = id.substr(1);
    }
    var successFn = function () {
      onSuccess(id);
    };
    this.validate(successFn, onUnsupportedModelVersionError, onValidationError);
  };

  /**
   * check, if the modelVersion attribute exist.
   *
   * @return {boolean} return true, if the modelVersion exists, otherwise return false.
   * @private
   */
  WebpackageDocument.prototype._modelVersionExists = function () {
    if (!this.document || !this.document.modelVersion) {
      return false;
    }
    return true;
  };

  /**
   * Check the given modelVersion if exists.
   * If the given version number have just 2 segments, it will completed with the third segment: '.0'.
   * Return the correct version number or throw ReferenceError if the version number does not exists in the modul.
   * @param {string} version modelVersion to check
   * @return {string} correct modelVersion
   * @private
   */
  WebpackageDocument.prototype._checkSchemaVersion = function (version) {
    var vers = version;
    if (version && version.length > 0 && version.indexOf('.') === -1) {
      vers = version + '.0.0';
    } else if (version && version.length > 0 && version.lastIndexOf('.') === version.indexOf('.')) {
      vers = version + '.0';
    }

    if (!validator.schema[ vers ]) {
      throw new TypeError('modelVersion ' + version + ' is not allowed.');
    }
    return vers;
  };

  /**
   * check parameter, if object or string. If the parameter is a string will be parse as a JSON.
   *
   * @param { object | string} param as Object or JSON-String
   * @returns {object} passed parameter as an object
   * @private
   * @memberOf WebpackageDocument
   */
  WebpackageDocument._handleJsonOrObjectParameter = function (param) {
    var obj;
    if (typeof param === 'string') {
      // JSON
      try {
        obj = JSON.parse(param);
      } catch (error) {
        throw new TypeError('Parameter doc must be a json string ' +
          'which represented a javascript object or an javascript object.');
      }
    } else if (typeof param === 'object') {
      // Object
      obj = param;
    } else {
      throw new TypeError('Parameter doc must be a Json String or an object.');
    }
    return obj;
  };
}());
