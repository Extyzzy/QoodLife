function hasAction(permission, action) {
  return (action === '*' && !!permission.length) ||
    !!permission.find(i => i === action);
}

function inPermissions(permissions, {module, action}) {
  switch (module) {
    case '*': {
      for(let module in permissions) {
        if (permissions.hasOwnProperty(module) && (
          ! Array.isArray(permissions[module]) ||
          ! hasAction(permissions[module], action)
        )) {
          return false;
        }
      }

      return !!Object.keys(permissions).length;
    }

    default: {
      if (permissions.hasOwnProperty(module) &&
        Array.isArray(permissions[module])) {
        return hasAction(permissions[module], action);
      }

      return false;
    }
  }
}

/**
 * Check if in the given permissions set we have
 * set required action.
 *
 * `module` & `action` can take `*` as value if
 * you want to check just by one of them.
 *
 * Note! We'll check for all modules to have given
 * action if `module` is `*`, or module to have any
 * actions in it if `action` is `*`.
 *
 * @param {Object} permissions
 * @param {string} module
 * @param {string} action
 * @returns {boolean}
 */
export function actionIsAllowed(permissions, {module, action}) {
  if (permissions instanceof Object && permissions.constructor.name === 'Object') {
    return inPermissions(permissions, {module, action});
  }

  return false;
}

/**
 * Check if in the given permissions set we have
 * set at least one required action.
 * Actions are passed as next parameters after
 * permissions set as {module, action}.
 *
 * `module` & `action` can take `*` as value if
 * you want to check just by one of them.
 *
 * Note! We'll check for all modules to have given
 * action if `module` is `*`, or module to have any
 * actions in it if `action` is `*`.
 *
 * @param {Object} permissions
 * @param {Array} actions
 * @returns {boolean}
 */
export function atLeastOneActionIsAllowed(permissions, ...actions) {
  if (permissions instanceof Object && permissions.constructor.name === 'Object') {
    for(let i in actions) {
      if (inPermissions(permissions, actions[i])) {
        return true;
      }
    }
  }

  return false;
}

export function userIsItemOwner(user, postedLike, owner) {
  const userCanBeOwner = user.roles.find(role => role.id === postedLike.id);

  const userRelativeId = !!userCanBeOwner
    && ((userCanBeOwner.code === 'professional'
    && user.profDetails.id) || (
      userCanBeOwner.code === 'place'
      && user.placeDetails.id
    ) || user.id);

    return userRelativeId === owner.id;
}
