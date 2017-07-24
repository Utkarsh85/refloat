var models= require('../../models');
var dotProp = require('dot-prop');

module.exports= function () {
	return function (req,res,next) {
		if(req.options.action === "find")	
		{
			if(models[req.options.controller].schema.hasOwnProperty('queryModify'))
			{

				var safeObj=models[req.options.controller].schema.queryModify;

				for(var key in safeObj)
				{
					if(typeof(dotProp.get(safeObj,key))=="boolean" && dotProp.get(safeObj,key)==true)
					{
						dotProp.delete(req.query,key);
						dotProp.delete(req.query,'where.'+key);
						dotProp.delete(req.Params,key);
						dotProp.delete(req.Params,'where.'+key);
					}

					if(typeof(dotProp.get(safeObj,key))=="function" && dotProp.get(safeObj,key)(req,dotProp.get(req.query,key))==true)
					{
						dotProp.delete(req.query,key);
						dotProp.delete(req.query,'where.'+key);
						dotProp.delete(req.Params,key);
						dotProp.delete(req.Params,'where.'+key);
					}

					if(dotProp.get(req,'user.id'))
					{
						if(typeof(dotProp.get(safeObj,key))=="object" && dotProp.get(safeObj,key).hasOwnProperty(dotProp.get(req,'user.auth','authenticated')) && dotProp.get(safeObj,key)[dotProp.get(req,'user.auth','authenticated')]==true)
						{
							dotProp.delete(req.query,key);
							dotProp.delete(req.query,'where.'+key);
							dotProp.delete(req.Params,key);
							dotProp.delete(req.Params,'where.'+key);
						}
					}
					else
					{
						if(typeof(dotProp.get(safeObj,key))=="object" && dotProp.get(safeObj,key).hasOwnProperty(dotProp.get(req,'user.auth','not_authenticated')) && dotProp.get(safeObj,key)[dotProp.get(req,'user.auth','not_authenticated')]==true)
						{
							dotProp.delete(req.query,key);
							dotProp.delete(req.query,'where.'+key);
							dotProp.delete(req.Params,key);
							dotProp.delete(req.Params,'where.'+key);
						}
					}
				}
				next();
			}
			else
			{
				next();
			}
		}
		else
		{
			next();
		}
	}
}