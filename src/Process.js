


var exec = require('child_process').exec;
var duplex = require('duplexer');
var arrange = require('./arrange');

var Process = module.exports = function Process (/* chunk, chunk, ..., options, options, ... */)
{
	var _ = arrange(arguments);

	var args = _.args;
	var opts = _.opts;

	var str = args.join(' ');

	return Simple(str, opts);
}

var Simple = Process.Simple = function Simple (str, options)
{
	return piped(exec(str, options));
}

function piped (child)
{
	return duplex(child.stdin, child.stdout);
}
