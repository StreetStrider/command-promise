

var
	Command = require('../src/Command'),
	Q = require('bluebird');

Q.onPossiblyUnhandledRejection(function () {});

describe('Command', function ()
{

	describe('with strings and arrays', function ()
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

		it('([ str, str, options ])', function (done)
		{
			$test(done, Command([ 'echo -n', '$(dirname $(pwd))', { cwd: '/tmp' } ]), '/');
		});

		it('(str, [ str, str ], options)', function (done)
		{
			$test(done, Command('echo', [ '-n', '$(dirname $(pwd))' ], { cwd: '/tmp' }), '/');
		});

		it('(str, [ str, str, options ])', function (done)
		{
			$test(done, Command('echo', [ '-n', '$(dirname $(pwd))', { cwd: '/tmp' } ]), '/');
		});
	});

	describe('with strings and arguments object', function ()
	{
		it('(str, arguments)', function (done)
		{
			var args = Arguments(1, 2, 3);
			$test(done, Command('echo', args), '1 2 3\n');
		});

		it('(str, str, arguments)', function (done)
		{
			var args = Arguments('-n', '-a', '-b');
			$test(done, Command('echo', '1', args), '1 -n -a -b\n');
			$test(done, Command('echo', '-', args), '- -n -a -b\n');
		});

		it('(str, [str, arguments])', function (done)
		{
			var args = Arguments('-n', '-a', '-b');
			$test(done, Command('echo', [ '1', args ]),  '1 -n -a -b\n');
			$test(done, Command('echo', [ '--', args ]), '-- -n -a -b\n');
		});

		it('(arguments, options)', function (done)
		{
			var args = Arguments('pwd');
			$test(done, Command(args, { cwd: '/tmp' }), '/tmp\n');
		});

		it('(str, arguments, options)', function (done)
		{
			var args = Arguments('$(pwd)');
			$test(done, Command('dirname', args, { cwd: '/' }), '/\n');
		});

		it('(str, arguments with options)', function (done)
		{
			var args = Arguments('$(pwd)', { cwd: '/' });
			$test(done, Command('dirname', args), '/\n');
		});

		it('(str, [str], arguments, options)', function (done)
		{
			var args = Arguments('$(pwd)');
			$test(done, Command('dirname', '-z', args, { cwd: '/tmp' }), '/\0');
		});

		it('(str, [str], arguments with options)', function (done)
		{
			var args = Arguments('$(pwd)', { cwd: '/tmp' });
			$test(done, Command('dirname', '-z', args), '/\0');
		});
	});

	describe('with wrong commands', function ()
	{
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

});

describe('Command.Simple', function ()
{
	describe('with strings and arrays', function ()
	{
		it('(str)', function (done)
		{
			$test(done, Command.Simple('echo -n 1'), '1');
		});
		it('(str, options)', function (done)
		{
			$test(done, Command.Simple('pwd', { cwd: '/tmp' }), '/tmp\n');
		});
	});

	describe('with wrong commands', function ()
	{
		it('(fail str)', function (done)
		{
			$testError(done, Command('false'), 1);
		});
	});
});

function $test (done, command, stdout, stderr)
{
	command
	.then($eq(stdout, stderr), $fail)
	.finally(done);
}

function Arguments ()
{
	return arguments;
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
