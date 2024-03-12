"use strict";

var relationMethodPrefixes = [
  "prototype.__findById__",
  "prototype.__destroyById__",
  "prototype.__updateById__",
  "prototype.__replaceById__",
  "prototype.__exists__",
  "prototype.__link__",
  "prototype.__get__",
  "prototype.__create__",
  "prototype.__update__",
  "prototype.__destroy__",
  "prototype.__unlink__",
  "prototype.__count__",
  "prototype.__delete__"
];

function getAclMethods(model) {
  var acls = model.definition.settings.acls || [];
  let authorizedMethods = [];

  acls.forEach(acl => {
    if (acl.permission === "ALLOW" && acl.property) {
      if (Array.isArray(acl.property)) {
        authorizedMethods = authorizedMethods.concat(acl.property);
      } else if (acl.property !== "*") {
        authorizedMethods.push(acl.property);
      }
    }
  });
  return authorizedMethods;
}

/**
 * Options for disableAllExcept
 * @param model -- The model to operate on
 * @param methodsToExpose -- An array of method names
 */

function disableAllExcept(model, methodsToExpose) {
  var explicitMethods = getAclMethods(model);
  var excludedMethods = methodsToExpose
    ? methodsToExpose.concat(explicitMethods)
    : explicitMethods;
  var hiddenMethods = [];

  if (model && model.sharedClass) {
    model.sharedClass.methods().forEach(disableMethod);
    Object.keys(model.definition.settings.relations).forEach(
      disableRelatedMethods
    );
  }
  function disableRelatedMethods(relation) {
    relationMethodPrefixes.forEach(function(prefix) {
      var methodName = prefix + relation;
      disableMethod({ name: methodName });
    });
  }
  function disableMethod(method) {
    var methodName = method.name;

    if (excludedMethods.indexOf(methodName) == -1) {
      model.disableRemoteMethodByName(methodName, true);
      hiddenMethods.push(methodName);
    }
  }
}

/**
 * Options for methodsToDisable:
 * create, upsert, replaceOrCreate, upsertWithWhere, exists, findById, replaceById,
 * find, findOne, updateAll, deleteById, count, updateAttributes, createChangeStream
 * -- can also specify related method using prefixes listed above
 * and the related model name ex for Account: (prototype.__updateById__followers, prototype.__create__tags)
 * @param model
 * @param methodsToDisable array
 */
function disableOnlyTheseMethods(model, methodsToDisable) {
  methodsToDisable.forEach(function(method) {
    model.disableRemoteMethodByName(method);
  });
}

module.exports = function(model, options) {
  if (model && model.sharedClass) {
    var methodsToExpose = options.expose || [];
    var methodsToHide = options.hide || [];

    if (methodsToExpose.length) {
      disableAllExcept(model, methodsToExpose);
    }
    if (methodsToHide.length) {
      disableOnlyTheseMethods(model, methodsToHide);
    }
  }
};
