var ObjectId= require('mongodb').ObjectId;

var find= require('../core/find');
var projectionUtil= require('../utils/projectUtil');
var getDb= require('../getDb');
var allModels= require('../../../models');

module.exports= function (input) {
	var model= input.model;
	if(input.model.schema.hasOwnProperty('reference'))
		input.model.populate= function (obj,fields,options) {

			// if no fields defined just set it all the fields
			if(!fields || !Array.isArray(fields))
				fields=Object.keys(model.schema.reference);

			var isObject=false;
			if(!Array.isArray(obj))
			{
				isObject= true;
				obj=[obj];
			}

			var modelReferences= Object.keys(model.schema.reference)
			.filter(function (ref) {
				if(fields.indexOf(ref) < 0)
					return false;
				else
					return true;
			})
			.filter(function (ref) {
				if(allModels.hasOwnProperty(model.schema.reference[ref].model))
					return true;
				else
					return false;
			})
			.map(function (modelReference) {
				var ids=obj.map(function (objVal) {
					if(objVal.hasOwnProperty(modelReference))
						return ObjectId(objVal[modelReference]);
				}).filter(x=>{if(x)return x;});

				return {modelReference:modelReference,ids:ids,modelName:model.schema.reference[modelReference].model,toJSON:allModels[model.schema.reference[modelReference].model].schema.toJSON};
			});

			var queryList=modelReferences
			.map(function (modelReferenceFind) {
				return getDb().then(function (db) {
					return find(db,allModels[modelReferenceFind.modelName].modelName,{_id:{$in:modelReferenceFind.ids}},{}).toArray();
				});
			});

			return Promise.all(queryList)
			.then(function (resolvedList) {
				// console.log(resolvedList);
				return modelReferences.map(function (modelRef,index) {
					var temp={};
					temp[modelRef.modelReference]={};
					resolvedList[index].forEach(function (resolved) {
						// console.log(resolved);
						if(options && options.hasOwnProperty('toJSON') && modelRef.toJSON && typeof(modelRef.toJSON)==="function")
							temp[modelRef.modelReference][resolved._id.toHexString()]=modelRef.toJSON(resolved);
						else
							temp[modelRef.modelReference][resolved._id.toHexString()]=resolved;
					});
					return temp;
				})
				.reduce(function (reduct,val) {
					var refName=Object.keys(val)[0];
					reduct[refName]=val[refName];
					return reduct;
				},{});
			})
			.then(function (resolvedList) {
				// console.log(resolvedList);
				Object.keys(resolvedList)
				.forEach(function (refName) {
					obj.forEach(function (objVal) {
						if(objVal.hasOwnProperty(refName))
						{
							if(resolvedList[refName].hasOwnProperty(objVal[refName]))
							{
								objVal[refName]=resolvedList[refName][objVal[refName]];
							}
							else
							{
								objVal[refName]=null;
							}
						}
					})
				});

				if(isObject)
					return obj[0];
				else
					return obj;
			});
		}

	return input;
}
