


module.exports = Command;

var
	Q,
	exec = require('child_process').exec,

	flat = require('./deps').flat,
	reduce = require('./deps').reduce,
	isPlain = require('./deps').isPlain,
	extend = require('./deps').extend;


try
{
	Q = require('bluebird');
}
catch (e) { try
{
	Q = require('q').Promise;
}
catch (e)
{
	Q = require('./deps').promise;
}}


function Command (/* chunk, chunk, ..., options, options, ... */)
{
	var
		args = flat(arguments),
		opts = {};

	args = reduce(args, function (args, value)
	{
		if (isPlain(value))
		{
			extend(opts, value);
		}
		else
		{
			args.push(value);
		}

		return args;
	}
	, []);

	var str = args.join(' ');

	return Command.Simple(str, opts);
}

Command.Simple = Simple;

function Simple (str, options)
{
	return new Q(function (rs, rj)
	{
		exec(str, options, function (error, stdout, stderr)
		{
			if (error)
			{
				rj(error);
			}
			else
			{
				rs([ stdout, stderr ]);
			}
		});
	});
}

Command.so = function so ()
{
	var args = arguments;
	return function soCommand ()
	{
		return Command.apply(null, args);
	}
}
