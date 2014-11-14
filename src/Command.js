


module.exports = Command;

var
	exec = require('child_process').exec,
	Q    = require('bluebird'),

	flat = require('lodash-node/modern/arrays/flatten');

	reduce = require('lodash-node/modern/collections/reduce'),
	isPlain = require('lodash-node/modern/objects/isPlainObject'),
	extend = require('lodash-node/modern/objects/assign');


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
