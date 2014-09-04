
/**
 * Module dependencies.
 */

var semver = require('semver');
var values = require('object-values');
var max = semver.maxSatisfying;

/**
 * Expose `resolve`.
 */

module.exports = resolve;

/**
 * Resolve the "leanest" matching versions from a set of semver
 * `ranges` and available `version`, returning a mapping of:
 *
 *   {
 *     semver: version
 *   }
 *
 * @param {Array} ranges
 * @param {Array} versions 
 * @return {Object}
 */

function resolve(ranges, versions) {
  return ranges
    .map(parse)
    .map(prioritize)
    .sort(sorter)
    .reduce(function(map, range){
      var semver = range.semver;
      var existing = values(map);
      var version = max(existing, semver) || max(versions, semver);
      map[semver] = version;
      return map;
    }, {});
}

/**
 * Normalize these:
 *
 * 1.2.3 => 1.2.3
 * >1.2.3 => >1.2.3
 * <1.2.3 => <1.2.3
 * >=1.2.3 => >=1.2.3
 * <=1.2.3 => <=1.2.3
 * ~1.2.3 => ~1.2.3
 * ^1.2.3 => ^1.2.3
 * ^0.1.3 => 0.1.3
 * ^0.0.2 => 0.0.2
 * ~1.2 => 1.2.x
 * ^1.2 => 1.x.x
 * 1.2.x => 1.2.x
 * 1.2.* => 1.2.x
 * 1.2 => 1.2.x
 * ~1 => 1.x.x
 * ^1 => 1.x.x
 * 1.x => 1.x.x
 * 1.* => 1.x.x
 * 1 => 1.x.x
 * * => x.x.x
 * x => x.x.x
 * "" => x.x.x
 *
 * So the final set is just:
 * 
 * 1.2.3
 * >1.2.3
 * <1.2.3
 * >=1.2.3
 * <=1.2.3
 * ~1.2.3
 * ^1.2.3
 * 1.2.x
 * 1.x.x
 * x.x.x
 */

function parse(semver) {
  var operator;
  // strip the operator out at first
  var string = semver.replace(/^[~\^\>\<=]+/, function($1){
    operator = $1;
    return '';
  });

  if (!string) string = '*';

  var parts = string.split('.');
  // normalize it so there's always 3 parts (for now)
  while (parts.length < 3) parts.push('x');
  // normalize the `*` into `x`
  parts.forEach(function(part, i){
    parts[i] = '*' === part ? 'x' : part;
  });

  var result = {
    semver: semver,
    major: parts[0],
    minor: parts[1],
    patch: parts[2]
  };

  if (operator) result.operator = operator;

  return result;
}

/**
 * Convert to standard form so they're sortable?
 *
 * 1.2.3 => 1.2.3-1.2.3 => 1
 * ~1.2.3 => 1.2.3-1.2.n => 2
 * 1.2.x => 1.2.n-1.2.n => 3
 * ^1.2.3 => 1.2.3-1.n.n => 4
 * >1.2.3 => 1.2.3+-n.n.n => 5
 * >=1.2.3 => 1.2.3-n.n.n => 5.5
 * <1.2.3 => i.i.i-1.2.3- => 6
 * <=1.2.3 => i.i.i-1.2.3 => 6.5
 * ^1.2.x => 1.2.n-1.n.n => 7
 * 1.x.x => 1.n.n-1.n.n => 8
 * x.x.x => n.n.n-n.n.n => 9
 * 
 * 1.2.3-1.2.3 => 1
 * 1.2.3-1.2.n => 2
 * 1.2.n-1.2.n => 3
 * 1.2.3-1.n.n => 4
 * 1.2.3-n.n.n => 5
 * 1.2.3+-n.n.n => 6
 * i.i.i-1.2.3 => ?
 * i.i.i-1.2.3- => ?
 * 1.2.n-1.n.n => 7
 * 1.n.n-1.n.n => 8
 * n.n.n-n.n.n => 9
 *
 * @param {Object} version
 * @return {Object}
 */

function prioritize(obj) {
  var digit = /^\d+/;
  var majorIsDigit = obj.major.match(digit);
  var minorIsDigit = obj.minor.match(digit);
  var patchIsDigit = obj.patch.match(digit);
  var op = obj.operator;

  // 1
  if (null == op && patchIsDigit) obj.priority = 1;
  // 2
  else if ('~' == op && patchIsDigit) obj.priority = 2;
  // 3
  else if (null == op && !patchIsDigit && minorIsDigit) obj.priority = 3;
  // 4
  else if ('^' == op && patchIsDigit) obj.priority = 4;
  // 5
  else if ('>' == op) obj.priority = 5;
  // 5.5
  else if ('>=' == op) obj.priority = 5.5;
  // 6
  else if ('<' == op) obj.priority = 6;
  // 6.5
  else if ('<=' == op) obj.priority = 6.5;
  // 7
  else if ('^' == op && !patchIsDigit && minorIsDigit) obj.priority = 7;
  // 8
  else if (!patchIsDigit && !minorIsDigit && majorIsDigit) obj.priority = 8;
  // 9
  else if (null == op && !patchIsDigit && !minorIsDigit && !majorIsDigit) obj.priority = 9;

  return obj;
}

/**
 * Sort by `.priority`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Number}
 */

function sorter(a, b) {
  a = a.priority;
  b = b.priority;
  if (a == b) return 0;
  if (a > b) return 1;
  if (a < b) return -1;
}
