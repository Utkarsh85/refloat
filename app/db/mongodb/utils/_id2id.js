var extend= require('util')._extend;
var queryHelper= require('../core/utils/queryHelper');

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
				if(tempObj.hasOwnProperty(reference) && tempObj[reference] && Array.isArray(tempObj[reference]))
				{
					tempObj[reference]=tempObj[reference].map(queryHelper.toStringId);
				}
				else if(tempObj.hasOwnProperty(reference) && tempObj[reference])
				{
					tempObj[reference]=queryHelper.toStringId(tempObj[reference]);
				}
			})
		}

		if(tempObj && tempObj.hasOwnProperty('_id'))
		{
			var newObj=extend({},tempObj);
			newObj.id=queryHelper.toStringId(tempObj._id);
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