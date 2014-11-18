# Command [![license|mit](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](README.md#license) [![npm|command-promise](http://img.shields.io/badge/npm-command--promise-CB3837.svg?style=flat-square)](https://www.npmjs.org/package/command-promise) [![npm test|with mocha](http://img.shields.io/badge/npm%20test-with%20mocha-9E785A.svg?style=flat-square)](http://mochajs.org/)
Promise wrapper around `child_process.exec`. Uses [promise](https://www.npmjs.org/package/promise)
for result, but if there is a [Q](https://www.npmjs.org/package/q) or [Bluebird](https://www.npmjs.org/package/bluebird)
will switch to it. This lib also handles arrays smartly, so not need in manual
constructing any `apply`-ing them.

**size**: ~90kB;
**deps**: 0, all bundled in

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
Command(chunk, chunk, ..., options, options)
Command(chunk, chunk, ..., options, chunk, options)
Command(any sequence of chunks and options)
```
**options** is a object of options for `child_process.exec`.

**chunk** is a *string* or *array of strings* or *arguments* or *array of strings and options*.

All chunks are concatenated in one flat array, options objects are merged in one as well.

If you have hardcoded data just pass strings. If you have variative data
then pass arrays, no need in joining elements or manipulating with `.apply`.
If all of your data is hardcoded, look at [Command.Simple](#simple-command).

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

## using in partials
```javascript
var gitLog = partial(Command, 'git', 'log', { cwd: '/opt/repo' });
var gitLogOneline = partial(gitLog, '--oneline');

gitLogOneline().then(console.log, console.error);
gitLogOneline('-15').then(console.log, console.error);
```

## license
MIT. © StreetStrider, 2014.
