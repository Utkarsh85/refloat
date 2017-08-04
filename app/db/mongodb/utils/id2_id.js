var extend= require('util')._extend;
var queryHelper= require('../core/utils/queryHelper');
var ObjectID = require('mongodb').ObjectID;

module.exports= function (model) {
	var processFunc= function (obj) {
		if(ObjectID.isValid(obj))  // if obj turns out to be an ObjectId or a string of type ObjectId
			obj=queryHelper._id(obj);

		var tempObj;
		if(obj)
			tempObj= extend({},obj);
		else
			tempObj=null;

		if(tempObj && model.schema.hasOwnProperty('reference') && typeof(model.schema.reference)==="object")
		{
			Object.keys(model.schema.reference)
			.forEach(function (reference) {
				if(tempObj.hasOwnProperty(reference) && Array.isArray(tempObj[reference]))
				{
					tempObj[reference]=tempObj[reference].map(queryHelper.toObjectId);
					
				}
				else if(tempObj.hasOwnProperty(reference))
				{
					tempObj[reference]=queryHelper.toObjectId(tempObj[reference]);
					
				}
			})
		}

		if(tempObj && tempObj.hasOwnProperty('id'))
		{
			var newObj=extend({},tempObj);
			newObj._id=queryHelper.toObjectId(tempObj.id);
			delete newObj.id;
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