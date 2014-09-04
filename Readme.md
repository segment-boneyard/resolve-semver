
# resolve-semver

Resolve a set of semver constraints with the fewest versions possible.

Given a set of semvers strings and a set of available versions, map each semver string to an available version in the set so that the fewest number of available versions are actually used.

## Installation

Duo:

```js
var resolve = require('segmentio/resolve-semver');
```

Node:

```
$ npm install resolve-semver
```

## API

### resolve(ranges, versions)

Returns a map with semvers as keys, and the specific version as value.

```js
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
```

This is the semvers' order of priority:

```
1.2.3
>1.2.3
<1.2.3
>=1.2.3
<=1.2.3
~1.2.3
^1.2.3
1.2.x
1.x.x
x.x.x
```

## License

MIT