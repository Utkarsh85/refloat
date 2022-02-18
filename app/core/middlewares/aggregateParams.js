var merge = require('deepmerge');
var copy = require('fast-copy');
var objectTraverseClean= require('object-traverse-clean');

module.exports= function (req,res,next) {
	var params={};

	if(typeof(req.body) === "object")
	{
		params= merge(copy(req.body),params);
	}

	if(typeof(req.params) === "object")
	{
		params= merge(copy(req.params),params);
	}

	if(typeof(req.query) ==="object")
	{
		params= merge(copy(req.query),params);
	}

	req.Params= objectTraverseClean(params);

	return next();
}