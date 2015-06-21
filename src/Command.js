


module.exports = Command;

var
	Promise = require('./promise'),
	exec = require('child_process').exec,

	flat    = require('./deps').flat,
	reduce  = require('./deps').reduce,
	isPlain = require('./deps').isPlain,
	extend  = require('./deps').extend;

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
Command.util = require('./util');

function Simple (str, options)
{
	return new Promise(function (rs, rj)
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
