


module.exports = Command;

var
	Promise = require('./promise'),
	exec = require('child_process').exec;

var
	arrange = require('./arrange');

function Command (/* chunk, chunk, ..., options, options, ... */)
{
	var _ = arrange(arguments);

	var args = _.args;
	var opts = _.opts;

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
