module.exports= function (model) {
	return function (obj) {
		if(Array.isArray(obj))
		{
			return obj.map(function (val) {
				if(typeof(model.schema.autoUpdatedAt)=="undefined" || model.schema.autoUpdatedAt)
				{
					val.updatedAt= new Date();
				}
				return val;
			});
		}
		else
		{
			if(typeof(model.schema.autoUpdatedAt)=="undefined" || model.schema.autoUpdatedAt)
			{
				obj.updatedAt= new Date();
			}
			return obj
		}
	};
}