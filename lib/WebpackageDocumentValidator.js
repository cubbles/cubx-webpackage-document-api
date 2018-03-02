/**
 * Created by jtrs on 26.02.2015.
 */

'use strict';
(function () {
  var tv4 = require('tv4');
  var _ = require('lodash');

  /**
   * @module WebpackageDocumentValidator
   */
  var WebpackageDocumentValidator = {};
  module.exports = WebpackageDocumentValidator;

  WebpackageDocumentValidator.schema = {
    '8.0.0': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-8.0.0.schema') },
    '8.1.0': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-8.1.0.schema') },
    '8.2.0': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-8.2.0.schema') },
    '8.3.0': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-8.3.0.schema') },
    '8.3.1': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-8.3.1.schema') },
    '9.0.0': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-9.0.0.schema') },
    '9.1.0': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-9.1.0.schema') },
    '9.1.1': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-9.1.1.schema') },
    '9.1.2': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-9.1.2.schema') },
    '10.0.0': { manifestWebpackageSchema: require('./jsonSchema/manifestWebpackage-10.0.0.schema') }
  };

  // function getSchemaUrl (name, version) {
  //  return name + version
  // }

  /**
   * Validate #doc to the schema of manifest.webpackage AND some implemented business rules.
   * @param {object} doc document for validation
   * @param {callback} onSuccess
   * @param {function} onUnsupportedModelVersionError
   * @param {callback} onError
   * @throws TypeError if the doc param not valid for the schema.
   * @memberOf  WebpackageDocumentValidator
   */
  WebpackageDocumentValidator.validateDocument =
    function (doc, onSuccess, onUnsupportedModelVersionError, onError) {
      var schema;
      try {
        schema = WebpackageDocumentValidator._getManifestWebpackageSchema(doc.modelVersion);
      } catch (typeError) {
        onUnsupportedModelVersionError(typeError);
        return;
      }
      var onSchemaValidationSuccess = function () {
        WebpackageDocumentValidator._validateForBusinessRules(doc, onSuccess, onError);
      };
      WebpackageDocumentValidator._validateForSchema(doc, schema, onSchemaValidationSuccess, onError);
    };

  /**
   * get the jsonschema of manifest.webpackage for the given modelVersion
   * @param {string} version modelVersion of the webpackage
   * @return {object} the json schema of manifest.webpackage
   * @memberOf  WebpackageDocumentValidator
   */
  WebpackageDocumentValidator._getManifestWebpackageSchema = function (version) {
    var vers = WebpackageDocumentValidator._checkSchemaVersion(version);
    if (vers) {
      return WebpackageDocumentValidator.schema[ vers ].manifestWebpackageSchema;
    }
    return null;
  };

  /**
   * Check the given modelVersion if exists.
   * If the given versionsnumber have just 2 segment, it will completed with the third segment: '.0'.
   * Give the correct Versionsnumber or throw ReferenceError if the versionnumber not exists in the modul.
   * @param {string} version modelVersion to check
   * @return {string} correct moduleversion
   * @private
   */
  WebpackageDocumentValidator._checkSchemaVersion = function (version) {
    var vers = version;
    if (version && version.length > 0 && version.indexOf('.') === -1) {
      vers = version + '.0.0';
    } else if (version && version.length > 0 && version.lastIndexOf('.') === version.indexOf('.')) {
      vers = version + '.0';
    }

    if (!WebpackageDocumentValidator.schema[ vers ]) {
      throw new TypeError('modelVersion ' + version + ' is unknown or not supported.');
    }
    return vers;
  };

  /**
   * Validate #doc to #schema
   * @param {object} doc document for validation
   * @param {object} schema json schema
   * @param {function} onSuccess
   * @param {function} onError
   * @memberOf  WebpackageDocumentValidator
   * @private
   */
  WebpackageDocumentValidator._validateForSchema = function (doc, schema, onSuccess, onError) {
    if (!doc) {
      onError('Missing document to be validated.');
      return;
    }
    if (!schema) {
      onError('Missing a schema the document should be validated against.');
      return;
    }
    var documentObj = WebpackageDocumentValidator._handleJsonOrObjectParameter(doc);
    var schemaValidationResult = tv4.validateMultiple(documentObj, schema);
    if (schemaValidationResult.errors && schemaValidationResult.errors.length > 0) {
      onError(schemaValidationResult.errors);
      return schemaValidationResult.errors;
    }
    onSuccess();
  };

  /**
   * Validate #doc to some business rules. It assumes, the document is schema-valid.
   * @param {object} doc document for validation
   * @param {function} onSuccess
   * @param {function} onError
   * @memberOf  WebpackageDocumentValidator
   * @private
   */
  WebpackageDocumentValidator._validateForBusinessRules = function (doc, onSuccess, onError) {
    var errors = [];
    // Rule 1: If there is a groupId, it is expected to start with the authors email-domain.
    //   except for @incowia -users, which are allowed to be author of packages of cubx.*-webpackages
    var runPackageGroupIdRule = function () {
      if (doc.groupId.length < 1) {
        return;
      }
      // exception for @incowia -users
      if (doc.author.email.indexOf('@incowia') &&
        (doc.groupId === 'cubx' || doc.groupId.indexOf('cubx.', 0) === 0)) {
        return;
      }
      var authorMailDomainArray = doc.author.email.replace(/.*@/, '').split('.');
      var expectedGroupId = authorMailDomainArray.reverse().join('.');
      if (doc.groupId.indexOf(expectedGroupId, 0) !== 0) {
        errors.push(
          'RuleViolation identified: Non-empty \'groupId\' must start with the (reversed) author ' +
          'email-domain to avoid misuse of groupId\'s: ' +
          '[(groupId) \'' + doc.groupId + '\' != ' + expectedGroupId + ' (reversed author email-domain)].');
      }
    };

    // Rule 2: Check unique artifactId's
    var runUniqueArtifactIdRule = function () {
      var doUniqueArtifactIdsCheck = function (artifactsIds) {
        var duplicateArtifactIds = [];
        artifactsIds.forEach(function (artifactId) {
          var artifactIdUnderTest = artifactId;

          function filterById (id) {
            return id === artifactIdUnderTest;
          }

          var arrayByUniqueArtifactIds = artifactsIds.filter(filterById);
          if (arrayByUniqueArtifactIds.length > 1 && duplicateArtifactIds.indexOf(artifactIdUnderTest) < 0) {
            duplicateArtifactIds.push(artifactIdUnderTest);
          }
        });
        duplicateArtifactIds.forEach(function (artifactId) {
          errors.push(
            'RuleViolation identified: WebPackage contains multiple artifacts with \'artifactId\'=\'' +
            artifactId + '\'');
        });
      };
      //
      var collectArtifactIds = function (next) {
        var artifactsIds = [];
        if (doc.artifacts) {
          Object.keys(doc.artifacts).forEach(function (artifactType) {
            doc.artifacts[ artifactType ].forEach(function (artifact) {
              artifactsIds.push(artifact.artifactId);
            });
          });
        }
        next(artifactsIds);
      };
      collectArtifactIds(doUniqueArtifactIdsCheck);
    };

    // Rule 3: Check compound slot definitions to have unique slot's.
    var runCompoundUniqueSlotIdRule = function () {
      var doUniqueSlotIdsCheck = function (compound) {
        var duplicateSlotIds = [];
        compound.slots.forEach(function (slot) {
          var slotId = slot.slotId;

          function filterBySlotId (slot) {
            return slot.slotId === slotId;
          }

          var arrayByUniqueSlotIds = compound.slots.filter(filterBySlotId);
          if (arrayByUniqueSlotIds.length > 1 && duplicateSlotIds.indexOf(slotId) < 0) {
            duplicateSlotIds.push(slotId);
          }
        });
        duplicateSlotIds.forEach(function (slotId) {
          errors.push('RuleViolation identified: Artifact \'' + compound.artifactId +
            '\' contains multiple slots with \'slotId\'=\'' + slotId + '\'');
        });
      };
      //
      if (doc.artifacts && doc.artifacts.compoundComponents) {
        doc.artifacts.compoundComponents.forEach(function (compound) {
          if (compound.slots) {
            doUniqueSlotIdsCheck(compound);
          }
        });
      }
    };

    // Rule 4: Check compound member definitions to have unique memberId's.
    var runCompoundUniqueMemberIdRule = function () {
      var doUniqueMemberIdsCheck = function (compound) {
        var duplicateMemberIds = [];
        compound.members.forEach(function (member) {
          var memberId = member.memberId;

          function filterByMemberId (member) {
            return member.memberId === memberId;
          }

          var arrayByMemberId = compound.members.filter(filterByMemberId);
          if (arrayByMemberId.length > 1 && duplicateMemberIds.indexOf(memberId) < 0) {
            duplicateMemberIds.push(memberId);
          }
        });
        duplicateMemberIds.forEach(function (memberId) {
          errors.push('RuleViolation identified: Artifact \'' + compound.artifactId +
            '\' contains multiple members with \'memberId\'=\'' + memberId + '\'');
        });
      };
      //
      if (doc.artifacts && doc.artifacts.compoundComponents) {
        doc.artifacts.compoundComponents.forEach(doUniqueMemberIdsCheck);
      }
    };

    // Rule 5: Check compound member definitions to have unique memberId's.
    var runCompoundUniqueConnectionIdRule = function () {
      var doUniqueConnectionIdsCheck = function (compound) {
        var duplicateConnectionIds = [];
        compound.connections.forEach(function (connection) {
          var connectionId = connection.connectionId;

          function filterByConnectionId (connection) {
            return connection.connectionId === connectionId;
          }

          var arrayByConnectionId = compound.connections.filter(filterByConnectionId);
          if (arrayByConnectionId.length > 1 && duplicateConnectionIds.indexOf(connectionId) < 0) {
            duplicateConnectionIds.push(connectionId);
          }
        });
        duplicateConnectionIds.forEach(function (connectionId) {
          errors.push('RuleViolation identified: Artifact \'' + compound.artifactId +
            '\' contains multiple connections with \'connectionId\'=\'' + connectionId + '\'');
        });
      };
      //
      if (doc.artifacts && doc.artifacts.compoundComponents) {
        doc.artifacts.compoundComponents.forEach(doUniqueConnectionIdsCheck);
      }
    };

    // Rule 6: Check elementary slot definitions to have unique slot's.
    var runElementaryUniqueSlotIdRule = function () {
      var doUniqueSlotIdsCheck = function (elementary) {
        var duplicateSlotIds = [];
        elementary.slots.forEach(function (slot) {
          var slotId = slot.slotId;

          function filterBySlotId (slot) {
            return slot.slotId === slotId;
          }

          var arrayByUniqueSlotIds = elementary.slots.filter(filterBySlotId);
          if (arrayByUniqueSlotIds.length > 1 && duplicateSlotIds.indexOf(slotId) < 0) {
            duplicateSlotIds.push(slotId);
          }
        });
        duplicateSlotIds.forEach(function (slotId) {
          errors.push('RuleViolation identified: Artifact \'' + elementary.artifactId +
            '\' contains multiple slots with \'slotId\'=\'' + slotId + '\'');
        });
      };
      //
      if (doc.artifacts && doc.artifacts.elementaryComponents) {
        doc.artifacts.elementaryComponents.forEach(function (elementary) {
          if (elementary.slots) {
            doUniqueSlotIdsCheck(elementary);
          }
        });
      }
    };

    // Rule 7: Check artifact-endpoint-dependencies to be unique.
    var runUniqueDependenciesRule = function () {
      var getConflictingDependencies = function (dependencies) {
        var conflicts = [];
        if (!dependencies) {
          return conflicts;
        }
        // for each dependency, extract and check the qualified artifactId
        dependencies.forEach(function (dependency) {
          function filterByDependencyString (dep) {
            return typeof dependency === 'string' ? dependency === dep : _.isEqual(dependency, dep);
          }

          var arrayOfEqualDependencies = dependencies.filter(
            filterByDependencyString);

          // find dependency in conflicts if dependency is n object
          var findedDep;
          if (typeof dependency === 'object') {
            findedDep = conflicts.find(function (dep) {
              return dep.artifactId === dependency.artifactId && dep.webpackageId === dependency.webpackageId && dep.endpointId === dependency.endpointId;
            });
          }
          if (arrayOfEqualDependencies.length > 1 && conflicts.indexOf(dependency) < 0 && !findedDep) {
            conflicts.push(dependency);
          }
        });
        return conflicts;
      };

      var doUniqueDependenciesCheck = function (artifact) {
        var conflictingDependencies = [];
        if (doc.modelVersion.indexOf('8.') === 0) { // we do have at least one endpoints for each artifact (modelVersion 8.x.x)
          // for each artifacts endpoint, check it's dependencies
          artifact.endpoints.forEach(function (endpoint) {
            conflictingDependencies = endpoint.dependencies ? getConflictingDependencies(endpoint.dependencies) : [];

            conflictingDependencies.forEach(function (dependency) {
              errors.push('RuleViolation identified: Artifact \'' + artifact.artifactId + '\' / endpoint \'' +
                endpoint.endpointId + '\' contains multiple references to dependency \'' + dependency +
                '\'');
            });
          });
        } else { // we don't have endpoints in artifact (modelVersion 9.x.x)
          // for each artifact, check it's dependencies
          conflictingDependencies = artifact.dependencies ? getConflictingDependencies(artifact.dependencies) : [];

          conflictingDependencies.forEach(function (dependency) {
            var dependencyStr = typeof dependency === 'object' ? JSON.stringify(dependency) : dependency;
            errors.push('RuleViolation identified: Artifact \'' + artifact.artifactId +
              '\' contains multiple references to dependency \'' + dependencyStr + '\'');
          });
        }
      };
      //
      var allArtifacts = [];
      // collect artifacts
      if (doc.artifacts) {
        var artifactTypes = Object.keys(doc.artifacts);
        artifactTypes.forEach(function (artifactType) {
          allArtifacts = allArtifacts.concat(doc.artifacts[ artifactType ]);
        });
      }
      // call rule for each artifact
      allArtifacts.forEach(function (artifact) {
        if (artifact.endpoints || artifact.dependencies) {
          doUniqueDependenciesCheck(artifact);
        }
      });
    };

    // Rule 8: Check all members has a dependency.
    var runMembersHasDependencyRule = function () {
      var compoundComponents = doc.artifacts.compoundComponents;
      if (!compoundComponents) {
        return;
      }
      function checkMemberHasDependency (compound) {
        function findDep (dependencies, artifactId) {
          if (!dependencies || !artifactId) {
            return;
          }
          return dependencies.filter(function (dep) {
            return dep.artifactId === artifactId;
          });
        }

        function checkDependencyForMember (member) {
          // for model version 9 and higher no endpoint
          var foundedArray = findDep(compound.dependencies, member.artifactId);
          if (foundedArray && foundedArray.length === 0) {
            errors.push('RuleViolation identified: Member of "' + compound.artifactId + '" with memberId "' + member.memberId +
              '" and artifactId "' + member.artifactId + '" has no corresponding dependency');
          }
        }

        var members = compound.members;
        members.forEach(function (member) {
          checkDependencyForMember(member);
        });
      }

      compoundComponents.forEach(function (compoundComponent) {
        checkMemberHasDependency(compoundComponent);
      });
    };

    // run rule functions
    runPackageGroupIdRule();
    runUniqueArtifactIdRule();
    runCompoundUniqueSlotIdRule();
    runCompoundUniqueMemberIdRule();
    runCompoundUniqueConnectionIdRule();
    runElementaryUniqueSlotIdRule();
    runUniqueDependenciesRule();
    if (this._modelVersionValid('9', doc.modelVersion)) {
      runMembersHasDependencyRule();
    }
    //
    if (errors.length > 0) {
      onError(errors);
    } else {
      onSuccess();
    }
  };
  /**
   * check parameter, if object or string. If the parameter is a string will be parse as a JSON.
   *
   * @param { object | string} param as Object or JSON-String
   * @returns {object} parameter as an object
   * @private
   * @static
   * @memberOf WebpackageDocumentValidator
   */
  WebpackageDocumentValidator._handleJsonOrObjectParameter = function (param) {
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
  WebpackageDocumentValidator._modelVersionValid = function (minVersion, modelVersion) {
    var completeRefVersion = this._getCompleteVersionNumber(minVersion);
    var refNumber = this._changeVersionInNumber(completeRefVersion);
    var completeModelVersion = this._getCompleteVersionNumber(modelVersion);
    var modelNumber = this._changeVersionInNumber(completeModelVersion);
    return refNumber <= modelNumber;
  };
  WebpackageDocumentValidator._getCompleteVersionNumber = function (version) {
    var maxVersComponests = 3;
    var versArray = version.split('.');
    if (versArray.length === 3) {
      return version;
    }
    if (versArray.length > 3) {
      console.error(version + ' is not a valid version number. A version number should be have a format x[.x][.x]');
    }
    var currentLength = versArray.length;
    for (var i = 0; i < (maxVersComponests - currentLength); i++) {
      versArray[ currentLength + i ] = 0;
    }
    return versArray.join('.');
  };
  WebpackageDocumentValidator._changeVersionInNumber = function (version) {
    var ergNumber = 0;
    var error = false;
    var versArray = version.split('.');
    if (versArray.length !== 3) {
      console.error('The \'version\' parameter in the method #_changeVersionInNumber must be have a major, minor and the patch versionnumber. (x.x.x)');
      return -1;
    }
    for (var i = 0; i < versArray.length; i++) {
      if (Number.isNaN(Number(versArray[ i ]))) {
        console.error(version + ' is not a valid versions number. The versions component \'' + versArray[ i ] + '\' is not a number.');
        error = true;
      }
      if (!error) {
        ergNumber += versArray[ i ] * Math.pow(10, versArray.length - i - 1);
      }
    }
    return error ? -1 : ergNumber;
  };
}());
