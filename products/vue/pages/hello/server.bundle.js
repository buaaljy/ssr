module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/' ? aPath : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}();

function identity(s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
      return false;
    }

  if (s.charCodeAt(length - 1) !== 95 /* '_' */ || s.charCodeAt(length - 2) !== 95 /* '_' */ || s.charCodeAt(length - 3) !== 111 /* 'o' */ || s.charCodeAt(length - 4) !== 116 /* 't' */ || s.charCodeAt(length - 5) !== 111 /* 'o' */ || s.charCodeAt(length - 6) !== 114 /* 'r' */ || s.charCodeAt(length - 7) !== 112 /* 'p' */ || s.charCodeAt(length - 8) !== 95 /* '_' */ || s.charCodeAt(length - 9) !== 95 /* '_' */) {
      return false;
    }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
        return false;
      }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var current = process.versions && process.versions.node && process.versions.node.split('.') || [];

function specifierIncluded(specifier) {
    var parts = specifier.split(' ');
    var op = parts.length > 1 ? parts[0] : '=';
    var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split('.');

    for (var i = 0; i < 3; ++i) {
        var cur = Number(current[i] || 0);
        var ver = Number(versionParts[i] || 0);
        if (cur === ver) {
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        }
        if (op === '<') {
            return cur < ver;
        } else if (op === '>=') {
            return cur >= ver;
        } else {
            return false;
        }
    }
    return op === '>=';
}

function matchesRange(range) {
    var specifiers = range.split(/ ?&& ?/);
    if (specifiers.length === 0) {
        return false;
    }
    for (var i = 0; i < specifiers.length; ++i) {
        if (!specifierIncluded(specifiers[i])) {
            return false;
        }
    }
    return true;
}

function versionIncluded(specifierValue) {
    if (typeof specifierValue === 'boolean') {
        return specifierValue;
    }
    if (specifierValue && (typeof specifierValue === 'undefined' ? 'undefined' : _typeof(specifierValue)) === 'object') {
        for (var i = 0; i < specifierValue.length; ++i) {
            if (matchesRange(specifierValue[i])) {
                return true;
            }
        }
        return false;
    }
    return matchesRange(specifierValue);
}

var data = __webpack_require__(29);

var core = {};
for (var mod in data) {
    // eslint-disable-line no-restricted-syntax
    if (Object.prototype.hasOwnProperty.call(data, mod)) {
        core[mod] = versionIncluded(data[mod]);
    }
}
module.exports = core;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {"_from":"vue-server-renderer","_id":"vue-server-renderer@2.5.21","_inBundle":false,"_integrity":"sha1-fCthHS6FWDWc24Tc0wgIRcBxIbQ=","_location":"/vue-server-renderer","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"vue-server-renderer","name":"vue-server-renderer","escapedName":"vue-server-renderer","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"http://artifactory.intra.xiaojukeji.com:80/artifactory/api/npm/npm/vue-server-renderer/-/vue-server-renderer-2.5.21.tgz","_shasum":"7c2b611d2e8558359cdb84dcd3080845c07121b4","_spec":"vue-server-renderer","_where":"/Users/didi/workplace/share/ssr","author":{"name":"Evan You"},"bugs":{"url":"https://github.com/vuejs/vue/issues"},"bundleDependencies":false,"dependencies":{"chalk":"^1.1.3","hash-sum":"^1.0.2","he":"^1.1.0","lodash.template":"^4.4.0","lodash.uniq":"^4.5.0","resolve":"^1.2.0","serialize-javascript":"^1.3.0","source-map":"0.5.6"},"deprecated":false,"description":"server renderer for Vue 2.0","devDependencies":{"vue":"file:../.."},"homepage":"https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer#readme","keywords":["vue","server","ssr"],"license":"MIT","main":"index.js","name":"vue-server-renderer","repository":{"type":"git","url":"git+https://github.com/vuejs/vue.git"},"types":"types/index.d.ts","version":"2.5.21"}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to match template delimiters. */
var reInterpolate = /<%=([\s\S]+?)%>/g;

module.exports = reInterpolate;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function () {
    // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    var origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    var stack = new Error().stack;
    Error.prepareStackTrace = origPrepareStackTrace;
    return stack[2].getFileName();
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(0);
var parse = path.parse || __webpack_require__(31);

var getNodeModulesDirs = function getNodeModulesDirs(absoluteStart, modules) {
    var prefix = '/';
    if (/^([A-Za-z]:)/.test(absoluteStart)) {
        prefix = '';
    } else if (/^\\\\/.test(absoluteStart)) {
        prefix = '\\\\';
    }

    var paths = [absoluteStart];
    var parsed = parse(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = parse(parsed.dir);
    }

    return paths.reduce(function (dirs, aPath) {
        return dirs.concat(modules.map(function (moduleDir) {
            return path.join(prefix, aPath, moduleDir);
        }));
    }, []);
};

module.exports = function nodeModulesPaths(start, opts, request) {
    var modules = opts && opts.moduleDirectory ? [].concat(opts.moduleDirectory) : ['node_modules'];

    if (opts && typeof opts.paths === 'function') {
        return opts.paths(request, start, function () {
            return getNodeModulesDirs(start, modules);
        }, opts);
    }

    var dirs = getNodeModulesDirs(start, modules);
    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (x, opts) {
  /**
   * This file is purposefully a passthrough. It's expected that third-party
   * environments will override it at runtime in order to inject special logic
   * into `resolve` (by manipulating the options). One such example is the PnP
   * code path in Yarn.
   */

  return opts || {};
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 12;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(14);
var util = __webpack_require__(1);
var ArraySet = __webpack_require__(15).ArraySet;
var MappingList = __webpack_require__(36).MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
  var sourceRoot = aSourceMapConsumer.sourceRoot;
  var generator = new SourceMapGenerator({
    file: aSourceMapConsumer.file,
    sourceRoot: sourceRoot
  });
  aSourceMapConsumer.eachMapping(function (mapping) {
    var newMapping = {
      generated: {
        line: mapping.generatedLine,
        column: mapping.generatedColumn
      }
    };

    if (mapping.source != null) {
      newMapping.source = mapping.source;
      if (sourceRoot != null) {
        newMapping.source = util.relative(sourceRoot, newMapping.source);
      }

      newMapping.original = {
        line: mapping.originalLine,
        column: mapping.originalColumn
      };

      if (mapping.name != null) {
        newMapping.name = mapping.name;
      }
    }

    generator.addMapping(newMapping);
  });
  aSourceMapConsumer.sources.forEach(function (sourceFile) {
    var content = aSourceMapConsumer.sourceContentFor(sourceFile);
    if (content != null) {
      generator.setSourceContent(sourceFile, content);
    }
  });
  return generator;
};

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
  var generated = util.getArg(aArgs, 'generated');
  var original = util.getArg(aArgs, 'original', null);
  var source = util.getArg(aArgs, 'source', null);
  var name = util.getArg(aArgs, 'name', null);

  if (!this._skipValidation) {
    this._validateMapping(generated, original, source, name);
  }

  if (source != null) {
    source = String(source);
    if (!this._sources.has(source)) {
      this._sources.add(source);
    }
  }

  if (name != null) {
    name = String(name);
    if (!this._names.has(name)) {
      this._names.add(name);
    }
  }

  this._mappings.add({
    generatedLine: generated.line,
    generatedColumn: generated.column,
    originalLine: original != null && original.line,
    originalColumn: original != null && original.column,
    source: source,
    name: name
  });
};

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
  var source = aSourceFile;
  if (this._sourceRoot != null) {
    source = util.relative(this._sourceRoot, source);
  }

  if (aSourceContent != null) {
    // Add the source content to the _sourcesContents map.
    // Create a new _sourcesContents map if the property is null.
    if (!this._sourcesContents) {
      this._sourcesContents = Object.create(null);
    }
    this._sourcesContents[util.toSetString(source)] = aSourceContent;
  } else if (this._sourcesContents) {
    // Remove the source file from the _sourcesContents map.
    // If the _sourcesContents map is empty, set the property to null.
    delete this._sourcesContents[util.toSetString(source)];
    if (Object.keys(this._sourcesContents).length === 0) {
      this._sourcesContents = null;
    }
  }
};

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
  var sourceFile = aSourceFile;
  // If aSourceFile is omitted, we will use the file property of the SourceMap
  if (aSourceFile == null) {
    if (aSourceMapConsumer.file == null) {
      throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' + 'or the source map\'s "file" property. Both were omitted.');
    }
    sourceFile = aSourceMapConsumer.file;
  }
  var sourceRoot = this._sourceRoot;
  // Make "sourceFile" relative if an absolute Url is passed.
  if (sourceRoot != null) {
    sourceFile = util.relative(sourceRoot, sourceFile);
  }
  // Applying the SourceMap can add and remove items from the sources and
  // the names array.
  var newSources = new ArraySet();
  var newNames = new ArraySet();

  // Find mappings for the "sourceFile"
  this._mappings.unsortedForEach(function (mapping) {
    if (mapping.source === sourceFile && mapping.originalLine != null) {
      // Check if it can be mapped by the source map, then update the mapping.
      var original = aSourceMapConsumer.originalPositionFor({
        line: mapping.originalLine,
        column: mapping.originalColumn
      });
      if (original.source != null) {
        // Copy mapping
        mapping.source = original.source;
        if (aSourceMapPath != null) {
          mapping.source = util.join(aSourceMapPath, mapping.source);
        }
        if (sourceRoot != null) {
          mapping.source = util.relative(sourceRoot, mapping.source);
        }
        mapping.originalLine = original.line;
        mapping.originalColumn = original.column;
        if (original.name != null) {
          mapping.name = original.name;
        }
      }
    }

    var source = mapping.source;
    if (source != null && !newSources.has(source)) {
      newSources.add(source);
    }

    var name = mapping.name;
    if (name != null && !newNames.has(name)) {
      newNames.add(name);
    }
  }, this);
  this._sources = newSources;
  this._names = newNames;

  // Copy sourcesContents of applied map.
  aSourceMapConsumer.sources.forEach(function (sourceFile) {
    var content = aSourceMapConsumer.sourceContentFor(sourceFile);
    if (content != null) {
      if (aSourceMapPath != null) {
        sourceFile = util.join(aSourceMapPath, sourceFile);
      }
      if (sourceRoot != null) {
        sourceFile = util.relative(sourceRoot, sourceFile);
      }
      this.setSourceContent(sourceFile, content);
    }
  }, this);
};

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
  if (aGenerated && 'line' in aGenerated && 'column' in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
    // Case 1.
    return;
  } else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated && aOriginal && 'line' in aOriginal && 'column' in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
    // Cases 2 and 3.
    return;
  } else {
    throw new Error('Invalid mapping: ' + JSON.stringify({
      generated: aGenerated,
      source: aSource,
      original: aOriginal,
      name: aName
    }));
  }
};

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
  var previousGeneratedColumn = 0;
  var previousGeneratedLine = 1;
  var previousOriginalColumn = 0;
  var previousOriginalLine = 0;
  var previousName = 0;
  var previousSource = 0;
  var result = '';
  var next;
  var mapping;
  var nameIdx;
  var sourceIdx;

  var mappings = this._mappings.toArray();
  for (var i = 0, len = mappings.length; i < len; i++) {
    mapping = mappings[i];
    next = '';

    if (mapping.generatedLine !== previousGeneratedLine) {
      previousGeneratedColumn = 0;
      while (mapping.generatedLine !== previousGeneratedLine) {
        next += ';';
        previousGeneratedLine++;
      }
    } else {
      if (i > 0) {
        if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
          continue;
        }
        next += ',';
      }
    }

    next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
    previousGeneratedColumn = mapping.generatedColumn;

    if (mapping.source != null) {
      sourceIdx = this._sources.indexOf(mapping.source);
      next += base64VLQ.encode(sourceIdx - previousSource);
      previousSource = sourceIdx;

      // lines are stored 0-based in SourceMap spec version 3
      next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
      previousOriginalLine = mapping.originalLine - 1;

      next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
      previousOriginalColumn = mapping.originalColumn;

      if (mapping.name != null) {
        nameIdx = this._names.indexOf(mapping.name);
        next += base64VLQ.encode(nameIdx - previousName);
        previousName = nameIdx;
      }
    }

    result += next;
  }

  return result;
};

SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
  return aSources.map(function (source) {
    if (!this._sourcesContents) {
      return null;
    }
    if (aSourceRoot != null) {
      source = util.relative(aSourceRoot, source);
    }
    var key = util.toSetString(source);
    return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
  }, this);
};

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
  var map = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings()
  };
  if (this._file != null) {
    map.file = this._file;
  }
  if (this._sourceRoot != null) {
    map.sourceRoot = this._sourceRoot;
  }
  if (this._sourcesContents) {
    map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
  }

  return map;
};

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
  return JSON.stringify(this.toJSON());
};

exports.SourceMapGenerator = SourceMapGenerator;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(35);

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative ? -shifted : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(1);
var has = Object.prototype.hasOwnProperty;

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = util.toSetString(aStr);
  var isDuplicate = has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    this._set[sStr] = idx;
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  var sStr = util.toSetString(aStr);
  return has.call(this._set, sStr);
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  var sStr = util.toSetString(aStr);
  if (has.call(this._set, sStr)) {
    return this._set[sStr];
  }
  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var has = Object.prototype.hasOwnProperty;

var hexTable = function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}();

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
            if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && _typeof(target[i]) === 'object') {
                    target[i] = merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function decode(str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (c === 0x2D // -
        || c === 0x2E // .
        || c === 0x5F // _
        || c === 0x7E // ~
        || c >= 0x30 && c <= 0x39 // 0-9
        || c >= 0x41 && c <= 0x5A // a-z
        || c >= 0x61 && c <= 0x7A // A-Z
        ) {
                out += string.charAt(i);
                continue;
            }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F]);
            continue;
        }

        i += 1;
        c = 0x10000 + ((c & 0x3FF) << 10 | string.charCodeAt(i) & 0x3FF);
        out += hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function RFC1738(value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function RFC3986(value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return testModule; });
var domain = '';

var testModule = {
  getUser: {
    domain: domain,
    method: 'get',
    url: '/test/getUser',
    params: {}
  }
};

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prefetch", function() { return prefetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service__ = __webpack_require__(18);
var Vue = __webpack_require__(5);
var renderer = __webpack_require__(20).createRenderer();




var prefetch = function prefetch() {
  return [__WEBPACK_IMPORTED_MODULE_1__service__["a" /* testModule */].getUser];
};

var render = function render(serverSideData) {
  __WEBPACK_IMPORTED_MODULE_0__app_vue___default.a.el = '#root';
  var serverApp = new Vue(__WEBPACK_IMPORTED_MODULE_0__app_vue___default.a);
  return renderer.renderToString(__WEBPACK_IMPORTED_MODULE_0__app_vue___default.a);
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

try {
  var vueVersion = __webpack_require__(5).version;
} catch (e) {}

var packageName = __webpack_require__(6).name;
var packageVersion = __webpack_require__(6).version;
if (vueVersion && vueVersion !== packageVersion) {
  throw new Error('\n\nVue packages version mismatch:\n\n' + '- vue@' + vueVersion + '\n' + '- ' + packageName + '@' + packageVersion + '\n\n' + 'This may cause things to work incorrectly. Make sure to use the same version for both.\n');
}

module.exports = __webpack_require__(21);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

console.log('vue render');

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault(ex) {
  return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
}

var he = _interopDefault(__webpack_require__(22));

/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef(v) {
  return v === undefined || v === null;
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isTrue(v) {
  return v === true;
}

function isFalse(v) {
  return v === false;
}

/**
 * Check if value is primitive.
 */
function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number' ||
  // $flow-disable-line
  (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol' || typeof value === 'boolean';
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString(val) {
  return val == null ? '' : (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? JSON.stringify(val, null, 2) : String(val);
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber(val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n;
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

var bind = Function.prototype.bind ? nativeBind : polyfillBind;

/**
 * Mix properties into target object.
 */
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop(a, b, c) {}

/**
 * Always return false.
 */
var no = function no(a, b, c) {
  return false;
};

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function identity(_) {
  return _;
};

/**
 * Generate a string containing static keys from compiler modules.
 */
function genStaticKeys(modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || []);
  }, []).join(',');
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual(a, b) {
  if (a === b) {
    return true;
  }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]);
        });
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]);
        });
      } else {
        /* istanbul ignore next */
        return false;
      }
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }
  return -1;
}

/**
 * Ensure a function is called only once.
 */
function once(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

/*  */

var isAttr = makeMap('accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' + 'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' + 'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' + 'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' + 'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' + 'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,' + 'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' + 'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' + 'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' + 'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' + 'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' + 'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' + 'target,title,type,usemap,value,width,wrap');

var unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/; // eslint-disable-line no-control-regex
var isSSRUnsafeAttr = function isSSRUnsafeAttr(name) {
  return unsafeAttrCharRE.test(name);
};

/* istanbul ignore next */
var isRenderableAttr = function isRenderableAttr(name) {
  return isAttr(name) || name.indexOf('data-') === 0 || name.indexOf('aria-') === 0;
};

var propsToAttrMap = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
};

var ESC = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '&': '&amp;'
};

function escape(s) {
  return s.replace(/[<>"&]/g, escapeChar);
}

function escapeChar(a) {
  return ESC[a] || a;
}

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function mustUseProp(tag, type, attr) {
  return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');

var isFalsyAttrValue = function isFalsyAttrValue(val) {
  return val == null || val === false;
};

/*  */

function renderAttrs(node) {
  var attrs = node.data.attrs;
  var res = '';

  var opts = node.parent && node.parent.componentOptions;
  if (isUndef(opts) || opts.Ctor.options.inheritAttrs !== false) {
    var parent = node.parent;
    while (isDef(parent)) {
      if (isDef(parent.data) && isDef(parent.data.attrs)) {
        attrs = extend(extend({}, attrs), parent.data.attrs);
      }
      parent = parent.parent;
    }
  }

  if (isUndef(attrs)) {
    return res;
  }

  for (var key in attrs) {
    if (isSSRUnsafeAttr(key)) {
      continue;
    }
    if (key === 'style') {
      // leave it to the style module
      continue;
    }
    res += renderAttr(key, attrs[key]);
  }
  return res;
}

function renderAttr(key, value) {
  if (isBooleanAttr(key)) {
    if (!isFalsyAttrValue(value)) {
      return " " + key + "=\"" + key + "\"";
    }
  } else if (isEnumeratedAttr(key)) {
    return " " + key + "=\"" + (isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true') + "\"";
  } else if (!isFalsyAttrValue(value)) {
    return " " + key + "=\"" + escape(String(value)) + "\"";
  }
  return '';
}

/*  */

var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance;
};

Object.defineProperties(VNode.prototype, prototypeAccessors);

var createEmptyVNode = function createEmptyVNode(text) {
  if (text === void 0) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode(vnode) {
  var cloned = new VNode(vnode.tag, vnode.data,
  // #7975
  // clone children array to avoid mutating original in case of cloning
  // a child.
  vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned;
}

/*  */

function renderDOMProps(node) {
  var props = node.data.domProps;
  var res = '';

  var parent = node.parent;
  while (isDef(parent)) {
    if (parent.data && parent.data.domProps) {
      props = extend(extend({}, props), parent.data.domProps);
    }
    parent = parent.parent;
  }

  if (isUndef(props)) {
    return res;
  }

  var attrs = node.data.attrs;
  for (var key in props) {
    if (key === 'innerHTML') {
      setText(node, props[key], true);
    } else if (key === 'textContent') {
      setText(node, props[key], false);
    } else if (key === 'value' && node.tag === 'textarea') {
      setText(node, props[key], false);
    } else {
      // $flow-disable-line (WTF?)
      var attr = propsToAttrMap[key] || key.toLowerCase();
      if (isRenderableAttr(attr) &&
      // avoid rendering double-bound props/attrs twice
      !(isDef(attrs) && isDef(attrs[attr]))) {
        res += renderAttr(attr, props[key]);
      }
    }
  }
  return res;
}

function setText(node, text, raw) {
  var child = new VNode(undefined, undefined, undefined, text);
  child.raw = raw;
  node.children = [child];
}

/*  */

/**
 * Define a property.
 */
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0 || weexPlatform === 'android';
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = {}.watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', {
      get: function get() {}
    }); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function isServerRendering() {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer;
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/function () {
    function Set() {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has(key) {
      return this.set[key] === true;
    };
    Set.prototype.add = function add(key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear() {
      this.set = Object.create(null);
    };

    return Set;
  }();
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = ['component', 'directive', 'filter'];

var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured'];

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "production" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "production" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
};

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = noop; // work around flow check
var formatComponentName = noop;

if (false) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function classify(str) {
    return str.replace(classifyRE, function (c) {
      return c.toUpperCase();
    }).replace(/[-_]/g, '');
  };

  warn = function warn(msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (hasConsole && !config.silent) {
      console.error("[Vue warn]: " + msg + trace);
    }
  };

  tip = function tip(msg, vm) {
    if (hasConsole && !config.silent) {
      console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
    }
  };

  formatComponentName = function formatComponentName(vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>';
    }
    var options = typeof vm === 'function' && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
  };

  var repeat = function repeat(str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) {
        res += str;
      }
      if (n > 1) {
        str += str;
      }
      n >>= 1;
    }
    return res;
  };

  generateComponentTrace = function generateComponentTrace(vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue;
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree.map(function (vm, i) {
        return "" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
      }).join('\n');
    } else {
      return "\n\n(found in " + formatComponentName(vm) + ")";
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep() {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (false) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) {
      return a.id - b.id;
    });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    var args = [],
        len = arguments.length;
    while (len--) {
      args[len] = arguments[len];
    }var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    // notify change
    ob.dep.notify();
    return result;
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving(value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1(obj, key, val, customSetter, shallow) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (false) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set(target, key, val) {
  if (false) {
    warn("Cannot set reactive property on undefined, null, or primitive value: " + target);
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  var ob = target.__ob__;
  if (target._isVue || ob && ob.vmCount) {
    "production" !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val;
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray(value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (false) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
    }
    return defaultStrat(parent, child);
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData(to, from) {
  if (!from) {
    return to;
  }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (toVal !== fromVal && isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to;
}

/**
 * Data
 */
function mergeDataOrFn(parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }
    if (!parentVal) {
      return childVal;
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn() {
      return mergeData(typeof childVal === 'function' ? childVal.call(this, this) : childVal, typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal);
    };
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "production" !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);

      return parentVal;
    }
    return mergeDataOrFn(parentVal, childVal);
  }

  return mergeDataOrFn(parentVal, childVal, vm);
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook(parentVal, childVal) {
  return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets(parentVal, childVal, vm, key) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "production" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal);
  } else {
    return res;
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal, vm, key) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) {
    parentVal = undefined;
  }
  if (childVal === nativeWatch) {
    childVal = undefined;
  }
  /* istanbul ignore if */
  if (!childVal) {
    return Object.create(parentVal || null);
  }
  if (false) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) {
    return childVal;
  }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child];
  }
  return ret;
};

/**
 * Other object hashes.
 */
strats.props = strats.methods = strats.inject = strats.computed = function (parentVal, childVal, vm, key) {
  if (childVal && "production" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) {
    return childVal;
  }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) {
    extend(ret, childVal);
  }
  return ret;
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function defaultStrat(parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};

/**
 * Validate component names
 */
function checkComponents(options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName(name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characters and the hyphen, ' + 'and must start with a letter.');
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + name);
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps(options, vm) {
  var props = options.props;
  if (!props) {
    return;
  }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (false) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  } else if (false) {
    warn("Invalid value for option \"props\": expected an Array or an Object, " + "but got " + toRawType(props) + ".", vm);
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject(options, vm) {
  var inject = options.inject;
  if (!inject) {
    return;
  }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val) ? extend({ from: key }, val) : { from: val };
    }
  } else if (false) {
    warn("Invalid value for option \"inject\": expected an Array or an Object, " + "but got " + toRawType(inject) + ".", vm);
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives(options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType(name, value, vm) {
  if (!isPlainObject(value)) {
    warn("Invalid value for option \"" + name + "\": expected an Object, " + "but got " + toRawType(value) + ".", vm);
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions(parent, child, vm) {
  if (false) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options;
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) {
    return assets[id];
  }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) {
    return assets[camelizedId];
  }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) {
    return assets[PascalCaseId];
  }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (false) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }
  return res;
}

/*  */

function validateProp(key, propOptions, propsData, vm) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (false) {
    assertProp(prop, key, value, vm, absent);
  }
  return value;
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined;
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (false) {
    warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
    return vm._props[key];
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
}

/**
 * Assert whether a prop is valid.
 */
function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }
  if (value == null && !prop.required) {
    return;
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
    return;
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType(value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  };
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

function isSameType(a, b) {
  return getType(a) === getType(b);
}

function getTypeIndex(type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i;
    }
  }
  return -1;
}

function getInvalidTypeMessage(name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." + " Expected " + expectedTypes.map(capitalize).join(', ');
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message;
}

function styleValue(value, type) {
  if (type === 'String') {
    return "\"" + value + "\"";
  } else if (type === 'Number') {
    return "" + Number(value);
  } else {
    return "" + value;
  }
}

function isExplicable(value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) {
    return value.toLowerCase() === elem;
  });
}

function isBoolean() {
  var args = [],
      len = arguments.length;
  while (len--) {
    args[len] = arguments[len];
  }return args.some(function (elem) {
    return elem.toLowerCase() === 'boolean';
  });
}

/*  */

function handleError(err, vm, info) {
  if (vm) {
    var cur = vm;
    while (cur = cur.$parent) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) {
              return;
            }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError(err, vm, info) {
  logError(err, vm, info);
}

function logError(err, vm, info) {
  if (false) {
    warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err;
  }
}

/*  */

var callbacks = [];

function flushCallbacks() {
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) ;else if (typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) ||
// PhantomJS
MessageChannel.toString() === '[object MessageChannelConstructor]')) {
  var channel = new MessageChannel();
  channel.port1.onmessage = flushCallbacks;
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) ;

/*  */

/*  */

function genClassForVnode(vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class);
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  };
}

function renderClass(staticClass, dynamicClass) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  /* istanbul ignore next */
  return '';
}

function concat(a, b) {
  return a ? b ? a + ' ' + b : a : b || '';
}

function stringifyClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }
  if (isObject(value)) {
    return stringifyObject(value);
  }
  if (typeof value === 'string') {
    return value;
  }
  /* istanbul ignore next */
  return '';
}

function stringifyArray(value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) {
        res += ' ';
      }
      res += stringified;
    }
  }
  return res;
}

function stringifyObject(value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) {
        res += ' ';
      }
      res += key;
    }
  }
  return res;
}

/*  */

var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

var isPreTag = function isPreTag(tag) {
  return tag === 'pre';
};

var isReservedTag = function isReservedTag(tag) {
  return isHTMLTag(tag) || isSVG(tag);
};

function getTagNamespace(tag) {
  if (isSVG(tag)) {
    return 'svg';
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math';
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/*  */

function renderClass$1(node) {
  var classList = genClassForVnode(node);
  if (classList !== '') {
    return " class=\"" + escape(classList) + "\"";
  }
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData(data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle ? extend(data.staticStyle, style) : style;
}

// normalize possible array / string values into Object
function normalizeStyleBinding(bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle);
  }
  return bindingStyle;
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle(vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if (styleData = normalizeStyleData(vnode.data)) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while (parentNode = parentNode.parent) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res;
}

/*  */

function genStyle(style) {
  var styleText = '';
  for (var key in style) {
    var value = style[key];
    var hyphenatedKey = hyphenate(key);
    if (Array.isArray(value)) {
      for (var i = 0, len = value.length; i < len; i++) {
        styleText += hyphenatedKey + ":" + value[i] + ";";
      }
    } else {
      styleText += hyphenatedKey + ":" + value + ";";
    }
  }
  return styleText;
}

function renderStyle(vnode) {
  var styleText = genStyle(getStyle(vnode, false));
  if (styleText !== '') {
    return " style=" + JSON.stringify(escape(styleText));
  }
}

var modules = [renderAttrs, renderDOMProps, renderClass$1, renderStyle];

/*  */

function show(node, dir) {
  if (!dir.value) {
    var style = node.data.style || (node.data.style = {});
    if (Array.isArray(style)) {
      style.push({ display: 'none' });
    } else {
      style.display = 'none';
    }
  }
}

/*  */

// this is only applied for <select v-model> because it is the only edge case
// that must be done at runtime instead of compile time.
function model(node, dir) {
  if (!node.children) {
    return;
  }
  var value = dir.value;
  var isMultiple = node.data.attrs && node.data.attrs.multiple;
  for (var i = 0, l = node.children.length; i < l; i++) {
    var option = node.children[i];
    if (option.tag === 'option') {
      if (isMultiple) {
        var selected = Array.isArray(value) && looseIndexOf(value, getValue(option)) > -1;
        if (selected) {
          setSelected(option);
        }
      } else {
        if (looseEqual(value, getValue(option))) {
          setSelected(option);
          return;
        }
      }
    }
  }
}

function getValue(option) {
  var data = option.data || {};
  return data.attrs && data.attrs.value || data.domProps && data.domProps.value || option.children && option.children[0] && option.children[0].text;
}

function setSelected(option) {
  var data = option.data || (option.data = {});
  var attrs = data.attrs || (data.attrs = {});
  attrs.selected = '';
}

var baseDirectives = {
  show: show,
  model: model
};

/*  */

var isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');

/*  */

var MAX_STACK_DEPTH = 900;
var noop$1 = function noop$1(_) {
  return _;
};

var defer = typeof process !== 'undefined' && process.nextTick ? process.nextTick : typeof Promise !== 'undefined' ? function (fn) {
  return Promise.resolve().then(fn);
} : typeof setTimeout !== 'undefined' ? setTimeout : noop$1;

if (defer === noop$1) {
  throw new Error('Your JavaScript runtime does not support any asynchronous primitives ' + 'that are required by vue-server-renderer. Please use a polyfill for ' + 'either Promise or setTimeout.');
}

function createWriteFunction(write, onError) {
  var stackDepth = 0;
  var cachedWrite = function cachedWrite(text, next) {
    if (text && cachedWrite.caching) {
      cachedWrite.cacheBuffer[cachedWrite.cacheBuffer.length - 1] += text;
    }
    var waitForNext = write(text, next);
    if (waitForNext !== true) {
      if (stackDepth >= MAX_STACK_DEPTH) {
        defer(function () {
          try {
            next();
          } catch (e) {
            onError(e);
          }
        });
      } else {
        stackDepth++;
        next();
        stackDepth--;
      }
    }
  };
  cachedWrite.caching = false;
  cachedWrite.cacheBuffer = [];
  cachedWrite.componentBuffer = [];
  return cachedWrite;
}

/*  */

/**
 * Original RenderStream implementation by Sasha Aickin (@aickin)
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Modified by Evan You (@yyx990803)
 */

var stream = __webpack_require__(2);

var RenderStream = /*@__PURE__*/function (superclass) {
  function RenderStream(render) {
    var this$1 = this;

    superclass.call(this);
    this.buffer = '';
    this.render = render;
    this.expectedSize = 0;

    this.write = createWriteFunction(function (text, next) {
      var n = this$1.expectedSize;
      this$1.buffer += text;
      if (this$1.buffer.length >= n) {
        this$1.next = next;
        this$1.pushBySize(n);
        return true; // we will decide when to call next
      }
      return false;
    }, function (err) {
      this$1.emit('error', err);
    });

    this.end = function () {
      // the rendering is finished; we should push out the last of the buffer.
      this$1.done = true;
      this$1.push(this$1.buffer);
    };
  }

  if (superclass) RenderStream.__proto__ = superclass;
  RenderStream.prototype = Object.create(superclass && superclass.prototype);
  RenderStream.prototype.constructor = RenderStream;

  RenderStream.prototype.pushBySize = function pushBySize(n) {
    var bufferToPush = this.buffer.substring(0, n);
    this.buffer = this.buffer.substring(n);
    this.push(bufferToPush);
  };

  RenderStream.prototype.tryRender = function tryRender() {
    try {
      this.render(this.write, this.end);
    } catch (e) {
      this.emit('error', e);
    }
  };

  RenderStream.prototype.tryNext = function tryNext() {
    try {
      this.next();
    } catch (e) {
      this.emit('error', e);
    }
  };

  RenderStream.prototype._read = function _read(n) {
    this.expectedSize = n;
    // it's possible that the last chunk added bumped the buffer up to > 2 * n,
    // which means we will need to go through multiple read calls to drain it
    // down to < n.
    if (isTrue(this.done)) {
      this.push(null);
      return;
    }
    if (this.buffer.length >= n) {
      this.pushBySize(n);
      return;
    }
    if (isUndef(this.next)) {
      // start the rendering chain.
      this.tryRender();
    } else {
      // continue with the rendering.
      this.tryNext();
    }
  };

  return RenderStream;
}(stream.Readable);

/*  */

var RenderContext = function RenderContext(options) {
  this.userContext = options.userContext;
  this.activeInstance = options.activeInstance;
  this.renderStates = [];

  this.write = options.write;
  this.done = options.done;
  this.renderNode = options.renderNode;

  this.isUnaryTag = options.isUnaryTag;
  this.modules = options.modules;
  this.directives = options.directives;

  var cache = options.cache;
  if (cache && (!cache.get || !cache.set)) {
    throw new Error('renderer cache must implement at least get & set.');
  }
  this.cache = cache;
  this.get = cache && normalizeAsync(cache, 'get');
  this.has = cache && normalizeAsync(cache, 'has');

  this.next = this.next.bind(this);
};

RenderContext.prototype.next = function next() {
  // eslint-disable-next-line
  while (true) {
    var lastState = this.renderStates[this.renderStates.length - 1];
    if (isUndef(lastState)) {
      return this.done();
    }
    /* eslint-disable no-case-declarations */
    switch (lastState.type) {
      case 'Element':
      case 'Fragment':
        var children = lastState.children;
        var total = lastState.total;
        var rendered = lastState.rendered++;
        if (rendered < total) {
          return this.renderNode(children[rendered], false, this);
        } else {
          this.renderStates.pop();
          if (lastState.type === 'Element') {
            return this.write(lastState.endTag, this.next);
          }
        }
        break;
      case 'Component':
        this.renderStates.pop();
        this.activeInstance = lastState.prevActive;
        break;
      case 'ComponentWithCache':
        this.renderStates.pop();
        var buffer = lastState.buffer;
        var bufferIndex = lastState.bufferIndex;
        var componentBuffer = lastState.componentBuffer;
        var key = lastState.key;
        var result = {
          html: buffer[bufferIndex],
          components: componentBuffer[bufferIndex]
        };
        this.cache.set(key, result);
        if (bufferIndex === 0) {
          // this is a top-level cached component,
          // exit caching mode.
          this.write.caching = false;
        } else {
          // parent component is also being cached,
          // merge self into parent's result
          buffer[bufferIndex - 1] += result.html;
          var prev = componentBuffer[bufferIndex - 1];
          result.components.forEach(function (c) {
            return prev.add(c);
          });
        }
        buffer.length = bufferIndex;
        componentBuffer.length = bufferIndex;
        break;
    }
  }
};

function normalizeAsync(cache, method) {
  var fn = cache[method];
  if (isUndef(fn)) {
    return;
  } else if (fn.length > 1) {
    return function (key, cb) {
      return fn.call(cache, key, cb);
    };
  } else {
    return function (key, cb) {
      return cb(fn.call(cache, key));
    };
  }
}

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters(exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) {
        inSingle = false;
      }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) {
        inDouble = false;
      }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) {
        inTemplateString = false;
      }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) {
        inRegex = false;
      }
    } else if (c === 0x7C && // pipe
    exp.charCodeAt(i + 1) !== 0x7C && exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22:
          inDouble = true;break; // "
        case 0x27:
          inSingle = true;break; // '
        case 0x60:
          inTemplateString = true;break; // `
        case 0x28:
          paren++;break; // (
        case 0x29:
          paren--;break; // )
        case 0x5B:
          square++;break; // [
        case 0x5D:
          square--;break; // ]
        case 0x7B:
          curly++;break; // {
        case 0x7D:
          curly--;break; // }
      }
      if (c === 0x2f) {
        // /
        var j = i - 1;
        var p = void 0;
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') {
            break;
          }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter() {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression;
}

function wrapFilter(exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return "_f(\"" + filter + "\")(" + exp + ")";
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return "_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args);
  }
}

/*  */

var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
});

function parseText(text, delimiters) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return;
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while (match = tagRE.exec(text)) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push("_s(" + exp + ")");
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  };
}

/*  */

function baseWarn(msg) {
  console.error("[Vue compiler]: " + msg);
}

function pluckModuleFunction(modules, key) {
  return modules ? modules.map(function (m) {
    return m[key];
  }).filter(function (_) {
    return _;
  }) : [];
}

function addProp(el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
  el.plain = false;
}

function addAttr(el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr(el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

function addDirective(el, name, rawName, value, arg, modifiers) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  el.plain = false;
}

function addHandler(el, name, value, modifiers, important, warn) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (false) {
    warn('passive and prevent can\'t be used together. ' + 'Passive handler can\'t prevent default event.');
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = {
    value: value.trim()
  };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getBindingAttr(el, name, getStatic) {
  var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue);
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue);
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr(el, name, removeFromMap) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break;
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val;
}

/*  */

function transformNode(el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if (false) {
    var res = parseText(staticClass, options.delimiters);
    if (res) {
      warn("class=\"" + staticClass + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div class="{{ val }}">, use <div :class="val">.');
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData(el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + el.staticClass + ",";
  }
  if (el.classBinding) {
    data += "class:" + el.classBinding + ",";
  }
  return data;
}

var klass = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1(el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (false) {
      var res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn("style=\"" + staticStyle + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div style="{{ val }}">, use <div :style="val">.');
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1(el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + el.staticStyle + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + el.styleBinding + "),";
  }
  return data;
}

var style = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/**
 * Not type-checking this file because it's mostly vendor code.
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp("^<" + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being pased as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function shouldIgnoreFirstNewline(tag, html) {
  return tag && isIgnoreNewlineTag(tag) && html[0] === '\n';
};

function decodeAttr(value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) {
    return decodingMap[match];
  });
}

function parseHTML(html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue;
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue;
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue;
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue;
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }
          continue;
        }
      }

      var text = void 0,
          rest = void 0,
          next = void 0;
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) {
            break;
          }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text.replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
          .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return '';
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (false) {
        options.warn("Mal-formatted tag at end of template: \"" + html + "\"");
      }
      break;
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag() {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function handleStartTag(match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href' ? options.shouldDecodeNewlinesForHref : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag(tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) {
      start = index;
    }
    if (end == null) {
      end = index;
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break;
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (false) {
          options.warn("tag <" + stack[i].tag + "> has no matching end tag.");
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel(el, value, modifiers) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression = "(typeof " + baseValueExpression + " === 'string'" + "? " + baseValueExpression + ".trim()" + ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: "(" + value + ")",
    expression: JSON.stringify(value),
    callback: "function (" + baseValueExpression + ") {" + assignment + "}"
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode(value, assignment) {
  var res = parseModel(value);
  if (res.key === null) {
    return value + "=" + assignment;
  } else {
    return "$set(" + res.exp + ", " + res.key + ", " + assignment + ")";
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len, str, chr, index, expressionPos, expressionEndPos;

function parseModel(val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim();
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index = val.lastIndexOf('.');
    if (index > -1) {
      return {
        exp: val.slice(0, index),
        key: '"' + val.slice(index + 1) + '"'
      };
    } else {
      return {
        exp: val,
        key: null
      };
    }
  }

  str = val;
  index = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  };
}

function next() {
  return str.charCodeAt(++index);
}

function eof() {
  return index >= len;
}

function isStringStart(chr) {
  return chr === 0x22 || chr === 0x27;
}

function parseBracket(chr) {
  var inBracket = 1;
  expressionPos = index;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue;
    }
    if (chr === 0x5B) {
      inBracket++;
    }
    if (chr === 0x5D) {
      inBracket--;
    }
    if (inBracket === 0) {
      expressionEndPos = index;
      break;
    }
  }
}

function parseString(chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break;
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$1;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

function createASTElement(tag, attrs, parent) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  };
}

/**
 * Convert HTML string to AST.
 */
function parse(template, options) {
  warn$1 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce(msg) {
    if (!warned) {
      warned = true;
      warn$1(msg);
    }
  }

  function closeElement(element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  parseHTML(template, {
    warn: warn$1,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start(tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = currentParent && currentParent.ns || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "production" !== 'production' && warn$1('Templates should only be responsible for mapping the state to the ' + 'UI. Avoid placing tags with side-effects in your templates, such as ' + "<" + tag + ">" + ', as they will not be parsed.');
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints(el) {
        if (false) {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce("Cannot use <" + el.tag + "> as component root element because it may " + 'contain multiple nodes.');
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce('Cannot use v-for on stateful component root element because ' + 'it renders multiple elements.');
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (false) {
          warnOnce("Component template should contain exactly one root element. " + "If you are using v-if on multiple elements, " + "use v-else-if to chain them instead.");
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) {
          // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end() {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      closeElement(element);
    },

    chars: function chars(text) {
      if (!currentParent) {
        if (false) {
          if (text === template) {
            warnOnce('Component template requires a root element, rather than just text.');
          } else if (text = text.trim()) {
            warnOnce("text \"" + text + "\" outside root element will be ignored.");
          }
        }
        return;
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE && currentParent.tag === 'textarea' && currentParent.attrsMap.placeholder === text) {
        return;
      }
      var children = currentParent.children;
      text = inPre || text.trim() ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
      // only preserve whitespace if its not right after a starting tag
      : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var res;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment(text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root;
}

function processPre(el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs(el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement(element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey(el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (false) {
      if (el.tag === 'template') {
        warn$1("<template> cannot be keyed. Place the key on real elements instead.");
      }
      if (el.for) {
        var iterator = el.iterator2 || el.iterator1;
        var parent = el.parent;
        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
          warn$1("Do not use v-for index as key on <transition-group> children, " + "this is the same as not using keys.");
        }
      }
    }
    el.key = exp;
  }
}

function processRef(el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor(el) {
  var exp;
  if (exp = getAndRemoveAttr(el, 'v-for')) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else if (false) {
      warn$1("Invalid v-for expression: " + exp);
    }
  }
}

function parseFor(exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) {
    return;
  }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim();
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res;
}

function processIf(el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions(el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (false) {
    warn$1("v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " " + "used on element <" + el.tag + "> without corresponding v-if.");
  }
}

function findPrevElement(children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i];
    } else {
      if (false) {
        warn$1("text \"" + children[i].text.trim() + "\" between v-if and v-else(-if) " + "will be ignored.");
      }
      children.pop();
    }
  }
}

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce(el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot(el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (false) {
      warn$1("`key` does not work on <slot> because slots are abstract outlets " + "and can possibly expand into multiple elements. " + "Use the key on a wrapping element instead.");
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if (false) {
        warn$1("the \"scope\" attribute for scoped slots have been deprecated and " + "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " + "can also be used on plain elements in addition to <template> to " + "denote scoped slots.", true);
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if (slotScope = getAndRemoveAttr(el, 'slot-scope')) {
      /* istanbul ignore if */
      if (false) {
        warn$1("Ambiguous combined usage of slot-scope and v-for on <" + el.tag + "> " + "(v-for takes higher priority). Use a wrapper <template> for the " + "scoped slot to make it clearer.", true);
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent(el) {
  var binding;
  if (binding = getBindingAttr(el, 'is')) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs(el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) {
        // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (false) {
          warn$1("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"");
        }
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') {
              name = 'innerHTML';
            }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(el, "update:" + camelize(name), genAssignmentCode(value, "$event"));
          }
        }
        if (isProp || !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) {
        // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$1);
      } else {
        // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (false) {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (false) {
        var res = parseText(value, delimiters);
        if (res) {
          warn$1(name + "=\"" + value + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div id="{{ val }}">, use <div :id="val">.');
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component && name === 'muted' && platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor(el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

function parseModifiers(name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) {
      ret[m.slice(1)] = true;
    });
    return ret;
  }
}

function makeAttrsMap(attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (false) {
      warn$1('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map;
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag(el) {
  return el.tag === 'script' || el.tag === 'style';
}

function isForbiddenTag(el) {
  return el.tag === 'style' || el.tag === 'script' && (!el.attrsMap.type || el.attrsMap.type === 'text/javascript');
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug(attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res;
}

function checkForAliasModel(el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$1("<" + el.tag + " v-model=\"" + value + "\">: " + "You are binding v-model directly to a v-for iteration alias. " + "This will not be able to modify the v-for source array because " + "writing to the alias is like modifying a function local variable. " + "Consider using an array of objects and use v-model on an object property instead.");
    }
    _el = _el.parent;
  }
}

/*  */

function preTransformNode(el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (!map['v-model']) {
      return;
    }

    var typeBinding;
    if (map[':type'] || map['v-bind:type']) {
      typeBinding = getBindingAttr(el, 'type');
    }
    if (!map.type && !typeBinding && map['v-bind']) {
      typeBinding = "(" + map['v-bind'] + ").type";
    }

    if (typeBinding) {
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? "&&(" + ifCondition + ")" : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0;
    }
  }
}

function cloneASTElement(el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent);
}

var model$1 = {
  preTransformNode: preTransformNode
};

var modules$1 = [klass, style, model$1];

/*  */

var warn$2;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';

function model$2(el, dir, _warn) {
  warn$2 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (false) {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$2("<" + el.tag + " v-model=\"" + value + "\" type=\"file\">:\n" + "File inputs are read only. Use a v-on:change listener instead.");
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false;
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false;
  }

  // ensure runtime directive metadata
  return true;
}

function genCheckboxModel(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked', "Array.isArray(" + value + ")" + "?_i(" + value + "," + valueBinding + ")>-1" + (trueValueBinding === 'true' ? ":(" + value + ")" : ":_q(" + value + "," + trueValueBinding + ")"));
  addHandler(el, 'change', "var $$a=" + value + "," + '$$el=$event.target,' + "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" + 'if(Array.isArray($$a)){' + "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," + '$$i=_i($$a,$$v);' + "if($$el.checked){$$i<0&&(" + genAssignmentCode(value, '$$a.concat([$$v])') + ")}" + "else{$$i>-1&&(" + genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))') + ")}" + "}else{" + genAssignmentCode(value, '$$c') + "}", null, true);
}

function genRadioModel(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? "_n(" + valueBinding + ")" : valueBinding;
  addProp(el, 'checked', "_q(" + value + "," + valueBinding + ")");
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" + ".call($event.target.options,function(o){return o.selected})" + ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" + "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + genAssignmentCode(value, assignment);
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel(el, value, modifiers) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  if (false) {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (value$1 && !typeBinding) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$2(binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " + 'because the latter already expands to a value binding internally');
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', "(" + value + ")");
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

function text(el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', "_s(" + dir.value + ")");
  }
}

/*  */

function html(el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', "_s(" + dir.value + ")");
  }
}

var directives = {
  model: model$2,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// KeyboardEvent.key aliases
var keyNames = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ['Esc', 'Escape'],
  tab: 'Tab',
  enter: 'Enter',
  // #9112: IE11 uses `Spacebar` for Space key name.
  space: [' ', 'Spacebar'],
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  // #9112: IE11 uses `Del` for Delete key name.
  'delete': ['Backspace', 'Delete', 'Del']
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function genGuard(condition) {
  return "if(" + condition + ")return null;";
};

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers(events, isNative) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + genHandler(name, events[name]) + ",";
  }
  return res.slice(0, -1) + '}';
}

function genHandler(name, handler) {
  if (!handler) {
    return 'function(){}';
  }

  if (Array.isArray(handler)) {
    return "[" + handler.map(function (handler) {
      return genHandler(name, handler);
    }).join(',') + "]";
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value;
    }
    return "function($event){" + handler.value + "}"; // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = handler.modifiers;
        genModifierCode += genGuard(['ctrl', 'shift', 'alt', 'meta'].filter(function (keyModifier) {
          return !modifiers[keyModifier];
        }).map(function (keyModifier) {
          return "$event." + keyModifier + "Key";
        }).join('||'));
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath ? "return " + handler.value + "($event)" : isFunctionExpression ? "return (" + handler.value + ")($event)" : handler.value;
    return "function($event){" + code + handlerCode + "}";
  }
}

function genKeyFilter(keys) {
  return "if(!('button' in $event)&&" + keys.map(genFilterCode).join('&&') + ")return null;";
}

function genFilterCode(key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return "$event.keyCode!==" + keyVal;
  }
  var keyCode = keyCodes[key];
  var keyName = keyNames[key];
  return "_k($event.keyCode," + JSON.stringify(key) + "," + JSON.stringify(keyCode) + "," + "$event.key," + "" + JSON.stringify(keyName) + ")";
}

/*  */

function on(el, dir) {
  if (false) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) {
    return "_g(" + code + "," + dir.value + ")";
  };
}

/*  */

function bind$1(el, dir) {
  el.wrapData = function (code) {
    return "_b(" + code + ",'" + el.tag + "'," + dir.value + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")";
  };
}

/*  */

var baseDirectives$1 = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState(options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives$1), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) {
    return !(isReservedTag(el.tag) && !el.component);
  };
  this.onceId = 0;
  this.staticRenderFns = [];
  this.pre = false;
};

function generate(ast, options) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: "with(this){return " + code + "}",
    staticRenderFns: state.staticRenderFns
  };
}

function genElement(el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre;
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state);
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state);
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state);
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0';
  } else if (el.tag === 'slot') {
    return genSlot(el, state);
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data;
      if (!el.plain || el.pre && state.maybeComponent(el)) {
        data = genData$2(el, state);
      }

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + el.tag + "'" + (data ? "," + data : '') + (children ? "," + children : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code;
  }
}

// hoist static sub-trees out
function genStatic(el, state) {
  el.staticProcessed = true;
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  var originalPreState = state.pre;
  if (el.pre) {
    state.pre = el.pre;
  }
  state.staticRenderFns.push("with(this){return " + genElement(el, state) + "}");
  state.pre = originalPreState;
  return "_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")";
}

// v-once
function genOnce(el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break;
      }
      parent = parent.parent;
    }
    if (!key) {
      "production" !== 'production' && state.warn("v-once can only be used inside v-for that is keyed. ");
      return genElement(el, state);
    }
    return "_o(" + genElement(el, state) + "," + state.onceId++ + "," + key + ")";
  } else {
    return genStatic(el, state);
  }
}

function genIf(el, state, altGen, altEmpty) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty);
}

function genIfConditions(conditions, state, altGen, altEmpty) {
  if (!conditions.length) {
    return altEmpty || '_e()';
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return "(" + condition.exp + ")?" + genTernaryExp(condition.block) + ":" + genIfConditions(conditions, state, altGen, altEmpty);
  } else {
    return "" + genTernaryExp(condition.block);
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp(el) {
    return altGen ? altGen(el, state) : el.once ? genOnce(el, state) : genElement(el, state);
  }
}

function genFor(el, state, altGen, altHelper) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
  var iterator2 = el.iterator2 ? "," + el.iterator2 : '';

  if (false) {
    state.warn("<" + el.tag + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " + "v-for should have explicit keys. " + "See https://vuejs.org/guide/list.html#key for more info.", true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + (altGen || genElement)(el, state) + '})';
}

function genData$2(el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) {
    data += dirs + ',';
  }

  // key
  if (el.key) {
    data += "key:" + el.key + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + el.ref + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + el.tag + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + genProps(el.attrs) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + genProps(el.props) + "},";
  }
  // event handlers
  if (el.events) {
    data += genHandlers(el.events, false) + ",";
  }
  if (el.nativeEvents) {
    data += genHandlers(el.nativeEvents, true) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + el.slotTarget + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += genScopedSlots(el.scopedSlots, state) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + el.model.value + ",callback:" + el.model.callback + ",expression:" + el.model.expression + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data;
}

function genDirectives(el, state) {
  var dirs = el.directives;
  if (!dirs) {
    return;
  }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + dir.name + "\",rawName:\"" + dir.rawName + "\"" + (dir.value ? ",value:(" + dir.value + "),expression:" + JSON.stringify(dir.value) : '') + (dir.arg ? ",arg:\"" + dir.arg + "\"" : '') + (dir.modifiers ? ",modifiers:" + JSON.stringify(dir.modifiers) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']';
  }
}

function genInlineTemplate(el, state) {
  var ast = el.children[0];
  if (false) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return "inlineTemplate:{render:function(){" + inlineRenderFns.render + "},staticRenderFns:[" + inlineRenderFns.staticRenderFns.map(function (code) {
      return "function(){" + code + "}";
    }).join(',') + "]}";
  }
}

function genScopedSlots(slots, state) {
  return "scopedSlots:_u([" + Object.keys(slots).map(function (key) {
    return genScopedSlot(key, slots[key], state);
  }).join(',') + "])";
}

function genScopedSlot(key, el, state) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state);
  }
  var fn = "function(" + String(el.slotScope) + "){" + "return " + (el.tag === 'template' ? el.if ? "(" + el.if + ")?" + (genChildren(el, state) || 'undefined') + ":undefined" : genChildren(el, state) || 'undefined' : genElement(el, state)) + "}";
  return "{key:" + key + ",fn:" + fn + "}";
}

function genForScopedSlot(key, el, state) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
  var iterator2 = el.iterator2 ? "," + el.iterator2 : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + genScopedSlot(key, el, state) + '})';
}

function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 && el$1.for && el$1.tag !== 'template' && el$1.tag !== 'slot') {
      var normalizationType = checkSkip ? state.maybeComponent(el$1) ? ",1" : ",0" : "";
      return "" + (altGenElement || genElement)(el$1, state) + normalizationType;
    }
    var normalizationType$1 = checkSkip ? getNormalizationType(children, state.maybeComponent) : 0;
    var gen = altGenNode || genNode;
    return "[" + children.map(function (c) {
      return gen(c, state);
    }).join(',') + "]" + (normalizationType$1 ? "," + normalizationType$1 : '');
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType(children, maybeComponent) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue;
    }
    if (needsNormalization(el) || el.ifConditions && el.ifConditions.some(function (c) {
      return needsNormalization(c.block);
    })) {
      res = 2;
      break;
    }
    if (maybeComponent(el) || el.ifConditions && el.ifConditions.some(function (c) {
      return maybeComponent(c.block);
    })) {
      res = 1;
    }
  }
  return res;
}

function needsNormalization(el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
}

function genNode(node, state) {
  if (node.type === 1) {
    return genElement(node, state);
  } else if (node.type === 3 && node.isComment) {
    return genComment(node);
  } else {
    return genText(node);
  }
}

function genText(text) {
  return "_v(" + (text.type === 2 ? text.expression // no need for () because already wrapped in _s()
  : transformSpecialNewlines(JSON.stringify(text.text))) + ")";
}

function genComment(comment) {
  return "_e(" + JSON.stringify(comment.text) + ")";
}

function genSlot(el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? "," + children : '');
  var attrs = el.attrs && "{" + el.attrs.map(function (a) {
    return camelize(a.name) + ":" + a.value;
  }).join(',') + "}";
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')';
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent(componentName, el, state) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return "_c(" + componentName + "," + genData$2(el, state) + (children ? "," + children : '') + ")";
}

function genProps(props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    /* istanbul ignore if */
    {
      res += "\"" + prop.name + "\":" + transformSpecialNewlines(prop.value) + ",";
    }
  }
  return res.slice(0, -1);
}

// #3895, #4268
function transformSpecialNewlines(text) {
  return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

/*  */

var plainStringRE = /^"(?:[^"\\]|\\.)*"$|^'(?:[^'\\]|\\.)*'$/;

// let the model AST transform translate v-model into appropriate
// props bindings
function applyModelTransform(el, state) {
  if (el.directives) {
    for (var i = 0; i < el.directives.length; i++) {
      var dir = el.directives[i];
      if (dir.name === 'model') {
        state.directives.model(el, dir, state.warn);
        // remove value for textarea as its converted to text
        if (el.tag === 'textarea' && el.props) {
          el.props = el.props.filter(function (p) {
            return p.name !== 'value';
          });
        }
        break;
      }
    }
  }
}

function genAttrSegments(attrs) {
  return attrs.map(function (ref) {
    var name = ref.name;
    var value = ref.value;

    return genAttrSegment(name, value);
  });
}

function genDOMPropSegments(props, attrs) {
  var segments = [];
  props.forEach(function (ref) {
    var name = ref.name;
    var value = ref.value;

    name = propsToAttrMap[name] || name.toLowerCase();
    if (isRenderableAttr(name) && !(attrs && attrs.some(function (a) {
      return a.name === name;
    }))) {
      segments.push(genAttrSegment(name, value));
    }
  });
  return segments;
}

function genAttrSegment(name, value) {
  if (plainStringRE.test(value)) {
    // force double quote
    value = value.replace(/^'|'$/g, '"');
    // force enumerated attr to "true"
    if (isEnumeratedAttr(name) && value !== "\"false\"") {
      value = "\"true\"";
    }
    return {
      type: RAW,
      value: isBooleanAttr(name) ? " " + name + "=\"" + name + "\"" : value === '""' ? " " + name : " " + name + "=\"" + JSON.parse(value) + "\""
    };
  } else {
    return {
      type: EXPRESSION,
      value: "_ssrAttr(" + JSON.stringify(name) + "," + value + ")"
    };
  }
}

function genClassSegments(staticClass, classBinding) {
  if (staticClass && !classBinding) {
    return [{ type: RAW, value: " class=\"" + JSON.parse(staticClass) + "\"" }];
  } else {
    return [{
      type: EXPRESSION,
      value: "_ssrClass(" + (staticClass || 'null') + "," + (classBinding || 'null') + ")"
    }];
  }
}

function genStyleSegments(staticStyle, parsedStaticStyle, styleBinding, vShowExpression) {
  if (staticStyle && !styleBinding && !vShowExpression) {
    return [{ type: RAW, value: " style=" + JSON.stringify(staticStyle) }];
  } else {
    return [{
      type: EXPRESSION,
      value: "_ssrStyle(" + (parsedStaticStyle || 'null') + "," + (styleBinding || 'null') + ", " + (vShowExpression ? "{ display: (" + vShowExpression + ") ? '' : 'none' }" : 'null') + ")"
    }];
  }
}

/*  */

// optimizability constants
var optimizability = {
  FALSE: 0, // whole sub tree un-optimizable
  FULL: 1, // whole sub tree optimizable
  SELF: 2, // self optimizable but has some un-optimizable children
  CHILDREN: 3, // self un-optimizable but have fully optimizable children
  PARTIAL: 4 // self un-optimizable with some un-optimizable children
};

var isPlatformReservedTag;

function optimize(root, options) {
  if (!root) {
    return;
  }
  isPlatformReservedTag = options.isReservedTag || no;
  walk(root, true);
}

function walk(node, isRoot) {
  if (isUnOptimizableTree(node)) {
    node.ssrOptimizability = optimizability.FALSE;
    return;
  }
  // root node or nodes with custom directives should always be a VNode
  var selfUnoptimizable = isRoot || hasCustomDirective(node);
  var check = function check(child) {
    if (child.ssrOptimizability !== optimizability.FULL) {
      node.ssrOptimizability = selfUnoptimizable ? optimizability.PARTIAL : optimizability.SELF;
    }
  };
  if (selfUnoptimizable) {
    node.ssrOptimizability = optimizability.CHILDREN;
  }
  if (node.type === 1) {
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      walk(child);
      check(child);
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        walk(block, isRoot);
        check(block);
      }
    }
    if (node.ssrOptimizability == null || !isRoot && (node.attrsMap['v-html'] || node.attrsMap['v-text'])) {
      node.ssrOptimizability = optimizability.FULL;
    } else {
      node.children = optimizeSiblings(node);
    }
  } else {
    node.ssrOptimizability = optimizability.FULL;
  }
}

function optimizeSiblings(el) {
  var children = el.children;
  var optimizedChildren = [];

  var currentOptimizableGroup = [];
  var pushGroup = function pushGroup() {
    if (currentOptimizableGroup.length) {
      optimizedChildren.push({
        type: 1,
        parent: el,
        tag: 'template',
        attrsList: [],
        attrsMap: {},
        children: currentOptimizableGroup,
        ssrOptimizability: optimizability.FULL
      });
    }
    currentOptimizableGroup = [];
  };

  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.ssrOptimizability === optimizability.FULL) {
      currentOptimizableGroup.push(c);
    } else {
      // wrap fully-optimizable adjacent siblings inside a template tag
      // so that they can be optimized into a single ssrNode by codegen
      pushGroup();
      optimizedChildren.push(c);
    }
  }
  pushGroup();
  return optimizedChildren;
}

function isUnOptimizableTree(node) {
  if (node.type === 2 || node.type === 3) {
    // text or expression
    return false;
  }
  return isBuiltInTag(node.tag) || // built-in (slot, component)
  !isPlatformReservedTag(node.tag) || // custom component
  !!node.component || // "is" component
  isSelectWithModel(node) // <select v-model> requires runtime inspection
  ;
}

var isBuiltInDir = makeMap('text,html,show,on,bind,model,pre,cloak,once');

function hasCustomDirective(node) {
  return node.type === 1 && node.directives && node.directives.some(function (d) {
    return !isBuiltInDir(d.name);
  });
}

// <select v-model> cannot be optimized because it requires a runtime check
// to determine proper selected option
function isSelectWithModel(node) {
  return node.type === 1 && node.tag === 'select' && node.directives != null && node.directives.some(function (d) {
    return d.name === 'model';
  });
}

/*  */

// segment types
var RAW = 0;
var INTERPOLATION = 1;
var EXPRESSION = 2;

function generate$1(ast, options) {
  var state = new CodegenState(options);
  var code = ast ? genSSRElement(ast, state) : '_c("div")';
  return {
    render: "with(this){return " + code + "}",
    staticRenderFns: state.staticRenderFns
  };
}

function genSSRElement(el, state) {
  if (el.for && !el.forProcessed) {
    return genFor(el, state, genSSRElement);
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state, genSSRElement);
  } else if (el.tag === 'template' && !el.slotTarget) {
    return el.ssrOptimizability === optimizability.FULL ? genChildrenAsStringNode(el, state) : genSSRChildren(el, state) || 'void 0';
  }

  switch (el.ssrOptimizability) {
    case optimizability.FULL:
      // stringify whole tree
      return genStringElement(el, state);
    case optimizability.SELF:
      // stringify self and check children
      return genStringElementWithChildren(el, state);
    case optimizability.CHILDREN:
      // generate self as VNode and stringify children
      return genNormalElement(el, state, true);
    case optimizability.PARTIAL:
      // generate self as VNode and check children
      return genNormalElement(el, state, false);
    default:
      // bail whole tree
      return genElement(el, state);
  }
}

function genNormalElement(el, state, stringifyChildren) {
  var data = el.plain ? undefined : genData$2(el, state);
  var children = stringifyChildren ? "[" + genChildrenAsStringNode(el, state) + "]" : genSSRChildren(el, state, true);
  return "_c('" + el.tag + "'" + (data ? "," + data : '') + (children ? "," + children : '') + ")";
}

function genSSRChildren(el, state, checkSkip) {
  return genChildren(el, state, checkSkip, genSSRElement, genSSRNode);
}

function genSSRNode(el, state) {
  return el.type === 1 ? genSSRElement(el, state) : genText(el);
}

function genChildrenAsStringNode(el, state) {
  return el.children.length ? "_ssrNode(" + flattenSegments(childrenToSegments(el, state)) + ")" : '';
}

function genStringElement(el, state) {
  return "_ssrNode(" + elementToString(el, state) + ")";
}

function genStringElementWithChildren(el, state) {
  var children = genSSRChildren(el, state, true);
  return "_ssrNode(" + flattenSegments(elementToOpenTagSegments(el, state)) + ",\"</" + el.tag + ">\"" + (children ? "," + children : '') + ")";
}

function elementToString(el, state) {
  return "(" + flattenSegments(elementToSegments(el, state)) + ")";
}

function elementToSegments(el, state) {
  // v-for / v-if
  if (el.for && !el.forProcessed) {
    el.forProcessed = true;
    return [{
      type: EXPRESSION,
      value: genFor(el, state, elementToString, '_ssrList')
    }];
  } else if (el.if && !el.ifProcessed) {
    el.ifProcessed = true;
    return [{
      type: EXPRESSION,
      value: genIf(el, state, elementToString, '"<!---->"')
    }];
  } else if (el.tag === 'template') {
    return childrenToSegments(el, state);
  }

  var openSegments = elementToOpenTagSegments(el, state);
  var childrenSegments = childrenToSegments(el, state);
  var ref = state.options;
  var isUnaryTag = ref.isUnaryTag;
  var close = isUnaryTag && isUnaryTag(el.tag) ? [] : [{ type: RAW, value: "</" + el.tag + ">" }];
  return openSegments.concat(childrenSegments, close);
}

function elementToOpenTagSegments(el, state) {
  applyModelTransform(el, state);
  var binding;
  var segments = [{ type: RAW, value: "<" + el.tag }];
  // attrs
  if (el.attrs) {
    segments.push.apply(segments, genAttrSegments(el.attrs));
  }
  // domProps
  if (el.props) {
    segments.push.apply(segments, genDOMPropSegments(el.props, el.attrs));
  }
  // v-bind="object"
  if (binding = el.attrsMap['v-bind']) {
    segments.push({ type: EXPRESSION, value: "_ssrAttrs(" + binding + ")" });
  }
  // v-bind.prop="object"
  if (binding = el.attrsMap['v-bind.prop']) {
    segments.push({ type: EXPRESSION, value: "_ssrDOMProps(" + binding + ")" });
  }
  // class
  if (el.staticClass || el.classBinding) {
    segments.push.apply(segments, genClassSegments(el.staticClass, el.classBinding));
  }
  // style & v-show
  if (el.staticStyle || el.styleBinding || el.attrsMap['v-show']) {
    segments.push.apply(segments, genStyleSegments(el.attrsMap.style, el.staticStyle, el.styleBinding, el.attrsMap['v-show']));
  }
  // _scopedId
  if (state.options.scopeId) {
    segments.push({ type: RAW, value: " " + state.options.scopeId });
  }
  segments.push({ type: RAW, value: ">" });
  return segments;
}

function childrenToSegments(el, state) {
  var binding;
  if (binding = el.attrsMap['v-html']) {
    return [{ type: EXPRESSION, value: "_s(" + binding + ")" }];
  }
  if (binding = el.attrsMap['v-text']) {
    return [{ type: INTERPOLATION, value: "_s(" + binding + ")" }];
  }
  if (el.tag === 'textarea' && (binding = el.attrsMap['v-model'])) {
    return [{ type: INTERPOLATION, value: "_s(" + binding + ")" }];
  }
  return el.children ? nodesToSegments(el.children, state) : [];
}

function nodesToSegments(children, state) {
  var segments = [];
  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.type === 1) {
      segments.push.apply(segments, elementToSegments(c, state));
    } else if (c.type === 2) {
      segments.push({ type: INTERPOLATION, value: c.expression });
    } else if (c.type === 3) {
      segments.push({ type: RAW, value: escape(c.text) });
    }
  }
  return segments;
}

function flattenSegments(segments) {
  var mergedSegments = [];
  var textBuffer = '';

  var pushBuffer = function pushBuffer() {
    if (textBuffer) {
      mergedSegments.push(JSON.stringify(textBuffer));
      textBuffer = '';
    }
  };

  for (var i = 0; i < segments.length; i++) {
    var s = segments[i];
    if (s.type === RAW) {
      textBuffer += s.value;
    } else if (s.type === INTERPOLATION) {
      pushBuffer();
      mergedSegments.push("_ssrEscape(" + s.value + ")");
    } else if (s.type === EXPRESSION) {
      pushBuffer();
      mergedSegments.push("(" + s.value + ")");
    }
  }
  pushBuffer();

  return mergedSegments.join('+');
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' + 'super,throw,while,yield,delete,export,import,return,switch,default,' + 'extends,finally,continue,debugger,function,arguments').split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + 'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors(ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors;
}

function checkNode(node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, "v-for=\"" + value + "\"", errors);
          } else if (onRE.test(name)) {
            checkEvent(value, name + "=\"" + value + "\"", errors);
          } else {
            checkExpression(value, name + "=\"" + value + "\"", errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent(exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push("avoid using JavaScript unary operator as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim());
  }
  checkExpression(exp, text, errors);
}

function checkFor(node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier(ident, type, text, errors) {
  if (typeof ident === 'string') {
    try {
      new Function("var " + ident + "=_");
    } catch (e) {
      errors.push("invalid " + type + " \"" + ident + "\" in expression: " + text.trim());
    }
  }
}

function checkExpression(exp, text, errors) {
  try {
    new Function("return " + exp);
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push("avoid using JavaScript keyword as property name: " + "\"" + keywordMatch[0] + "\"\n  Raw expression: " + text.trim());
    } else {
      errors.push("invalid expression: " + e.message + " in\n\n" + "    " + exp + "\n\n" + "  Raw expression: " + text.trim() + "\n");
    }
  }
}

/*  */

function createFunction(code, errors) {
  try {
    return new Function(code);
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop;
  }
}

function createCompileToFunctionFn(compile) {
  var cache = Object.create(null);

  return function compileToFunctions(template, options, vm) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    if (false) {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1('It seems you are using the standalone build of Vue.js in an ' + 'environment with Content Security Policy that prohibits unsafe-eval. ' + 'The template compiler cannot work in this environment. Consider ' + 'relaxing the policy to allow unsafe-eval or pre-compiling your ' + 'templates into render functions.');
        }
      }
    }

    // check cache
    var key = options.delimiters ? String(options.delimiters) + template : template;
    if (cache[key]) {
      return cache[key];
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (false) {
      if (compiled.errors && compiled.errors.length) {
        warn$$1("Error compiling template:\n\n" + template + "\n\n" + compiled.errors.map(function (e) {
          return "- " + e;
        }).join('\n') + '\n', vm);
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) {
          return tip(msg, vm);
        });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors);
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (false) {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1("Failed to generate render function:\n\n" + fnGenErrors.map(function (ref) {
          var err = ref.err;
          var code = ref.code;

          return err.toString() + " in\n\n" + code + "\n";
        }).join('\n'), vm);
      }
    }

    return cache[key] = res;
  };
}

/*  */

function createCompilerCreator(baseCompile) {
  return function createCompiler(baseOptions) {
    function compile(template, options) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(Object.create(baseOptions.directives || null), options.directives);
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      if (false) {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled;
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    };
  };
}

/*  */

var createCompiler = createCompilerCreator(function baseCompile(template, options) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate$1(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});

/*  */

var ref = createCompiler(baseOptions);
var compile = ref.compile;
var compileToFunctions = ref.compileToFunctions;

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren(children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }
  return children;
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren(children) {
  return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
}

function isTextNode(node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}

function normalizeArrayChildren(children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') {
      continue;
    }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, (nestedIndex || '') + "_" + i);
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + c[0].text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res;
}

/*  */

var ssrHelpers = {
  _ssrEscape: escape,
  _ssrNode: renderStringNode,
  _ssrList: renderStringList,
  _ssrAttr: renderAttr,
  _ssrAttrs: renderAttrs$1,
  _ssrDOMProps: renderDOMProps$1,
  _ssrClass: renderSSRClass,
  _ssrStyle: renderSSRStyle
};

function installSSRHelpers(vm) {
  if (vm._ssrNode) {
    return;
  }
  var Vue = vm.constructor;
  while (Vue.super) {
    Vue = Vue.super;
  }
  extend(Vue.prototype, ssrHelpers);
  if (Vue.FunctionalRenderContext) {
    extend(Vue.FunctionalRenderContext.prototype, ssrHelpers);
  }
}

var StringNode = function StringNode(open, close, children, normalizationType) {
  this.isString = true;
  this.open = open;
  this.close = close;
  if (children) {
    this.children = normalizationType === 1 ? simpleNormalizeChildren(children) : normalizationType === 2 ? normalizeChildren(children) : children;
  } else {
    this.children = void 0;
  }
};

function renderStringNode(open, close, children, normalizationType) {
  return new StringNode(open, close, children, normalizationType);
}

function renderStringList(val, render) {
  var ret = '';
  var i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    for (i = 0, l = val.length; i < l; i++) {
      ret += render(val[i], i);
    }
  } else if (typeof val === 'number') {
    for (i = 0; i < val; i++) {
      ret += render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret += render(val[key], key, i);
    }
  }
  return ret;
}

function renderAttrs$1(obj) {
  var res = '';
  for (var key in obj) {
    if (isSSRUnsafeAttr(key)) {
      continue;
    }
    res += renderAttr(key, obj[key]);
  }
  return res;
}

function renderDOMProps$1(obj) {
  var res = '';
  for (var key in obj) {
    var attr = propsToAttrMap[key] || key.toLowerCase();
    if (isRenderableAttr(attr)) {
      res += renderAttr(attr, obj[key]);
    }
  }
  return res;
}

function renderSSRClass(staticClass, dynamic) {
  var res = renderClass(staticClass, dynamic);
  return res === '' ? res : " class=\"" + escape(res) + "\"";
}

function renderSSRStyle(staticStyle, dynamic, extra) {
  var style = {};
  if (staticStyle) {
    extend(style, staticStyle);
  }
  if (dynamic) {
    extend(style, normalizeStyleBinding(dynamic));
  }
  if (extra) {
    extend(style, extra);
  }
  var res = genStyle(style);
  return res === '' ? res : " style=" + JSON.stringify(escape(res));
}

/* not type checking this file because flow doesn't play well with Proxy */

if (false) {
  var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
  );

  var hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
          return false;
        } else {
          target[key] = value;
          return true;
        }
      }
    });
  }
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse(val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse(val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if (!isA && !isObject(val) || Object.isFrozen(val) || val instanceof VNode) {
    return;
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) {
      _traverse(val[i], seen);
    }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}

if (false) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) ;
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  };
});

function createFnInvoker(fns) {
  function invoker() {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments);
    }
  }
  invoker.fns = fns;
  return invoker;
}

function updateListeners(on, oldOn, add, remove$$1, createOnceHandler, vm) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "production" !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

function extractPropsFromVNodeData(data, Ctor, tag) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return;
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (false) {
        var keyInLowerCase = key.toLowerCase();
        if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
          tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ", but the declared prop name is" + " \"" + key + "\". " + "Note that HTML attributes are case-insensitive and camelCased " + "props need to use their kebab-case equivalents when using in-DOM " + "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
        }
      }
      checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
    }
  }
  return res;
}

function checkProp(res, hash, key, altKey, preserve) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true;
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true;
    }
  }
  return false;
}

/*  */

function ensureCtor(comp, base) {
  if (comp.__esModule || hasSymbol && comp[Symbol.toStringTag] === 'Module') {
    comp = comp.default;
  }
  return isObject(comp) ? base.extend(comp) : comp;
}

function createAsyncPlaceholder(factory, data, context, children, tag) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node;
}

function resolveAsyncComponent(factory, baseCtor, context) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp;
  }

  if (isDef(factory.resolved)) {
    return factory.resolved;
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp;
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function forceRender(renderCompleted) {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }

      if (renderCompleted) {
        contexts.length = 0;
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      }
    });

    var reject = once(function (reason) {
      "production" !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject( false ? "timeout (" + res.timeout + "ms)" : null);
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading ? factory.loadingComp : factory.resolved;
  }
}

/*  */

/*  */

/*  */

/*  */

var target;

function add(event, fn) {
  target.$on(event, fn);
}

function remove$1(event, fn) {
  target.$off(event, fn);
}

function createOnceHandler(event, fn) {
  var _target = target;
  return function onceHandler() {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  };
}

function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots(children, context) {
  var slots = {};
  if (!children) {
    return slots;
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) && data && data.slot != null) {
      var name = data.slot;
      var slot = slots[name] || (slots[name] = []);
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots;
}

function isWhitespace(node) {
  return node.isComment && !node.asyncFactory || node.text === ' ';
}

function resolveScopedSlots(fns, // see flow/vnode
res) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res;
}

/*  */

var activeInstance = null;

function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
  if (false) ;

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(renderChildren || // has new static slots
  vm.$options._renderChildren || // has old static slots
  parentVnode.data.scopedSlots || // has new scoped slots
  vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (false) ;
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) {
      return true;
    }
  }
  return false;
}

function activateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return;
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook(vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, hook + " hook");
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent(vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
}

/*  */

/*  */

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType);
}

function _createElement(context, tag, data, children, normalizationType) {
  if (isDef(data) && isDef(data.__ob__)) {
    "production" !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
    return createEmptyVNode();
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  }
  // warn against non-primitive key
  if (false) {
    {
      warn('Avoid using non-primitive value as key, ' + 'use string/number value instead.', context);
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = context.$vnode && context.$vnode.ns || config.getTagNamespace(tag);
    if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode;
  } else if (isDef(vnode)) {
    if (isDef(ns)) {
      applyNS(vnode, ns);
    }
    if (isDef(data)) {
      registerDeepBindings(data);
    }
    return vnode;
  } else {
    return createEmptyVNode();
  }
}

function applyNS(vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force) && child.tag !== 'svg')) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings(data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList(val, render) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  ret._isVList = true;
  return ret;
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot(name, fallback, props, bindObject) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) {
    // scoped slot
    props = props || {};
    if (bindObject) {
      if (false) {
        warn('slot v-bind without argument expects an Object', this);
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes);
  } else {
    return nodes;
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter(id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity;
}

/*  */

function isKeyNotMatch(expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1;
  } else {
    return expect !== actual;
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName);
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode);
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key;
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps(data, tag, value, asProp, isSync) {
  if (value) {
    if (!isObject(value)) {
      "production" !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function loop(key) {
        if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        if (!(key in hash) && !(camelizedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on["update:" + camelizedKey] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) {
        loop(key);
      }
    }
  }
  return data;
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic(index, isInFor) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree;
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, null, this // for render fns generated for functional component templates
  );
  markStatic(tree, "__static__" + index, false);
  return tree;
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce(tree, index, key) {
  markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
  return tree;
}

function markStatic(tree, key, isOnce) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], key + "_" + i, isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode(node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners(data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "production" !== 'production' && warn('v-on without argument expects an Object value', this);
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data;
}

/*  */

function installRenderHelpers(target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

/*  */

function resolveInject(inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol ? Reflect.ownKeys(inject).filter(function (key) {
      /* istanbul ignore next */
      return Object.getOwnPropertyDescriptor(inject, key).enumerable;
    }) : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function' ? provideDefault.call(vm) : provideDefault;
        } else if (false) {
          warn("Injection \"" + key + "\" not found", vm);
        }
      }
    }
    return result;
  }
}

/*  */

function resolveConstructorOptions(Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options;
}

function resolveModifiedOptions(Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        modified = {};
      }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified;
}

function dedupe(latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res;
  } else {
    return latest;
  }
}

/*  */

function FunctionalRenderContext(data, props, children, parent, Ctor) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    return resolveSlots(children, parent);
  };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode;
    };
  } else {
    this._c = function (a, b, c, d) {
      return createElement(contextVm, a, b, c, d, needNormalization);
    };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) {
      mergeProps(props, data.attrs);
    }
    if (isDef(data.props)) {
      mergeProps(props, data.props);
    }
  }

  var renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res;
  }
}

function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (false) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone;
}

function mergeProps(to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init(vnode, hydrating) {
    if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch(oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(child, options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
    );
  },

  insert: function insert(vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy(vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent(Ctor, data, context, children, tag) {
  if (isUndef(Ctor)) {
    return;
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (false) {
      warn("Invalid Component definition: " + String(Ctor), context);
    }
    return;
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }, asyncFactory);

  return vnode;
}

function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options);
}

function installComponentHooks(data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1(f1, f2) {
  var merged = function merged(a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged;
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel(options, data) {
  var prop = options.model && options.model.prop || 'value';
  var event = options.model && options.model.event || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (Array.isArray(existing) ? existing.indexOf(callback) === -1 : existing !== callback) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var warned = Object.create(null);
var warnOnce = function warnOnce(msg) {
  if (!warned[msg]) {
    warned[msg] = true;
    console.warn('\n\x1B[31m' + msg + '\x1B[39m\n');
  }
};

var onCompilationError = function onCompilationError(err, vm) {
  var trace = vm ? generateComponentTrace(vm) : '';
  throw new Error('\n\x1B[31m' + err + trace + '\x1B[39m\n');
};

var normalizeRender = function normalizeRender(vm) {
  var ref = vm.$options;
  var render = ref.render;
  var template = ref.template;
  var _scopeId = ref._scopeId;
  if (isUndef(render)) {
    if (template) {
      var compiled = compileToFunctions(template, {
        scopeId: _scopeId,
        warn: onCompilationError
      }, vm);

      vm.$options.render = compiled.render;
      vm.$options.staticRenderFns = compiled.staticRenderFns;
    } else {
      throw new Error("render function or template not defined in component: " + (vm.$options.name || vm.$options._componentTag || 'anonymous'));
    }
  }
};

function renderNode(node, isRoot, context) {
  if (node.isString) {
    renderStringNode$1(node, context);
  } else if (isDef(node.componentOptions)) {
    renderComponent(node, isRoot, context);
  } else if (isDef(node.tag)) {
    renderElement(node, isRoot, context);
  } else if (isTrue(node.isComment)) {
    if (isDef(node.asyncFactory)) {
      // async component
      renderAsyncComponent(node, isRoot, context);
    } else {
      context.write("<!--" + node.text + "-->", context.next);
    }
  } else {
    context.write(node.raw ? node.text : escape(String(node.text)), context.next);
  }
}

function registerComponentForCache(options, write) {
  // exposed by vue-loader, need to call this if cache hit because
  // component lifecycle hooks will not be called.
  var register = options._ssrRegister;
  if (write.caching && isDef(register)) {
    write.componentBuffer[write.componentBuffer.length - 1].add(register);
  }
  return register;
}

function renderComponent(node, isRoot, context) {
  var write = context.write;
  var next = context.next;
  var userContext = context.userContext;

  // check cache hit
  var Ctor = node.componentOptions.Ctor;
  var getKey = Ctor.options.serverCacheKey;
  var name = Ctor.options.name;
  var cache = context.cache;
  var registerComponent = registerComponentForCache(Ctor.options, write);

  if (isDef(getKey) && isDef(cache) && isDef(name)) {
    var key = name + '::' + getKey(node.componentOptions.propsData);
    var has = context.has;
    var get = context.get;
    if (isDef(has)) {
      has(key, function (hit) {
        if (hit === true && isDef(get)) {
          get(key, function (res) {
            if (isDef(registerComponent)) {
              registerComponent(userContext);
            }
            res.components.forEach(function (register) {
              return register(userContext);
            });
            write(res.html, next);
          });
        } else {
          renderComponentWithCache(node, isRoot, key, context);
        }
      });
    } else if (isDef(get)) {
      get(key, function (res) {
        if (isDef(res)) {
          if (isDef(registerComponent)) {
            registerComponent(userContext);
          }
          res.components.forEach(function (register) {
            return register(userContext);
          });
          write(res.html, next);
        } else {
          renderComponentWithCache(node, isRoot, key, context);
        }
      });
    }
  } else {
    if (isDef(getKey) && isUndef(cache)) {
      warnOnce("[vue-server-renderer] Component " + (Ctor.options.name || '(anonymous)') + " implemented serverCacheKey, " + 'but no cache was provided to the renderer.');
    }
    if (isDef(getKey) && isUndef(name)) {
      warnOnce("[vue-server-renderer] Components that implement \"serverCacheKey\" " + "must also define a unique \"name\" option.");
    }
    renderComponentInner(node, isRoot, context);
  }
}

function renderComponentWithCache(node, isRoot, key, context) {
  var write = context.write;
  write.caching = true;
  var buffer = write.cacheBuffer;
  var bufferIndex = buffer.push('') - 1;
  var componentBuffer = write.componentBuffer;
  componentBuffer.push(new Set());
  context.renderStates.push({
    type: 'ComponentWithCache',
    key: key,
    buffer: buffer,
    bufferIndex: bufferIndex,
    componentBuffer: componentBuffer
  });
  renderComponentInner(node, isRoot, context);
}

function renderComponentInner(node, isRoot, context) {
  var prevActive = context.activeInstance;
  // expose userContext on vnode
  node.ssrContext = context.userContext;
  var child = context.activeInstance = createComponentInstanceForVnode(node, context.activeInstance);
  normalizeRender(child);
  var childNode = child._render();
  childNode.parent = node;
  context.renderStates.push({
    type: 'Component',
    prevActive: prevActive
  });
  renderNode(childNode, isRoot, context);
}

function renderAsyncComponent(node, isRoot, context) {
  var factory = node.asyncFactory;

  var resolve = function resolve(comp) {
    if (comp.__esModule && comp.default) {
      comp = comp.default;
    }
    var ref = node.asyncMeta;
    var data = ref.data;
    var children = ref.children;
    var tag = ref.tag;
    var nodeContext = node.asyncMeta.context;
    var resolvedNode = createComponent(comp, data, nodeContext, children, tag);
    if (resolvedNode) {
      if (resolvedNode.componentOptions) {
        // normal component
        renderComponent(resolvedNode, isRoot, context);
      } else if (!Array.isArray(resolvedNode)) {
        // single return node from functional component
        renderNode(resolvedNode, isRoot, context);
      } else {
        // multiple return nodes from functional component
        context.renderStates.push({
          type: 'Fragment',
          children: resolvedNode,
          rendered: 0,
          total: resolvedNode.length
        });
        context.next();
      }
    } else {
      // invalid component, but this does not throw on the client
      // so render empty comment node
      context.write("<!---->", context.next);
    }
  };

  if (factory.resolved) {
    resolve(factory.resolved);
    return;
  }

  var reject = context.done;
  var res;
  try {
    res = factory(resolve, reject);
  } catch (e) {
    reject(e);
  }
  if (res) {
    if (typeof res.then === 'function') {
      res.then(resolve, reject).catch(reject);
    } else {
      // new syntax in 2.3
      var comp = res.component;
      if (comp && typeof comp.then === 'function') {
        comp.then(resolve, reject).catch(reject);
      }
    }
  }
}

function renderStringNode$1(el, context) {
  var write = context.write;
  var next = context.next;
  if (isUndef(el.children) || el.children.length === 0) {
    write(el.open + (el.close || ''), next);
  } else {
    var children = el.children;
    context.renderStates.push({
      type: 'Element',
      children: children,
      rendered: 0,
      total: children.length,
      endTag: el.close
    });
    write(el.open, next);
  }
}

function renderElement(el, isRoot, context) {
  var write = context.write;
  var next = context.next;

  if (isTrue(isRoot)) {
    if (!el.data) {
      el.data = {};
    }
    if (!el.data.attrs) {
      el.data.attrs = {};
    }
    el.data.attrs[SSR_ATTR] = 'true';
  }

  if (el.fnOptions) {
    registerComponentForCache(el.fnOptions, write);
  }

  var startTag = renderStartingTag(el, context);
  var endTag = "</" + el.tag + ">";
  if (context.isUnaryTag(el.tag)) {
    write(startTag, next);
  } else if (isUndef(el.children) || el.children.length === 0) {
    write(startTag + endTag, next);
  } else {
    var children = el.children;
    context.renderStates.push({
      type: 'Element',
      children: children,
      rendered: 0,
      total: children.length,
      endTag: endTag
    });
    write(startTag, next);
  }
}

function hasAncestorData(node) {
  var parentNode = node.parent;
  return isDef(parentNode) && (isDef(parentNode.data) || hasAncestorData(parentNode));
}

function getVShowDirectiveInfo(node) {
  var dir;
  var tmp;

  while (isDef(node)) {
    if (node.data && node.data.directives) {
      tmp = node.data.directives.find(function (dir) {
        return dir.name === 'show';
      });
      if (tmp) {
        dir = tmp;
      }
    }
    node = node.parent;
  }
  return dir;
}

function renderStartingTag(node, context) {
  var markup = "<" + node.tag;
  var directives = context.directives;
  var modules = context.modules;

  // construct synthetic data for module processing
  // because modules like style also produce code by parent VNode data
  if (isUndef(node.data) && hasAncestorData(node)) {
    node.data = {};
  }
  if (isDef(node.data)) {
    // check directives
    var dirs = node.data.directives;
    if (dirs) {
      for (var i = 0; i < dirs.length; i++) {
        var name = dirs[i].name;
        if (name !== 'show') {
          var dirRenderer = resolveAsset(context, 'directives', name);
          if (dirRenderer) {
            // directives mutate the node's data
            // which then gets rendered by modules
            dirRenderer(node, dirs[i]);
          }
        }
      }
    }

    // v-show directive needs to be merged from parent to child
    var vshowDirectiveInfo = getVShowDirectiveInfo(node);
    if (vshowDirectiveInfo) {
      directives.show(node, vshowDirectiveInfo);
    }

    // apply other modules
    for (var i$1 = 0; i$1 < modules.length; i$1++) {
      var res = modules[i$1](node);
      if (res) {
        markup += res;
      }
    }
  }
  // attach scoped CSS ID
  var scopeId;
  var activeInstance = context.activeInstance;
  if (isDef(activeInstance) && activeInstance !== node.context && isDef(scopeId = activeInstance.$options._scopeId)) {
    markup += " " + scopeId;
  }
  if (isDef(node.fnScopeId)) {
    markup += " " + node.fnScopeId;
  } else {
    while (isDef(node)) {
      if (isDef(scopeId = node.context.$options._scopeId)) {
        markup += " " + scopeId;
      }
      node = node.parent;
    }
  }
  return markup + '>';
}

function createRenderFunction(modules, directives, isUnaryTag, cache) {
  return function render(component, write, userContext, done) {
    warned = Object.create(null);
    var context = new RenderContext({
      activeInstance: component,
      userContext: userContext,
      write: write, done: done, renderNode: renderNode,
      isUnaryTag: isUnaryTag, modules: modules, directives: directives,
      cache: cache
    });
    installSSRHelpers(component);
    normalizeRender(component);
    renderNode(component._render(), true, context);
  };
}

/*  */

var isJS = function isJS(file) {
  return (/\.js(\?[^.]+)?$/.test(file)
  );
};

var isCSS = function isCSS(file) {
  return (/\.css(\?[^.]+)?$/.test(file)
  );
};

function createPromiseCallback() {
  var resolve, reject;
  var promise = new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
  var cb = function cb(err, res) {
    if (err) {
      return reject(err);
    }
    resolve(res || '');
  };
  return { promise: promise, cb: cb };
}

/*  */

var Transform = __webpack_require__(2).Transform;

var TemplateStream = /*@__PURE__*/function (Transform) {
  function TemplateStream(renderer, template, context) {
    Transform.call(this);
    this.started = false;
    this.renderer = renderer;
    this.template = template;
    this.context = context || {};
    this.inject = renderer.inject;
  }

  if (Transform) TemplateStream.__proto__ = Transform;
  TemplateStream.prototype = Object.create(Transform && Transform.prototype);
  TemplateStream.prototype.constructor = TemplateStream;

  TemplateStream.prototype._transform = function _transform(data, encoding, done) {
    if (!this.started) {
      this.emit('beforeStart');
      this.start();
    }
    this.push(data);
    done();
  };

  TemplateStream.prototype.start = function start() {
    this.started = true;
    this.push(this.template.head(this.context));

    if (this.inject) {
      // inline server-rendered head meta information
      if (this.context.head) {
        this.push(this.context.head);
      }

      // inline preload/prefetch directives for initial/async chunks
      var links = this.renderer.renderResourceHints(this.context);
      if (links) {
        this.push(links);
      }

      // CSS files and inline server-rendered CSS collected by vue-style-loader
      var styles = this.renderer.renderStyles(this.context);
      if (styles) {
        this.push(styles);
      }
    }

    this.push(this.template.neck(this.context));
  };

  TemplateStream.prototype._flush = function _flush(done) {
    this.emit('beforeEnd');

    if (this.inject) {
      // inline initial store state
      var state = this.renderer.renderState(this.context);
      if (state) {
        this.push(state);
      }

      // embed scripts needed
      var scripts = this.renderer.renderScripts(this.context);
      if (scripts) {
        this.push(scripts);
      }
    }

    this.push(this.template.tail(this.context));
    done();
  };

  return TemplateStream;
}(Transform);

/*  */

var compile$1 = __webpack_require__(24);
var compileOptions = {
  escape: /{{([^{][\s\S]+?[^}])}}/g,
  interpolate: /{{{([\s\S]+?)}}}/g
};

function parseTemplate(template, contentPlaceholder) {
  if (contentPlaceholder === void 0) contentPlaceholder = '<!--vue-ssr-outlet-->';

  if ((typeof template === 'undefined' ? 'undefined' : _typeof(template)) === 'object') {
    return template;
  }

  var i = template.indexOf('</head>');
  var j = template.indexOf(contentPlaceholder);

  if (j < 0) {
    throw new Error("Content placeholder not found in template.");
  }

  if (i < 0) {
    i = template.indexOf('<body>');
    if (i < 0) {
      i = j;
    }
  }

  return {
    head: compile$1(template.slice(0, i), compileOptions),
    neck: compile$1(template.slice(i, j), compileOptions),
    tail: compile$1(template.slice(j + contentPlaceholder.length), compileOptions)
  };
}

/*  */

/**
 * Creates a mapper that maps components used during a server-side render
 * to async chunk files in the client-side build, so that we can inline them
 * directly in the rendered HTML to avoid waterfall requests.
 */

function createMapper(clientManifest) {
  var map = createMap(clientManifest);
  // map server-side moduleIds to client-side files
  return function mapper(moduleIds) {
    var res = new Set();
    for (var i = 0; i < moduleIds.length; i++) {
      var mapped = map.get(moduleIds[i]);
      if (mapped) {
        for (var j = 0; j < mapped.length; j++) {
          res.add(mapped[j]);
        }
      }
    }
    return Array.from(res);
  };
}

function createMap(clientManifest) {
  var map = new Map();
  Object.keys(clientManifest.modules).forEach(function (id) {
    map.set(id, mapIdToFile(id, clientManifest));
  });
  return map;
}

function mapIdToFile(id, clientManifest) {
  var files = [];
  var fileIndices = clientManifest.modules[id];
  if (fileIndices) {
    fileIndices.forEach(function (index) {
      var file = clientManifest.all[index];
      // only include async files or non-js assets
      if (clientManifest.async.indexOf(file) > -1 || !/\.js($|\?)/.test(file)) {
        files.push(file);
      }
    });
  }
  return files;
}

/*  */

var path = __webpack_require__(0);
var serialize = __webpack_require__(26);

var TemplateRenderer = function TemplateRenderer(options) {
  this.options = options;
  this.inject = options.inject !== false;
  // if no template option is provided, the renderer is created
  // as a utility object for rendering assets like preload links and scripts.
  this.parsedTemplate = options.template ? parseTemplate(options.template) : null;

  // extra functionality with client manifest
  if (options.clientManifest) {
    var clientManifest = this.clientManifest = options.clientManifest;
    // ensure publicPath ends with /
    this.publicPath = clientManifest.publicPath === '' ? '' : clientManifest.publicPath.replace(/([^\/])$/, '$1/');
    // preload/prefetch directives
    this.preloadFiles = (clientManifest.initial || []).map(normalizeFile);
    this.prefetchFiles = (clientManifest.async || []).map(normalizeFile);
    // initial async chunk mapping
    this.mapFiles = createMapper(clientManifest);
  }
};

TemplateRenderer.prototype.bindRenderFns = function bindRenderFns(context) {
  var renderer = this;['ResourceHints', 'State', 'Scripts', 'Styles'].forEach(function (type) {
    context["render" + type] = renderer["render" + type].bind(renderer, context);
  });
  // also expose getPreloadFiles, useful for HTTP/2 push
  context.getPreloadFiles = renderer.getPreloadFiles.bind(renderer, context);
};

// render synchronously given rendered app content and render context
TemplateRenderer.prototype.renderSync = function renderSync(content, context) {
  var template = this.parsedTemplate;
  if (!template) {
    throw new Error('renderSync cannot be called without a template.');
  }
  context = context || {};
  if (this.inject) {
    return template.head(context) + (context.head || '') + this.renderResourceHints(context) + this.renderStyles(context) + template.neck(context) + content + this.renderState(context) + this.renderScripts(context) + template.tail(context);
  } else {
    return template.head(context) + template.neck(context) + content + template.tail(context);
  }
};

TemplateRenderer.prototype.renderStyles = function renderStyles(context) {
  var this$1 = this;

  var initial = this.preloadFiles || [];
  var async = this.getUsedAsyncFiles(context) || [];
  var cssFiles = initial.concat(async).filter(function (ref) {
    var file = ref.file;

    return isCSS(file);
  });
  return (
    // render links for css files
    (cssFiles.length ? cssFiles.map(function (ref) {
      var file = ref.file;

      return "<link rel=\"stylesheet\" href=\"" + this$1.publicPath + file + "\">";
    }).join('') : '') + (
    // context.styles is a getter exposed by vue-style-loader which contains
    // the inline component styles collected during SSR
    context.styles || '')
  );
};

TemplateRenderer.prototype.renderResourceHints = function renderResourceHints(context) {
  return this.renderPreloadLinks(context) + this.renderPrefetchLinks(context);
};

TemplateRenderer.prototype.getPreloadFiles = function getPreloadFiles(context) {
  var usedAsyncFiles = this.getUsedAsyncFiles(context);
  if (this.preloadFiles || usedAsyncFiles) {
    return (this.preloadFiles || []).concat(usedAsyncFiles || []);
  } else {
    return [];
  }
};

TemplateRenderer.prototype.renderPreloadLinks = function renderPreloadLinks(context) {
  var this$1 = this;

  var files = this.getPreloadFiles(context);
  var shouldPreload = this.options.shouldPreload;
  if (files.length) {
    return files.map(function (ref) {
      var file = ref.file;
      var extension = ref.extension;
      var fileWithoutQuery = ref.fileWithoutQuery;
      var asType = ref.asType;

      var extra = '';
      // by default, we only preload scripts or css
      if (!shouldPreload && asType !== 'script' && asType !== 'style') {
        return '';
      }
      // user wants to explicitly control what to preload
      if (shouldPreload && !shouldPreload(fileWithoutQuery, asType)) {
        return '';
      }
      if (asType === 'font') {
        extra = " type=\"font/" + extension + "\" crossorigin";
      }
      return "<link rel=\"preload\" href=\"" + this$1.publicPath + file + "\"" + (asType !== '' ? " as=\"" + asType + "\"" : '') + extra + ">";
    }).join('');
  } else {
    return '';
  }
};

TemplateRenderer.prototype.renderPrefetchLinks = function renderPrefetchLinks(context) {
  var this$1 = this;

  var shouldPrefetch = this.options.shouldPrefetch;
  if (this.prefetchFiles) {
    var usedAsyncFiles = this.getUsedAsyncFiles(context);
    var alreadyRendered = function alreadyRendered(file) {
      return usedAsyncFiles && usedAsyncFiles.some(function (f) {
        return f.file === file;
      });
    };
    return this.prefetchFiles.map(function (ref) {
      var file = ref.file;
      var fileWithoutQuery = ref.fileWithoutQuery;
      var asType = ref.asType;

      if (shouldPrefetch && !shouldPrefetch(fileWithoutQuery, asType)) {
        return '';
      }
      if (alreadyRendered(file)) {
        return '';
      }
      return "<link rel=\"prefetch\" href=\"" + this$1.publicPath + file + "\">";
    }).join('');
  } else {
    return '';
  }
};

TemplateRenderer.prototype.renderState = function renderState(context, options) {
  var ref = options || {};
  var contextKey = ref.contextKey;if (contextKey === void 0) contextKey = 'state';
  var windowKey = ref.windowKey;if (windowKey === void 0) windowKey = '__INITIAL_STATE__';
  var state = serialize(context[contextKey], { isJSON: true });
  var autoRemove =  true ? ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());' : '';
  return context[contextKey] ? "<script>window." + windowKey + "=" + state + autoRemove + "</script>" : '';
};

TemplateRenderer.prototype.renderScripts = function renderScripts(context) {
  var this$1 = this;

  if (this.clientManifest) {
    var initial = this.preloadFiles.filter(function (ref) {
      var file = ref.file;

      return isJS(file);
    });
    var async = (this.getUsedAsyncFiles(context) || []).filter(function (ref) {
      var file = ref.file;

      return isJS(file);
    });
    var needed = [initial[0]].concat(async || [], initial.slice(1));
    return needed.map(function (ref) {
      var file = ref.file;

      return "<script src=\"" + this$1.publicPath + file + "\" defer></script>";
    }).join('');
  } else {
    return '';
  }
};

TemplateRenderer.prototype.getUsedAsyncFiles = function getUsedAsyncFiles(context) {
  if (!context._mappedFiles && context._registeredComponents && this.mapFiles) {
    var registered = Array.from(context._registeredComponents);
    context._mappedFiles = this.mapFiles(registered).map(normalizeFile);
  }
  return context._mappedFiles;
};

// create a transform stream
TemplateRenderer.prototype.createStream = function createStream(context) {
  if (!this.parsedTemplate) {
    throw new Error('createStream cannot be called without a template.');
  }
  return new TemplateStream(this, this.parsedTemplate, context || {});
};

function normalizeFile(file) {
  var withoutQuery = file.replace(/\?.*/, '');
  var extension = path.extname(withoutQuery).slice(1);
  return {
    file: file,
    extension: extension,
    fileWithoutQuery: withoutQuery,
    asType: getPreloadType(extension)
  };
}

function getPreloadType(ext) {
  if (ext === 'js') {
    return 'script';
  } else if (ext === 'css') {
    return 'style';
  } else if (/jpe?g|png|svg|gif|webp|ico/.test(ext)) {
    return 'image';
  } else if (/woff2?|ttf|otf|eot/.test(ext)) {
    return 'font';
  } else {
    // not exhausting all possibilities here, but above covers common cases
    return '';
  }
}

/*  */

function createRenderer(ref) {
  if (ref === void 0) ref = {};
  var modules = ref.modules;if (modules === void 0) modules = [];
  var directives = ref.directives;if (directives === void 0) directives = {};
  var isUnaryTag = ref.isUnaryTag;if (isUnaryTag === void 0) isUnaryTag = function isUnaryTag() {
    return false;
  };
  var template = ref.template;
  var inject = ref.inject;
  var cache = ref.cache;
  var shouldPreload = ref.shouldPreload;
  var shouldPrefetch = ref.shouldPrefetch;
  var clientManifest = ref.clientManifest;

  var render = createRenderFunction(modules, directives, isUnaryTag, cache);
  var templateRenderer = new TemplateRenderer({
    template: template,
    inject: inject,
    shouldPreload: shouldPreload,
    shouldPrefetch: shouldPrefetch,
    clientManifest: clientManifest
  });

  return {
    renderToString: function renderToString(component, context, cb) {
      var assign;

      if (typeof context === 'function') {
        cb = context;
        context = {};
      }
      if (context) {
        templateRenderer.bindRenderFns(context);
      }

      // no callback, return Promise
      var promise;
      if (!cb) {
        assign = createPromiseCallback(), promise = assign.promise, cb = assign.cb;
      }

      var result = '';
      var write = createWriteFunction(function (text) {
        result += text;
        return false;
      }, cb);
      try {
        render(component, write, context, function (err) {
          if (template) {
            result = templateRenderer.renderSync(result, context);
          }
          if (err) {
            cb(err);
          } else {
            cb(null, result);
          }
        });
      } catch (e) {
        cb(e);
      }

      return promise;
    },

    renderToStream: function renderToStream(component, context) {
      if (context) {
        templateRenderer.bindRenderFns(context);
      }
      var renderStream = new RenderStream(function (write, done) {
        render(component, write, context, done);
      });
      if (!template) {
        return renderStream;
      } else {
        var templateStream = templateRenderer.createStream(context);
        renderStream.on('error', function (err) {
          templateStream.emit('error', err);
        });
        renderStream.pipe(templateStream);
        return templateStream;
      }
    }
  };
}

var vm = __webpack_require__(27);
var path$1 = __webpack_require__(0);
var resolve = __webpack_require__(28);
var NativeModule = __webpack_require__(33);

function createSandbox(context) {
  var sandbox = {
    Buffer: Buffer,
    console: console,
    process: process,
    setTimeout: setTimeout,
    setInterval: setInterval,
    setImmediate: setImmediate,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    clearImmediate: clearImmediate,
    __VUE_SSR_CONTEXT__: context
  };
  sandbox.global = sandbox;
  return sandbox;
}

function compileModule(files, basedir, runInNewContext) {
  var compiledScripts = {};
  var resolvedModules = {};

  function getCompiledScript(filename) {
    if (compiledScripts[filename]) {
      return compiledScripts[filename];
    }
    var code = files[filename];
    var wrapper = NativeModule.wrap(code);
    var script = new vm.Script(wrapper, {
      filename: filename,
      displayErrors: true
    });
    compiledScripts[filename] = script;
    return script;
  }

  function evaluateModule(filename, sandbox, evaluatedFiles) {
    if (evaluatedFiles === void 0) evaluatedFiles = {};

    if (evaluatedFiles[filename]) {
      return evaluatedFiles[filename];
    }

    var script = getCompiledScript(filename);
    var compiledWrapper = runInNewContext === false ? script.runInThisContext() : script.runInNewContext(sandbox);
    var m = { exports: {} };
    var r = function r(file) {
      file = path$1.posix.join('.', file);
      if (files[file]) {
        return evaluateModule(file, sandbox, evaluatedFiles);
      } else if (basedir) {
        return !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      } else {
        return !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      }
    };
    compiledWrapper.call(m.exports, m.exports, r, m);

    var res = Object.prototype.hasOwnProperty.call(m.exports, 'default') ? m.exports.default : m.exports;
    evaluatedFiles[filename] = res;
    return res;
  }
  return evaluateModule;
}

function deepClone(val) {
  if (isPlainObject(val)) {
    var res = {};
    for (var key in val) {
      res[key] = deepClone(val[key]);
    }
    return res;
  } else if (Array.isArray(val)) {
    return val.slice();
  } else {
    return val;
  }
}

function createBundleRunner(entry, files, basedir, runInNewContext) {
  var evaluate = compileModule(files, basedir, runInNewContext);
  if (runInNewContext !== false && runInNewContext !== 'once') {
    // new context mode: creates a fresh context and re-evaluate the bundle
    // on each render. Ensures entire application state is fresh for each
    // render, but incurs extra evaluation cost.
    return function (userContext) {
      if (userContext === void 0) userContext = {};

      return new Promise(function (resolve) {
        userContext._registeredComponents = new Set();
        var res = evaluate(entry, createSandbox(userContext));
        resolve(typeof res === 'function' ? res(userContext) : res);
      });
    };
  } else {
    // direct mode: instead of re-evaluating the whole bundle on
    // each render, it simply calls the exported function. This avoids the
    // module evaluation costs but requires the source code to be structured
    // slightly differently.
    var runner; // lazy creation so that errors can be caught by user
    var initialContext;
    return function (userContext) {
      if (userContext === void 0) userContext = {};

      return new Promise(function (resolve) {
        if (!runner) {
          var sandbox = runInNewContext === 'once' ? createSandbox() : global;
          // the initial context is only used for collecting possible non-component
          // styles injected by vue-style-loader.
          initialContext = sandbox.__VUE_SSR_CONTEXT__ = {};
          runner = evaluate(entry, sandbox);
          // On subsequent renders, __VUE_SSR_CONTEXT__ will not be available
          // to prevent cross-request pollution.
          delete sandbox.__VUE_SSR_CONTEXT__;
          if (typeof runner !== 'function') {
            throw new Error('bundle export should be a function when using ' + '{ runInNewContext: false }.');
          }
        }
        userContext._registeredComponents = new Set();

        // vue-style-loader styles imported outside of component lifecycle hooks
        if (initialContext._styles) {
          userContext._styles = deepClone(initialContext._styles);
          // #6353 ensure "styles" is exposed even if no styles are injected
          // in component lifecycles.
          // the renderStyles fn is exposed by vue-style-loader >= 3.0.3
          var renderStyles = initialContext._renderStyles;
          if (renderStyles) {
            Object.defineProperty(userContext, 'styles', {
              enumerable: true,
              get: function get() {
                return renderStyles(userContext._styles);
              }
            });
          }
        }

        resolve(runner(userContext));
      });
    };
  }
}

/*  */

var SourceMapConsumer = __webpack_require__(34).SourceMapConsumer;

var filenameRE = /\(([^)]+\.js):(\d+):(\d+)\)$/;

function createSourceMapConsumers(rawMaps) {
  var maps = {};
  Object.keys(rawMaps).forEach(function (file) {
    maps[file] = new SourceMapConsumer(rawMaps[file]);
  });
  return maps;
}

function rewriteErrorTrace(e, mapConsumers) {
  if (e && typeof e.stack === 'string') {
    e.stack = e.stack.split('\n').map(function (line) {
      return rewriteTraceLine(line, mapConsumers);
    }).join('\n');
  }
}

function rewriteTraceLine(trace, mapConsumers) {
  var m = trace.match(filenameRE);
  var map = m && mapConsumers[m[1]];
  if (m != null && map) {
    var originalPosition = map.originalPositionFor({
      line: Number(m[2]),
      column: Number(m[3])
    });
    if (originalPosition.source != null) {
      var source = originalPosition.source;
      var line = originalPosition.line;
      var column = originalPosition.column;
      var mappedPosition = "(" + source.replace(/^webpack:\/\/\//, '') + ":" + String(line) + ":" + String(column) + ")";
      return trace.replace(filenameRE, mappedPosition);
    } else {
      return trace;
    }
  } else {
    return trace;
  }
}

/*  */

var fs = __webpack_require__(4);
var path$2 = __webpack_require__(0);
var PassThrough = __webpack_require__(2).PassThrough;

var INVALID_MSG = 'Invalid server-rendering bundle format. Should be a string ' + 'or a bundle Object of type:\n\n' + "{\n  entry: string;\n  files: { [filename: string]: string; };\n  maps: { [filename: string]: string; };\n}\n";

// The render bundle can either be a string (single bundled file)
// or a bundle manifest object generated by vue-ssr-webpack-plugin.


function createBundleRendererCreator(createRenderer) {
  return function createBundleRenderer(bundle, rendererOptions) {
    if (rendererOptions === void 0) rendererOptions = {};

    var files, entry, maps;
    var basedir = rendererOptions.basedir;

    // load bundle if given filepath
    if (typeof bundle === 'string' && /\.js(on)?$/.test(bundle) && path$2.isAbsolute(bundle)) {
      if (fs.existsSync(bundle)) {
        var isJSON = /\.json$/.test(bundle);
        basedir = basedir || path$2.dirname(bundle);
        bundle = fs.readFileSync(bundle, 'utf-8');
        if (isJSON) {
          try {
            bundle = JSON.parse(bundle);
          } catch (e) {
            throw new Error("Invalid JSON bundle file: " + bundle);
          }
        }
      } else {
        throw new Error("Cannot locate bundle file: " + bundle);
      }
    }

    if ((typeof bundle === 'undefined' ? 'undefined' : _typeof(bundle)) === 'object') {
      entry = bundle.entry;
      files = bundle.files;
      basedir = basedir || bundle.basedir;
      maps = createSourceMapConsumers(bundle.maps);
      if (typeof entry !== 'string' || (typeof files === 'undefined' ? 'undefined' : _typeof(files)) !== 'object') {
        throw new Error(INVALID_MSG);
      }
    } else if (typeof bundle === 'string') {
      entry = '__vue_ssr_bundle__';
      files = { '__vue_ssr_bundle__': bundle };
      maps = {};
    } else {
      throw new Error(INVALID_MSG);
    }

    var renderer = createRenderer(rendererOptions);

    var run = createBundleRunner(entry, files, basedir, rendererOptions.runInNewContext);

    return {
      renderToString: function renderToString(context, cb) {
        var assign;

        if (typeof context === 'function') {
          cb = context;
          context = {};
        }

        var promise;
        if (!cb) {
          assign = createPromiseCallback(), promise = assign.promise, cb = assign.cb;
        }
        console.log(context);
        run(context).catch(function (err) {
          rewriteErrorTrace(err, maps);
          cb(err);
        }).then(function (app) {
          if (app) {
            renderer.renderToString(app, context, function (err, res) {
              rewriteErrorTrace(err, maps);
              cb(err, res);
            });
          }
        });

        return promise;
      },

      renderToStream: function renderToStream(context) {
        var res = new PassThrough();
        run(context).catch(function (err) {
          rewriteErrorTrace(err, maps);
          // avoid emitting synchronously before user can
          // attach error listener
          process.nextTick(function () {
            res.emit('error', err);
          });
        }).then(function (app) {
          if (app) {
            var renderStream = renderer.renderToStream(app, context);

            renderStream.on('error', function (err) {
              rewriteErrorTrace(err, maps);
              res.emit('error', err);
            });

            // relay HTMLStream special events
            if (rendererOptions && rendererOptions.template) {
              renderStream.on('beforeStart', function () {
                res.emit('beforeStart');
              });
              renderStream.on('beforeEnd', function () {
                res.emit('beforeEnd');
              });
            }

            renderStream.pipe(res);
          }
        });

        return res;
      }
    };
  };
}

/*  */

process.env.VUE_ENV = 'server';

function createRenderer$1(options) {
  if (options === void 0) options = {};

  return createRenderer(extend(extend({}, options), {
    isUnaryTag: isUnaryTag,
    canBeLeftOpenTag: canBeLeftOpenTag,
    modules: modules,
    // user can provide server-side implementations for custom directives
    // when creating the renderer.
    directives: extend(baseDirectives, options.directives)
  }));
}

var createBundleRenderer = createBundleRendererCreator(createRenderer$1);

exports.createRenderer = createRenderer$1;
exports.createBundleRenderer = createBundleRenderer;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! https://mths.be/he v1.1.1 by @mathias | MIT license */
;(function (root) {

	// Detect free variables `exports`.
	var freeExports = ( false ? 'undefined' : _typeof(exports)) == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = ( false ? 'undefined' : _typeof(module)) == 'object' && module && module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`.
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	// All astral symbols.
	var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	// All ASCII symbols (not just printable ASCII) except those listed in the
	// first column of the overrides table.
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides
	var regexAsciiWhitelist = /[\x01-\x7F]/g;
	// All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
	// code points listed in the first column of the overrides table on
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.
	var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;

	var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
	var encodeMap = { '\xAD': 'shy', '\u200C': 'zwnj', '\u200D': 'zwj', '\u200E': 'lrm', '\u2063': 'ic', '\u2062': 'it', '\u2061': 'af', '\u200F': 'rlm', '\u200B': 'ZeroWidthSpace', '\u2060': 'NoBreak', '\u0311': 'DownBreve', '\u20DB': 'tdot', '\u20DC': 'DotDot', '\t': 'Tab', '\n': 'NewLine', '\u2008': 'puncsp', '\u205F': 'MediumSpace', '\u2009': 'thinsp', '\u200A': 'hairsp', '\u2004': 'emsp13', '\u2002': 'ensp', '\u2005': 'emsp14', '\u2003': 'emsp', '\u2007': 'numsp', '\xA0': 'nbsp', '\u205F\u200A': 'ThickSpace', '\u203E': 'oline', '_': 'lowbar', '\u2010': 'dash', '\u2013': 'ndash', '\u2014': 'mdash', '\u2015': 'horbar', ',': 'comma', ';': 'semi', '\u204F': 'bsemi', ':': 'colon', '\u2A74': 'Colone', '!': 'excl', '\xA1': 'iexcl', '?': 'quest', '\xBF': 'iquest', '.': 'period', '\u2025': 'nldr', '\u2026': 'mldr', '\xB7': 'middot', '\'': 'apos', '\u2018': 'lsquo', '\u2019': 'rsquo', '\u201A': 'sbquo', '\u2039': 'lsaquo', '\u203A': 'rsaquo', '"': 'quot', '\u201C': 'ldquo', '\u201D': 'rdquo', '\u201E': 'bdquo', '\xAB': 'laquo', '\xBB': 'raquo', '(': 'lpar', ')': 'rpar', '[': 'lsqb', ']': 'rsqb', '{': 'lcub', '}': 'rcub', '\u2308': 'lceil', '\u2309': 'rceil', '\u230A': 'lfloor', '\u230B': 'rfloor', '\u2985': 'lopar', '\u2986': 'ropar', '\u298B': 'lbrke', '\u298C': 'rbrke', '\u298D': 'lbrkslu', '\u298E': 'rbrksld', '\u298F': 'lbrksld', '\u2990': 'rbrkslu', '\u2991': 'langd', '\u2992': 'rangd', '\u2993': 'lparlt', '\u2994': 'rpargt', '\u2995': 'gtlPar', '\u2996': 'ltrPar', '\u27E6': 'lobrk', '\u27E7': 'robrk', '\u27E8': 'lang', '\u27E9': 'rang', '\u27EA': 'Lang', '\u27EB': 'Rang', '\u27EC': 'loang', '\u27ED': 'roang', '\u2772': 'lbbrk', '\u2773': 'rbbrk', '\u2016': 'Vert', '\xA7': 'sect', '\xB6': 'para', '@': 'commat', '*': 'ast', '/': 'sol', 'undefined': null, '&': 'amp', '#': 'num', '%': 'percnt', '\u2030': 'permil', '\u2031': 'pertenk', '\u2020': 'dagger', '\u2021': 'Dagger', '\u2022': 'bull', '\u2043': 'hybull', '\u2032': 'prime', '\u2033': 'Prime', '\u2034': 'tprime', '\u2057': 'qprime', '\u2035': 'bprime', '\u2041': 'caret', '`': 'grave', '\xB4': 'acute', '\u02DC': 'tilde', '^': 'Hat', '\xAF': 'macr', '\u02D8': 'breve', '\u02D9': 'dot', '\xA8': 'die', '\u02DA': 'ring', '\u02DD': 'dblac', '\xB8': 'cedil', '\u02DB': 'ogon', '\u02C6': 'circ', '\u02C7': 'caron', '\xB0': 'deg', '\xA9': 'copy', '\xAE': 'reg', '\u2117': 'copysr', '\u2118': 'wp', '\u211E': 'rx', '\u2127': 'mho', '\u2129': 'iiota', '\u2190': 'larr', '\u219A': 'nlarr', '\u2192': 'rarr', '\u219B': 'nrarr', '\u2191': 'uarr', '\u2193': 'darr', '\u2194': 'harr', '\u21AE': 'nharr', '\u2195': 'varr', '\u2196': 'nwarr', '\u2197': 'nearr', '\u2198': 'searr', '\u2199': 'swarr', '\u219D': 'rarrw', '\u219D\u0338': 'nrarrw', '\u219E': 'Larr', '\u219F': 'Uarr', '\u21A0': 'Rarr', '\u21A1': 'Darr', '\u21A2': 'larrtl', '\u21A3': 'rarrtl', '\u21A4': 'mapstoleft', '\u21A5': 'mapstoup', '\u21A6': 'map', '\u21A7': 'mapstodown', '\u21A9': 'larrhk', '\u21AA': 'rarrhk', '\u21AB': 'larrlp', '\u21AC': 'rarrlp', '\u21AD': 'harrw', '\u21B0': 'lsh', '\u21B1': 'rsh', '\u21B2': 'ldsh', '\u21B3': 'rdsh', '\u21B5': 'crarr', '\u21B6': 'cularr', '\u21B7': 'curarr', '\u21BA': 'olarr', '\u21BB': 'orarr', '\u21BC': 'lharu', '\u21BD': 'lhard', '\u21BE': 'uharr', '\u21BF': 'uharl', '\u21C0': 'rharu', '\u21C1': 'rhard', '\u21C2': 'dharr', '\u21C3': 'dharl', '\u21C4': 'rlarr', '\u21C5': 'udarr', '\u21C6': 'lrarr', '\u21C7': 'llarr', '\u21C8': 'uuarr', '\u21C9': 'rrarr', '\u21CA': 'ddarr', '\u21CB': 'lrhar', '\u21CC': 'rlhar', '\u21D0': 'lArr', '\u21CD': 'nlArr', '\u21D1': 'uArr', '\u21D2': 'rArr', '\u21CF': 'nrArr', '\u21D3': 'dArr', '\u21D4': 'iff', '\u21CE': 'nhArr', '\u21D5': 'vArr', '\u21D6': 'nwArr', '\u21D7': 'neArr', '\u21D8': 'seArr', '\u21D9': 'swArr', '\u21DA': 'lAarr', '\u21DB': 'rAarr', '\u21DD': 'zigrarr', '\u21E4': 'larrb', '\u21E5': 'rarrb', '\u21F5': 'duarr', '\u21FD': 'loarr', '\u21FE': 'roarr', '\u21FF': 'hoarr', '\u2200': 'forall', '\u2201': 'comp', '\u2202': 'part', '\u2202\u0338': 'npart', '\u2203': 'exist', '\u2204': 'nexist', '\u2205': 'empty', '\u2207': 'Del', '\u2208': 'in', '\u2209': 'notin', '\u220B': 'ni', '\u220C': 'notni', '\u03F6': 'bepsi', '\u220F': 'prod', '\u2210': 'coprod', '\u2211': 'sum', '+': 'plus', '\xB1': 'pm', '\xF7': 'div', '\xD7': 'times', '<': 'lt', '\u226E': 'nlt', '<\u20D2': 'nvlt', '=': 'equals', '\u2260': 'ne', '=\u20E5': 'bne', '\u2A75': 'Equal', '>': 'gt', '\u226F': 'ngt', '>\u20D2': 'nvgt', '\xAC': 'not', '|': 'vert', '\xA6': 'brvbar', '\u2212': 'minus', '\u2213': 'mp', '\u2214': 'plusdo', '\u2044': 'frasl', '\u2216': 'setmn', '\u2217': 'lowast', '\u2218': 'compfn', '\u221A': 'Sqrt', '\u221D': 'prop', '\u221E': 'infin', '\u221F': 'angrt', '\u2220': 'ang', '\u2220\u20D2': 'nang', '\u2221': 'angmsd', '\u2222': 'angsph', '\u2223': 'mid', '\u2224': 'nmid', '\u2225': 'par', '\u2226': 'npar', '\u2227': 'and', '\u2228': 'or', '\u2229': 'cap', '\u2229\uFE00': 'caps', '\u222A': 'cup', '\u222A\uFE00': 'cups', '\u222B': 'int', '\u222C': 'Int', '\u222D': 'tint', '\u2A0C': 'qint', '\u222E': 'oint', '\u222F': 'Conint', '\u2230': 'Cconint', '\u2231': 'cwint', '\u2232': 'cwconint', '\u2233': 'awconint', '\u2234': 'there4', '\u2235': 'becaus', '\u2236': 'ratio', '\u2237': 'Colon', '\u2238': 'minusd', '\u223A': 'mDDot', '\u223B': 'homtht', '\u223C': 'sim', '\u2241': 'nsim', '\u223C\u20D2': 'nvsim', '\u223D': 'bsim', '\u223D\u0331': 'race', '\u223E': 'ac', '\u223E\u0333': 'acE', '\u223F': 'acd', '\u2240': 'wr', '\u2242': 'esim', '\u2242\u0338': 'nesim', '\u2243': 'sime', '\u2244': 'nsime', '\u2245': 'cong', '\u2247': 'ncong', '\u2246': 'simne', '\u2248': 'ap', '\u2249': 'nap', '\u224A': 'ape', '\u224B': 'apid', '\u224B\u0338': 'napid', '\u224C': 'bcong', '\u224D': 'CupCap', '\u226D': 'NotCupCap', '\u224D\u20D2': 'nvap', '\u224E': 'bump', '\u224E\u0338': 'nbump', '\u224F': 'bumpe', '\u224F\u0338': 'nbumpe', '\u2250': 'doteq', '\u2250\u0338': 'nedot', '\u2251': 'eDot', '\u2252': 'efDot', '\u2253': 'erDot', '\u2254': 'colone', '\u2255': 'ecolon', '\u2256': 'ecir', '\u2257': 'cire', '\u2259': 'wedgeq', '\u225A': 'veeeq', '\u225C': 'trie', '\u225F': 'equest', '\u2261': 'equiv', '\u2262': 'nequiv', '\u2261\u20E5': 'bnequiv', '\u2264': 'le', '\u2270': 'nle', '\u2264\u20D2': 'nvle', '\u2265': 'ge', '\u2271': 'nge', '\u2265\u20D2': 'nvge', '\u2266': 'lE', '\u2266\u0338': 'nlE', '\u2267': 'gE', '\u2267\u0338': 'ngE', '\u2268\uFE00': 'lvnE', '\u2268': 'lnE', '\u2269': 'gnE', '\u2269\uFE00': 'gvnE', '\u226A': 'll', '\u226A\u0338': 'nLtv', '\u226A\u20D2': 'nLt', '\u226B': 'gg', '\u226B\u0338': 'nGtv', '\u226B\u20D2': 'nGt', '\u226C': 'twixt', '\u2272': 'lsim', '\u2274': 'nlsim', '\u2273': 'gsim', '\u2275': 'ngsim', '\u2276': 'lg', '\u2278': 'ntlg', '\u2277': 'gl', '\u2279': 'ntgl', '\u227A': 'pr', '\u2280': 'npr', '\u227B': 'sc', '\u2281': 'nsc', '\u227C': 'prcue', '\u22E0': 'nprcue', '\u227D': 'sccue', '\u22E1': 'nsccue', '\u227E': 'prsim', '\u227F': 'scsim', '\u227F\u0338': 'NotSucceedsTilde', '\u2282': 'sub', '\u2284': 'nsub', '\u2282\u20D2': 'vnsub', '\u2283': 'sup', '\u2285': 'nsup', '\u2283\u20D2': 'vnsup', '\u2286': 'sube', '\u2288': 'nsube', '\u2287': 'supe', '\u2289': 'nsupe', '\u228A\uFE00': 'vsubne', '\u228A': 'subne', '\u228B\uFE00': 'vsupne', '\u228B': 'supne', '\u228D': 'cupdot', '\u228E': 'uplus', '\u228F': 'sqsub', '\u228F\u0338': 'NotSquareSubset', '\u2290': 'sqsup', '\u2290\u0338': 'NotSquareSuperset', '\u2291': 'sqsube', '\u22E2': 'nsqsube', '\u2292': 'sqsupe', '\u22E3': 'nsqsupe', '\u2293': 'sqcap', '\u2293\uFE00': 'sqcaps', '\u2294': 'sqcup', '\u2294\uFE00': 'sqcups', '\u2295': 'oplus', '\u2296': 'ominus', '\u2297': 'otimes', '\u2298': 'osol', '\u2299': 'odot', '\u229A': 'ocir', '\u229B': 'oast', '\u229D': 'odash', '\u229E': 'plusb', '\u229F': 'minusb', '\u22A0': 'timesb', '\u22A1': 'sdotb', '\u22A2': 'vdash', '\u22AC': 'nvdash', '\u22A3': 'dashv', '\u22A4': 'top', '\u22A5': 'bot', '\u22A7': 'models', '\u22A8': 'vDash', '\u22AD': 'nvDash', '\u22A9': 'Vdash', '\u22AE': 'nVdash', '\u22AA': 'Vvdash', '\u22AB': 'VDash', '\u22AF': 'nVDash', '\u22B0': 'prurel', '\u22B2': 'vltri', '\u22EA': 'nltri', '\u22B3': 'vrtri', '\u22EB': 'nrtri', '\u22B4': 'ltrie', '\u22EC': 'nltrie', '\u22B4\u20D2': 'nvltrie', '\u22B5': 'rtrie', '\u22ED': 'nrtrie', '\u22B5\u20D2': 'nvrtrie', '\u22B6': 'origof', '\u22B7': 'imof', '\u22B8': 'mumap', '\u22B9': 'hercon', '\u22BA': 'intcal', '\u22BB': 'veebar', '\u22BD': 'barvee', '\u22BE': 'angrtvb', '\u22BF': 'lrtri', '\u22C0': 'Wedge', '\u22C1': 'Vee', '\u22C2': 'xcap', '\u22C3': 'xcup', '\u22C4': 'diam', '\u22C5': 'sdot', '\u22C6': 'Star', '\u22C7': 'divonx', '\u22C8': 'bowtie', '\u22C9': 'ltimes', '\u22CA': 'rtimes', '\u22CB': 'lthree', '\u22CC': 'rthree', '\u22CD': 'bsime', '\u22CE': 'cuvee', '\u22CF': 'cuwed', '\u22D0': 'Sub', '\u22D1': 'Sup', '\u22D2': 'Cap', '\u22D3': 'Cup', '\u22D4': 'fork', '\u22D5': 'epar', '\u22D6': 'ltdot', '\u22D7': 'gtdot', '\u22D8': 'Ll', '\u22D8\u0338': 'nLl', '\u22D9': 'Gg', '\u22D9\u0338': 'nGg', '\u22DA\uFE00': 'lesg', '\u22DA': 'leg', '\u22DB': 'gel', '\u22DB\uFE00': 'gesl', '\u22DE': 'cuepr', '\u22DF': 'cuesc', '\u22E6': 'lnsim', '\u22E7': 'gnsim', '\u22E8': 'prnsim', '\u22E9': 'scnsim', '\u22EE': 'vellip', '\u22EF': 'ctdot', '\u22F0': 'utdot', '\u22F1': 'dtdot', '\u22F2': 'disin', '\u22F3': 'isinsv', '\u22F4': 'isins', '\u22F5': 'isindot', '\u22F5\u0338': 'notindot', '\u22F6': 'notinvc', '\u22F7': 'notinvb', '\u22F9': 'isinE', '\u22F9\u0338': 'notinE', '\u22FA': 'nisd', '\u22FB': 'xnis', '\u22FC': 'nis', '\u22FD': 'notnivc', '\u22FE': 'notnivb', '\u2305': 'barwed', '\u2306': 'Barwed', '\u230C': 'drcrop', '\u230D': 'dlcrop', '\u230E': 'urcrop', '\u230F': 'ulcrop', '\u2310': 'bnot', '\u2312': 'profline', '\u2313': 'profsurf', '\u2315': 'telrec', '\u2316': 'target', '\u231C': 'ulcorn', '\u231D': 'urcorn', '\u231E': 'dlcorn', '\u231F': 'drcorn', '\u2322': 'frown', '\u2323': 'smile', '\u232D': 'cylcty', '\u232E': 'profalar', '\u2336': 'topbot', '\u233D': 'ovbar', '\u233F': 'solbar', '\u237C': 'angzarr', '\u23B0': 'lmoust', '\u23B1': 'rmoust', '\u23B4': 'tbrk', '\u23B5': 'bbrk', '\u23B6': 'bbrktbrk', '\u23DC': 'OverParenthesis', '\u23DD': 'UnderParenthesis', '\u23DE': 'OverBrace', '\u23DF': 'UnderBrace', '\u23E2': 'trpezium', '\u23E7': 'elinters', '\u2423': 'blank', '\u2500': 'boxh', '\u2502': 'boxv', '\u250C': 'boxdr', '\u2510': 'boxdl', '\u2514': 'boxur', '\u2518': 'boxul', '\u251C': 'boxvr', '\u2524': 'boxvl', '\u252C': 'boxhd', '\u2534': 'boxhu', '\u253C': 'boxvh', '\u2550': 'boxH', '\u2551': 'boxV', '\u2552': 'boxdR', '\u2553': 'boxDr', '\u2554': 'boxDR', '\u2555': 'boxdL', '\u2556': 'boxDl', '\u2557': 'boxDL', '\u2558': 'boxuR', '\u2559': 'boxUr', '\u255A': 'boxUR', '\u255B': 'boxuL', '\u255C': 'boxUl', '\u255D': 'boxUL', '\u255E': 'boxvR', '\u255F': 'boxVr', '\u2560': 'boxVR', '\u2561': 'boxvL', '\u2562': 'boxVl', '\u2563': 'boxVL', '\u2564': 'boxHd', '\u2565': 'boxhD', '\u2566': 'boxHD', '\u2567': 'boxHu', '\u2568': 'boxhU', '\u2569': 'boxHU', '\u256A': 'boxvH', '\u256B': 'boxVh', '\u256C': 'boxVH', '\u2580': 'uhblk', '\u2584': 'lhblk', '\u2588': 'block', '\u2591': 'blk14', '\u2592': 'blk12', '\u2593': 'blk34', '\u25A1': 'squ', '\u25AA': 'squf', '\u25AB': 'EmptyVerySmallSquare', '\u25AD': 'rect', '\u25AE': 'marker', '\u25B1': 'fltns', '\u25B3': 'xutri', '\u25B4': 'utrif', '\u25B5': 'utri', '\u25B8': 'rtrif', '\u25B9': 'rtri', '\u25BD': 'xdtri', '\u25BE': 'dtrif', '\u25BF': 'dtri', '\u25C2': 'ltrif', '\u25C3': 'ltri', '\u25CA': 'loz', '\u25CB': 'cir', '\u25EC': 'tridot', '\u25EF': 'xcirc', '\u25F8': 'ultri', '\u25F9': 'urtri', '\u25FA': 'lltri', '\u25FB': 'EmptySmallSquare', '\u25FC': 'FilledSmallSquare', '\u2605': 'starf', '\u2606': 'star', '\u260E': 'phone', '\u2640': 'female', '\u2642': 'male', '\u2660': 'spades', '\u2663': 'clubs', '\u2665': 'hearts', '\u2666': 'diams', '\u266A': 'sung', '\u2713': 'check', '\u2717': 'cross', '\u2720': 'malt', '\u2736': 'sext', '\u2758': 'VerticalSeparator', '\u27C8': 'bsolhsub', '\u27C9': 'suphsol', '\u27F5': 'xlarr', '\u27F6': 'xrarr', '\u27F7': 'xharr', '\u27F8': 'xlArr', '\u27F9': 'xrArr', '\u27FA': 'xhArr', '\u27FC': 'xmap', '\u27FF': 'dzigrarr', '\u2902': 'nvlArr', '\u2903': 'nvrArr', '\u2904': 'nvHarr', '\u2905': 'Map', '\u290C': 'lbarr', '\u290D': 'rbarr', '\u290E': 'lBarr', '\u290F': 'rBarr', '\u2910': 'RBarr', '\u2911': 'DDotrahd', '\u2912': 'UpArrowBar', '\u2913': 'DownArrowBar', '\u2916': 'Rarrtl', '\u2919': 'latail', '\u291A': 'ratail', '\u291B': 'lAtail', '\u291C': 'rAtail', '\u291D': 'larrfs', '\u291E': 'rarrfs', '\u291F': 'larrbfs', '\u2920': 'rarrbfs', '\u2923': 'nwarhk', '\u2924': 'nearhk', '\u2925': 'searhk', '\u2926': 'swarhk', '\u2927': 'nwnear', '\u2928': 'toea', '\u2929': 'tosa', '\u292A': 'swnwar', '\u2933': 'rarrc', '\u2933\u0338': 'nrarrc', '\u2935': 'cudarrr', '\u2936': 'ldca', '\u2937': 'rdca', '\u2938': 'cudarrl', '\u2939': 'larrpl', '\u293C': 'curarrm', '\u293D': 'cularrp', '\u2945': 'rarrpl', '\u2948': 'harrcir', '\u2949': 'Uarrocir', '\u294A': 'lurdshar', '\u294B': 'ldrushar', '\u294E': 'LeftRightVector', '\u294F': 'RightUpDownVector', '\u2950': 'DownLeftRightVector', '\u2951': 'LeftUpDownVector', '\u2952': 'LeftVectorBar', '\u2953': 'RightVectorBar', '\u2954': 'RightUpVectorBar', '\u2955': 'RightDownVectorBar', '\u2956': 'DownLeftVectorBar', '\u2957': 'DownRightVectorBar', '\u2958': 'LeftUpVectorBar', '\u2959': 'LeftDownVectorBar', '\u295A': 'LeftTeeVector', '\u295B': 'RightTeeVector', '\u295C': 'RightUpTeeVector', '\u295D': 'RightDownTeeVector', '\u295E': 'DownLeftTeeVector', '\u295F': 'DownRightTeeVector', '\u2960': 'LeftUpTeeVector', '\u2961': 'LeftDownTeeVector', '\u2962': 'lHar', '\u2963': 'uHar', '\u2964': 'rHar', '\u2965': 'dHar', '\u2966': 'luruhar', '\u2967': 'ldrdhar', '\u2968': 'ruluhar', '\u2969': 'rdldhar', '\u296A': 'lharul', '\u296B': 'llhard', '\u296C': 'rharul', '\u296D': 'lrhard', '\u296E': 'udhar', '\u296F': 'duhar', '\u2970': 'RoundImplies', '\u2971': 'erarr', '\u2972': 'simrarr', '\u2973': 'larrsim', '\u2974': 'rarrsim', '\u2975': 'rarrap', '\u2976': 'ltlarr', '\u2978': 'gtrarr', '\u2979': 'subrarr', '\u297B': 'suplarr', '\u297C': 'lfisht', '\u297D': 'rfisht', '\u297E': 'ufisht', '\u297F': 'dfisht', '\u299A': 'vzigzag', '\u299C': 'vangrt', '\u299D': 'angrtvbd', '\u29A4': 'ange', '\u29A5': 'range', '\u29A6': 'dwangle', '\u29A7': 'uwangle', '\u29A8': 'angmsdaa', '\u29A9': 'angmsdab', '\u29AA': 'angmsdac', '\u29AB': 'angmsdad', '\u29AC': 'angmsdae', '\u29AD': 'angmsdaf', '\u29AE': 'angmsdag', '\u29AF': 'angmsdah', '\u29B0': 'bemptyv', '\u29B1': 'demptyv', '\u29B2': 'cemptyv', '\u29B3': 'raemptyv', '\u29B4': 'laemptyv', '\u29B5': 'ohbar', '\u29B6': 'omid', '\u29B7': 'opar', '\u29B9': 'operp', '\u29BB': 'olcross', '\u29BC': 'odsold', '\u29BE': 'olcir', '\u29BF': 'ofcir', '\u29C0': 'olt', '\u29C1': 'ogt', '\u29C2': 'cirscir', '\u29C3': 'cirE', '\u29C4': 'solb', '\u29C5': 'bsolb', '\u29C9': 'boxbox', '\u29CD': 'trisb', '\u29CE': 'rtriltri', '\u29CF': 'LeftTriangleBar', '\u29CF\u0338': 'NotLeftTriangleBar', '\u29D0': 'RightTriangleBar', '\u29D0\u0338': 'NotRightTriangleBar', '\u29DC': 'iinfin', '\u29DD': 'infintie', '\u29DE': 'nvinfin', '\u29E3': 'eparsl', '\u29E4': 'smeparsl', '\u29E5': 'eqvparsl', '\u29EB': 'lozf', '\u29F4': 'RuleDelayed', '\u29F6': 'dsol', '\u2A00': 'xodot', '\u2A01': 'xoplus', '\u2A02': 'xotime', '\u2A04': 'xuplus', '\u2A06': 'xsqcup', '\u2A0D': 'fpartint', '\u2A10': 'cirfnint', '\u2A11': 'awint', '\u2A12': 'rppolint', '\u2A13': 'scpolint', '\u2A14': 'npolint', '\u2A15': 'pointint', '\u2A16': 'quatint', '\u2A17': 'intlarhk', '\u2A22': 'pluscir', '\u2A23': 'plusacir', '\u2A24': 'simplus', '\u2A25': 'plusdu', '\u2A26': 'plussim', '\u2A27': 'plustwo', '\u2A29': 'mcomma', '\u2A2A': 'minusdu', '\u2A2D': 'loplus', '\u2A2E': 'roplus', '\u2A2F': 'Cross', '\u2A30': 'timesd', '\u2A31': 'timesbar', '\u2A33': 'smashp', '\u2A34': 'lotimes', '\u2A35': 'rotimes', '\u2A36': 'otimesas', '\u2A37': 'Otimes', '\u2A38': 'odiv', '\u2A39': 'triplus', '\u2A3A': 'triminus', '\u2A3B': 'tritime', '\u2A3C': 'iprod', '\u2A3F': 'amalg', '\u2A40': 'capdot', '\u2A42': 'ncup', '\u2A43': 'ncap', '\u2A44': 'capand', '\u2A45': 'cupor', '\u2A46': 'cupcap', '\u2A47': 'capcup', '\u2A48': 'cupbrcap', '\u2A49': 'capbrcup', '\u2A4A': 'cupcup', '\u2A4B': 'capcap', '\u2A4C': 'ccups', '\u2A4D': 'ccaps', '\u2A50': 'ccupssm', '\u2A53': 'And', '\u2A54': 'Or', '\u2A55': 'andand', '\u2A56': 'oror', '\u2A57': 'orslope', '\u2A58': 'andslope', '\u2A5A': 'andv', '\u2A5B': 'orv', '\u2A5C': 'andd', '\u2A5D': 'ord', '\u2A5F': 'wedbar', '\u2A66': 'sdote', '\u2A6A': 'simdot', '\u2A6D': 'congdot', '\u2A6D\u0338': 'ncongdot', '\u2A6E': 'easter', '\u2A6F': 'apacir', '\u2A70': 'apE', '\u2A70\u0338': 'napE', '\u2A71': 'eplus', '\u2A72': 'pluse', '\u2A73': 'Esim', '\u2A77': 'eDDot', '\u2A78': 'equivDD', '\u2A79': 'ltcir', '\u2A7A': 'gtcir', '\u2A7B': 'ltquest', '\u2A7C': 'gtquest', '\u2A7D': 'les', '\u2A7D\u0338': 'nles', '\u2A7E': 'ges', '\u2A7E\u0338': 'nges', '\u2A7F': 'lesdot', '\u2A80': 'gesdot', '\u2A81': 'lesdoto', '\u2A82': 'gesdoto', '\u2A83': 'lesdotor', '\u2A84': 'gesdotol', '\u2A85': 'lap', '\u2A86': 'gap', '\u2A87': 'lne', '\u2A88': 'gne', '\u2A89': 'lnap', '\u2A8A': 'gnap', '\u2A8B': 'lEg', '\u2A8C': 'gEl', '\u2A8D': 'lsime', '\u2A8E': 'gsime', '\u2A8F': 'lsimg', '\u2A90': 'gsiml', '\u2A91': 'lgE', '\u2A92': 'glE', '\u2A93': 'lesges', '\u2A94': 'gesles', '\u2A95': 'els', '\u2A96': 'egs', '\u2A97': 'elsdot', '\u2A98': 'egsdot', '\u2A99': 'el', '\u2A9A': 'eg', '\u2A9D': 'siml', '\u2A9E': 'simg', '\u2A9F': 'simlE', '\u2AA0': 'simgE', '\u2AA1': 'LessLess', '\u2AA1\u0338': 'NotNestedLessLess', '\u2AA2': 'GreaterGreater', '\u2AA2\u0338': 'NotNestedGreaterGreater', '\u2AA4': 'glj', '\u2AA5': 'gla', '\u2AA6': 'ltcc', '\u2AA7': 'gtcc', '\u2AA8': 'lescc', '\u2AA9': 'gescc', '\u2AAA': 'smt', '\u2AAB': 'lat', '\u2AAC': 'smte', '\u2AAC\uFE00': 'smtes', '\u2AAD': 'late', '\u2AAD\uFE00': 'lates', '\u2AAE': 'bumpE', '\u2AAF': 'pre', '\u2AAF\u0338': 'npre', '\u2AB0': 'sce', '\u2AB0\u0338': 'nsce', '\u2AB3': 'prE', '\u2AB4': 'scE', '\u2AB5': 'prnE', '\u2AB6': 'scnE', '\u2AB7': 'prap', '\u2AB8': 'scap', '\u2AB9': 'prnap', '\u2ABA': 'scnap', '\u2ABB': 'Pr', '\u2ABC': 'Sc', '\u2ABD': 'subdot', '\u2ABE': 'supdot', '\u2ABF': 'subplus', '\u2AC0': 'supplus', '\u2AC1': 'submult', '\u2AC2': 'supmult', '\u2AC3': 'subedot', '\u2AC4': 'supedot', '\u2AC5': 'subE', '\u2AC5\u0338': 'nsubE', '\u2AC6': 'supE', '\u2AC6\u0338': 'nsupE', '\u2AC7': 'subsim', '\u2AC8': 'supsim', '\u2ACB\uFE00': 'vsubnE', '\u2ACB': 'subnE', '\u2ACC\uFE00': 'vsupnE', '\u2ACC': 'supnE', '\u2ACF': 'csub', '\u2AD0': 'csup', '\u2AD1': 'csube', '\u2AD2': 'csupe', '\u2AD3': 'subsup', '\u2AD4': 'supsub', '\u2AD5': 'subsub', '\u2AD6': 'supsup', '\u2AD7': 'suphsub', '\u2AD8': 'supdsub', '\u2AD9': 'forkv', '\u2ADA': 'topfork', '\u2ADB': 'mlcp', '\u2AE4': 'Dashv', '\u2AE6': 'Vdashl', '\u2AE7': 'Barv', '\u2AE8': 'vBar', '\u2AE9': 'vBarv', '\u2AEB': 'Vbar', '\u2AEC': 'Not', '\u2AED': 'bNot', '\u2AEE': 'rnmid', '\u2AEF': 'cirmid', '\u2AF0': 'midcir', '\u2AF1': 'topcir', '\u2AF2': 'nhpar', '\u2AF3': 'parsim', '\u2AFD': 'parsl', '\u2AFD\u20E5': 'nparsl', '\u266D': 'flat', '\u266E': 'natur', '\u266F': 'sharp', '\xA4': 'curren', '\xA2': 'cent', '$': 'dollar', '\xA3': 'pound', '\xA5': 'yen', '\u20AC': 'euro', '\xB9': 'sup1', '\xBD': 'half', '\u2153': 'frac13', '\xBC': 'frac14', '\u2155': 'frac15', '\u2159': 'frac16', '\u215B': 'frac18', '\xB2': 'sup2', '\u2154': 'frac23', '\u2156': 'frac25', '\xB3': 'sup3', '\xBE': 'frac34', '\u2157': 'frac35', '\u215C': 'frac38', '\u2158': 'frac45', '\u215A': 'frac56', '\u215D': 'frac58', '\u215E': 'frac78', '\uD835\uDCB6': 'ascr', '\uD835\uDD52': 'aopf', '\uD835\uDD1E': 'afr', '\uD835\uDD38': 'Aopf', '\uD835\uDD04': 'Afr', '\uD835\uDC9C': 'Ascr', '\xAA': 'ordf', '\xE1': 'aacute', '\xC1': 'Aacute', '\xE0': 'agrave', '\xC0': 'Agrave', '\u0103': 'abreve', '\u0102': 'Abreve', '\xE2': 'acirc', '\xC2': 'Acirc', '\xE5': 'aring', '\xC5': 'angst', '\xE4': 'auml', '\xC4': 'Auml', '\xE3': 'atilde', '\xC3': 'Atilde', '\u0105': 'aogon', '\u0104': 'Aogon', '\u0101': 'amacr', '\u0100': 'Amacr', '\xE6': 'aelig', '\xC6': 'AElig', '\uD835\uDCB7': 'bscr', '\uD835\uDD53': 'bopf', '\uD835\uDD1F': 'bfr', '\uD835\uDD39': 'Bopf', '\u212C': 'Bscr', '\uD835\uDD05': 'Bfr', '\uD835\uDD20': 'cfr', '\uD835\uDCB8': 'cscr', '\uD835\uDD54': 'copf', '\u212D': 'Cfr', '\uD835\uDC9E': 'Cscr', '\u2102': 'Copf', '\u0107': 'cacute', '\u0106': 'Cacute', '\u0109': 'ccirc', '\u0108': 'Ccirc', '\u010D': 'ccaron', '\u010C': 'Ccaron', '\u010B': 'cdot', '\u010A': 'Cdot', '\xE7': 'ccedil', '\xC7': 'Ccedil', '\u2105': 'incare', '\uD835\uDD21': 'dfr', '\u2146': 'dd', '\uD835\uDD55': 'dopf', '\uD835\uDCB9': 'dscr', '\uD835\uDC9F': 'Dscr', '\uD835\uDD07': 'Dfr', '\u2145': 'DD', '\uD835\uDD3B': 'Dopf', '\u010F': 'dcaron', '\u010E': 'Dcaron', '\u0111': 'dstrok', '\u0110': 'Dstrok', '\xF0': 'eth', '\xD0': 'ETH', '\u2147': 'ee', '\u212F': 'escr', '\uD835\uDD22': 'efr', '\uD835\uDD56': 'eopf', '\u2130': 'Escr', '\uD835\uDD08': 'Efr', '\uD835\uDD3C': 'Eopf', '\xE9': 'eacute', '\xC9': 'Eacute', '\xE8': 'egrave', '\xC8': 'Egrave', '\xEA': 'ecirc', '\xCA': 'Ecirc', '\u011B': 'ecaron', '\u011A': 'Ecaron', '\xEB': 'euml', '\xCB': 'Euml', '\u0117': 'edot', '\u0116': 'Edot', '\u0119': 'eogon', '\u0118': 'Eogon', '\u0113': 'emacr', '\u0112': 'Emacr', '\uD835\uDD23': 'ffr', '\uD835\uDD57': 'fopf', '\uD835\uDCBB': 'fscr', '\uD835\uDD09': 'Ffr', '\uD835\uDD3D': 'Fopf', '\u2131': 'Fscr', '\uFB00': 'fflig', '\uFB03': 'ffilig', '\uFB04': 'ffllig', '\uFB01': 'filig', 'fj': 'fjlig', '\uFB02': 'fllig', '\u0192': 'fnof', '\u210A': 'gscr', '\uD835\uDD58': 'gopf', '\uD835\uDD24': 'gfr', '\uD835\uDCA2': 'Gscr', '\uD835\uDD3E': 'Gopf', '\uD835\uDD0A': 'Gfr', '\u01F5': 'gacute', '\u011F': 'gbreve', '\u011E': 'Gbreve', '\u011D': 'gcirc', '\u011C': 'Gcirc', '\u0121': 'gdot', '\u0120': 'Gdot', '\u0122': 'Gcedil', '\uD835\uDD25': 'hfr', '\u210E': 'planckh', '\uD835\uDCBD': 'hscr', '\uD835\uDD59': 'hopf', '\u210B': 'Hscr', '\u210C': 'Hfr', '\u210D': 'Hopf', '\u0125': 'hcirc', '\u0124': 'Hcirc', '\u210F': 'hbar', '\u0127': 'hstrok', '\u0126': 'Hstrok', '\uD835\uDD5A': 'iopf', '\uD835\uDD26': 'ifr', '\uD835\uDCBE': 'iscr', '\u2148': 'ii', '\uD835\uDD40': 'Iopf', '\u2110': 'Iscr', '\u2111': 'Im', '\xED': 'iacute', '\xCD': 'Iacute', '\xEC': 'igrave', '\xCC': 'Igrave', '\xEE': 'icirc', '\xCE': 'Icirc', '\xEF': 'iuml', '\xCF': 'Iuml', '\u0129': 'itilde', '\u0128': 'Itilde', '\u0130': 'Idot', '\u012F': 'iogon', '\u012E': 'Iogon', '\u012B': 'imacr', '\u012A': 'Imacr', '\u0133': 'ijlig', '\u0132': 'IJlig', '\u0131': 'imath', '\uD835\uDCBF': 'jscr', '\uD835\uDD5B': 'jopf', '\uD835\uDD27': 'jfr', '\uD835\uDCA5': 'Jscr', '\uD835\uDD0D': 'Jfr', '\uD835\uDD41': 'Jopf', '\u0135': 'jcirc', '\u0134': 'Jcirc', '\u0237': 'jmath', '\uD835\uDD5C': 'kopf', '\uD835\uDCC0': 'kscr', '\uD835\uDD28': 'kfr', '\uD835\uDCA6': 'Kscr', '\uD835\uDD42': 'Kopf', '\uD835\uDD0E': 'Kfr', '\u0137': 'kcedil', '\u0136': 'Kcedil', '\uD835\uDD29': 'lfr', '\uD835\uDCC1': 'lscr', '\u2113': 'ell', '\uD835\uDD5D': 'lopf', '\u2112': 'Lscr', '\uD835\uDD0F': 'Lfr', '\uD835\uDD43': 'Lopf', '\u013A': 'lacute', '\u0139': 'Lacute', '\u013E': 'lcaron', '\u013D': 'Lcaron', '\u013C': 'lcedil', '\u013B': 'Lcedil', '\u0142': 'lstrok', '\u0141': 'Lstrok', '\u0140': 'lmidot', '\u013F': 'Lmidot', '\uD835\uDD2A': 'mfr', '\uD835\uDD5E': 'mopf', '\uD835\uDCC2': 'mscr', '\uD835\uDD10': 'Mfr', '\uD835\uDD44': 'Mopf', '\u2133': 'Mscr', '\uD835\uDD2B': 'nfr', '\uD835\uDD5F': 'nopf', '\uD835\uDCC3': 'nscr', '\u2115': 'Nopf', '\uD835\uDCA9': 'Nscr', '\uD835\uDD11': 'Nfr', '\u0144': 'nacute', '\u0143': 'Nacute', '\u0148': 'ncaron', '\u0147': 'Ncaron', '\xF1': 'ntilde', '\xD1': 'Ntilde', '\u0146': 'ncedil', '\u0145': 'Ncedil', '\u2116': 'numero', '\u014B': 'eng', '\u014A': 'ENG', '\uD835\uDD60': 'oopf', '\uD835\uDD2C': 'ofr', '\u2134': 'oscr', '\uD835\uDCAA': 'Oscr', '\uD835\uDD12': 'Ofr', '\uD835\uDD46': 'Oopf', '\xBA': 'ordm', '\xF3': 'oacute', '\xD3': 'Oacute', '\xF2': 'ograve', '\xD2': 'Ograve', '\xF4': 'ocirc', '\xD4': 'Ocirc', '\xF6': 'ouml', '\xD6': 'Ouml', '\u0151': 'odblac', '\u0150': 'Odblac', '\xF5': 'otilde', '\xD5': 'Otilde', '\xF8': 'oslash', '\xD8': 'Oslash', '\u014D': 'omacr', '\u014C': 'Omacr', '\u0153': 'oelig', '\u0152': 'OElig', '\uD835\uDD2D': 'pfr', '\uD835\uDCC5': 'pscr', '\uD835\uDD61': 'popf', '\u2119': 'Popf', '\uD835\uDD13': 'Pfr', '\uD835\uDCAB': 'Pscr', '\uD835\uDD62': 'qopf', '\uD835\uDD2E': 'qfr', '\uD835\uDCC6': 'qscr', '\uD835\uDCAC': 'Qscr', '\uD835\uDD14': 'Qfr', '\u211A': 'Qopf', '\u0138': 'kgreen', '\uD835\uDD2F': 'rfr', '\uD835\uDD63': 'ropf', '\uD835\uDCC7': 'rscr', '\u211B': 'Rscr', '\u211C': 'Re', '\u211D': 'Ropf', '\u0155': 'racute', '\u0154': 'Racute', '\u0159': 'rcaron', '\u0158': 'Rcaron', '\u0157': 'rcedil', '\u0156': 'Rcedil', '\uD835\uDD64': 'sopf', '\uD835\uDCC8': 'sscr', '\uD835\uDD30': 'sfr', '\uD835\uDD4A': 'Sopf', '\uD835\uDD16': 'Sfr', '\uD835\uDCAE': 'Sscr', '\u24C8': 'oS', '\u015B': 'sacute', '\u015A': 'Sacute', '\u015D': 'scirc', '\u015C': 'Scirc', '\u0161': 'scaron', '\u0160': 'Scaron', '\u015F': 'scedil', '\u015E': 'Scedil', '\xDF': 'szlig', '\uD835\uDD31': 'tfr', '\uD835\uDCC9': 'tscr', '\uD835\uDD65': 'topf', '\uD835\uDCAF': 'Tscr', '\uD835\uDD17': 'Tfr', '\uD835\uDD4B': 'Topf', '\u0165': 'tcaron', '\u0164': 'Tcaron', '\u0163': 'tcedil', '\u0162': 'Tcedil', '\u2122': 'trade', '\u0167': 'tstrok', '\u0166': 'Tstrok', '\uD835\uDCCA': 'uscr', '\uD835\uDD66': 'uopf', '\uD835\uDD32': 'ufr', '\uD835\uDD4C': 'Uopf', '\uD835\uDD18': 'Ufr', '\uD835\uDCB0': 'Uscr', '\xFA': 'uacute', '\xDA': 'Uacute', '\xF9': 'ugrave', '\xD9': 'Ugrave', '\u016D': 'ubreve', '\u016C': 'Ubreve', '\xFB': 'ucirc', '\xDB': 'Ucirc', '\u016F': 'uring', '\u016E': 'Uring', '\xFC': 'uuml', '\xDC': 'Uuml', '\u0171': 'udblac', '\u0170': 'Udblac', '\u0169': 'utilde', '\u0168': 'Utilde', '\u0173': 'uogon', '\u0172': 'Uogon', '\u016B': 'umacr', '\u016A': 'Umacr', '\uD835\uDD33': 'vfr', '\uD835\uDD67': 'vopf', '\uD835\uDCCB': 'vscr', '\uD835\uDD19': 'Vfr', '\uD835\uDD4D': 'Vopf', '\uD835\uDCB1': 'Vscr', '\uD835\uDD68': 'wopf', '\uD835\uDCCC': 'wscr', '\uD835\uDD34': 'wfr', '\uD835\uDCB2': 'Wscr', '\uD835\uDD4E': 'Wopf', '\uD835\uDD1A': 'Wfr', '\u0175': 'wcirc', '\u0174': 'Wcirc', '\uD835\uDD35': 'xfr', '\uD835\uDCCD': 'xscr', '\uD835\uDD69': 'xopf', '\uD835\uDD4F': 'Xopf', '\uD835\uDD1B': 'Xfr', '\uD835\uDCB3': 'Xscr', '\uD835\uDD36': 'yfr', '\uD835\uDCCE': 'yscr', '\uD835\uDD6A': 'yopf', '\uD835\uDCB4': 'Yscr', '\uD835\uDD1C': 'Yfr', '\uD835\uDD50': 'Yopf', '\xFD': 'yacute', '\xDD': 'Yacute', '\u0177': 'ycirc', '\u0176': 'Ycirc', '\xFF': 'yuml', '\u0178': 'Yuml', '\uD835\uDCCF': 'zscr', '\uD835\uDD37': 'zfr', '\uD835\uDD6B': 'zopf', '\u2128': 'Zfr', '\u2124': 'Zopf', '\uD835\uDCB5': 'Zscr', '\u017A': 'zacute', '\u0179': 'Zacute', '\u017E': 'zcaron', '\u017D': 'Zcaron', '\u017C': 'zdot', '\u017B': 'Zdot', '\u01B5': 'imped', '\xFE': 'thorn', '\xDE': 'THORN', '\u0149': 'napos', '\u03B1': 'alpha', '\u0391': 'Alpha', '\u03B2': 'beta', '\u0392': 'Beta', '\u03B3': 'gamma', '\u0393': 'Gamma', '\u03B4': 'delta', '\u0394': 'Delta', '\u03B5': 'epsi', '\u03F5': 'epsiv', '\u0395': 'Epsilon', '\u03DD': 'gammad', '\u03DC': 'Gammad', '\u03B6': 'zeta', '\u0396': 'Zeta', '\u03B7': 'eta', '\u0397': 'Eta', '\u03B8': 'theta', '\u03D1': 'thetav', '\u0398': 'Theta', '\u03B9': 'iota', '\u0399': 'Iota', '\u03BA': 'kappa', '\u03F0': 'kappav', '\u039A': 'Kappa', '\u03BB': 'lambda', '\u039B': 'Lambda', '\u03BC': 'mu', '\xB5': 'micro', '\u039C': 'Mu', '\u03BD': 'nu', '\u039D': 'Nu', '\u03BE': 'xi', '\u039E': 'Xi', '\u03BF': 'omicron', '\u039F': 'Omicron', '\u03C0': 'pi', '\u03D6': 'piv', '\u03A0': 'Pi', '\u03C1': 'rho', '\u03F1': 'rhov', '\u03A1': 'Rho', '\u03C3': 'sigma', '\u03A3': 'Sigma', '\u03C2': 'sigmaf', '\u03C4': 'tau', '\u03A4': 'Tau', '\u03C5': 'upsi', '\u03A5': 'Upsilon', '\u03D2': 'Upsi', '\u03C6': 'phi', '\u03D5': 'phiv', '\u03A6': 'Phi', '\u03C7': 'chi', '\u03A7': 'Chi', '\u03C8': 'psi', '\u03A8': 'Psi', '\u03C9': 'omega', '\u03A9': 'ohm', '\u0430': 'acy', '\u0410': 'Acy', '\u0431': 'bcy', '\u0411': 'Bcy', '\u0432': 'vcy', '\u0412': 'Vcy', '\u0433': 'gcy', '\u0413': 'Gcy', '\u0453': 'gjcy', '\u0403': 'GJcy', '\u0434': 'dcy', '\u0414': 'Dcy', '\u0452': 'djcy', '\u0402': 'DJcy', '\u0435': 'iecy', '\u0415': 'IEcy', '\u0451': 'iocy', '\u0401': 'IOcy', '\u0454': 'jukcy', '\u0404': 'Jukcy', '\u0436': 'zhcy', '\u0416': 'ZHcy', '\u0437': 'zcy', '\u0417': 'Zcy', '\u0455': 'dscy', '\u0405': 'DScy', '\u0438': 'icy', '\u0418': 'Icy', '\u0456': 'iukcy', '\u0406': 'Iukcy', '\u0457': 'yicy', '\u0407': 'YIcy', '\u0439': 'jcy', '\u0419': 'Jcy', '\u0458': 'jsercy', '\u0408': 'Jsercy', '\u043A': 'kcy', '\u041A': 'Kcy', '\u045C': 'kjcy', '\u040C': 'KJcy', '\u043B': 'lcy', '\u041B': 'Lcy', '\u0459': 'ljcy', '\u0409': 'LJcy', '\u043C': 'mcy', '\u041C': 'Mcy', '\u043D': 'ncy', '\u041D': 'Ncy', '\u045A': 'njcy', '\u040A': 'NJcy', '\u043E': 'ocy', '\u041E': 'Ocy', '\u043F': 'pcy', '\u041F': 'Pcy', '\u0440': 'rcy', '\u0420': 'Rcy', '\u0441': 'scy', '\u0421': 'Scy', '\u0442': 'tcy', '\u0422': 'Tcy', '\u045B': 'tshcy', '\u040B': 'TSHcy', '\u0443': 'ucy', '\u0423': 'Ucy', '\u045E': 'ubrcy', '\u040E': 'Ubrcy', '\u0444': 'fcy', '\u0424': 'Fcy', '\u0445': 'khcy', '\u0425': 'KHcy', '\u0446': 'tscy', '\u0426': 'TScy', '\u0447': 'chcy', '\u0427': 'CHcy', '\u045F': 'dzcy', '\u040F': 'DZcy', '\u0448': 'shcy', '\u0428': 'SHcy', '\u0449': 'shchcy', '\u0429': 'SHCHcy', '\u044A': 'hardcy', '\u042A': 'HARDcy', '\u044B': 'ycy', '\u042B': 'Ycy', '\u044C': 'softcy', '\u042C': 'SOFTcy', '\u044D': 'ecy', '\u042D': 'Ecy', '\u044E': 'yucy', '\u042E': 'YUcy', '\u044F': 'yacy', '\u042F': 'YAcy', '\u2135': 'aleph', '\u2136': 'beth', '\u2137': 'gimel', '\u2138': 'daleth' };

	var regexEscape = /["&'<>`]/g;
	var escapeMap = {
		'"': '&quot;',
		'&': '&amp;',
		'\'': '&#x27;',
		'<': '&lt;',
		// See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
		// following is not strictly necessary unless it’s part of a tag or an
		// unquoted attribute value. We’re only escaping it to support those
		// situations, and for XML support.
		'>': '&gt;',
		// In Internet Explorer ≤ 8, the backtick character can be used
		// to break out of (un)quoted attribute values or HTML comments.
		// See http://html5sec.org/#102, http://html5sec.org/#108, and
		// http://html5sec.org/#133.
		'`': '&#x60;'
	};

	var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
	var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var regexDecode = /&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;
	var decodeMap = { 'aacute': '\xE1', 'Aacute': '\xC1', 'abreve': '\u0103', 'Abreve': '\u0102', 'ac': '\u223E', 'acd': '\u223F', 'acE': '\u223E\u0333', 'acirc': '\xE2', 'Acirc': '\xC2', 'acute': '\xB4', 'acy': '\u0430', 'Acy': '\u0410', 'aelig': '\xE6', 'AElig': '\xC6', 'af': '\u2061', 'afr': '\uD835\uDD1E', 'Afr': '\uD835\uDD04', 'agrave': '\xE0', 'Agrave': '\xC0', 'alefsym': '\u2135', 'aleph': '\u2135', 'alpha': '\u03B1', 'Alpha': '\u0391', 'amacr': '\u0101', 'Amacr': '\u0100', 'amalg': '\u2A3F', 'amp': '&', 'AMP': '&', 'and': '\u2227', 'And': '\u2A53', 'andand': '\u2A55', 'andd': '\u2A5C', 'andslope': '\u2A58', 'andv': '\u2A5A', 'ang': '\u2220', 'ange': '\u29A4', 'angle': '\u2220', 'angmsd': '\u2221', 'angmsdaa': '\u29A8', 'angmsdab': '\u29A9', 'angmsdac': '\u29AA', 'angmsdad': '\u29AB', 'angmsdae': '\u29AC', 'angmsdaf': '\u29AD', 'angmsdag': '\u29AE', 'angmsdah': '\u29AF', 'angrt': '\u221F', 'angrtvb': '\u22BE', 'angrtvbd': '\u299D', 'angsph': '\u2222', 'angst': '\xC5', 'angzarr': '\u237C', 'aogon': '\u0105', 'Aogon': '\u0104', 'aopf': '\uD835\uDD52', 'Aopf': '\uD835\uDD38', 'ap': '\u2248', 'apacir': '\u2A6F', 'ape': '\u224A', 'apE': '\u2A70', 'apid': '\u224B', 'apos': '\'', 'ApplyFunction': '\u2061', 'approx': '\u2248', 'approxeq': '\u224A', 'aring': '\xE5', 'Aring': '\xC5', 'ascr': '\uD835\uDCB6', 'Ascr': '\uD835\uDC9C', 'Assign': '\u2254', 'ast': '*', 'asymp': '\u2248', 'asympeq': '\u224D', 'atilde': '\xE3', 'Atilde': '\xC3', 'auml': '\xE4', 'Auml': '\xC4', 'awconint': '\u2233', 'awint': '\u2A11', 'backcong': '\u224C', 'backepsilon': '\u03F6', 'backprime': '\u2035', 'backsim': '\u223D', 'backsimeq': '\u22CD', 'Backslash': '\u2216', 'Barv': '\u2AE7', 'barvee': '\u22BD', 'barwed': '\u2305', 'Barwed': '\u2306', 'barwedge': '\u2305', 'bbrk': '\u23B5', 'bbrktbrk': '\u23B6', 'bcong': '\u224C', 'bcy': '\u0431', 'Bcy': '\u0411', 'bdquo': '\u201E', 'becaus': '\u2235', 'because': '\u2235', 'Because': '\u2235', 'bemptyv': '\u29B0', 'bepsi': '\u03F6', 'bernou': '\u212C', 'Bernoullis': '\u212C', 'beta': '\u03B2', 'Beta': '\u0392', 'beth': '\u2136', 'between': '\u226C', 'bfr': '\uD835\uDD1F', 'Bfr': '\uD835\uDD05', 'bigcap': '\u22C2', 'bigcirc': '\u25EF', 'bigcup': '\u22C3', 'bigodot': '\u2A00', 'bigoplus': '\u2A01', 'bigotimes': '\u2A02', 'bigsqcup': '\u2A06', 'bigstar': '\u2605', 'bigtriangledown': '\u25BD', 'bigtriangleup': '\u25B3', 'biguplus': '\u2A04', 'bigvee': '\u22C1', 'bigwedge': '\u22C0', 'bkarow': '\u290D', 'blacklozenge': '\u29EB', 'blacksquare': '\u25AA', 'blacktriangle': '\u25B4', 'blacktriangledown': '\u25BE', 'blacktriangleleft': '\u25C2', 'blacktriangleright': '\u25B8', 'blank': '\u2423', 'blk12': '\u2592', 'blk14': '\u2591', 'blk34': '\u2593', 'block': '\u2588', 'bne': '=\u20E5', 'bnequiv': '\u2261\u20E5', 'bnot': '\u2310', 'bNot': '\u2AED', 'bopf': '\uD835\uDD53', 'Bopf': '\uD835\uDD39', 'bot': '\u22A5', 'bottom': '\u22A5', 'bowtie': '\u22C8', 'boxbox': '\u29C9', 'boxdl': '\u2510', 'boxdL': '\u2555', 'boxDl': '\u2556', 'boxDL': '\u2557', 'boxdr': '\u250C', 'boxdR': '\u2552', 'boxDr': '\u2553', 'boxDR': '\u2554', 'boxh': '\u2500', 'boxH': '\u2550', 'boxhd': '\u252C', 'boxhD': '\u2565', 'boxHd': '\u2564', 'boxHD': '\u2566', 'boxhu': '\u2534', 'boxhU': '\u2568', 'boxHu': '\u2567', 'boxHU': '\u2569', 'boxminus': '\u229F', 'boxplus': '\u229E', 'boxtimes': '\u22A0', 'boxul': '\u2518', 'boxuL': '\u255B', 'boxUl': '\u255C', 'boxUL': '\u255D', 'boxur': '\u2514', 'boxuR': '\u2558', 'boxUr': '\u2559', 'boxUR': '\u255A', 'boxv': '\u2502', 'boxV': '\u2551', 'boxvh': '\u253C', 'boxvH': '\u256A', 'boxVh': '\u256B', 'boxVH': '\u256C', 'boxvl': '\u2524', 'boxvL': '\u2561', 'boxVl': '\u2562', 'boxVL': '\u2563', 'boxvr': '\u251C', 'boxvR': '\u255E', 'boxVr': '\u255F', 'boxVR': '\u2560', 'bprime': '\u2035', 'breve': '\u02D8', 'Breve': '\u02D8', 'brvbar': '\xA6', 'bscr': '\uD835\uDCB7', 'Bscr': '\u212C', 'bsemi': '\u204F', 'bsim': '\u223D', 'bsime': '\u22CD', 'bsol': '\\', 'bsolb': '\u29C5', 'bsolhsub': '\u27C8', 'bull': '\u2022', 'bullet': '\u2022', 'bump': '\u224E', 'bumpe': '\u224F', 'bumpE': '\u2AAE', 'bumpeq': '\u224F', 'Bumpeq': '\u224E', 'cacute': '\u0107', 'Cacute': '\u0106', 'cap': '\u2229', 'Cap': '\u22D2', 'capand': '\u2A44', 'capbrcup': '\u2A49', 'capcap': '\u2A4B', 'capcup': '\u2A47', 'capdot': '\u2A40', 'CapitalDifferentialD': '\u2145', 'caps': '\u2229\uFE00', 'caret': '\u2041', 'caron': '\u02C7', 'Cayleys': '\u212D', 'ccaps': '\u2A4D', 'ccaron': '\u010D', 'Ccaron': '\u010C', 'ccedil': '\xE7', 'Ccedil': '\xC7', 'ccirc': '\u0109', 'Ccirc': '\u0108', 'Cconint': '\u2230', 'ccups': '\u2A4C', 'ccupssm': '\u2A50', 'cdot': '\u010B', 'Cdot': '\u010A', 'cedil': '\xB8', 'Cedilla': '\xB8', 'cemptyv': '\u29B2', 'cent': '\xA2', 'centerdot': '\xB7', 'CenterDot': '\xB7', 'cfr': '\uD835\uDD20', 'Cfr': '\u212D', 'chcy': '\u0447', 'CHcy': '\u0427', 'check': '\u2713', 'checkmark': '\u2713', 'chi': '\u03C7', 'Chi': '\u03A7', 'cir': '\u25CB', 'circ': '\u02C6', 'circeq': '\u2257', 'circlearrowleft': '\u21BA', 'circlearrowright': '\u21BB', 'circledast': '\u229B', 'circledcirc': '\u229A', 'circleddash': '\u229D', 'CircleDot': '\u2299', 'circledR': '\xAE', 'circledS': '\u24C8', 'CircleMinus': '\u2296', 'CirclePlus': '\u2295', 'CircleTimes': '\u2297', 'cire': '\u2257', 'cirE': '\u29C3', 'cirfnint': '\u2A10', 'cirmid': '\u2AEF', 'cirscir': '\u29C2', 'ClockwiseContourIntegral': '\u2232', 'CloseCurlyDoubleQuote': '\u201D', 'CloseCurlyQuote': '\u2019', 'clubs': '\u2663', 'clubsuit': '\u2663', 'colon': ':', 'Colon': '\u2237', 'colone': '\u2254', 'Colone': '\u2A74', 'coloneq': '\u2254', 'comma': ',', 'commat': '@', 'comp': '\u2201', 'compfn': '\u2218', 'complement': '\u2201', 'complexes': '\u2102', 'cong': '\u2245', 'congdot': '\u2A6D', 'Congruent': '\u2261', 'conint': '\u222E', 'Conint': '\u222F', 'ContourIntegral': '\u222E', 'copf': '\uD835\uDD54', 'Copf': '\u2102', 'coprod': '\u2210', 'Coproduct': '\u2210', 'copy': '\xA9', 'COPY': '\xA9', 'copysr': '\u2117', 'CounterClockwiseContourIntegral': '\u2233', 'crarr': '\u21B5', 'cross': '\u2717', 'Cross': '\u2A2F', 'cscr': '\uD835\uDCB8', 'Cscr': '\uD835\uDC9E', 'csub': '\u2ACF', 'csube': '\u2AD1', 'csup': '\u2AD0', 'csupe': '\u2AD2', 'ctdot': '\u22EF', 'cudarrl': '\u2938', 'cudarrr': '\u2935', 'cuepr': '\u22DE', 'cuesc': '\u22DF', 'cularr': '\u21B6', 'cularrp': '\u293D', 'cup': '\u222A', 'Cup': '\u22D3', 'cupbrcap': '\u2A48', 'cupcap': '\u2A46', 'CupCap': '\u224D', 'cupcup': '\u2A4A', 'cupdot': '\u228D', 'cupor': '\u2A45', 'cups': '\u222A\uFE00', 'curarr': '\u21B7', 'curarrm': '\u293C', 'curlyeqprec': '\u22DE', 'curlyeqsucc': '\u22DF', 'curlyvee': '\u22CE', 'curlywedge': '\u22CF', 'curren': '\xA4', 'curvearrowleft': '\u21B6', 'curvearrowright': '\u21B7', 'cuvee': '\u22CE', 'cuwed': '\u22CF', 'cwconint': '\u2232', 'cwint': '\u2231', 'cylcty': '\u232D', 'dagger': '\u2020', 'Dagger': '\u2021', 'daleth': '\u2138', 'darr': '\u2193', 'dArr': '\u21D3', 'Darr': '\u21A1', 'dash': '\u2010', 'dashv': '\u22A3', 'Dashv': '\u2AE4', 'dbkarow': '\u290F', 'dblac': '\u02DD', 'dcaron': '\u010F', 'Dcaron': '\u010E', 'dcy': '\u0434', 'Dcy': '\u0414', 'dd': '\u2146', 'DD': '\u2145', 'ddagger': '\u2021', 'ddarr': '\u21CA', 'DDotrahd': '\u2911', 'ddotseq': '\u2A77', 'deg': '\xB0', 'Del': '\u2207', 'delta': '\u03B4', 'Delta': '\u0394', 'demptyv': '\u29B1', 'dfisht': '\u297F', 'dfr': '\uD835\uDD21', 'Dfr': '\uD835\uDD07', 'dHar': '\u2965', 'dharl': '\u21C3', 'dharr': '\u21C2', 'DiacriticalAcute': '\xB4', 'DiacriticalDot': '\u02D9', 'DiacriticalDoubleAcute': '\u02DD', 'DiacriticalGrave': '`', 'DiacriticalTilde': '\u02DC', 'diam': '\u22C4', 'diamond': '\u22C4', 'Diamond': '\u22C4', 'diamondsuit': '\u2666', 'diams': '\u2666', 'die': '\xA8', 'DifferentialD': '\u2146', 'digamma': '\u03DD', 'disin': '\u22F2', 'div': '\xF7', 'divide': '\xF7', 'divideontimes': '\u22C7', 'divonx': '\u22C7', 'djcy': '\u0452', 'DJcy': '\u0402', 'dlcorn': '\u231E', 'dlcrop': '\u230D', 'dollar': '$', 'dopf': '\uD835\uDD55', 'Dopf': '\uD835\uDD3B', 'dot': '\u02D9', 'Dot': '\xA8', 'DotDot': '\u20DC', 'doteq': '\u2250', 'doteqdot': '\u2251', 'DotEqual': '\u2250', 'dotminus': '\u2238', 'dotplus': '\u2214', 'dotsquare': '\u22A1', 'doublebarwedge': '\u2306', 'DoubleContourIntegral': '\u222F', 'DoubleDot': '\xA8', 'DoubleDownArrow': '\u21D3', 'DoubleLeftArrow': '\u21D0', 'DoubleLeftRightArrow': '\u21D4', 'DoubleLeftTee': '\u2AE4', 'DoubleLongLeftArrow': '\u27F8', 'DoubleLongLeftRightArrow': '\u27FA', 'DoubleLongRightArrow': '\u27F9', 'DoubleRightArrow': '\u21D2', 'DoubleRightTee': '\u22A8', 'DoubleUpArrow': '\u21D1', 'DoubleUpDownArrow': '\u21D5', 'DoubleVerticalBar': '\u2225', 'downarrow': '\u2193', 'Downarrow': '\u21D3', 'DownArrow': '\u2193', 'DownArrowBar': '\u2913', 'DownArrowUpArrow': '\u21F5', 'DownBreve': '\u0311', 'downdownarrows': '\u21CA', 'downharpoonleft': '\u21C3', 'downharpoonright': '\u21C2', 'DownLeftRightVector': '\u2950', 'DownLeftTeeVector': '\u295E', 'DownLeftVector': '\u21BD', 'DownLeftVectorBar': '\u2956', 'DownRightTeeVector': '\u295F', 'DownRightVector': '\u21C1', 'DownRightVectorBar': '\u2957', 'DownTee': '\u22A4', 'DownTeeArrow': '\u21A7', 'drbkarow': '\u2910', 'drcorn': '\u231F', 'drcrop': '\u230C', 'dscr': '\uD835\uDCB9', 'Dscr': '\uD835\uDC9F', 'dscy': '\u0455', 'DScy': '\u0405', 'dsol': '\u29F6', 'dstrok': '\u0111', 'Dstrok': '\u0110', 'dtdot': '\u22F1', 'dtri': '\u25BF', 'dtrif': '\u25BE', 'duarr': '\u21F5', 'duhar': '\u296F', 'dwangle': '\u29A6', 'dzcy': '\u045F', 'DZcy': '\u040F', 'dzigrarr': '\u27FF', 'eacute': '\xE9', 'Eacute': '\xC9', 'easter': '\u2A6E', 'ecaron': '\u011B', 'Ecaron': '\u011A', 'ecir': '\u2256', 'ecirc': '\xEA', 'Ecirc': '\xCA', 'ecolon': '\u2255', 'ecy': '\u044D', 'Ecy': '\u042D', 'eDDot': '\u2A77', 'edot': '\u0117', 'eDot': '\u2251', 'Edot': '\u0116', 'ee': '\u2147', 'efDot': '\u2252', 'efr': '\uD835\uDD22', 'Efr': '\uD835\uDD08', 'eg': '\u2A9A', 'egrave': '\xE8', 'Egrave': '\xC8', 'egs': '\u2A96', 'egsdot': '\u2A98', 'el': '\u2A99', 'Element': '\u2208', 'elinters': '\u23E7', 'ell': '\u2113', 'els': '\u2A95', 'elsdot': '\u2A97', 'emacr': '\u0113', 'Emacr': '\u0112', 'empty': '\u2205', 'emptyset': '\u2205', 'EmptySmallSquare': '\u25FB', 'emptyv': '\u2205', 'EmptyVerySmallSquare': '\u25AB', 'emsp': '\u2003', 'emsp13': '\u2004', 'emsp14': '\u2005', 'eng': '\u014B', 'ENG': '\u014A', 'ensp': '\u2002', 'eogon': '\u0119', 'Eogon': '\u0118', 'eopf': '\uD835\uDD56', 'Eopf': '\uD835\uDD3C', 'epar': '\u22D5', 'eparsl': '\u29E3', 'eplus': '\u2A71', 'epsi': '\u03B5', 'epsilon': '\u03B5', 'Epsilon': '\u0395', 'epsiv': '\u03F5', 'eqcirc': '\u2256', 'eqcolon': '\u2255', 'eqsim': '\u2242', 'eqslantgtr': '\u2A96', 'eqslantless': '\u2A95', 'Equal': '\u2A75', 'equals': '=', 'EqualTilde': '\u2242', 'equest': '\u225F', 'Equilibrium': '\u21CC', 'equiv': '\u2261', 'equivDD': '\u2A78', 'eqvparsl': '\u29E5', 'erarr': '\u2971', 'erDot': '\u2253', 'escr': '\u212F', 'Escr': '\u2130', 'esdot': '\u2250', 'esim': '\u2242', 'Esim': '\u2A73', 'eta': '\u03B7', 'Eta': '\u0397', 'eth': '\xF0', 'ETH': '\xD0', 'euml': '\xEB', 'Euml': '\xCB', 'euro': '\u20AC', 'excl': '!', 'exist': '\u2203', 'Exists': '\u2203', 'expectation': '\u2130', 'exponentiale': '\u2147', 'ExponentialE': '\u2147', 'fallingdotseq': '\u2252', 'fcy': '\u0444', 'Fcy': '\u0424', 'female': '\u2640', 'ffilig': '\uFB03', 'fflig': '\uFB00', 'ffllig': '\uFB04', 'ffr': '\uD835\uDD23', 'Ffr': '\uD835\uDD09', 'filig': '\uFB01', 'FilledSmallSquare': '\u25FC', 'FilledVerySmallSquare': '\u25AA', 'fjlig': 'fj', 'flat': '\u266D', 'fllig': '\uFB02', 'fltns': '\u25B1', 'fnof': '\u0192', 'fopf': '\uD835\uDD57', 'Fopf': '\uD835\uDD3D', 'forall': '\u2200', 'ForAll': '\u2200', 'fork': '\u22D4', 'forkv': '\u2AD9', 'Fouriertrf': '\u2131', 'fpartint': '\u2A0D', 'frac12': '\xBD', 'frac13': '\u2153', 'frac14': '\xBC', 'frac15': '\u2155', 'frac16': '\u2159', 'frac18': '\u215B', 'frac23': '\u2154', 'frac25': '\u2156', 'frac34': '\xBE', 'frac35': '\u2157', 'frac38': '\u215C', 'frac45': '\u2158', 'frac56': '\u215A', 'frac58': '\u215D', 'frac78': '\u215E', 'frasl': '\u2044', 'frown': '\u2322', 'fscr': '\uD835\uDCBB', 'Fscr': '\u2131', 'gacute': '\u01F5', 'gamma': '\u03B3', 'Gamma': '\u0393', 'gammad': '\u03DD', 'Gammad': '\u03DC', 'gap': '\u2A86', 'gbreve': '\u011F', 'Gbreve': '\u011E', 'Gcedil': '\u0122', 'gcirc': '\u011D', 'Gcirc': '\u011C', 'gcy': '\u0433', 'Gcy': '\u0413', 'gdot': '\u0121', 'Gdot': '\u0120', 'ge': '\u2265', 'gE': '\u2267', 'gel': '\u22DB', 'gEl': '\u2A8C', 'geq': '\u2265', 'geqq': '\u2267', 'geqslant': '\u2A7E', 'ges': '\u2A7E', 'gescc': '\u2AA9', 'gesdot': '\u2A80', 'gesdoto': '\u2A82', 'gesdotol': '\u2A84', 'gesl': '\u22DB\uFE00', 'gesles': '\u2A94', 'gfr': '\uD835\uDD24', 'Gfr': '\uD835\uDD0A', 'gg': '\u226B', 'Gg': '\u22D9', 'ggg': '\u22D9', 'gimel': '\u2137', 'gjcy': '\u0453', 'GJcy': '\u0403', 'gl': '\u2277', 'gla': '\u2AA5', 'glE': '\u2A92', 'glj': '\u2AA4', 'gnap': '\u2A8A', 'gnapprox': '\u2A8A', 'gne': '\u2A88', 'gnE': '\u2269', 'gneq': '\u2A88', 'gneqq': '\u2269', 'gnsim': '\u22E7', 'gopf': '\uD835\uDD58', 'Gopf': '\uD835\uDD3E', 'grave': '`', 'GreaterEqual': '\u2265', 'GreaterEqualLess': '\u22DB', 'GreaterFullEqual': '\u2267', 'GreaterGreater': '\u2AA2', 'GreaterLess': '\u2277', 'GreaterSlantEqual': '\u2A7E', 'GreaterTilde': '\u2273', 'gscr': '\u210A', 'Gscr': '\uD835\uDCA2', 'gsim': '\u2273', 'gsime': '\u2A8E', 'gsiml': '\u2A90', 'gt': '>', 'Gt': '\u226B', 'GT': '>', 'gtcc': '\u2AA7', 'gtcir': '\u2A7A', 'gtdot': '\u22D7', 'gtlPar': '\u2995', 'gtquest': '\u2A7C', 'gtrapprox': '\u2A86', 'gtrarr': '\u2978', 'gtrdot': '\u22D7', 'gtreqless': '\u22DB', 'gtreqqless': '\u2A8C', 'gtrless': '\u2277', 'gtrsim': '\u2273', 'gvertneqq': '\u2269\uFE00', 'gvnE': '\u2269\uFE00', 'Hacek': '\u02C7', 'hairsp': '\u200A', 'half': '\xBD', 'hamilt': '\u210B', 'hardcy': '\u044A', 'HARDcy': '\u042A', 'harr': '\u2194', 'hArr': '\u21D4', 'harrcir': '\u2948', 'harrw': '\u21AD', 'Hat': '^', 'hbar': '\u210F', 'hcirc': '\u0125', 'Hcirc': '\u0124', 'hearts': '\u2665', 'heartsuit': '\u2665', 'hellip': '\u2026', 'hercon': '\u22B9', 'hfr': '\uD835\uDD25', 'Hfr': '\u210C', 'HilbertSpace': '\u210B', 'hksearow': '\u2925', 'hkswarow': '\u2926', 'hoarr': '\u21FF', 'homtht': '\u223B', 'hookleftarrow': '\u21A9', 'hookrightarrow': '\u21AA', 'hopf': '\uD835\uDD59', 'Hopf': '\u210D', 'horbar': '\u2015', 'HorizontalLine': '\u2500', 'hscr': '\uD835\uDCBD', 'Hscr': '\u210B', 'hslash': '\u210F', 'hstrok': '\u0127', 'Hstrok': '\u0126', 'HumpDownHump': '\u224E', 'HumpEqual': '\u224F', 'hybull': '\u2043', 'hyphen': '\u2010', 'iacute': '\xED', 'Iacute': '\xCD', 'ic': '\u2063', 'icirc': '\xEE', 'Icirc': '\xCE', 'icy': '\u0438', 'Icy': '\u0418', 'Idot': '\u0130', 'iecy': '\u0435', 'IEcy': '\u0415', 'iexcl': '\xA1', 'iff': '\u21D4', 'ifr': '\uD835\uDD26', 'Ifr': '\u2111', 'igrave': '\xEC', 'Igrave': '\xCC', 'ii': '\u2148', 'iiiint': '\u2A0C', 'iiint': '\u222D', 'iinfin': '\u29DC', 'iiota': '\u2129', 'ijlig': '\u0133', 'IJlig': '\u0132', 'Im': '\u2111', 'imacr': '\u012B', 'Imacr': '\u012A', 'image': '\u2111', 'ImaginaryI': '\u2148', 'imagline': '\u2110', 'imagpart': '\u2111', 'imath': '\u0131', 'imof': '\u22B7', 'imped': '\u01B5', 'Implies': '\u21D2', 'in': '\u2208', 'incare': '\u2105', 'infin': '\u221E', 'infintie': '\u29DD', 'inodot': '\u0131', 'int': '\u222B', 'Int': '\u222C', 'intcal': '\u22BA', 'integers': '\u2124', 'Integral': '\u222B', 'intercal': '\u22BA', 'Intersection': '\u22C2', 'intlarhk': '\u2A17', 'intprod': '\u2A3C', 'InvisibleComma': '\u2063', 'InvisibleTimes': '\u2062', 'iocy': '\u0451', 'IOcy': '\u0401', 'iogon': '\u012F', 'Iogon': '\u012E', 'iopf': '\uD835\uDD5A', 'Iopf': '\uD835\uDD40', 'iota': '\u03B9', 'Iota': '\u0399', 'iprod': '\u2A3C', 'iquest': '\xBF', 'iscr': '\uD835\uDCBE', 'Iscr': '\u2110', 'isin': '\u2208', 'isindot': '\u22F5', 'isinE': '\u22F9', 'isins': '\u22F4', 'isinsv': '\u22F3', 'isinv': '\u2208', 'it': '\u2062', 'itilde': '\u0129', 'Itilde': '\u0128', 'iukcy': '\u0456', 'Iukcy': '\u0406', 'iuml': '\xEF', 'Iuml': '\xCF', 'jcirc': '\u0135', 'Jcirc': '\u0134', 'jcy': '\u0439', 'Jcy': '\u0419', 'jfr': '\uD835\uDD27', 'Jfr': '\uD835\uDD0D', 'jmath': '\u0237', 'jopf': '\uD835\uDD5B', 'Jopf': '\uD835\uDD41', 'jscr': '\uD835\uDCBF', 'Jscr': '\uD835\uDCA5', 'jsercy': '\u0458', 'Jsercy': '\u0408', 'jukcy': '\u0454', 'Jukcy': '\u0404', 'kappa': '\u03BA', 'Kappa': '\u039A', 'kappav': '\u03F0', 'kcedil': '\u0137', 'Kcedil': '\u0136', 'kcy': '\u043A', 'Kcy': '\u041A', 'kfr': '\uD835\uDD28', 'Kfr': '\uD835\uDD0E', 'kgreen': '\u0138', 'khcy': '\u0445', 'KHcy': '\u0425', 'kjcy': '\u045C', 'KJcy': '\u040C', 'kopf': '\uD835\uDD5C', 'Kopf': '\uD835\uDD42', 'kscr': '\uD835\uDCC0', 'Kscr': '\uD835\uDCA6', 'lAarr': '\u21DA', 'lacute': '\u013A', 'Lacute': '\u0139', 'laemptyv': '\u29B4', 'lagran': '\u2112', 'lambda': '\u03BB', 'Lambda': '\u039B', 'lang': '\u27E8', 'Lang': '\u27EA', 'langd': '\u2991', 'langle': '\u27E8', 'lap': '\u2A85', 'Laplacetrf': '\u2112', 'laquo': '\xAB', 'larr': '\u2190', 'lArr': '\u21D0', 'Larr': '\u219E', 'larrb': '\u21E4', 'larrbfs': '\u291F', 'larrfs': '\u291D', 'larrhk': '\u21A9', 'larrlp': '\u21AB', 'larrpl': '\u2939', 'larrsim': '\u2973', 'larrtl': '\u21A2', 'lat': '\u2AAB', 'latail': '\u2919', 'lAtail': '\u291B', 'late': '\u2AAD', 'lates': '\u2AAD\uFE00', 'lbarr': '\u290C', 'lBarr': '\u290E', 'lbbrk': '\u2772', 'lbrace': '{', 'lbrack': '[', 'lbrke': '\u298B', 'lbrksld': '\u298F', 'lbrkslu': '\u298D', 'lcaron': '\u013E', 'Lcaron': '\u013D', 'lcedil': '\u013C', 'Lcedil': '\u013B', 'lceil': '\u2308', 'lcub': '{', 'lcy': '\u043B', 'Lcy': '\u041B', 'ldca': '\u2936', 'ldquo': '\u201C', 'ldquor': '\u201E', 'ldrdhar': '\u2967', 'ldrushar': '\u294B', 'ldsh': '\u21B2', 'le': '\u2264', 'lE': '\u2266', 'LeftAngleBracket': '\u27E8', 'leftarrow': '\u2190', 'Leftarrow': '\u21D0', 'LeftArrow': '\u2190', 'LeftArrowBar': '\u21E4', 'LeftArrowRightArrow': '\u21C6', 'leftarrowtail': '\u21A2', 'LeftCeiling': '\u2308', 'LeftDoubleBracket': '\u27E6', 'LeftDownTeeVector': '\u2961', 'LeftDownVector': '\u21C3', 'LeftDownVectorBar': '\u2959', 'LeftFloor': '\u230A', 'leftharpoondown': '\u21BD', 'leftharpoonup': '\u21BC', 'leftleftarrows': '\u21C7', 'leftrightarrow': '\u2194', 'Leftrightarrow': '\u21D4', 'LeftRightArrow': '\u2194', 'leftrightarrows': '\u21C6', 'leftrightharpoons': '\u21CB', 'leftrightsquigarrow': '\u21AD', 'LeftRightVector': '\u294E', 'LeftTee': '\u22A3', 'LeftTeeArrow': '\u21A4', 'LeftTeeVector': '\u295A', 'leftthreetimes': '\u22CB', 'LeftTriangle': '\u22B2', 'LeftTriangleBar': '\u29CF', 'LeftTriangleEqual': '\u22B4', 'LeftUpDownVector': '\u2951', 'LeftUpTeeVector': '\u2960', 'LeftUpVector': '\u21BF', 'LeftUpVectorBar': '\u2958', 'LeftVector': '\u21BC', 'LeftVectorBar': '\u2952', 'leg': '\u22DA', 'lEg': '\u2A8B', 'leq': '\u2264', 'leqq': '\u2266', 'leqslant': '\u2A7D', 'les': '\u2A7D', 'lescc': '\u2AA8', 'lesdot': '\u2A7F', 'lesdoto': '\u2A81', 'lesdotor': '\u2A83', 'lesg': '\u22DA\uFE00', 'lesges': '\u2A93', 'lessapprox': '\u2A85', 'lessdot': '\u22D6', 'lesseqgtr': '\u22DA', 'lesseqqgtr': '\u2A8B', 'LessEqualGreater': '\u22DA', 'LessFullEqual': '\u2266', 'LessGreater': '\u2276', 'lessgtr': '\u2276', 'LessLess': '\u2AA1', 'lesssim': '\u2272', 'LessSlantEqual': '\u2A7D', 'LessTilde': '\u2272', 'lfisht': '\u297C', 'lfloor': '\u230A', 'lfr': '\uD835\uDD29', 'Lfr': '\uD835\uDD0F', 'lg': '\u2276', 'lgE': '\u2A91', 'lHar': '\u2962', 'lhard': '\u21BD', 'lharu': '\u21BC', 'lharul': '\u296A', 'lhblk': '\u2584', 'ljcy': '\u0459', 'LJcy': '\u0409', 'll': '\u226A', 'Ll': '\u22D8', 'llarr': '\u21C7', 'llcorner': '\u231E', 'Lleftarrow': '\u21DA', 'llhard': '\u296B', 'lltri': '\u25FA', 'lmidot': '\u0140', 'Lmidot': '\u013F', 'lmoust': '\u23B0', 'lmoustache': '\u23B0', 'lnap': '\u2A89', 'lnapprox': '\u2A89', 'lne': '\u2A87', 'lnE': '\u2268', 'lneq': '\u2A87', 'lneqq': '\u2268', 'lnsim': '\u22E6', 'loang': '\u27EC', 'loarr': '\u21FD', 'lobrk': '\u27E6', 'longleftarrow': '\u27F5', 'Longleftarrow': '\u27F8', 'LongLeftArrow': '\u27F5', 'longleftrightarrow': '\u27F7', 'Longleftrightarrow': '\u27FA', 'LongLeftRightArrow': '\u27F7', 'longmapsto': '\u27FC', 'longrightarrow': '\u27F6', 'Longrightarrow': '\u27F9', 'LongRightArrow': '\u27F6', 'looparrowleft': '\u21AB', 'looparrowright': '\u21AC', 'lopar': '\u2985', 'lopf': '\uD835\uDD5D', 'Lopf': '\uD835\uDD43', 'loplus': '\u2A2D', 'lotimes': '\u2A34', 'lowast': '\u2217', 'lowbar': '_', 'LowerLeftArrow': '\u2199', 'LowerRightArrow': '\u2198', 'loz': '\u25CA', 'lozenge': '\u25CA', 'lozf': '\u29EB', 'lpar': '(', 'lparlt': '\u2993', 'lrarr': '\u21C6', 'lrcorner': '\u231F', 'lrhar': '\u21CB', 'lrhard': '\u296D', 'lrm': '\u200E', 'lrtri': '\u22BF', 'lsaquo': '\u2039', 'lscr': '\uD835\uDCC1', 'Lscr': '\u2112', 'lsh': '\u21B0', 'Lsh': '\u21B0', 'lsim': '\u2272', 'lsime': '\u2A8D', 'lsimg': '\u2A8F', 'lsqb': '[', 'lsquo': '\u2018', 'lsquor': '\u201A', 'lstrok': '\u0142', 'Lstrok': '\u0141', 'lt': '<', 'Lt': '\u226A', 'LT': '<', 'ltcc': '\u2AA6', 'ltcir': '\u2A79', 'ltdot': '\u22D6', 'lthree': '\u22CB', 'ltimes': '\u22C9', 'ltlarr': '\u2976', 'ltquest': '\u2A7B', 'ltri': '\u25C3', 'ltrie': '\u22B4', 'ltrif': '\u25C2', 'ltrPar': '\u2996', 'lurdshar': '\u294A', 'luruhar': '\u2966', 'lvertneqq': '\u2268\uFE00', 'lvnE': '\u2268\uFE00', 'macr': '\xAF', 'male': '\u2642', 'malt': '\u2720', 'maltese': '\u2720', 'map': '\u21A6', 'Map': '\u2905', 'mapsto': '\u21A6', 'mapstodown': '\u21A7', 'mapstoleft': '\u21A4', 'mapstoup': '\u21A5', 'marker': '\u25AE', 'mcomma': '\u2A29', 'mcy': '\u043C', 'Mcy': '\u041C', 'mdash': '\u2014', 'mDDot': '\u223A', 'measuredangle': '\u2221', 'MediumSpace': '\u205F', 'Mellintrf': '\u2133', 'mfr': '\uD835\uDD2A', 'Mfr': '\uD835\uDD10', 'mho': '\u2127', 'micro': '\xB5', 'mid': '\u2223', 'midast': '*', 'midcir': '\u2AF0', 'middot': '\xB7', 'minus': '\u2212', 'minusb': '\u229F', 'minusd': '\u2238', 'minusdu': '\u2A2A', 'MinusPlus': '\u2213', 'mlcp': '\u2ADB', 'mldr': '\u2026', 'mnplus': '\u2213', 'models': '\u22A7', 'mopf': '\uD835\uDD5E', 'Mopf': '\uD835\uDD44', 'mp': '\u2213', 'mscr': '\uD835\uDCC2', 'Mscr': '\u2133', 'mstpos': '\u223E', 'mu': '\u03BC', 'Mu': '\u039C', 'multimap': '\u22B8', 'mumap': '\u22B8', 'nabla': '\u2207', 'nacute': '\u0144', 'Nacute': '\u0143', 'nang': '\u2220\u20D2', 'nap': '\u2249', 'napE': '\u2A70\u0338', 'napid': '\u224B\u0338', 'napos': '\u0149', 'napprox': '\u2249', 'natur': '\u266E', 'natural': '\u266E', 'naturals': '\u2115', 'nbsp': '\xA0', 'nbump': '\u224E\u0338', 'nbumpe': '\u224F\u0338', 'ncap': '\u2A43', 'ncaron': '\u0148', 'Ncaron': '\u0147', 'ncedil': '\u0146', 'Ncedil': '\u0145', 'ncong': '\u2247', 'ncongdot': '\u2A6D\u0338', 'ncup': '\u2A42', 'ncy': '\u043D', 'Ncy': '\u041D', 'ndash': '\u2013', 'ne': '\u2260', 'nearhk': '\u2924', 'nearr': '\u2197', 'neArr': '\u21D7', 'nearrow': '\u2197', 'nedot': '\u2250\u0338', 'NegativeMediumSpace': '\u200B', 'NegativeThickSpace': '\u200B', 'NegativeThinSpace': '\u200B', 'NegativeVeryThinSpace': '\u200B', 'nequiv': '\u2262', 'nesear': '\u2928', 'nesim': '\u2242\u0338', 'NestedGreaterGreater': '\u226B', 'NestedLessLess': '\u226A', 'NewLine': '\n', 'nexist': '\u2204', 'nexists': '\u2204', 'nfr': '\uD835\uDD2B', 'Nfr': '\uD835\uDD11', 'nge': '\u2271', 'ngE': '\u2267\u0338', 'ngeq': '\u2271', 'ngeqq': '\u2267\u0338', 'ngeqslant': '\u2A7E\u0338', 'nges': '\u2A7E\u0338', 'nGg': '\u22D9\u0338', 'ngsim': '\u2275', 'ngt': '\u226F', 'nGt': '\u226B\u20D2', 'ngtr': '\u226F', 'nGtv': '\u226B\u0338', 'nharr': '\u21AE', 'nhArr': '\u21CE', 'nhpar': '\u2AF2', 'ni': '\u220B', 'nis': '\u22FC', 'nisd': '\u22FA', 'niv': '\u220B', 'njcy': '\u045A', 'NJcy': '\u040A', 'nlarr': '\u219A', 'nlArr': '\u21CD', 'nldr': '\u2025', 'nle': '\u2270', 'nlE': '\u2266\u0338', 'nleftarrow': '\u219A', 'nLeftarrow': '\u21CD', 'nleftrightarrow': '\u21AE', 'nLeftrightarrow': '\u21CE', 'nleq': '\u2270', 'nleqq': '\u2266\u0338', 'nleqslant': '\u2A7D\u0338', 'nles': '\u2A7D\u0338', 'nless': '\u226E', 'nLl': '\u22D8\u0338', 'nlsim': '\u2274', 'nlt': '\u226E', 'nLt': '\u226A\u20D2', 'nltri': '\u22EA', 'nltrie': '\u22EC', 'nLtv': '\u226A\u0338', 'nmid': '\u2224', 'NoBreak': '\u2060', 'NonBreakingSpace': '\xA0', 'nopf': '\uD835\uDD5F', 'Nopf': '\u2115', 'not': '\xAC', 'Not': '\u2AEC', 'NotCongruent': '\u2262', 'NotCupCap': '\u226D', 'NotDoubleVerticalBar': '\u2226', 'NotElement': '\u2209', 'NotEqual': '\u2260', 'NotEqualTilde': '\u2242\u0338', 'NotExists': '\u2204', 'NotGreater': '\u226F', 'NotGreaterEqual': '\u2271', 'NotGreaterFullEqual': '\u2267\u0338', 'NotGreaterGreater': '\u226B\u0338', 'NotGreaterLess': '\u2279', 'NotGreaterSlantEqual': '\u2A7E\u0338', 'NotGreaterTilde': '\u2275', 'NotHumpDownHump': '\u224E\u0338', 'NotHumpEqual': '\u224F\u0338', 'notin': '\u2209', 'notindot': '\u22F5\u0338', 'notinE': '\u22F9\u0338', 'notinva': '\u2209', 'notinvb': '\u22F7', 'notinvc': '\u22F6', 'NotLeftTriangle': '\u22EA', 'NotLeftTriangleBar': '\u29CF\u0338', 'NotLeftTriangleEqual': '\u22EC', 'NotLess': '\u226E', 'NotLessEqual': '\u2270', 'NotLessGreater': '\u2278', 'NotLessLess': '\u226A\u0338', 'NotLessSlantEqual': '\u2A7D\u0338', 'NotLessTilde': '\u2274', 'NotNestedGreaterGreater': '\u2AA2\u0338', 'NotNestedLessLess': '\u2AA1\u0338', 'notni': '\u220C', 'notniva': '\u220C', 'notnivb': '\u22FE', 'notnivc': '\u22FD', 'NotPrecedes': '\u2280', 'NotPrecedesEqual': '\u2AAF\u0338', 'NotPrecedesSlantEqual': '\u22E0', 'NotReverseElement': '\u220C', 'NotRightTriangle': '\u22EB', 'NotRightTriangleBar': '\u29D0\u0338', 'NotRightTriangleEqual': '\u22ED', 'NotSquareSubset': '\u228F\u0338', 'NotSquareSubsetEqual': '\u22E2', 'NotSquareSuperset': '\u2290\u0338', 'NotSquareSupersetEqual': '\u22E3', 'NotSubset': '\u2282\u20D2', 'NotSubsetEqual': '\u2288', 'NotSucceeds': '\u2281', 'NotSucceedsEqual': '\u2AB0\u0338', 'NotSucceedsSlantEqual': '\u22E1', 'NotSucceedsTilde': '\u227F\u0338', 'NotSuperset': '\u2283\u20D2', 'NotSupersetEqual': '\u2289', 'NotTilde': '\u2241', 'NotTildeEqual': '\u2244', 'NotTildeFullEqual': '\u2247', 'NotTildeTilde': '\u2249', 'NotVerticalBar': '\u2224', 'npar': '\u2226', 'nparallel': '\u2226', 'nparsl': '\u2AFD\u20E5', 'npart': '\u2202\u0338', 'npolint': '\u2A14', 'npr': '\u2280', 'nprcue': '\u22E0', 'npre': '\u2AAF\u0338', 'nprec': '\u2280', 'npreceq': '\u2AAF\u0338', 'nrarr': '\u219B', 'nrArr': '\u21CF', 'nrarrc': '\u2933\u0338', 'nrarrw': '\u219D\u0338', 'nrightarrow': '\u219B', 'nRightarrow': '\u21CF', 'nrtri': '\u22EB', 'nrtrie': '\u22ED', 'nsc': '\u2281', 'nsccue': '\u22E1', 'nsce': '\u2AB0\u0338', 'nscr': '\uD835\uDCC3', 'Nscr': '\uD835\uDCA9', 'nshortmid': '\u2224', 'nshortparallel': '\u2226', 'nsim': '\u2241', 'nsime': '\u2244', 'nsimeq': '\u2244', 'nsmid': '\u2224', 'nspar': '\u2226', 'nsqsube': '\u22E2', 'nsqsupe': '\u22E3', 'nsub': '\u2284', 'nsube': '\u2288', 'nsubE': '\u2AC5\u0338', 'nsubset': '\u2282\u20D2', 'nsubseteq': '\u2288', 'nsubseteqq': '\u2AC5\u0338', 'nsucc': '\u2281', 'nsucceq': '\u2AB0\u0338', 'nsup': '\u2285', 'nsupe': '\u2289', 'nsupE': '\u2AC6\u0338', 'nsupset': '\u2283\u20D2', 'nsupseteq': '\u2289', 'nsupseteqq': '\u2AC6\u0338', 'ntgl': '\u2279', 'ntilde': '\xF1', 'Ntilde': '\xD1', 'ntlg': '\u2278', 'ntriangleleft': '\u22EA', 'ntrianglelefteq': '\u22EC', 'ntriangleright': '\u22EB', 'ntrianglerighteq': '\u22ED', 'nu': '\u03BD', 'Nu': '\u039D', 'num': '#', 'numero': '\u2116', 'numsp': '\u2007', 'nvap': '\u224D\u20D2', 'nvdash': '\u22AC', 'nvDash': '\u22AD', 'nVdash': '\u22AE', 'nVDash': '\u22AF', 'nvge': '\u2265\u20D2', 'nvgt': '>\u20D2', 'nvHarr': '\u2904', 'nvinfin': '\u29DE', 'nvlArr': '\u2902', 'nvle': '\u2264\u20D2', 'nvlt': '<\u20D2', 'nvltrie': '\u22B4\u20D2', 'nvrArr': '\u2903', 'nvrtrie': '\u22B5\u20D2', 'nvsim': '\u223C\u20D2', 'nwarhk': '\u2923', 'nwarr': '\u2196', 'nwArr': '\u21D6', 'nwarrow': '\u2196', 'nwnear': '\u2927', 'oacute': '\xF3', 'Oacute': '\xD3', 'oast': '\u229B', 'ocir': '\u229A', 'ocirc': '\xF4', 'Ocirc': '\xD4', 'ocy': '\u043E', 'Ocy': '\u041E', 'odash': '\u229D', 'odblac': '\u0151', 'Odblac': '\u0150', 'odiv': '\u2A38', 'odot': '\u2299', 'odsold': '\u29BC', 'oelig': '\u0153', 'OElig': '\u0152', 'ofcir': '\u29BF', 'ofr': '\uD835\uDD2C', 'Ofr': '\uD835\uDD12', 'ogon': '\u02DB', 'ograve': '\xF2', 'Ograve': '\xD2', 'ogt': '\u29C1', 'ohbar': '\u29B5', 'ohm': '\u03A9', 'oint': '\u222E', 'olarr': '\u21BA', 'olcir': '\u29BE', 'olcross': '\u29BB', 'oline': '\u203E', 'olt': '\u29C0', 'omacr': '\u014D', 'Omacr': '\u014C', 'omega': '\u03C9', 'Omega': '\u03A9', 'omicron': '\u03BF', 'Omicron': '\u039F', 'omid': '\u29B6', 'ominus': '\u2296', 'oopf': '\uD835\uDD60', 'Oopf': '\uD835\uDD46', 'opar': '\u29B7', 'OpenCurlyDoubleQuote': '\u201C', 'OpenCurlyQuote': '\u2018', 'operp': '\u29B9', 'oplus': '\u2295', 'or': '\u2228', 'Or': '\u2A54', 'orarr': '\u21BB', 'ord': '\u2A5D', 'order': '\u2134', 'orderof': '\u2134', 'ordf': '\xAA', 'ordm': '\xBA', 'origof': '\u22B6', 'oror': '\u2A56', 'orslope': '\u2A57', 'orv': '\u2A5B', 'oS': '\u24C8', 'oscr': '\u2134', 'Oscr': '\uD835\uDCAA', 'oslash': '\xF8', 'Oslash': '\xD8', 'osol': '\u2298', 'otilde': '\xF5', 'Otilde': '\xD5', 'otimes': '\u2297', 'Otimes': '\u2A37', 'otimesas': '\u2A36', 'ouml': '\xF6', 'Ouml': '\xD6', 'ovbar': '\u233D', 'OverBar': '\u203E', 'OverBrace': '\u23DE', 'OverBracket': '\u23B4', 'OverParenthesis': '\u23DC', 'par': '\u2225', 'para': '\xB6', 'parallel': '\u2225', 'parsim': '\u2AF3', 'parsl': '\u2AFD', 'part': '\u2202', 'PartialD': '\u2202', 'pcy': '\u043F', 'Pcy': '\u041F', 'percnt': '%', 'period': '.', 'permil': '\u2030', 'perp': '\u22A5', 'pertenk': '\u2031', 'pfr': '\uD835\uDD2D', 'Pfr': '\uD835\uDD13', 'phi': '\u03C6', 'Phi': '\u03A6', 'phiv': '\u03D5', 'phmmat': '\u2133', 'phone': '\u260E', 'pi': '\u03C0', 'Pi': '\u03A0', 'pitchfork': '\u22D4', 'piv': '\u03D6', 'planck': '\u210F', 'planckh': '\u210E', 'plankv': '\u210F', 'plus': '+', 'plusacir': '\u2A23', 'plusb': '\u229E', 'pluscir': '\u2A22', 'plusdo': '\u2214', 'plusdu': '\u2A25', 'pluse': '\u2A72', 'PlusMinus': '\xB1', 'plusmn': '\xB1', 'plussim': '\u2A26', 'plustwo': '\u2A27', 'pm': '\xB1', 'Poincareplane': '\u210C', 'pointint': '\u2A15', 'popf': '\uD835\uDD61', 'Popf': '\u2119', 'pound': '\xA3', 'pr': '\u227A', 'Pr': '\u2ABB', 'prap': '\u2AB7', 'prcue': '\u227C', 'pre': '\u2AAF', 'prE': '\u2AB3', 'prec': '\u227A', 'precapprox': '\u2AB7', 'preccurlyeq': '\u227C', 'Precedes': '\u227A', 'PrecedesEqual': '\u2AAF', 'PrecedesSlantEqual': '\u227C', 'PrecedesTilde': '\u227E', 'preceq': '\u2AAF', 'precnapprox': '\u2AB9', 'precneqq': '\u2AB5', 'precnsim': '\u22E8', 'precsim': '\u227E', 'prime': '\u2032', 'Prime': '\u2033', 'primes': '\u2119', 'prnap': '\u2AB9', 'prnE': '\u2AB5', 'prnsim': '\u22E8', 'prod': '\u220F', 'Product': '\u220F', 'profalar': '\u232E', 'profline': '\u2312', 'profsurf': '\u2313', 'prop': '\u221D', 'Proportion': '\u2237', 'Proportional': '\u221D', 'propto': '\u221D', 'prsim': '\u227E', 'prurel': '\u22B0', 'pscr': '\uD835\uDCC5', 'Pscr': '\uD835\uDCAB', 'psi': '\u03C8', 'Psi': '\u03A8', 'puncsp': '\u2008', 'qfr': '\uD835\uDD2E', 'Qfr': '\uD835\uDD14', 'qint': '\u2A0C', 'qopf': '\uD835\uDD62', 'Qopf': '\u211A', 'qprime': '\u2057', 'qscr': '\uD835\uDCC6', 'Qscr': '\uD835\uDCAC', 'quaternions': '\u210D', 'quatint': '\u2A16', 'quest': '?', 'questeq': '\u225F', 'quot': '"', 'QUOT': '"', 'rAarr': '\u21DB', 'race': '\u223D\u0331', 'racute': '\u0155', 'Racute': '\u0154', 'radic': '\u221A', 'raemptyv': '\u29B3', 'rang': '\u27E9', 'Rang': '\u27EB', 'rangd': '\u2992', 'range': '\u29A5', 'rangle': '\u27E9', 'raquo': '\xBB', 'rarr': '\u2192', 'rArr': '\u21D2', 'Rarr': '\u21A0', 'rarrap': '\u2975', 'rarrb': '\u21E5', 'rarrbfs': '\u2920', 'rarrc': '\u2933', 'rarrfs': '\u291E', 'rarrhk': '\u21AA', 'rarrlp': '\u21AC', 'rarrpl': '\u2945', 'rarrsim': '\u2974', 'rarrtl': '\u21A3', 'Rarrtl': '\u2916', 'rarrw': '\u219D', 'ratail': '\u291A', 'rAtail': '\u291C', 'ratio': '\u2236', 'rationals': '\u211A', 'rbarr': '\u290D', 'rBarr': '\u290F', 'RBarr': '\u2910', 'rbbrk': '\u2773', 'rbrace': '}', 'rbrack': ']', 'rbrke': '\u298C', 'rbrksld': '\u298E', 'rbrkslu': '\u2990', 'rcaron': '\u0159', 'Rcaron': '\u0158', 'rcedil': '\u0157', 'Rcedil': '\u0156', 'rceil': '\u2309', 'rcub': '}', 'rcy': '\u0440', 'Rcy': '\u0420', 'rdca': '\u2937', 'rdldhar': '\u2969', 'rdquo': '\u201D', 'rdquor': '\u201D', 'rdsh': '\u21B3', 'Re': '\u211C', 'real': '\u211C', 'realine': '\u211B', 'realpart': '\u211C', 'reals': '\u211D', 'rect': '\u25AD', 'reg': '\xAE', 'REG': '\xAE', 'ReverseElement': '\u220B', 'ReverseEquilibrium': '\u21CB', 'ReverseUpEquilibrium': '\u296F', 'rfisht': '\u297D', 'rfloor': '\u230B', 'rfr': '\uD835\uDD2F', 'Rfr': '\u211C', 'rHar': '\u2964', 'rhard': '\u21C1', 'rharu': '\u21C0', 'rharul': '\u296C', 'rho': '\u03C1', 'Rho': '\u03A1', 'rhov': '\u03F1', 'RightAngleBracket': '\u27E9', 'rightarrow': '\u2192', 'Rightarrow': '\u21D2', 'RightArrow': '\u2192', 'RightArrowBar': '\u21E5', 'RightArrowLeftArrow': '\u21C4', 'rightarrowtail': '\u21A3', 'RightCeiling': '\u2309', 'RightDoubleBracket': '\u27E7', 'RightDownTeeVector': '\u295D', 'RightDownVector': '\u21C2', 'RightDownVectorBar': '\u2955', 'RightFloor': '\u230B', 'rightharpoondown': '\u21C1', 'rightharpoonup': '\u21C0', 'rightleftarrows': '\u21C4', 'rightleftharpoons': '\u21CC', 'rightrightarrows': '\u21C9', 'rightsquigarrow': '\u219D', 'RightTee': '\u22A2', 'RightTeeArrow': '\u21A6', 'RightTeeVector': '\u295B', 'rightthreetimes': '\u22CC', 'RightTriangle': '\u22B3', 'RightTriangleBar': '\u29D0', 'RightTriangleEqual': '\u22B5', 'RightUpDownVector': '\u294F', 'RightUpTeeVector': '\u295C', 'RightUpVector': '\u21BE', 'RightUpVectorBar': '\u2954', 'RightVector': '\u21C0', 'RightVectorBar': '\u2953', 'ring': '\u02DA', 'risingdotseq': '\u2253', 'rlarr': '\u21C4', 'rlhar': '\u21CC', 'rlm': '\u200F', 'rmoust': '\u23B1', 'rmoustache': '\u23B1', 'rnmid': '\u2AEE', 'roang': '\u27ED', 'roarr': '\u21FE', 'robrk': '\u27E7', 'ropar': '\u2986', 'ropf': '\uD835\uDD63', 'Ropf': '\u211D', 'roplus': '\u2A2E', 'rotimes': '\u2A35', 'RoundImplies': '\u2970', 'rpar': ')', 'rpargt': '\u2994', 'rppolint': '\u2A12', 'rrarr': '\u21C9', 'Rrightarrow': '\u21DB', 'rsaquo': '\u203A', 'rscr': '\uD835\uDCC7', 'Rscr': '\u211B', 'rsh': '\u21B1', 'Rsh': '\u21B1', 'rsqb': ']', 'rsquo': '\u2019', 'rsquor': '\u2019', 'rthree': '\u22CC', 'rtimes': '\u22CA', 'rtri': '\u25B9', 'rtrie': '\u22B5', 'rtrif': '\u25B8', 'rtriltri': '\u29CE', 'RuleDelayed': '\u29F4', 'ruluhar': '\u2968', 'rx': '\u211E', 'sacute': '\u015B', 'Sacute': '\u015A', 'sbquo': '\u201A', 'sc': '\u227B', 'Sc': '\u2ABC', 'scap': '\u2AB8', 'scaron': '\u0161', 'Scaron': '\u0160', 'sccue': '\u227D', 'sce': '\u2AB0', 'scE': '\u2AB4', 'scedil': '\u015F', 'Scedil': '\u015E', 'scirc': '\u015D', 'Scirc': '\u015C', 'scnap': '\u2ABA', 'scnE': '\u2AB6', 'scnsim': '\u22E9', 'scpolint': '\u2A13', 'scsim': '\u227F', 'scy': '\u0441', 'Scy': '\u0421', 'sdot': '\u22C5', 'sdotb': '\u22A1', 'sdote': '\u2A66', 'searhk': '\u2925', 'searr': '\u2198', 'seArr': '\u21D8', 'searrow': '\u2198', 'sect': '\xA7', 'semi': ';', 'seswar': '\u2929', 'setminus': '\u2216', 'setmn': '\u2216', 'sext': '\u2736', 'sfr': '\uD835\uDD30', 'Sfr': '\uD835\uDD16', 'sfrown': '\u2322', 'sharp': '\u266F', 'shchcy': '\u0449', 'SHCHcy': '\u0429', 'shcy': '\u0448', 'SHcy': '\u0428', 'ShortDownArrow': '\u2193', 'ShortLeftArrow': '\u2190', 'shortmid': '\u2223', 'shortparallel': '\u2225', 'ShortRightArrow': '\u2192', 'ShortUpArrow': '\u2191', 'shy': '\xAD', 'sigma': '\u03C3', 'Sigma': '\u03A3', 'sigmaf': '\u03C2', 'sigmav': '\u03C2', 'sim': '\u223C', 'simdot': '\u2A6A', 'sime': '\u2243', 'simeq': '\u2243', 'simg': '\u2A9E', 'simgE': '\u2AA0', 'siml': '\u2A9D', 'simlE': '\u2A9F', 'simne': '\u2246', 'simplus': '\u2A24', 'simrarr': '\u2972', 'slarr': '\u2190', 'SmallCircle': '\u2218', 'smallsetminus': '\u2216', 'smashp': '\u2A33', 'smeparsl': '\u29E4', 'smid': '\u2223', 'smile': '\u2323', 'smt': '\u2AAA', 'smte': '\u2AAC', 'smtes': '\u2AAC\uFE00', 'softcy': '\u044C', 'SOFTcy': '\u042C', 'sol': '/', 'solb': '\u29C4', 'solbar': '\u233F', 'sopf': '\uD835\uDD64', 'Sopf': '\uD835\uDD4A', 'spades': '\u2660', 'spadesuit': '\u2660', 'spar': '\u2225', 'sqcap': '\u2293', 'sqcaps': '\u2293\uFE00', 'sqcup': '\u2294', 'sqcups': '\u2294\uFE00', 'Sqrt': '\u221A', 'sqsub': '\u228F', 'sqsube': '\u2291', 'sqsubset': '\u228F', 'sqsubseteq': '\u2291', 'sqsup': '\u2290', 'sqsupe': '\u2292', 'sqsupset': '\u2290', 'sqsupseteq': '\u2292', 'squ': '\u25A1', 'square': '\u25A1', 'Square': '\u25A1', 'SquareIntersection': '\u2293', 'SquareSubset': '\u228F', 'SquareSubsetEqual': '\u2291', 'SquareSuperset': '\u2290', 'SquareSupersetEqual': '\u2292', 'SquareUnion': '\u2294', 'squarf': '\u25AA', 'squf': '\u25AA', 'srarr': '\u2192', 'sscr': '\uD835\uDCC8', 'Sscr': '\uD835\uDCAE', 'ssetmn': '\u2216', 'ssmile': '\u2323', 'sstarf': '\u22C6', 'star': '\u2606', 'Star': '\u22C6', 'starf': '\u2605', 'straightepsilon': '\u03F5', 'straightphi': '\u03D5', 'strns': '\xAF', 'sub': '\u2282', 'Sub': '\u22D0', 'subdot': '\u2ABD', 'sube': '\u2286', 'subE': '\u2AC5', 'subedot': '\u2AC3', 'submult': '\u2AC1', 'subne': '\u228A', 'subnE': '\u2ACB', 'subplus': '\u2ABF', 'subrarr': '\u2979', 'subset': '\u2282', 'Subset': '\u22D0', 'subseteq': '\u2286', 'subseteqq': '\u2AC5', 'SubsetEqual': '\u2286', 'subsetneq': '\u228A', 'subsetneqq': '\u2ACB', 'subsim': '\u2AC7', 'subsub': '\u2AD5', 'subsup': '\u2AD3', 'succ': '\u227B', 'succapprox': '\u2AB8', 'succcurlyeq': '\u227D', 'Succeeds': '\u227B', 'SucceedsEqual': '\u2AB0', 'SucceedsSlantEqual': '\u227D', 'SucceedsTilde': '\u227F', 'succeq': '\u2AB0', 'succnapprox': '\u2ABA', 'succneqq': '\u2AB6', 'succnsim': '\u22E9', 'succsim': '\u227F', 'SuchThat': '\u220B', 'sum': '\u2211', 'Sum': '\u2211', 'sung': '\u266A', 'sup': '\u2283', 'Sup': '\u22D1', 'sup1': '\xB9', 'sup2': '\xB2', 'sup3': '\xB3', 'supdot': '\u2ABE', 'supdsub': '\u2AD8', 'supe': '\u2287', 'supE': '\u2AC6', 'supedot': '\u2AC4', 'Superset': '\u2283', 'SupersetEqual': '\u2287', 'suphsol': '\u27C9', 'suphsub': '\u2AD7', 'suplarr': '\u297B', 'supmult': '\u2AC2', 'supne': '\u228B', 'supnE': '\u2ACC', 'supplus': '\u2AC0', 'supset': '\u2283', 'Supset': '\u22D1', 'supseteq': '\u2287', 'supseteqq': '\u2AC6', 'supsetneq': '\u228B', 'supsetneqq': '\u2ACC', 'supsim': '\u2AC8', 'supsub': '\u2AD4', 'supsup': '\u2AD6', 'swarhk': '\u2926', 'swarr': '\u2199', 'swArr': '\u21D9', 'swarrow': '\u2199', 'swnwar': '\u292A', 'szlig': '\xDF', 'Tab': '\t', 'target': '\u2316', 'tau': '\u03C4', 'Tau': '\u03A4', 'tbrk': '\u23B4', 'tcaron': '\u0165', 'Tcaron': '\u0164', 'tcedil': '\u0163', 'Tcedil': '\u0162', 'tcy': '\u0442', 'Tcy': '\u0422', 'tdot': '\u20DB', 'telrec': '\u2315', 'tfr': '\uD835\uDD31', 'Tfr': '\uD835\uDD17', 'there4': '\u2234', 'therefore': '\u2234', 'Therefore': '\u2234', 'theta': '\u03B8', 'Theta': '\u0398', 'thetasym': '\u03D1', 'thetav': '\u03D1', 'thickapprox': '\u2248', 'thicksim': '\u223C', 'ThickSpace': '\u205F\u200A', 'thinsp': '\u2009', 'ThinSpace': '\u2009', 'thkap': '\u2248', 'thksim': '\u223C', 'thorn': '\xFE', 'THORN': '\xDE', 'tilde': '\u02DC', 'Tilde': '\u223C', 'TildeEqual': '\u2243', 'TildeFullEqual': '\u2245', 'TildeTilde': '\u2248', 'times': '\xD7', 'timesb': '\u22A0', 'timesbar': '\u2A31', 'timesd': '\u2A30', 'tint': '\u222D', 'toea': '\u2928', 'top': '\u22A4', 'topbot': '\u2336', 'topcir': '\u2AF1', 'topf': '\uD835\uDD65', 'Topf': '\uD835\uDD4B', 'topfork': '\u2ADA', 'tosa': '\u2929', 'tprime': '\u2034', 'trade': '\u2122', 'TRADE': '\u2122', 'triangle': '\u25B5', 'triangledown': '\u25BF', 'triangleleft': '\u25C3', 'trianglelefteq': '\u22B4', 'triangleq': '\u225C', 'triangleright': '\u25B9', 'trianglerighteq': '\u22B5', 'tridot': '\u25EC', 'trie': '\u225C', 'triminus': '\u2A3A', 'TripleDot': '\u20DB', 'triplus': '\u2A39', 'trisb': '\u29CD', 'tritime': '\u2A3B', 'trpezium': '\u23E2', 'tscr': '\uD835\uDCC9', 'Tscr': '\uD835\uDCAF', 'tscy': '\u0446', 'TScy': '\u0426', 'tshcy': '\u045B', 'TSHcy': '\u040B', 'tstrok': '\u0167', 'Tstrok': '\u0166', 'twixt': '\u226C', 'twoheadleftarrow': '\u219E', 'twoheadrightarrow': '\u21A0', 'uacute': '\xFA', 'Uacute': '\xDA', 'uarr': '\u2191', 'uArr': '\u21D1', 'Uarr': '\u219F', 'Uarrocir': '\u2949', 'ubrcy': '\u045E', 'Ubrcy': '\u040E', 'ubreve': '\u016D', 'Ubreve': '\u016C', 'ucirc': '\xFB', 'Ucirc': '\xDB', 'ucy': '\u0443', 'Ucy': '\u0423', 'udarr': '\u21C5', 'udblac': '\u0171', 'Udblac': '\u0170', 'udhar': '\u296E', 'ufisht': '\u297E', 'ufr': '\uD835\uDD32', 'Ufr': '\uD835\uDD18', 'ugrave': '\xF9', 'Ugrave': '\xD9', 'uHar': '\u2963', 'uharl': '\u21BF', 'uharr': '\u21BE', 'uhblk': '\u2580', 'ulcorn': '\u231C', 'ulcorner': '\u231C', 'ulcrop': '\u230F', 'ultri': '\u25F8', 'umacr': '\u016B', 'Umacr': '\u016A', 'uml': '\xA8', 'UnderBar': '_', 'UnderBrace': '\u23DF', 'UnderBracket': '\u23B5', 'UnderParenthesis': '\u23DD', 'Union': '\u22C3', 'UnionPlus': '\u228E', 'uogon': '\u0173', 'Uogon': '\u0172', 'uopf': '\uD835\uDD66', 'Uopf': '\uD835\uDD4C', 'uparrow': '\u2191', 'Uparrow': '\u21D1', 'UpArrow': '\u2191', 'UpArrowBar': '\u2912', 'UpArrowDownArrow': '\u21C5', 'updownarrow': '\u2195', 'Updownarrow': '\u21D5', 'UpDownArrow': '\u2195', 'UpEquilibrium': '\u296E', 'upharpoonleft': '\u21BF', 'upharpoonright': '\u21BE', 'uplus': '\u228E', 'UpperLeftArrow': '\u2196', 'UpperRightArrow': '\u2197', 'upsi': '\u03C5', 'Upsi': '\u03D2', 'upsih': '\u03D2', 'upsilon': '\u03C5', 'Upsilon': '\u03A5', 'UpTee': '\u22A5', 'UpTeeArrow': '\u21A5', 'upuparrows': '\u21C8', 'urcorn': '\u231D', 'urcorner': '\u231D', 'urcrop': '\u230E', 'uring': '\u016F', 'Uring': '\u016E', 'urtri': '\u25F9', 'uscr': '\uD835\uDCCA', 'Uscr': '\uD835\uDCB0', 'utdot': '\u22F0', 'utilde': '\u0169', 'Utilde': '\u0168', 'utri': '\u25B5', 'utrif': '\u25B4', 'uuarr': '\u21C8', 'uuml': '\xFC', 'Uuml': '\xDC', 'uwangle': '\u29A7', 'vangrt': '\u299C', 'varepsilon': '\u03F5', 'varkappa': '\u03F0', 'varnothing': '\u2205', 'varphi': '\u03D5', 'varpi': '\u03D6', 'varpropto': '\u221D', 'varr': '\u2195', 'vArr': '\u21D5', 'varrho': '\u03F1', 'varsigma': '\u03C2', 'varsubsetneq': '\u228A\uFE00', 'varsubsetneqq': '\u2ACB\uFE00', 'varsupsetneq': '\u228B\uFE00', 'varsupsetneqq': '\u2ACC\uFE00', 'vartheta': '\u03D1', 'vartriangleleft': '\u22B2', 'vartriangleright': '\u22B3', 'vBar': '\u2AE8', 'Vbar': '\u2AEB', 'vBarv': '\u2AE9', 'vcy': '\u0432', 'Vcy': '\u0412', 'vdash': '\u22A2', 'vDash': '\u22A8', 'Vdash': '\u22A9', 'VDash': '\u22AB', 'Vdashl': '\u2AE6', 'vee': '\u2228', 'Vee': '\u22C1', 'veebar': '\u22BB', 'veeeq': '\u225A', 'vellip': '\u22EE', 'verbar': '|', 'Verbar': '\u2016', 'vert': '|', 'Vert': '\u2016', 'VerticalBar': '\u2223', 'VerticalLine': '|', 'VerticalSeparator': '\u2758', 'VerticalTilde': '\u2240', 'VeryThinSpace': '\u200A', 'vfr': '\uD835\uDD33', 'Vfr': '\uD835\uDD19', 'vltri': '\u22B2', 'vnsub': '\u2282\u20D2', 'vnsup': '\u2283\u20D2', 'vopf': '\uD835\uDD67', 'Vopf': '\uD835\uDD4D', 'vprop': '\u221D', 'vrtri': '\u22B3', 'vscr': '\uD835\uDCCB', 'Vscr': '\uD835\uDCB1', 'vsubne': '\u228A\uFE00', 'vsubnE': '\u2ACB\uFE00', 'vsupne': '\u228B\uFE00', 'vsupnE': '\u2ACC\uFE00', 'Vvdash': '\u22AA', 'vzigzag': '\u299A', 'wcirc': '\u0175', 'Wcirc': '\u0174', 'wedbar': '\u2A5F', 'wedge': '\u2227', 'Wedge': '\u22C0', 'wedgeq': '\u2259', 'weierp': '\u2118', 'wfr': '\uD835\uDD34', 'Wfr': '\uD835\uDD1A', 'wopf': '\uD835\uDD68', 'Wopf': '\uD835\uDD4E', 'wp': '\u2118', 'wr': '\u2240', 'wreath': '\u2240', 'wscr': '\uD835\uDCCC', 'Wscr': '\uD835\uDCB2', 'xcap': '\u22C2', 'xcirc': '\u25EF', 'xcup': '\u22C3', 'xdtri': '\u25BD', 'xfr': '\uD835\uDD35', 'Xfr': '\uD835\uDD1B', 'xharr': '\u27F7', 'xhArr': '\u27FA', 'xi': '\u03BE', 'Xi': '\u039E', 'xlarr': '\u27F5', 'xlArr': '\u27F8', 'xmap': '\u27FC', 'xnis': '\u22FB', 'xodot': '\u2A00', 'xopf': '\uD835\uDD69', 'Xopf': '\uD835\uDD4F', 'xoplus': '\u2A01', 'xotime': '\u2A02', 'xrarr': '\u27F6', 'xrArr': '\u27F9', 'xscr': '\uD835\uDCCD', 'Xscr': '\uD835\uDCB3', 'xsqcup': '\u2A06', 'xuplus': '\u2A04', 'xutri': '\u25B3', 'xvee': '\u22C1', 'xwedge': '\u22C0', 'yacute': '\xFD', 'Yacute': '\xDD', 'yacy': '\u044F', 'YAcy': '\u042F', 'ycirc': '\u0177', 'Ycirc': '\u0176', 'ycy': '\u044B', 'Ycy': '\u042B', 'yen': '\xA5', 'yfr': '\uD835\uDD36', 'Yfr': '\uD835\uDD1C', 'yicy': '\u0457', 'YIcy': '\u0407', 'yopf': '\uD835\uDD6A', 'Yopf': '\uD835\uDD50', 'yscr': '\uD835\uDCCE', 'Yscr': '\uD835\uDCB4', 'yucy': '\u044E', 'YUcy': '\u042E', 'yuml': '\xFF', 'Yuml': '\u0178', 'zacute': '\u017A', 'Zacute': '\u0179', 'zcaron': '\u017E', 'Zcaron': '\u017D', 'zcy': '\u0437', 'Zcy': '\u0417', 'zdot': '\u017C', 'Zdot': '\u017B', 'zeetrf': '\u2128', 'ZeroWidthSpace': '\u200B', 'zeta': '\u03B6', 'Zeta': '\u0396', 'zfr': '\uD835\uDD37', 'Zfr': '\u2128', 'zhcy': '\u0436', 'ZHcy': '\u0416', 'zigrarr': '\u21DD', 'zopf': '\uD835\uDD6B', 'Zopf': '\u2124', 'zscr': '\uD835\uDCCF', 'Zscr': '\uD835\uDCB5', 'zwj': '\u200D', 'zwnj': '\u200C' };
	var decodeMapLegacy = { 'aacute': '\xE1', 'Aacute': '\xC1', 'acirc': '\xE2', 'Acirc': '\xC2', 'acute': '\xB4', 'aelig': '\xE6', 'AElig': '\xC6', 'agrave': '\xE0', 'Agrave': '\xC0', 'amp': '&', 'AMP': '&', 'aring': '\xE5', 'Aring': '\xC5', 'atilde': '\xE3', 'Atilde': '\xC3', 'auml': '\xE4', 'Auml': '\xC4', 'brvbar': '\xA6', 'ccedil': '\xE7', 'Ccedil': '\xC7', 'cedil': '\xB8', 'cent': '\xA2', 'copy': '\xA9', 'COPY': '\xA9', 'curren': '\xA4', 'deg': '\xB0', 'divide': '\xF7', 'eacute': '\xE9', 'Eacute': '\xC9', 'ecirc': '\xEA', 'Ecirc': '\xCA', 'egrave': '\xE8', 'Egrave': '\xC8', 'eth': '\xF0', 'ETH': '\xD0', 'euml': '\xEB', 'Euml': '\xCB', 'frac12': '\xBD', 'frac14': '\xBC', 'frac34': '\xBE', 'gt': '>', 'GT': '>', 'iacute': '\xED', 'Iacute': '\xCD', 'icirc': '\xEE', 'Icirc': '\xCE', 'iexcl': '\xA1', 'igrave': '\xEC', 'Igrave': '\xCC', 'iquest': '\xBF', 'iuml': '\xEF', 'Iuml': '\xCF', 'laquo': '\xAB', 'lt': '<', 'LT': '<', 'macr': '\xAF', 'micro': '\xB5', 'middot': '\xB7', 'nbsp': '\xA0', 'not': '\xAC', 'ntilde': '\xF1', 'Ntilde': '\xD1', 'oacute': '\xF3', 'Oacute': '\xD3', 'ocirc': '\xF4', 'Ocirc': '\xD4', 'ograve': '\xF2', 'Ograve': '\xD2', 'ordf': '\xAA', 'ordm': '\xBA', 'oslash': '\xF8', 'Oslash': '\xD8', 'otilde': '\xF5', 'Otilde': '\xD5', 'ouml': '\xF6', 'Ouml': '\xD6', 'para': '\xB6', 'plusmn': '\xB1', 'pound': '\xA3', 'quot': '"', 'QUOT': '"', 'raquo': '\xBB', 'reg': '\xAE', 'REG': '\xAE', 'sect': '\xA7', 'shy': '\xAD', 'sup1': '\xB9', 'sup2': '\xB2', 'sup3': '\xB3', 'szlig': '\xDF', 'thorn': '\xFE', 'THORN': '\xDE', 'times': '\xD7', 'uacute': '\xFA', 'Uacute': '\xDA', 'ucirc': '\xFB', 'Ucirc': '\xDB', 'ugrave': '\xF9', 'Ugrave': '\xD9', 'uml': '\xA8', 'uuml': '\xFC', 'Uuml': '\xDC', 'yacute': '\xFD', 'Yacute': '\xDD', 'yen': '\xA5', 'yuml': '\xFF' };
	var decodeMapNumeric = { '0': '\uFFFD', '128': '\u20AC', '130': '\u201A', '131': '\u0192', '132': '\u201E', '133': '\u2026', '134': '\u2020', '135': '\u2021', '136': '\u02C6', '137': '\u2030', '138': '\u0160', '139': '\u2039', '140': '\u0152', '142': '\u017D', '145': '\u2018', '146': '\u2019', '147': '\u201C', '148': '\u201D', '149': '\u2022', '150': '\u2013', '151': '\u2014', '152': '\u02DC', '153': '\u2122', '154': '\u0161', '155': '\u203A', '156': '\u0153', '158': '\u017E', '159': '\u0178' };
	var invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65000, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	var object = {};
	var hasOwnProperty = object.hasOwnProperty;
	var has = function has(object, propertyName) {
		return hasOwnProperty.call(object, propertyName);
	};

	var contains = function contains(array, value) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			if (array[index] == value) {
				return true;
			}
		}
		return false;
	};

	var merge = function merge(options, defaults) {
		if (!options) {
			return defaults;
		}
		var result = {};
		var key;
		for (key in defaults) {
			// A `hasOwnProperty` check is not needed here, since only recognized
			// option names are used anyway. Any others are ignored.
			result[key] = has(options, key) ? options[key] : defaults[key];
		}
		return result;
	};

	// Modified version of `ucs2encode`; see https://mths.be/punycode.
	var codePointToSymbol = function codePointToSymbol(codePoint, strict) {
		var output = '';
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF || codePoint > 0x10FFFF) {
			// See issue #4:
			// “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
			// greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
			// REPLACEMENT CHARACTER.”
			if (strict) {
				parseError('character reference outside the permissible Unicode range');
			}
			return '\uFFFD';
		}
		if (has(decodeMapNumeric, codePoint)) {
			if (strict) {
				parseError('disallowed character reference');
			}
			return decodeMapNumeric[codePoint];
		}
		if (strict && contains(invalidReferenceCodePoints, codePoint)) {
			parseError('disallowed character reference');
		}
		if (codePoint > 0xFFFF) {
			codePoint -= 0x10000;
			output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
			codePoint = 0xDC00 | codePoint & 0x3FF;
		}
		output += stringFromCharCode(codePoint);
		return output;
	};

	var hexEscape = function hexEscape(codePoint) {
		return '&#x' + codePoint.toString(16).toUpperCase() + ';';
	};

	var decEscape = function decEscape(codePoint) {
		return '&#' + codePoint + ';';
	};

	var parseError = function parseError(message) {
		throw Error('Parse error: ' + message);
	};

	/*--------------------------------------------------------------------------*/

	var encode = function encode(string, options) {
		options = merge(options, encode.options);
		var strict = options.strict;
		if (strict && regexInvalidRawCodePoint.test(string)) {
			parseError('forbidden code point');
		}
		var encodeEverything = options.encodeEverything;
		var useNamedReferences = options.useNamedReferences;
		var allowUnsafeSymbols = options.allowUnsafeSymbols;
		var escapeCodePoint = options.decimal ? decEscape : hexEscape;

		var escapeBmpSymbol = function escapeBmpSymbol(symbol) {
			return escapeCodePoint(symbol.charCodeAt(0));
		};

		if (encodeEverything) {
			// Encode ASCII symbols.
			string = string.replace(regexAsciiWhitelist, function (symbol) {
				// Use named references if requested & possible.
				if (useNamedReferences && has(encodeMap, symbol)) {
					return '&' + encodeMap[symbol] + ';';
				}
				return escapeBmpSymbol(symbol);
			});
			// Shorten a few escapes that represent two symbols, of which at least one
			// is within the ASCII range.
			if (useNamedReferences) {
				string = string.replace(/&gt;\u20D2/g, '&nvgt;').replace(/&lt;\u20D2/g, '&nvlt;').replace(/&#x66;&#x6A;/g, '&fjlig;');
			}
			// Encode non-ASCII symbols.
			if (useNamedReferences) {
				// Encode non-ASCII symbols that can be replaced with a named reference.
				string = string.replace(regexEncodeNonAscii, function (string) {
					// Note: there is no need to check `has(encodeMap, string)` here.
					return '&' + encodeMap[string] + ';';
				});
			}
			// Note: any remaining non-ASCII symbols are handled outside of the `if`.
		} else if (useNamedReferences) {
			// Apply named character references.
			// Encode `<>"'&` using named character references.
			if (!allowUnsafeSymbols) {
				string = string.replace(regexEscape, function (string) {
					return '&' + encodeMap[string] + ';'; // no need to check `has()` here
				});
			}
			// Shorten escapes that represent two symbols, of which at least one is
			// `<>"'&`.
			string = string.replace(/&gt;\u20D2/g, '&nvgt;').replace(/&lt;\u20D2/g, '&nvlt;');
			// Encode non-ASCII symbols that can be replaced with a named reference.
			string = string.replace(regexEncodeNonAscii, function (string) {
				// Note: there is no need to check `has(encodeMap, string)` here.
				return '&' + encodeMap[string] + ';';
			});
		} else if (!allowUnsafeSymbols) {
			// Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
			// using named character references.
			string = string.replace(regexEscape, escapeBmpSymbol);
		}
		return string
		// Encode astral symbols.
		.replace(regexAstralSymbols, function ($0) {
			// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			var high = $0.charCodeAt(0);
			var low = $0.charCodeAt(1);
			var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
			return escapeCodePoint(codePoint);
		})
		// Encode any remaining BMP symbols that are not printable ASCII symbols
		// using a hexadecimal escape.
		.replace(regexBmpWhitelist, escapeBmpSymbol);
	};
	// Expose default options (so they can be overridden globally).
	encode.options = {
		'allowUnsafeSymbols': false,
		'encodeEverything': false,
		'strict': false,
		'useNamedReferences': false,
		'decimal': false
	};

	var decode = function decode(html, options) {
		options = merge(options, decode.options);
		var strict = options.strict;
		if (strict && regexInvalidEntity.test(html)) {
			parseError('malformed character reference');
		}
		return html.replace(regexDecode, function ($0, $1, $2, $3, $4, $5, $6, $7) {
			var codePoint;
			var semicolon;
			var decDigits;
			var hexDigits;
			var reference;
			var next;
			if ($1) {
				// Decode decimal escapes, e.g. `&#119558;`.
				decDigits = $1;
				semicolon = $2;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(decDigits, 10);
				return codePointToSymbol(codePoint, strict);
			}
			if ($3) {
				// Decode hexadecimal escapes, e.g. `&#x1D306;`.
				hexDigits = $3;
				semicolon = $4;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(hexDigits, 16);
				return codePointToSymbol(codePoint, strict);
			}
			if ($5) {
				// Decode named character references with trailing `;`, e.g. `&copy;`.
				reference = $5;
				if (has(decodeMap, reference)) {
					return decodeMap[reference];
				} else {
					// Ambiguous ampersand. https://mths.be/notes/ambiguous-ampersands
					if (strict) {
						parseError('named character reference was not terminated by a semicolon');
					}
					return $0;
				}
			}
			// If we’re still here, it’s a legacy reference for sure. No need for an
			// extra `if` check.
			// Decode named character references without trailing `;`, e.g. `&amp`
			// This is only a parse error if it gets converted to `&`, or if it is
			// followed by `=` in an attribute context.
			reference = $6;
			next = $7;
			if (next && options.isAttributeValue) {
				if (strict && next == '=') {
					parseError('`&` did not start a character reference');
				}
				return $0;
			} else {
				if (strict) {
					parseError('named character reference was not terminated by a semicolon');
				}
				// Note: there is no need to check `has(decodeMapLegacy, reference)`.
				return decodeMapLegacy[reference] + (next || '');
			}
		});
	};
	// Expose default options (so they can be overridden globally).
	decode.options = {
		'isAttributeValue': false,
		'strict': false
	};

	var escape = function escape(string) {
		return string.replace(regexEscape, function ($0) {
			// Note: there is no need to check `has(escapeMap, $0)` here.
			return escapeMap[$0];
		});
	};

	/*--------------------------------------------------------------------------*/

	var he = {
		'version': '1.1.1',
		'encode': encode,
		'decode': decode,
		'escape': escape,
		'unescape': decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if ("function" == 'function' && _typeof(__webpack_require__(7)) == 'object' && __webpack_require__(7)) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return he;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = he;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (var key in he) {
				has(he, key) && (freeExports[key] = he[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.he = he;
	}
})(this);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(23)(module)))

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var reInterpolate = __webpack_require__(8),
    templateSettings = __webpack_require__(25);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match empty string literals in compiled template source. */
var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to ensure capturing order of template delimiters. */
var reNoMatch = /($^)/;

/** Used to match unescaped characters in compiled string literals. */
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function (key) {
    return object[key];
  });
}

/**
 * Used by `_.template` to escape characters for inclusion in compiled string literals.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var _Symbol = root.Symbol,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object),
    nativeMax = Math.max;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
    return srcValue;
  }
  return objValue;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index === 'undefined' ? 'undefined' : _typeof(index);
  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike(value)) {
    return false;
  }
  return objectToString.call(value) == errorTag || typeof value.message == 'string' && typeof value.name == 'string';
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * Creates a compiled template function that can interpolate data properties
 * in "interpolate" delimiters, HTML-escape interpolated data properties in
 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
 * properties may be accessed as free variables in the template. If a setting
 * object is given, it takes precedence over `_.templateSettings` values.
 *
 * **Note:** In the development build `_.template` utilizes
 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
 * for easier debugging.
 *
 * For more information on precompiling templates see
 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
 *
 * For more information on Chrome extension sandboxes see
 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The template string.
 * @param {Object} [options={}] The options object.
 * @param {RegExp} [options.escape=_.templateSettings.escape]
 *  The HTML "escape" delimiter.
 * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
 *  The "evaluate" delimiter.
 * @param {Object} [options.imports=_.templateSettings.imports]
 *  An object to import into the template as free variables.
 * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
 *  The "interpolate" delimiter.
 * @param {string} [options.sourceURL='templateSources[n]']
 *  The sourceURL of the compiled template.
 * @param {string} [options.variable='obj']
 *  The data object variable name.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the compiled template function.
 * @example
 *
 * // Use the "interpolate" delimiter to create a compiled template.
 * var compiled = _.template('hello <%= user %>!');
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 *
 * // Use the HTML "escape" delimiter to escape data property values.
 * var compiled = _.template('<b><%- value %></b>');
 * compiled({ 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the internal `print` function in "evaluate" delimiters.
 * var compiled = _.template('<% print("hello " + user); %>!');
 * compiled({ 'user': 'barney' });
 * // => 'hello barney!'
 *
 * // Use the ES delimiter as an alternative to the default "interpolate" delimiter.
 * var compiled = _.template('hello ${ user }!');
 * compiled({ 'user': 'pebbles' });
 * // => 'hello pebbles!'
 *
 * // Use backslashes to treat delimiters as plain text.
 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
 * compiled({ 'value': 'ignored' });
 * // => '<%- value %>'
 *
 * // Use the `imports` option to import `jQuery` as `jq`.
 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the `sourceURL` option to specify a custom sourceURL for the template.
 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
 *
 * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 * //   var __t, __p = '';
 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
 * //   return __p;
 * // }
 *
 * // Use custom template delimiters.
 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
 * var compiled = _.template('hello {{ user }}!');
 * compiled({ 'user': 'mustache' });
 * // => 'hello mustache!'
 *
 * // Use the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and stack traces.
 * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */
function template(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings.imports._.templateSettings || templateSettings;

  if (guard && isIterateeCall(string, options, guard)) {
    options = undefined;
  }
  string = toString(string);
  options = assignInWith({}, options, settings, assignInDefaults);

  var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
      importsKeys = keys(imports),
      importsValues = baseValues(imports, importsKeys);

  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '";

  // Compile the regexp to match each delimiter.
  var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');

  // Use a sourceURL for easier debugging.
  var sourceURL = 'sourceURL' in options ? '//# sourceURL=' + options.sourceURL + '\n' : '';

  string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue);

    // Escape characters that can't be included in string literals.
    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

    // Replace delimiters with snippets.
    if (escapeValue) {
      isEscaping = true;
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }
    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }
    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }
    index = offset + match.length;

    // The JS engine embedded in Adobe products needs `match` returned in
    // order to produce the correct `offset` value.
    return match;
  });

  source += "';\n";

  // If `variable` is not specified wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain.
  var variable = options.variable;
  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  }
  // Cleanup code by stripping empty strings.
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');

  // Frame code as the function body.
  source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';

  var result = attempt(function () {
    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
  });

  // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.
  result.source = source;
  if (isError(result)) {
    throw result;
  }
  return result;
}

/**
 * Attempts to invoke `func`, returning either the result or the caught error
 * object. Any additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Function} func The function to attempt.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the `func` result or error object.
 * @example
 *
 * // Avoid throwing errors for invalid selectors.
 * var elements = _.attempt(function(selector) {
 *   return document.querySelectorAll(selector);
 * }, '>_>');
 *
 * if (_.isError(elements)) {
 *   elements = [];
 * }
 */
var attempt = baseRest(function (func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});

module.exports = template;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var reInterpolate = __webpack_require__(8);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/** Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g,
    reEvaluate = /<%([\s\S]+?)%>/g;

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = basePropertyOf(htmlEscapes);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var _Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB). Change the following template settings to use
 * alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */
var templateSettings = {

  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': reEscape,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': reEvaluate,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  'imports': {

    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    '_': { 'escape': escape }
  }
};

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
 * their corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * Backticks are escaped because in IE < 9, they can break out of
 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
 * [#133](https://html5sec.org/#133) of the
 * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString(string);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}

module.exports = templateSettings;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/



// Generate an internal UID to make the regexp pattern harder to guess.

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var UID = Math.floor(Math.random() * 0x10000000000).toString(16);
var PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R|D)-' + UID + '-(\\d+)__@"', 'g');

var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
var IS_PURE_FUNCTION = /function.*?\(/;
var UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;

var RESERVED_SYMBOLS = ['*', 'async'];

// Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
// Unicode char counterparts which are safe to use in JavaScript strings.
var ESCAPED_CHARS = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
    return ESCAPED_CHARS[unsafeChar];
}

module.exports = function serialize(obj, options) {
    options || (options = {});

    // Backwards-compatibility for `space` as the second argument.
    if (typeof options === 'number' || typeof options === 'string') {
        options = { space: options };
    }

    var functions = [];
    var regexps = [];
    var dates = [];

    // Returns placeholders for functions and regexps (identified by index)
    // which are later replaced by their string representation.
    function replacer(key, value) {
        if (!value) {
            return value;
        }

        // If the value is an object w/ a toJSON method, toJSON is called before
        // the replacer runs, so we use this[key] to get the non-toJSONed value.
        var origValue = this[key];
        var type = typeof origValue === 'undefined' ? 'undefined' : _typeof(origValue);

        if (type === 'object') {
            if (origValue instanceof RegExp) {
                return '@__R-' + UID + '-' + (regexps.push(origValue) - 1) + '__@';
            }

            if (origValue instanceof Date) {
                return '@__D-' + UID + '-' + (dates.push(origValue) - 1) + '__@';
            }
        }

        if (type === 'function') {
            return '@__F-' + UID + '-' + (functions.push(origValue) - 1) + '__@';
        }

        return value;
    }

    function serializeFunc(fn) {
        var serializedFn = fn.toString();
        if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
            throw new TypeError('Serializing native function: ' + fn.name);
        }

        // pure functions, example: {key: function() {}}
        if (IS_PURE_FUNCTION.test(serializedFn)) {
            return serializedFn;
        }

        var argsStartsAt = serializedFn.indexOf('(');
        var def = serializedFn.substr(0, argsStartsAt).trim().split(' ').filter(function (val) {
            return val.length > 0;
        });

        var nonReservedSymbols = def.filter(function (val) {
            return RESERVED_SYMBOLS.indexOf(val) === -1;
        });

        // enhanced literal objects, example: {key() {}}
        if (nonReservedSymbols.length > 0) {
            return (def.indexOf('async') > -1 ? 'async ' : '') + 'function' + (def.join('').indexOf('*') > -1 ? '*' : '') + serializedFn.substr(argsStartsAt);
        }

        // arrow functions
        return serializedFn;
    }

    var str;

    // Creates a JSON string representation of the value.
    // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
    if (options.isJSON && !options.space) {
        str = JSON.stringify(obj);
    } else {
        str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
    }

    // Protects against `JSON.stringify()` returning `undefined`, by serializing
    // to the literal string: "undefined".
    if (typeof str !== 'string') {
        return String(str);
    }

    // Replace unsafe HTML and invalid JavaScript line terminator chars with
    // their safe Unicode char counterpart. This _must_ happen before the
    // regexps and functions are serialized and added back to the string.
    if (options.unsafe !== true) {
        str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
    }

    if (functions.length === 0 && regexps.length === 0 && dates.length === 0) {
        return str;
    }

    // Replaces all occurrences of function, regexp and date placeholders in the
    // JSON string with their string representations. If the original value can
    // not be found, then `undefined` is used.
    return str.replace(PLACE_HOLDER_REGEXP, function (match, type, valueIndex) {
        if (type === 'D') {
            return "new Date(\"" + dates[valueIndex].toISOString() + "\")";
        }

        if (type === 'R') {
            return regexps[valueIndex].toString();
        }

        var fn = functions[valueIndex];

        return serializeFunc(fn);
    });
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("vm");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(3);
var async = __webpack_require__(30);
async.core = core;
async.isCore = function isCore(x) {
  return core[x];
};
async.sync = __webpack_require__(32);

exports = async;
module.exports = async;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = {"assert":true,"async_hooks":">= 8","buffer_ieee754":"< 0.9.7","buffer":true,"child_process":true,"cluster":true,"console":true,"constants":true,"crypto":true,"_debugger":"< 8","dgram":true,"dns":true,"domain":true,"events":true,"freelist":"< 6","fs":true,"fs/promises":">= 10 && < 10.1","_http_agent":">= 0.11.1","_http_client":">= 0.11.1","_http_common":">= 0.11.1","_http_incoming":">= 0.11.1","_http_outgoing":">= 0.11.1","_http_server":">= 0.11.1","http":true,"http2":">= 8.8","https":true,"inspector":">= 8.0.0","_linklist":"< 8","module":true,"net":true,"node-inspect/lib/_inspect":">= 7.6.0","node-inspect/lib/internal/inspect_client":">= 7.6.0","node-inspect/lib/internal/inspect_repl":">= 7.6.0","os":true,"path":true,"perf_hooks":">= 8.5","process":">= 1","punycode":true,"querystring":true,"readline":true,"repl":true,"smalloc":">= 0.11.5 && < 3","_stream_duplex":">= 0.9.4","_stream_transform":">= 0.9.4","_stream_wrap":">= 1.4.1","_stream_passthrough":">= 0.9.4","_stream_readable":">= 0.9.4","_stream_writable":">= 0.9.4","stream":true,"string_decoder":true,"sys":true,"timers":true,"_tls_common":">= 0.11.13","_tls_legacy":">= 0.11.3 && < 10","_tls_wrap":">= 0.11.3","tls":true,"trace_events":">= 10","tty":true,"url":true,"util":true,"v8/tools/arguments":">= 10","v8/tools/codemap":[">= 4.4.0 && < 5",">= 5.2.0"],"v8/tools/consarray":[">= 4.4.0 && < 5",">= 5.2.0"],"v8/tools/csvparser":[">= 4.4.0 && < 5",">= 5.2.0"],"v8/tools/logreader":[">= 4.4.0 && < 5",">= 5.2.0"],"v8/tools/profile_view":[">= 4.4.0 && < 5",">= 5.2.0"],"v8/tools/splaytree":[">= 4.4.0 && < 5",">= 5.2.0"],"v8":">= 1","vm":true,"zlib":true}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(3);
var fs = __webpack_require__(4);
var path = __webpack_require__(0);
var caller = __webpack_require__(9);
var nodeModulesPaths = __webpack_require__(10);
var normalizeOptions = __webpack_require__(11);

var defaultIsFile = function isFile(file, cb) {
    fs.stat(file, function (err, stat) {
        if (!err) {
            return cb(null, stat.isFile() || stat.isFIFO());
        }
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
        return cb(err);
    });
};

module.exports = function resolve(x, options, callback) {
    var cb = callback;
    var opts = options;
    if (typeof options === 'function') {
        cb = opts;
        opts = {};
    }
    if (typeof x !== 'string') {
        var err = new TypeError('Path must be a string.');
        return process.nextTick(function () {
            cb(err);
        });
    }

    opts = normalizeOptions(x, opts);

    var isFile = opts.isFile || defaultIsFile;
    var readFile = opts.readFile || fs.readFile;

    var extensions = opts.extensions || ['.js'];
    var basedir = opts.basedir || path.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || [];

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = path.resolve(basedir);

    if (opts.preserveSymlinks === false) {
        fs.realpath(absoluteStart, function (realPathErr, realStart) {
            if (realPathErr && realPathErr.code !== 'ENOENT') cb(err);else init(realStart);
        });
    } else {
        init(absoluteStart);
    }

    var res;
    function init(basedir) {
        if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
            res = path.resolve(basedir, x);
            if (x === '..' || x.slice(-1) === '/') res += '/';
            if (/\/$/.test(x) && res === basedir) {
                loadAsDirectory(res, opts.package, onfile);
            } else loadAsFile(res, opts.package, onfile);
        } else loadNodeModules(x, basedir, function (err, n, pkg) {
            if (err) cb(err);else if (n) cb(null, n, pkg);else if (core[x]) return cb(null, x);else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function onfile(err, m, pkg) {
        if (err) cb(err);else if (m) cb(null, m, pkg);else loadAsDirectory(res, function (err, d, pkg) {
            if (err) cb(err);else if (d) cb(null, d, pkg);else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function loadAsFile(x, thePackage, callback) {
        var loadAsFilePackage = thePackage;
        var cb = callback;
        if (typeof loadAsFilePackage === 'function') {
            cb = loadAsFilePackage;
            loadAsFilePackage = undefined;
        }

        var exts = [''].concat(extensions);
        load(exts, x, loadAsFilePackage);

        function load(exts, x, loadPackage) {
            if (exts.length === 0) return cb(null, undefined, loadPackage);
            var file = x + exts[0];

            var pkg = loadPackage;
            if (pkg) onpkg(null, pkg);else loadpkg(path.dirname(file), onpkg);

            function onpkg(err, pkg_, dir) {
                pkg = pkg_;
                if (err) return cb(err);
                if (dir && pkg && opts.pathFilter) {
                    var rfile = path.relative(dir, file);
                    var rel = rfile.slice(0, rfile.length - exts[0].length);
                    var r = opts.pathFilter(pkg, x, rel);
                    if (r) return load([''].concat(extensions.slice()), path.resolve(dir, r), pkg);
                }
                isFile(file, onex);
            }
            function onex(err, ex) {
                if (err) return cb(err);
                if (ex) return cb(null, file, pkg);
                load(exts.slice(1), x, pkg);
            }
        }
    }

    function loadpkg(dir, cb) {
        if (dir === '' || dir === '/') return cb(null);
        if (process.platform === 'win32' && /^\w:[/\\]*$/.test(dir)) {
            return cb(null);
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir)) return cb(null);

        var pkgfile = path.join(dir, 'package.json');
        isFile(pkgfile, function (err, ex) {
            // on err, ex is false
            if (!ex) return loadpkg(path.dirname(dir), cb);

            readFile(pkgfile, function (err, body) {
                if (err) cb(err);
                try {
                    var pkg = JSON.parse(body);
                } catch (jsonErr) {}

                if (pkg && opts.packageFilter) {
                    pkg = opts.packageFilter(pkg, pkgfile);
                }
                cb(null, pkg, dir);
            });
        });
    }

    function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
        var cb = callback;
        var fpkg = loadAsDirectoryPackage;
        if (typeof fpkg === 'function') {
            cb = fpkg;
            fpkg = opts.package;
        }

        var pkgfile = path.join(x, 'package.json');
        isFile(pkgfile, function (err, ex) {
            if (err) return cb(err);
            if (!ex) return loadAsFile(path.join(x, 'index'), fpkg, cb);

            readFile(pkgfile, function (err, body) {
                if (err) return cb(err);
                try {
                    var pkg = JSON.parse(body);
                } catch (jsonErr) {}

                if (opts.packageFilter) {
                    pkg = opts.packageFilter(pkg, pkgfile);
                }

                if (pkg.main) {
                    if (typeof pkg.main !== 'string') {
                        var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                        mainError.code = 'INVALID_PACKAGE_MAIN';
                        return cb(mainError);
                    }
                    if (pkg.main === '.' || pkg.main === './') {
                        pkg.main = 'index';
                    }
                    loadAsFile(path.resolve(x, pkg.main), pkg, function (err, m, pkg) {
                        if (err) return cb(err);
                        if (m) return cb(null, m, pkg);
                        if (!pkg) return loadAsFile(path.join(x, 'index'), pkg, cb);

                        var dir = path.resolve(x, pkg.main);
                        loadAsDirectory(dir, pkg, function (err, n, pkg) {
                            if (err) return cb(err);
                            if (n) return cb(null, n, pkg);
                            loadAsFile(path.join(x, 'index'), pkg, cb);
                        });
                    });
                    return;
                }

                loadAsFile(path.join(x, '/index'), pkg, cb);
            });
        });
    }

    function processDirs(cb, dirs) {
        if (dirs.length === 0) return cb(null, undefined);
        var dir = dirs[0];

        var file = path.join(dir, x);
        loadAsFile(file, opts.package, onfile);

        function onfile(err, m, pkg) {
            if (err) return cb(err);
            if (m) return cb(null, m, pkg);
            loadAsDirectory(path.join(dir, x), opts.package, ondir);
        }

        function ondir(err, n, pkg) {
            if (err) return cb(err);
            if (n) return cb(null, n, pkg);
            processDirs(cb, dirs.slice(1));
        }
    }
    function loadNodeModules(x, start, cb) {
        processDirs(cb, nodeModulesPaths(start, opts, x));
    }
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isWindows = process.platform === 'win32';

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
var splitTailRe = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

var win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  var result = splitDeviceRe.exec(filename),
      device = (result[1] || '') + (result[2] || ''),
      tail = result[3] || '';
  // Split the tail into dir, basename and extension
  var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3];
  return [device, dir, basename, ext];
}

win32.parse = function (pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError("Parameter 'pathString' must be a string, not " + (typeof pathString === 'undefined' ? 'undefined' : _typeof(pathString)));
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var posix = {};

function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}

posix.parse = function (pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError("Parameter 'pathString' must be a string, not " + (typeof pathString === 'undefined' ? 'undefined' : _typeof(pathString)));
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};

if (isWindows) module.exports = win32.parse;else /* posix */
  module.exports = posix.parse;

module.exports.posix = posix.parse;
module.exports.win32 = win32.parse;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(3);
var fs = __webpack_require__(4);
var path = __webpack_require__(0);
var caller = __webpack_require__(9);
var nodeModulesPaths = __webpack_require__(10);
var normalizeOptions = __webpack_require__(11);

var defaultIsFile = function isFile(file) {
    try {
        var stat = fs.statSync(file);
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return stat.isFile() || stat.isFIFO();
};

module.exports = function (x, options) {
    if (typeof x !== 'string') {
        throw new TypeError('Path must be a string.');
    }
    var opts = normalizeOptions(x, options);

    var isFile = opts.isFile || defaultIsFile;
    var readFileSync = opts.readFileSync || fs.readFileSync;

    var extensions = opts.extensions || ['.js'];
    var basedir = opts.basedir || path.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || [];

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = path.resolve(basedir);

    if (opts.preserveSymlinks === false) {
        try {
            absoluteStart = fs.realpathSync(absoluteStart);
        } catch (realPathErr) {
            if (realPathErr.code !== 'ENOENT') {
                throw realPathErr;
            }
        }
    }

    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
        var res = path.resolve(absoluteStart, x);
        if (x === '..' || x.slice(-1) === '/') res += '/';
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m) return m;
    } else {
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n) return n;
    }

    if (core[x]) return x;

    var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;

    function loadAsFileSync(x) {
        var pkg = loadpkg(path.dirname(x));

        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
            var rfile = path.relative(pkg.dir, x);
            var r = opts.pathFilter(pkg.pkg, x, rfile);
            if (r) {
                x = path.resolve(pkg.dir, r); // eslint-disable-line no-param-reassign
            }
        }

        if (isFile(x)) {
            return x;
        }

        for (var i = 0; i < extensions.length; i++) {
            var file = x + extensions[i];
            if (isFile(file)) {
                return file;
            }
        }
    }

    function loadpkg(dir) {
        if (dir === '' || dir === '/') return;
        if (process.platform === 'win32' && /^\w:[/\\]*$/.test(dir)) {
            return;
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir)) return;

        var pkgfile = path.join(dir, 'package.json');

        if (!isFile(pkgfile)) {
            return loadpkg(path.dirname(dir));
        }

        var body = readFileSync(pkgfile);

        try {
            var pkg = JSON.parse(body);
        } catch (jsonErr) {}

        if (pkg && opts.packageFilter) {
            pkg = opts.packageFilter(pkg, dir);
        }

        return { pkg: pkg, dir: dir };
    }

    function loadAsDirectorySync(x) {
        var pkgfile = path.join(x, '/package.json');
        if (isFile(pkgfile)) {
            try {
                var body = readFileSync(pkgfile, 'UTF8');
                var pkg = JSON.parse(body);
            } catch (e) {}

            if (opts.packageFilter) {
                pkg = opts.packageFilter(pkg, x);
            }

            if (pkg.main) {
                if (typeof pkg.main !== 'string') {
                    var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                    mainError.code = 'INVALID_PACKAGE_MAIN';
                    throw mainError;
                }
                if (pkg.main === '.' || pkg.main === './') {
                    pkg.main = 'index';
                }
                try {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                    var n = loadAsDirectorySync(path.resolve(x, pkg.main));
                    if (n) return n;
                } catch (e) {}
            }
        }

        return loadAsFileSync(path.join(x, '/index'));
    }

    function loadNodeModulesSync(x, start) {
        var dirs = nodeModulesPaths(start, opts, x);
        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            var m = loadAsFileSync(path.join(dir, '/', x));
            if (m) return m;
            var n = loadAsDirectorySync(path.join(dir, '/', x));
            if (n) return n;
        }
    }
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("module");

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(13).SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(37).SourceMapConsumer;
exports.SourceNode = __webpack_require__(40).SourceNode;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65; // 'A'
  var bigZ = 90; // 'Z'

  var littleA = 97; // 'a'
  var littleZ = 122; // 'z'

  var zero = 48; // '0'
  var nine = 57; // '9'

  var plus = 43; // '+'
  var slash = 47; // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return charCode - bigA;
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return charCode - littleA + littleOffset;
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return charCode - zero + numberOffset;
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(1);

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = { generatedLine: -1, generatedColumn: 0 };
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
  this._array.forEach(aCallback, aThisArg);
};

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(1);
var binarySearch = __webpack_require__(38);
var ArraySet = __webpack_require__(15).ArraySet;
var base64VLQ = __webpack_require__(14);
var quickSort = __webpack_require__(39).quickSort;

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap) : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function (aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function get() {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function get() {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
  var c = aStr.charAt(index);
  return c === ";" || c === ",";
};

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
  throw new Error("Subclasses must implement _parseMappings");
};

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
  var context = aContext || null;
  var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

  var mappings;
  switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
  }

  var sourceRoot = this.sourceRoot;
  mappings.map(function (mapping) {
    var source = mapping.source === null ? null : this._sources.at(mapping.source);
    if (source != null && sourceRoot != null) {
      source = util.join(sourceRoot, source);
    }
    return {
      source: source,
      generatedLine: mapping.generatedLine,
      generatedColumn: mapping.generatedColumn,
      originalLine: mapping.originalLine,
      originalColumn: mapping.originalColumn,
      name: mapping.name === null ? null : this._names.at(mapping.name)
    };
  }, this).forEach(aCallback, context);
};

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
  var line = util.getArg(aArgs, 'line');

  // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
  // returns the index of the closest mapping less than the needle. By
  // setting needle.originalColumn to 0, we thus find the last mapping for
  // the given line, provided such a mapping exists.
  var needle = {
    source: util.getArg(aArgs, 'source'),
    originalLine: line,
    originalColumn: util.getArg(aArgs, 'column', 0)
  };

  if (this.sourceRoot != null) {
    needle.source = util.relative(this.sourceRoot, needle.source);
  }
  if (!this._sources.has(needle.source)) {
    return [];
  }
  needle.source = this._sources.indexOf(needle.source);

  var mappings = [];

  var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
  if (index >= 0) {
    var mapping = this._originalMappings[index];

    if (aArgs.column === undefined) {
      var originalLine = mapping.originalLine;

      // Iterate until either we run out of mappings, or we run into
      // a mapping for a different line than the one we found. Since
      // mappings are sorted, this is guaranteed to find all mappings for
      // the line we found.
      while (mapping && mapping.originalLine === originalLine) {
        mappings.push({
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        });

        mapping = this._originalMappings[++index];
      }
    } else {
      var originalColumn = mapping.originalColumn;

      // Iterate until either we run out of mappings, or we run into
      // a mapping for a different line than the one we were searching for.
      // Since mappings are sorted, this is guaranteed to find all mappings for
      // the line we are searching for.
      while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
        mappings.push({
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        });

        mapping = this._originalMappings[++index];
      }
    }
  }

  return mappings;
};

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources.map(String)
  // Some source maps produce relative source paths like "./foo.js" instead of
  // "foo.js".  Normalize these first so that future comparisons will succeed.
  // See bugzil.la/1090768.
  .map(util.normalize)
  // Always ensure that absolute sources are internally stored relative to
  // the source root, if the source root is absolute. Not doing this would
  // be particularly problematic when the source root is a prefix of the
  // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
  .map(function (source) {
    return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
  });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap) {
  var smc = Object.create(BasicSourceMapConsumer.prototype);

  var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
  var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
  smc.sourceRoot = aSourceMap._sourceRoot;
  smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
  smc.file = aSourceMap._file;

  // Because we are modifying the entries (by converting string sources and
  // names to indices into the sources and names ArraySets), we have to make
  // a copy of the entry or else bad things happen. Shared mutable state
  // strikes again! See github issue #191.

  var generatedMappings = aSourceMap._mappings.toArray().slice();
  var destGeneratedMappings = smc.__generatedMappings = [];
  var destOriginalMappings = smc.__originalMappings = [];

  for (var i = 0, length = generatedMappings.length; i < length; i++) {
    var srcMapping = generatedMappings[i];
    var destMapping = new Mapping();
    destMapping.generatedLine = srcMapping.generatedLine;
    destMapping.generatedColumn = srcMapping.generatedColumn;

    if (srcMapping.source) {
      destMapping.source = sources.indexOf(srcMapping.source);
      destMapping.originalLine = srcMapping.originalLine;
      destMapping.originalColumn = srcMapping.originalColumn;

      if (srcMapping.name) {
        destMapping.name = names.indexOf(srcMapping.name);
      }

      destOriginalMappings.push(destMapping);
    }

    destGeneratedMappings.push(destMapping);
  }

  quickSort(smc.__originalMappings, util.compareByOriginalPositions);

  return smc;
};

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function get() {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
  var generatedLine = 1;
  var previousGeneratedColumn = 0;
  var previousOriginalLine = 0;
  var previousOriginalColumn = 0;
  var previousSource = 0;
  var previousName = 0;
  var length = aStr.length;
  var index = 0;
  var cachedSegments = {};
  var temp = {};
  var originalMappings = [];
  var generatedMappings = [];
  var mapping, str, segment, end, value;

  while (index < length) {
    if (aStr.charAt(index) === ';') {
      generatedLine++;
      index++;
      previousGeneratedColumn = 0;
    } else if (aStr.charAt(index) === ',') {
      index++;
    } else {
      mapping = new Mapping();
      mapping.generatedLine = generatedLine;

      // Because each offset is encoded relative to the previous one,
      // many segments often have the same encoding. We can exploit this
      // fact by caching the parsed variable length fields of each segment,
      // allowing us to avoid a second parse if we encounter the same
      // segment again.
      for (end = index; end < length; end++) {
        if (this._charIsMappingSeparator(aStr, end)) {
          break;
        }
      }
      str = aStr.slice(index, end);

      segment = cachedSegments[str];
      if (segment) {
        index += str.length;
      } else {
        segment = [];
        while (index < end) {
          base64VLQ.decode(aStr, index, temp);
          value = temp.value;
          index = temp.rest;
          segment.push(value);
        }

        if (segment.length === 2) {
          throw new Error('Found a source, but no line and column');
        }

        if (segment.length === 3) {
          throw new Error('Found a source and line, but no column');
        }

        cachedSegments[str] = segment;
      }

      // Generated column.
      mapping.generatedColumn = previousGeneratedColumn + segment[0];
      previousGeneratedColumn = mapping.generatedColumn;

      if (segment.length > 1) {
        // Original source.
        mapping.source = previousSource + segment[1];
        previousSource += segment[1];

        // Original line.
        mapping.originalLine = previousOriginalLine + segment[2];
        previousOriginalLine = mapping.originalLine;
        // Lines are stored 0-based
        mapping.originalLine += 1;

        // Original column.
        mapping.originalColumn = previousOriginalColumn + segment[3];
        previousOriginalColumn = mapping.originalColumn;

        if (segment.length > 4) {
          // Original name.
          mapping.name = previousName + segment[4];
          previousName += segment[4];
        }
      }

      generatedMappings.push(mapping);
      if (typeof mapping.originalLine === 'number') {
        originalMappings.push(mapping);
      }
    }
  }

  quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
  this.__generatedMappings = generatedMappings;

  quickSort(originalMappings, util.compareByOriginalPositions);
  this.__originalMappings = originalMappings;
};

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
  // To return the position we are searching for, we must first find the
  // mapping for the given position and then return the opposite position it
  // points to. Because the mappings are sorted, we can use binary search to
  // find the best mapping.

  if (aNeedle[aLineName] <= 0) {
    throw new TypeError('Line must be greater than or equal to 1, got ' + aNeedle[aLineName]);
  }
  if (aNeedle[aColumnName] < 0) {
    throw new TypeError('Column must be greater than or equal to 0, got ' + aNeedle[aColumnName]);
  }

  return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
};

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
  for (var index = 0; index < this._generatedMappings.length; ++index) {
    var mapping = this._generatedMappings[index];

    // Mappings do not contain a field for the last generated columnt. We
    // can come up with an optimistic estimate, however, by assuming that
    // mappings are contiguous (i.e. given two consecutive mappings, the
    // first mapping ends where the second one starts).
    if (index + 1 < this._generatedMappings.length) {
      var nextMapping = this._generatedMappings[index + 1];

      if (mapping.generatedLine === nextMapping.generatedLine) {
        mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
        continue;
      }
    }

    // The last mapping for each line spans the entire line.
    mapping.lastGeneratedColumn = Infinity;
  }
};

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
  var needle = {
    generatedLine: util.getArg(aArgs, 'line'),
    generatedColumn: util.getArg(aArgs, 'column')
  };

  var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND));

  if (index >= 0) {
    var mapping = this._generatedMappings[index];

    if (mapping.generatedLine === needle.generatedLine) {
      var source = util.getArg(mapping, 'source', null);
      if (source !== null) {
        source = this._sources.at(source);
        if (this.sourceRoot != null) {
          source = util.join(this.sourceRoot, source);
        }
      }
      var name = util.getArg(mapping, 'name', null);
      if (name !== null) {
        name = this._names.at(name);
      }
      return {
        source: source,
        line: util.getArg(mapping, 'originalLine', null),
        column: util.getArg(mapping, 'originalColumn', null),
        name: name
      };
    }
  }

  return {
    source: null,
    line: null,
    column: null,
    name: null
  };
};

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
  if (!this.sourcesContent) {
    return false;
  }
  return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function (sc) {
    return sc == null;
  });
};

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
  if (!this.sourcesContent) {
    return null;
  }

  if (this.sourceRoot != null) {
    aSource = util.relative(this.sourceRoot, aSource);
  }

  if (this._sources.has(aSource)) {
    return this.sourcesContent[this._sources.indexOf(aSource)];
  }

  var url;
  if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
    // XXX: file:// URIs and absolute paths lead to unexpected behavior for
    // many users. We can help them out when they expect file:// URIs to
    // behave like it would if they were running a local HTTP server. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
    var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
    if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
      return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
    }

    if ((!url.path || url.path == "/") && this._sources.has("/" + aSource)) {
      return this.sourcesContent[this._sources.indexOf("/" + aSource)];
    }
  }

  // This function is used recursively from
  // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
  // don't want to throw if we can't find the source - we just want to
  // return null, so we provide a flag to exit gracefully.
  if (nullOnMissing) {
    return null;
  } else {
    throw new Error('"' + aSource + '" is not in the SourceMap.');
  }
};

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
  var source = util.getArg(aArgs, 'source');
  if (this.sourceRoot != null) {
    source = util.relative(this.sourceRoot, source);
  }
  if (!this._sources.has(source)) {
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  }
  source = this._sources.indexOf(source);

  var needle = {
    source: source,
    originalLine: util.getArg(aArgs, 'line'),
    originalColumn: util.getArg(aArgs, 'column')
  };

  var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND));

  if (index >= 0) {
    var mapping = this._originalMappings[index];

    if (mapping.source === needle.source) {
      return {
        line: util.getArg(mapping, 'generatedLine', null),
        column: util.getArg(mapping, 'generatedColumn', null),
        lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
      };
    }
  }

  return {
    line: null,
    column: null,
    lastColumn: null
  };
};

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    };
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function get() {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
  var needle = {
    generatedLine: util.getArg(aArgs, 'line'),
    generatedColumn: util.getArg(aArgs, 'column')
  };

  // Find the section containing the generated position we're trying to map
  // to an original position.
  var sectionIndex = binarySearch.search(needle, this._sections, function (needle, section) {
    var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
    if (cmp) {
      return cmp;
    }

    return needle.generatedColumn - section.generatedOffset.generatedColumn;
  });
  var section = this._sections[sectionIndex];

  if (!section) {
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  }

  return section.consumer.originalPositionFor({
    line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
    column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
    bias: aArgs.bias
  });
};

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
  return this._sections.every(function (s) {
    return s.consumer.hasContentsOfAllSources();
  });
};

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
  for (var i = 0; i < this._sections.length; i++) {
    var section = this._sections[i];

    var content = section.consumer.sourceContentFor(aSource, true);
    if (content) {
      return content;
    }
  }
  if (nullOnMissing) {
    return null;
  } else {
    throw new Error('"' + aSource + '" is not in the SourceMap.');
  }
};

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
  for (var i = 0; i < this._sections.length; i++) {
    var section = this._sections[i];

    // Only consider this section if the requested source is in the list of
    // sources of the consumer.
    if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
      continue;
    }
    var generatedPosition = section.consumer.generatedPositionFor(aArgs);
    if (generatedPosition) {
      var ret = {
        line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
        column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
      };
      return ret;
    }
  }

  return {
    line: null,
    column: null
  };
};

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
  this.__generatedMappings = [];
  this.__originalMappings = [];
  for (var i = 0; i < this._sections.length; i++) {
    var section = this._sections[i];
    var sectionMappings = section.consumer._generatedMappings;
    for (var j = 0; j < sectionMappings.length; j++) {
      var mapping = sectionMappings[j];

      var source = section.consumer._sources.at(mapping.source);
      if (section.consumer.sourceRoot !== null) {
        source = util.join(section.consumer.sourceRoot, source);
      }
      this._sources.add(source);
      source = this._sources.indexOf(source);

      var name = section.consumer._names.at(mapping.name);
      this._names.add(name);
      name = this._names.indexOf(name);

      // The mappings coming from the consumer for the section have
      // generated positions relative to the start of the section, so we
      // need to offset them to be relative to the start of the concatenated
      // generated file.
      var adjustedMapping = {
        source: source,
        generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
        generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: name
      };

      this.__generatedMappings.push(adjustedMapping);
      if (typeof adjustedMapping.originalLine === 'number') {
        this.__originalMappings.push(adjustedMapping);
      }
    }
  }

  quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
  quickSort(this.__originalMappings, util.compareByOriginalPositions);
};

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

/***/ }),
/* 38 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  } else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  } else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + Math.random() * (high - low));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = __webpack_require__(13).SourceMapGenerator;
var util = __webpack_require__(1);

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
  // The SourceNode we want to fill with the generated code
  // and the SourceMap
  var node = new SourceNode();

  // All even indices of this array are one line of the generated code,
  // while all odd indices are the newlines between two adjacent lines
  // (since `REGEX_NEWLINE` captures its match).
  // Processed fragments are removed from this array, by calling `shiftNextLine`.
  var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
  var shiftNextLine = function shiftNextLine() {
    var lineContents = remainingLines.shift();
    // The last line of a file might not have a newline.
    var newLine = remainingLines.shift() || "";
    return lineContents + newLine;
  };

  // We need to remember the position of "remainingLines"
  var lastGeneratedLine = 1,
      lastGeneratedColumn = 0;

  // The generate SourceNodes we need a code range.
  // To extract it current and last mapping is used.
  // Here we store the last mapping.
  var lastMapping = null;

  aSourceMapConsumer.eachMapping(function (mapping) {
    if (lastMapping !== null) {
      // We add the code from "lastMapping" to "mapping":
      // First check if there is a new line in between.
      if (lastGeneratedLine < mapping.generatedLine) {
        // Associate first line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
        lastGeneratedLine++;
        lastGeneratedColumn = 0;
        // The remaining code is added without mapping
      } else {
        // There is no new line in between.
        // Associate the code between "lastGeneratedColumn" and
        // "mapping.generatedColumn" with "lastMapping"
        var nextLine = remainingLines[0];
        var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
        remainingLines[0] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
        addMappingWithCode(lastMapping, code);
        // No more remaining code, continue
        lastMapping = mapping;
        return;
      }
    }
    // We add the generated code until the first mapping
    // to the SourceNode without any mapping.
    // Each line is added as separate string.
    while (lastGeneratedLine < mapping.generatedLine) {
      node.add(shiftNextLine());
      lastGeneratedLine++;
    }
    if (lastGeneratedColumn < mapping.generatedColumn) {
      var nextLine = remainingLines[0];
      node.add(nextLine.substr(0, mapping.generatedColumn));
      remainingLines[0] = nextLine.substr(mapping.generatedColumn);
      lastGeneratedColumn = mapping.generatedColumn;
    }
    lastMapping = mapping;
  }, this);
  // We have processed all mappings.
  if (remainingLines.length > 0) {
    if (lastMapping) {
      // Associate the remaining code in the current line with "lastMapping"
      addMappingWithCode(lastMapping, shiftNextLine());
    }
    // and add the remaining lines without any mapping
    node.add(remainingLines.join(""));
  }

  // Copy sourcesContent into SourceNode
  aSourceMapConsumer.sources.forEach(function (sourceFile) {
    var content = aSourceMapConsumer.sourceContentFor(sourceFile);
    if (content != null) {
      if (aRelativePath != null) {
        sourceFile = util.join(aRelativePath, sourceFile);
      }
      node.setSourceContent(sourceFile, content);
    }
  });

  return node;

  function addMappingWithCode(mapping, code) {
    if (mapping === null || mapping.source === undefined) {
      node.add(code);
    } else {
      var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
      node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
    }
  }
};

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  } else {
    throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length - 1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  } else {
    throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    } else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
          line: this.line,
          column: this.column,
          name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len - 1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  } else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  } else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
  this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
};

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
  for (var i = 0, len = this.children.length; i < len; i++) {
    if (this.children[i][isSourceNode]) {
      this.children[i].walkSourceContents(aFn);
    }
  }

  var sources = Object.keys(this.sourceContents);
  for (var i = 0, len = sources.length; i < len; i++) {
    aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
  }
};

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null && original.line !== null && original.column !== null) {
      if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
var i
;(i=__webpack_require__(42),i.__inject__&&i.__inject__(ssrContext),i)
}
var Component = __webpack_require__(47)(
  /* script */
  __webpack_require__(48),
  /* template */
  __webpack_require__(55),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  "54420293"
)
Component.options.__file = "/Users/didi/workplace/share/ssr/products/vue/pages/hello/app.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] app.vue: functional components are not supported with templates, they should use render functions.")}

module.exports = Component.exports


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(45)
module.exports.__inject__ = function (context) {
  add("91e9e8e4", content, false, context)
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(44)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var listToStyles = __webpack_require__(46)

module.exports = function (parentId, list, isProduction, context) {
  if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
    context = __VUE_SSR_CONTEXT__
  }
  if (context) {
    if (!context.hasOwnProperty('styles')) {
      Object.defineProperty(context, 'styles', {
        enumerable: true,
        get: function() {
          return renderStyles(context._styles)
        }
      })
      // expose renderStyles for vue-server-renderer (vuejs/#6353)
      context._renderStyles = renderStyles
    }

    var styles = context._styles || (context._styles = {})
    list = listToStyles(parentId, list)
    if (isProduction) {
      addStyleProd(styles, list)
    } else {
      addStyleDev(styles, list)
    }
  }
}

// In production, render as few style tags as possible.
// (mostly because IE9 has a limit on number of style tags)
function addStyleProd (styles, list) {
  for (var i = 0; i < list.length; i++) {
    var parts = list[i].parts
    for (var j = 0; j < parts.length; j++) {
      var part = parts[j]
      // group style tags by media types.
      var id = part.media || 'default'
      var style = styles[id]
      if (style) {
        if (style.ids.indexOf(part.id) < 0) {
          style.ids.push(part.id)
          style.css += '\n' + part.css
        }
      } else {
        styles[id] = {
          ids: [part.id],
          css: part.css,
          media: part.media
        }
      }
    }
  }
}

// In dev we use individual style tag for each module for hot-reload
// and source maps.
function addStyleDev (styles, list) {
  for (var i = 0; i < list.length; i++) {
    var parts = list[i].parts
    for (var j = 0; j < parts.length; j++) {
      var part = parts[j]
      styles[part.id] = {
        ids: [part.id],
        css: part.css,
        media: part.media
      }
    }
  }
}

function renderStyles (styles) {
  var css = ''
  for (var key in styles) {
    var style = styles[key]
    css += '<style data-vue-ssr-id="' + style.ids.join(' ') + '"' +
        (style.media ? ( ' media="' + style.media + '"' ) : '') + '>' +
        style.css + '</style>'
  }
  return css
}


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles(parentId, list) {
  var styles = [];
  var newStyles = {};
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = item[0];
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    };
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] });
    } else {
      newStyles[id].parts.push(part);
    }
  }
  return styles;
};

/***/ }),
/* 47 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_request__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service__ = __webpack_require__(18);
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'App',
  components: {},
  data: function data() {
    return {
      user: {}
    };
  },
  mounted: function mounted() {
    var _this = this;

    Object(__WEBPACK_IMPORTED_MODULE_0__lib_request__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__service__["a" /* testModule */].getUser, {}).then(function (data) {
      console.log(data);
      if (data.data) {
        _this.user = data.data;
      }
    });
    console.log('mounted');
  }
});

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = request;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_qs__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_qs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_qs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_universal_jsonp__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_universal_jsonp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_universal_jsonp__);



var METHOD_GET = 'get';
var METHOD_POST = 'post';
var METHOD_JSONP = 'jsonp';
var DEFAULT_DATA_TYPE = 'json';
var DEFAULT_METHOD = METHOD_GET;
var DEFAULT_JSONP_CALLBACK_FUNCTION_NAME = 'callback';

function request(api, params) {
  var method = (api.method || DEFAULT_METHOD).toLowerCase();
  if (method === METHOD_GET) {
    var requestParams = Object.assign({}, api.params || {}, params || {});
    var domain = api.domain || '';
    var url = '' + domain + api.url + '?' + __WEBPACK_IMPORTED_MODULE_0_qs___default.a.stringify(requestParams);
    return new Promise(function (resolve, reject) {
      // eslint-disable-next-line
      fetch(url, {
        dataType: DEFAULT_DATA_TYPE
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        resolve(data);
      }).catch(function (err) {
        reject(err);
      });
    });
  } else if (method === METHOD_JSONP) {
    var _requestParams = Object.assign({}, api.params || {}, params || {});
    var _domain = api.domain || '';
    var _url = '' + _domain + api.url + '?' + __WEBPACK_IMPORTED_MODULE_0_qs___default.a.stringify(_requestParams);
    return new Promise(function (resolve, reject) {
      __WEBPACK_IMPORTED_MODULE_1_universal_jsonp___default()(_url, {
        jsonpCallbackFunctionName: api.callback || DEFAULT_JSONP_CALLBACK_FUNCTION_NAME
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        resolve(data);
      }).catch(function (err) {
        reject(err);
      });
    });
  } else if (method === METHOD_POST) {
    var _requestParams2 = Object.assign({}, api.params || {}, params || {});
    var _domain2 = api.domain || '';
    var _url2 = '' + _domain2 + api.url + '?_t=' + new Date().getTime();
    return new Promise(function (resolve, reject) {
      // eslint-disable-next-line
      fetch(_url2, {
        dataType: DEFAULT_DATA_TYPE,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: __WEBPACK_IMPORTED_MODULE_0_qs___default.a.stringify(_requestParams2)
      }).then(function (response) {
        return new Promise(function (resolve1, reject1) {
          response.text().then(function (str) {
            var formatStr = str.replace(/^\(|\)$/g, '');
            try {
              var data = JSON.parse(formatStr);
              var code = data && +data.code;
              if (code === 401) {
                alert(data ? data.msg : '网络繁忙！'); // eslint-disable-line
              } else {
                resolve1(data);
              }
            } catch (err) {
              reject1(err);
            }
          });
        });
      }).then(function (data) {
        resolve(data);
      }).catch(function (err) {
        reject(err);
      });
    });
  }
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(51);
var parse = __webpack_require__(52);
var formats = __webpack_require__(17);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var utils = __webpack_require__(16);
var formats = __webpack_require__(17);

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) {
        // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        // eslint-disable-line func-name-matching
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function pushToArray(arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly, charset) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            pushToArray(values, stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly, charset));
        } else {
            pushToArray(values, stringify(obj[key], prefix + (allowDots ? '.' + key : '[' + key + ']'), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly, charset));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? defaults.allowDots : !!options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    var charset = options.charset || defaults.charset;
    if (typeof options.charset !== 'undefined' && options.charset !== 'utf-8' && options.charset !== 'iso-8859-1') {
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    if (typeof options.format === 'undefined') {
        options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(obj[key], key, generateArrayPrefix, strictNullHandling, skipNulls, encode ? encoder : null, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly, charset));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(16);

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function interpretNumericEntities(str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset);
            val = options.decoder(part.slice(pos + 1), defaults.decoder, charset);
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }
        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function parseObject(chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'undefined' ? defaults.allowDots : !!options.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (typeof options.charset !== 'undefined' && options.charset !== 'utf-8' && options.charset !== 'iso-8859-1') {
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    if (typeof options.charset === 'undefined') {
        options.charset = defaults.charset;
    }

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _universalEnv = __webpack_require__(54);

// From https://github.com/camsong/fetch-jsonp
var defaultOptions = {
  timeout: 5000,
  jsonpCallback: 'callback'
};

function generateCallbackFunction() {
  return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
}

// Known issue: Will throw 'Uncaught ReferenceError: callback_*** is not defined' error if request timeout
function clearFunction(functionName) {
  // IE8 throws an exception when you try to delete a property on window
  // http://stackoverflow.com/a/1824228/751089
  try {
    delete window[functionName];
  } catch (e) {
    window[functionName] = undefined;
  }
}

function removeScript(script) {
  document.getElementsByTagName('head')[0].removeChild(script);
}

var JSONP = function JSONP(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (_universalEnv.isWeex) {
    var Stream = __weex_require__('@weex-module/stream');

    return new Promise(function (resolve, reject) {
      var jsonpCallback = options.jsonpCallback != null ? options.jsonpCallback : defaultOptions.jsonpCallback;
      var callbackFunction = options.jsonpCallbackFunctionName || generateCallbackFunction();
      if (url.indexOf(jsonpCallback) == -1) {
        url += url.indexOf('?') === -1 ? '?' : '&';
        url = url + jsonpCallback + '=' + callbackFunction;
      }
      var params = {
        url: url,
        method: 'GET',
        type: 'jsonp'
      };
      Stream.fetch(params, function (response) {
        try {
          if (typeof response === 'string') {
            // parse the response（it is string in weex-android & obj in ios）
            response = JSON.parse(response);
            if (response.data && typeof response.data === 'string' && response.ok) {
              try {
                response.data = JSON.parse(response.data);
              } catch (e) {
                throw new Error('the response.data in not valid json');
              }
            }
          }
          // resolve the response no matter success or fail(the user decide what to do)
          resolve({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            json: function json() {
              return Promise.resolve(response.data);
            }
          });
        } catch (e) {
          reject(e);
        }
      }, function (progress) {});
    });
  } else {
    // !weex env
    return new Promise(function (resolve, reject) {
      var timeout = options.timeout != null ? options.timeout : defaultOptions.timeout;
      var jsonpCallback = options.jsonpCallback != null ? options.jsonpCallback : defaultOptions.jsonpCallback;
      var timeoutId = void 0;
      var callbackFunction = options.jsonpCallbackFunctionName || generateCallbackFunction();
      var jsonpScript = document.createElement('script');

      window[callbackFunction] = function (response) {
        resolve({
          ok: true,
          // keep consistent with fetch API
          json: function json() {
            return Promise.resolve(response);
          }
        });
        if (timeoutId) clearTimeout(timeoutId);
        removeScript(jsonpScript);
        clearFunction(callbackFunction);
      };

      url += url.indexOf('?') === -1 ? '?' : '&';

      jsonpScript.setAttribute('src', url + jsonpCallback + '=' + callbackFunction);
      // jsonpScript.id = jsonpCallback + '_' + callbackFunction;
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);

      timeoutId = setTimeout(function () {
        reject(new Error('JSONP request to ' + url + ' timed out'));
        clearFunction(callbackFunction);
        removeScript(jsonpScript);
      }, timeout);
    });
  }
};

exports.default = JSONP;
module.exports = exports['default'];

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

// https://www.w3.org/TR/html5/webappapis.html#dom-navigator-appcodename
var isWeb = exports.isWeb = (typeof navigator === 'undefined' ? 'undefined' : _typeof(navigator)) === 'object' && (navigator.appCodeName === 'Mozilla' || navigator.product === 'Gecko');
var isNode = exports.isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
var isWeex = exports.isWeex = typeof callNative === 'function';
var isReactNative = exports.isReactNative = typeof __fbBatchedBridgeConfig !== 'undefined';
exports['default'] = module.exports;
exports.default = module.exports;

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_vm._ssrNode("<h1>Vue</h1> <h1>" + _vm._ssrEscape("hello " + _vm._s(_vm.user.userName)) + "</h1> <h2>" + _vm._ssrEscape(_vm._s(_vm.user.userId)) + "</h2>")])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ })
/******/ ]);