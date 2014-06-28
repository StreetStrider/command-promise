


module.exports = Command;

var
	exec = require('child_process').exec,
	Q    = require('bluebird'),
	_    = require('lodash')

function Command (/* chunk, chunk, ..., options */)
{
	var args, options, str;

	options = _.last(arguments);
	if (_.isPlainObject(options))
	{
		args    = _.initial(arguments);
	}
	else
	{
		args    = arguments;
		options = undefined;
	}
	args = _.flatten(args);
	str  = args.join(' ');

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
