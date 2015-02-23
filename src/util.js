


var util = module.exports = {};

var Q = require('./promise');

util.stderr = function (pair)
{
	var err = pair[1];

	if (err)
	{
		return Q.reject(err);
	}
}

util.trim = function (pair)
{
	return [
		pair[0].trim(),
		pair[1].trim()
	];
}
