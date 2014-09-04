
var assert = require('assert');
var resolve = require('./');

describe('resolve-semver', function(){
  it('should resolve null if not available', function(){
    var versions = [ '0.0.1' ];
    var semvers = [ '1' ];
    assert.deepEqual(resolve(semvers, versions), {
      '1': null
    });
  });

  it('should satisfy the most specific semver, with highest version', function(){
    var versions = [
      '1.1.1',
      '1.5.6',
      '1.5.8',
      '1.9.7'
    ];

    var semvers = [
      '',
      '*',
      'x',
      '1',
      '1.x',
      '1.*',
      '~1',
      '^1',
      '1.5',
      '1.5.*',
      '1.5.x',
      '~1.5',
      '^1.4',
      '<1.5.9',
      '<=1.5.6',
      '>1.4.0',
      '>=1.5.6',
      '~1.5.5',
      '^1.0.0',
      '1.5.6'
    ];

    assert.deepEqual(resolve(semvers, versions), {
      '': '1.5.6',
      '*': '1.5.6',
      'x': '1.5.6',
      '1': '1.5.6',
      '1.x': '1.5.6',
      '1.*': '1.5.6',
      '~1': '1.5.6',
      '^1': '1.5.6',
      '1.5': '1.5.6',
      '1.5.*': '1.5.6',
      '1.5.x': '1.5.6',
      '~1.5': '1.5.6',
      '^1.4': '1.5.6',
      '<1.5.9': '1.5.6',
      '<=1.5.6': '1.5.6',
      '>1.4.0': '1.5.6',
      '>=1.5.6': '1.5.6',
      '~1.5.5': '1.5.6',
      '^1.0.0': '1.5.6',
      '1.5.6': '1.5.6'
    });
  });

  it('should resolve version if available', function(){
    var versions = [
      '1.1.0',
      '1.1.1',
      '1.1.3',
      '1.2.2',
      '1.2.3',
      '1.3.1',
      '2.0.1'
    ];

    var semvers = [
      '*',
      '1.2.x',
      '1.x',
      '1.1.0',
      '1.1.x',
      '1.1.3'
    ];

    assert.deepEqual(resolve(semvers, versions), {
      '*': '1.2.3',
      '1.2.x': '1.2.3',
      '1.x': '1.2.3',
      '1.1.0': '1.1.0',
      '1.1.x': '1.1.3',
      '1.1.3': '1.1.3'
    });
  });
});