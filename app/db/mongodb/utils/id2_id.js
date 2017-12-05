var extend= require('util')._extend;
var queryHelper= require('../core/utils/queryHelper');
var ObjectID = require('mongodb').ObjectID;
var parser = require('mongo-parse');

module.exports= function (model) {
	var processFunc= function (obj) {
		if(queryHelper.checkObjectId(obj))  // if obj turns out to be an ObjectId or a string of type ObjectId
		{
			obj=queryHelper._id(obj);
			return obj;
		}

		var tempObj;
		if(obj)
			tempObj= extend({},obj);
		else
			return null;

		var references=(tempObj && model.schema.hasOwnProperty('reference') && typeof(model.schema.reference)==="object") ? Object.keys(model.schema.reference) : [];
		references= references.length ? references.concat('id') : ['id'];

		var tempObj = parser.parse(tempObj).mapValues(function(field, stringId){
			if(references.indexOf(field)>=0)
			{
				if(typeof(stringId)=="string" && ObjectID.isValid(stringId) && typeof(stringId)!='number' )
				{
					return ObjectID(stringId.toString());
				}
				else
					return stringId;
			}
			else if(model.schema.hasOwnProperty('attributes') && model.schema.attributes.hasOwnProperty('properties') && model.schema.attributes.properties.hasOwnProperty(field) && (((model.schema.attributes.properties[field].hasOwnProperty('format') && model.schema.attributes.properties[field].format=='date-time')) || ((model.schema.attributes.properties[field].hasOwnProperty('instanceof') && model.schema.attributes.properties[field].instanceof=='Date'))))
			{
				return new Date(stringId);
			}
			else
				return stringId;
		});

		// console.log(tempObj);

		// if(tempObj && model.schema.hasOwnProperty('reference') && typeof(model.schema.reference)==="object")
		// {
		// 	// .forEach(function (reference) {
		// 	// 	if(tempObj.hasOwnProperty(reference) && Array.isArray(tempObj[reference]))
		// 	// 	{
		// 	// 		tempObj[reference]=tempObj[reference].map(queryHelper._id);
					
		// 	// 	}
		// 	// 	else if(tempObj.hasOwnProperty(reference))
		// 	// 	{
		// 	// 		tempObj[reference]=queryHelper._id(tempObj[reference]);
					
		// 	// 	}
		// 	// })
		// }

		if(tempObj && tempObj.hasOwnProperty('id'))
		{
			var newObj=extend({},tempObj);
			newObj._id=tempObj.id;
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