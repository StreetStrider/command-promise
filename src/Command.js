


module.exports = Command;

var
	exec = require('child_process').exec,
	Q    = require('bluebird'),
	_    = require('lodash')

function Command (/* chunk, chunk, ..., options */)
{
	var args, options, str;

	args = _.flatten(arguments);
	options = _.last(args);
	if (_.isPlainObject(options))
	{
		args    = _.initial(args);
	}
	else
	{
		options = undefined;
	}
	str  = args.join(' ');

	return Command.Simple(str, options);
}

Command.Simple = Simple;

function Simple (str, options)
{
	return new Q(function (r, rj)
	{
		exec(str, options, function (error, stdout, stderr)
		{
			if (error)
			{
				rj(error);
			}
			else
			{
				r([stdout, stderr]);
			}
		});
	});
}
