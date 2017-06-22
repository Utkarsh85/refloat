module.exports= function (model) {
	return function (obj) {
		if(Array.isArray(obj))
		{
			return obj.map(function (val) {
				if(typeof(model.schema.autoCreatedAt)=="undefined" || model.schema.autoCreatedAt)
				{
					val.createdAt= new Date();
				}
				return val;
			});
		}
		else
		{
			if(typeof(model.schema.autoCreatedAt)=="undefined" || model.schema.autoCreatedAt)
			{
				obj.createdAt= new Date();
			}
			return obj
		}
	};
}