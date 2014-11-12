


module.exports = Command;

var
	exec = require('child_process').exec,
	Q    = require('bluebird'),

	_    = require('lodash'),

	last = _.last,
	initial = _.initial,

	flat = _.flatten,
	isPlain = _.isPlainObject

function Command (/* chunk, chunk, ..., options */)
{
	var
		args = flat(arguments),
		opts = last(args);

	if (isPlain(opts))
	{
		args = initial(args);
	}
	else
	{
		opts = undefined;
	}

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
