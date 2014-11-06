# Command [![license|mit](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](README.md#license) [![npm|command-promise](http://img.shields.io/badge/npm-command--promise-CB3837.svg?style=flat-square)](https://www.npmjs.org/package/command-promise) [![npm test|with mocha](http://img.shields.io/badge/npm%20test-with%20mocha-9E785A.svg?style=flat-square)](http://mochajs.org/)
Promise wrapper around `child_process.exec`.

## usage
```javascript
Command('ls -1').then(console.log, console.error);
```

## signature
Command is a multimethod:
```javascript
Command(chunk)
Command(chunk, options)
Command(chunk, chunk, ...)
Command(chunk, chunk, ..., options)
```
Where chunk is a *string* or *array of strings* or *arguments*.
Sequence of chunks may be followed by an options object, passed to `child_process.exec`.

## examples
```javascript
Command('ls', '-lA', { cwd: '/tmp' }).then(...);
Command('ls', [ '-l', '-A' ], { cwd: '/tmp' }).then(...);
Command('ls', [ '-l', '-A', { cwd: '/tmp' } ]).then(...);
Command([ 'ls', '-1' ], { cwd: '/tmp' }).then(...);

function Echo () { return Command('echo', '-', arguments); }
Echo('-n', '-a', '-b', { encoding: 'ascii' }).then(...);
```

## simple command
If you don't need any advanced arguments features, you can use `Command.Simple`.
It is simpler and faster.
```javascript
Command.Simple(str)
Command.Simple(str, options)
```

## using in the mid of the promise flow
Use `Command.so` it creates function which will self invoke command.
It does not append any arguments to command, so it can be used to order operations.
```javascript
Command('mkdir -p build')
.then(Command.so('cp package.json build/'))
.then(Command.so('cp -r src/'))
.then(...);
```

## license
MIT. © StreetStrider, 2014.
