


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

	it('can take non-fd as stdin (really?)', function ()
	{
		var data = new stream.Readable
		data.push('data')
		data.push(null)

		var cat = Process('cat')

		var pipe = data.pipe(cat)

		return drain(pipe)
		.then(Eq('data'))
	})

	it('works with all cases of arguments', function ()
	{
		var args1 = Arguments('$(pwd)', { cwd: '/abc' })
		var args2 = Arguments('$(pwd)', { cwd: '/tmp' })

		var pipe = Process('echo -n 1', '2', [[ '3' ], '4', { cwd: '/def' } ], args1, [ '5', args2 ])

		return drain(pipe)
		.then(Eq('1 2 3 4 /tmp 5 /tmp'))
	})

})
