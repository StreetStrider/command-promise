# Command
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
Command([ 'ls', '-1' ], { cwd: '/tmp' }).then(...);

function Echo () { return Command('echo', '-', arguments); }
Echo('-n', '-a', '-b').then(...);
```

## license
MIT. © StreetStrider, 2014.
