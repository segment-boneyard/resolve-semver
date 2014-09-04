
# resolve-semver

Given a set of semvers and a set of specific versions, map each semver to the specific version that most optimally satisfies the set of semvers.

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
  '1.5.8',
  '1.9.7',
  '1.5.6'
];

var semvers = [
  '1',
  '1.x',
  '1.5.x',
  '~1.5.5',
  '^1.0.0',
  '1.5.6'
];

assert.deepEqual(resolve(semvers, versions), {
  '1': '1.5.6',
  '1.x': '1.5.6',
  '1.5.x': '1.5.6',
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