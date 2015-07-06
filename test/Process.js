


var eq = require('assert').strictEqual

var stream = require('stream')
var drain = require('stream-to-promise')

var Process = require('../src/Process')

function Eq (etalon)
{
	return function (check)
	{
		eq(String(etalon), String(check))
	}
}

function isDuplex (pipe)
{
	eq(true, pipe instanceof stream.Stream);

	eq('function', typeof pipe.pipe)

	eq('function', typeof pipe.resume)
	eq('function', typeof pipe.pause)

	eq('function', typeof pipe.write)
}

function Arguments ()
{
	return arguments
}

describe('Process', function ()
{

	it('creates duplex stream', function ()
	{
		var pipe = Process('echo 1 2 3')
		isDuplex(pipe)
	})

	it('works as stdout', function ()
	{
		var pipe = Process('echo -n 1 2 3')
		isDuplex(pipe)

		return drain(pipe)
		.then(Eq('1 2 3'))
	})

	it('can take stdin', function ()
	{
		var pwd = Process('pwd', { cwd: '/tmp' })
		isDuplex(pwd)

		var cat = Process('cat')
		isDuplex(cat)

		var pipe = pwd.pipe(cat)
		isDuplex(pipe)

		return drain(pipe)
		.then(Eq('/tmp\n'))
	})

	it('can take non-fd as stdin', function ()
	{
		var data = new stream.Readable
		data._read = new Function

		var cat = Process('cat')

		var pipe = data.pipe(cat)

		data.push('data')
		data.push(null)

		return drain(pipe)
		.then(Eq('data'))
	})

	it('can work with pipes in string', function ()
	{
		var pipe = Process('echo -n 1 2 3 | cat')
		isDuplex(pipe)

		return drain(pipe)
		.then(Eq('1 2 3'))
	})

	it('can work with subshells', function ()
	{
		var pipe = Process('echo -n 1 2 $(pwd)', { cwd: '/tmp' })
		isDuplex(pipe)

		return drain(pipe)
		.then(Eq('1 2 /tmp'))
	})

	it('works with all cases of arguments', function ()
	{
		var args1 = Arguments('$(pwd)', { cwd: '/abc' })
		var args2 = Arguments('$(pwd)', { cwd: '/tmp' })

		var pipe = Process('echo -n 1', '2', [[ '3' ], '4', { cwd: '/def' } ], args1, [ '5', args2 ])
		isDuplex(pipe)

		return drain(pipe)
		.then(Eq('1 2 3 4 /tmp 5 /tmp'))
	})

	it('works with Stream\'s .pipe()', function ()
	{
		var echo = Process('echo -n 1 2 3')
		var cat  = Process('cat')

		isDuplex(echo)
		isDuplex(cat)

		var pipe = echo.pipe(cat)

		return drain(pipe)
		.then(Eq('1 2 3'))
	})

	it('throws proper errors', function ()
	{
		var pipe = Process('false')
		var wasError = false

		isDuplex(pipe)

		pipe.on('error', function ()
		{
			wasError = true
		})

		return drain(pipe)
		.catch(function (error)
		{
			eq(1, error.code)
			eq(true, wasError)
		})
	})

})

describe('Process.simple', function ()
{
	it('works', function ()
	{
		var pipe = Process.Simple('echo -n 1 2 $(pwd)', { cwd: '/tmp' })
		isDuplex(pipe)

		return drain(pipe)
		.then(Eq('1 2 /tmp'))
	})
})
