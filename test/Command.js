

var
	Command = require('../src/Command'),
	Q = require('bluebird');

Q.onPossiblyUnhandledRejection(function () {});

describe('Command', function ()
{

it('(str)', function (done)
{
	$test(done, Command('echo -n 1'), '1');
});

it('(str, str)', function (done)
{
	$test(done, Command('echo -n', '1', '2'), '1 2');
});

it('([str, str])', function (done)
{
	$test(done, Command([ 'echo -n 1', '2' ]), '1 2');
});

it('(str, [str, str])', function (done)
{
	$test(done, Command('echo -n 1', [ '2', '3' ]), '1 2 3');
});

it('(str, options)', function (done)
{
	$test(done, Command('pwd', { cwd: '/tmp' }), '/tmp\n');
});

it('(str, str, options)', function (done)
{
	$test(done, Command('echo', '$(dirname $(pwd))', { cwd: '/tmp' }), '/\n');
});

it('([ str, str ], options)', function (done)
{
	$test(done, Command([ 'echo -n', '$(dirname $(pwd))' ], { cwd: '/tmp' }), '/');
});

it('(str, [ str, str ], options)', function (done)
{
	$test(done, Command('echo', [ '-n', '$(dirname $(pwd))' ], { cwd: '/tmp' }), '/');
});

it('(fail str)', function (done)
{
	$testError(done, Command('false'), 1);
});

it('(fail str, str)', function (done)
{
	$testError(done, Command('pwd', '-x'), 2);
});

it('([ fail str, str ])', function (done)
{
	$testError(done, Command([ 'pwd', '-x' ]), 2);
});

});

function $test (done, command, stdout, stderr)
{
	command
	.then($eq(stdout, stderr), $fail)
	.finally(done);
}

function $testError (done, command, code)
{
	command
	.then($fail, $code(code))
	.finally(done);
}

function $eq (stdout, stderr)
{
	stderr || (stderr = '');
	return function eq (pair)
	{
		expect(pair[0]).toBe(stdout);
		expect(pair[1]).toBe(stderr);
	};
}

function $code (retcode)
{
	return function code (error)
	{
		expect(error.code).toBe(retcode);
	};
}

function $fail ()
{
	expect(null).not.toBeNull();
}
