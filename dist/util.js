'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var filter = _interopDefault(require('lodash/filter'));
var pick = _interopDefault(require('lodash/pick'));
var Promise = _interopDefault(require('bluebird'));

var tailor = {
	label: "Exam",
	type: "EXAM"
};

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var resolve = _async(function (exam, resolveStatics) {
  return _await(Promise.map(exam.groups, _async(function (group) {
    return _await(Promise.map(group.intro, resolveStatics), function (_Promise$map2) {
      group.intro = _Promise$map2;
      return _await(Promise.map(group.assessments, resolveStatics), function (_Promise$map3) {
        group.assessments = _Promise$map3;
        return group;
      });
    });
  })), function (_Promise$map) {
    exam.groups = _Promise$map;
    return exam;
  });
});

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

var fetchGroups = _async(function (exam, _ref) {
  var include = _ref.include;
  return _await(exam.getChildren({
    include: include
  }), function (groups) {
    return Object.assign({}, pick(exam, ATTRS), {
      groups: groups.map(function (group) {
        return Object.assign({}, pick(group, ['id', 'uid', 'type', 'position', 'data', 'createdAt']), {
          intro: filter(group.ContentElements, function (it) {
            return it.type !== 'ASSESSMENT';
          }),
          assessments: filter(group.ContentElements, {
            type: 'ASSESSMENT'
          })
        });
      })
    });
  });
});

var ATTRS = ['id', 'uid', 'type', 'position', 'parentId', 'createdAt', 'updatedAt'];

function fetch(parent, childOptions) {
  var opts = {
    where: {
      type: 'EXAM'
    }
  };
  return parent.getChildren(opts).map(function (exam) {
    return fetchGroups(exam, childOptions);
  });
}

var util = Object.assign({}, tailor, {
  fetch: fetch,
  resolve: resolve,
  publishedAs: 'exam'
});

module.exports = util;
