

var Q;

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

module.exports = Q;
