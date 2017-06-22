var merge = require('deepmerge');
var objectTraverseClean= require('object-traverse-clean');

module.exports= function (req,res,next) {
	var params={};

	if(typeof(req.body) === "object")
	{
		params= merge(req.body,params);
	}

	if(typeof(req.params) === "object")
	{
		params= merge(req.params,params);
	}

	if(typeof(req.query) ==="object")
	{
		params= merge(req.query,params);
	}

	req.Params= objectTraverseClean(params);

	return next();
}