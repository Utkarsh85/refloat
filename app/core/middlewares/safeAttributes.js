var models= require('../../models');
var dotProp = require('dot-prop');

module.exports= function () {
	return function (req,res,next) {
		if(req.options.action === "update")	
		{
			if(models[req.options.controller].schema.hasOwnProperty('safeAttributes'))
			{

				var safeObj=models[req.options.controller].schema.safeAttributes;

				for(var key in safeObj)
				{
					if(typeof(dotProp.get(safeObj,key))=="boolean" && dotProp.get(safeObj,key)==true)
					{
						dotProp.delete(req.body,key);
						dotProp.delete(req.Params,key);
					}

					if(typeof(dotProp.get(safeObj,key))=="function" && dotProp.get(safeObj,key)(req,dotProp.get(req.body,key))==true)
					{
						dotProp.delete(req.body,key);
						dotProp.delete(req.Params,key);
					}

					if(dotProp.get(req,'user.id'))
					{
						if(typeof(dotProp.get(safeObj,key))=="object" && dotProp.get(safeObj,key).hasOwnProperty(dotProp.get(req,'user.auth','authenticated')) && dotProp.get(safeObj,key)[dotProp.get(req,'user.auth','authenticated')]==true)
						{
							dotProp.delete(req.body,key);
							dotProp.delete(req.Params,key);
						}
					}
					else
					{
						if(typeof(dotProp.get(safeObj,key))=="object" && dotProp.get(safeObj,key).hasOwnProperty(dotProp.get(req,'user.auth','not_authenticated')) && dotProp.get(safeObj,key)[dotProp.get(req,'user.auth','not_authenticated')]==true)
						{
							dotProp.delete(req.body,key);
							dotProp.delete(req.Params,key);
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