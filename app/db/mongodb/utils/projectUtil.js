var merge = require('deepmerge');

module.exports= function (model,projection) {

	if(model.schema.hasOwnProperty('projection') && typeof(model.schema.projection) === "object")
	{
		if(!projection)
			projection={};

		return merge(model.schema.projection,projection);		
	}
	else
	{
		return projection;
	}
}