


var Command = require('../src/Command')
var Q = require('promise')

var eq = require('assert').strictEqual

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

		it('(str, str, options, options)', function (done)
		{
			$test(done, Command(
				'echo -n',
				'$(pwd)',
				{ cwd: '/abc' },
				{ cwd: '/tmp' }
			), '/tmp');
		});

		it('(str, str, options, [ options ])', function (done)
		{
			$test(done, Command(
				'echo -n',
				'$(pwd)',
				{ cwd: '/abc' },
				[ { cwd: '/tmp' } ]
			), '/tmp');
		});

		it('(str, str, [ options, options ])', function (done)
		{
			$test(done, Command(
				'echo -n',
				'$(pwd)',
				[ { cwd: '/abc' },
				  { cwd: '/tmp' } ]
			), '/tmp');
		});

		it('(str, str, [ options ], options )', function (done)
		{
			$test(done, Command(
				'echo -n',
				'$(pwd)',
				[ { cwd: '/abc' },
				  { cwd: '/tmp' } ]
			), '/tmp');
		});

		it('(str, str, options, str, options )', function (done)
		{
			$test(done, Command(
				'echo -n',
				'$(pwd)',
				{ cwd: '/abc' },
				'1',
				{ cwd: '/tmp' }
			), '/tmp 1');
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
		});

		it('(str, str, arguments)', function (done)
		{
			var args = Arguments('-n', '-a', '-b');
			$test(done, Command('echo', '-', args), '- -n -a -b\n');
		});

		it('(str, [str, arguments])', function (done)
		{
			var args = Arguments('-n', '-a', '-b');
			$test(done, Command('echo', [ '1', args ]),  '1 -n -a -b\n');
		});

		it('(str, [str, arguments])', function (done)
		{
			var args = Arguments('-n', '-a', '-b');
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

		it('(str, [str], arguments with options, str, arguments with options)', function (done)
		{
			var
				args1 = Arguments('$(pwd)', { cwd: '/abc' }),
				args2 = Arguments('$(pwd)', { cwd: '/tmp' });

			$test(done, Command('echo', [ '-n' ], args1, '1', args2 ), '/tmp 1 /tmp');
		});
	});

	describe('in partial', function ()
	{
		var partial = require('lodash').partial;

		it('(str)(str)', function (done)
		{
			var C = partial(Command, 'echo -n');

			$test(done, C('1'), '1')
		});

		it('(str, str)(str)', function (done)
		{
			var C = partial(Command, 'echo -n', '1');

			$test(done, C('2'), '1 2');
		});

		it('(str, options)(str, options)', function (done)
		{
			var C = partial(Command, 'echo -n', { cwd: '/abc' });

			$test(done, C('$(pwd)', { cwd: '/tmp' }), '/tmp');
		});

		it('(str, options)(arguments with options)', function (done)
		{
			var
				C = partial(Command, 'echo -n', { cwd: '/abc' }),
				args = Arguments('$(pwd)', { cwd: '/tmp' });

			$test(done, C(args), '/tmp');
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

	describe('util', function ()
	{
		var util = Command.util;

		describe('.stdout', function (done)
		{
			it('works', function (done)
			{
				var C = Command('echo -n ABC')
				.then(util.stdout);

				$testUtil(done, C, 'ABC');
			});
		});

		describe('.stderr', function ()
		{
			it('works well with no stderr', function (done)
			{
				$test(done, Command('echo -n'), '');
			});

			it('intercepts stderr', function (done)
			{
				var C = Command('>&2 echo -n error')
				.then(util.stderr);

				$testUtilError(done, C, 'error');
			});
		});

		describe('.trim', function ()
		{
			it('works with stdout', function (done)
			{
				var C = Command('echo ABC')
				.then(util.trim);

				$test(done, C, 'ABC');
			});

			it('works with stderr', function (done)
			{
				var C = Command('>&2 echo ABC')
				.then(util.trim);

				$test(done, C, '', 'ABC');
			});

			it('works if single string', function (done)
			{
				var C = Command('echo ABC')
				.then(function (pair) { return pair[0]; })
				.then(util.trim);

				$testUtil(done, C, 'ABC');
			});
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

describe('Command.so', function ()
{
	it('creates commands', function (done)
	{
		var thenCommand = Command.so('echo', '-n', '1', [ '2', '3' ]);

		eq(typeof thenCommand, 'function');

		$test(done, thenCommand(3, 4, 5), '1 2 3');
	});

	it('works in chains', function (done)
	{
		Command('echo')

		.then(Command.so('echo')) // do mutations in chain
		.then(Command.so('echo -n 1 2 3'))

		.then($eq('1 2 3'), $fail)
		.then($done(done), done);
	});
});

function $test (done, command, stdout, stderr)
{
	command
	.then($eq(stdout, stderr), $fail)
	.then($done(done), done);
}

function $testUtil (done, command, stdout)
{
	command
	.then($eqStr(stdout), $fail)
	.then($done(done), done);
}

function Arguments ()
{
	return arguments;
}

function $testError (done, command, code)
{
	command
	.then($fail, $code(code))
	.then($done(done), done);
}

function $testUtilError (done, command, stderr)
{
	command
	.then($fail, $eqStr(stderr))
	.then($done(done), done);
}

function $done (done)
{
	return function ()
	{
		done();
	}
}

function $eq (stdout, stderr)
{
	stderr || (stderr = '');
	return function (pair)
	{
		eq(stdout, pair[0]);
		eq(stderr, pair[1]);
	};
}

function $eqStr (expected)
{
	return function (str)
	{
		eq(str, expected);
	};
}

function $code (retcode)
{
	return function code (error)
	{
		eq(retcode, error.code);
	};
}

function $fail ()
{
	eq(null, ! null);
}
