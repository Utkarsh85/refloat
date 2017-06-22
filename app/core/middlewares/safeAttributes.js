var models= require('../../models');

module.exports= function () {
	return function (req,res,next) {
		if(req.options.action === "update")	
		{
			if(models[req.options.controller].schema.hasOwnProperty('safeAttributes'))
			{
				// models[req.options.controller].schema.safeAttributes.map(function (val) {
				// 	delete req.body[val];
				// 	delete req.Params[val];
				// });

				var safeObj=models[req.options.controller].schema.safeAttributes;

				// for req.body
				for(var key in req.body)
				{
					if(safeObj.hasOwnProperty(key) && typeof(safeObj[key])=="boolean" && safeObj[key]==true)
					{
						delete req.body[key];
					}
					else if(safeObj.hasOwnProperty(key) && typeof(safeObj[key])=="function" && safeObj[key](req,req.body[key])==true)
					{
						delete req.body[key];
					}
				}

				// for req.Params
				for(var key in req.Params)
				{
					if(safeObj.hasOwnProperty(key) && typeof(safeObj[key])=="boolean" && safeObj[key]==true)
					{
						delete req.Params[key];
					}
					else if(safeObj.hasOwnProperty(key) && typeof(safeObj[key])=="function" && safeObj[key](req,req.Params[key])==true)
					{
						delete req.Params[key];
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