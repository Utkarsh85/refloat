var extend= require('util')._extend;

module.exports= function (model) {

	var processFunc= function (obj) {
		var tempObj;
		if(obj)
			tempObj= extend({},obj);
		else
			tempObj=null;

		if(tempObj && model.schema.hasOwnProperty('reference') && typeof(model.schema.reference)==="object")
		{
			Object.keys(model.schema.reference)
			.forEach(function (reference) {
				if(tempObj.hasOwnProperty(reference))
				{
					tempObj[reference]=tempObj[reference].toString();
				}
			})
		}

		if(tempObj && tempObj.hasOwnProperty('_id') && !tempObj.hasOwnProperty('id'))
		{
			var newObj=extend({},tempObj);
			newObj.id=tempObj._id.toString();
			delete newObj._id;
			return newObj;
		}
		else
			return tempObj;
	}

	return function (obj) {
		if(Array.isArray(obj))
			return obj.map(processFunc);
		else
			return processFunc(obj);
	}
}