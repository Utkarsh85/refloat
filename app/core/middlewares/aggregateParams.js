var merge = require('deepmerge');
var deepClone = require('fast-deepclone');
var objectTraverseClean= require('object-traverse-clean');

module.exports= function (req,res,next) {
	var params={};

	if(typeof(req.body) === "object")
	{
		params= merge(deepClone(req.body,true),params);
	}

	if(typeof(req.params) === "object")
	{
		params= merge(deepClone(req.params,true),params);
	}

	if(typeof(req.query) ==="object")
	{
		params= merge(deepClone(req.query,true),params);
	}

	req.Params= objectTraverseClean(params);

	return next();
}