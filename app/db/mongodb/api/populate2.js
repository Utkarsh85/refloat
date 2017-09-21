var ObjectId= require('mongodb').ObjectId;

var find= require('../core/find');
var projectionUtil= require('../utils/projectUtil');
var _id2id= require('../utils/_id2id');
var queryHelper= require('../core/utils/queryHelper');
var getDb= require('../getDb');

module.exports= function (input) {
	var allModels= require('../../../models');
	var model= input.model;
	if(input.model.schema.hasOwnProperty('reference'))
		input.model.populate= function (obj,fields,options) {
		// console.time('Total');

			// if no fields defined just set it all the fields
			if(!fields || !Array.isArray(fields))
				fields=Object.keys(model.schema.reference);

			var isObject=false;
			if(!Array.isArray(obj))
			{
				isObject= true;
				obj=[obj];
			}

			var modelReferences= getModelReferences(model,obj,fields,allModels);

			var queryList= getQueryList(modelReferences,allModels);

			// console.time('Querying');
			return Promise.all(queryList)
			.then(function (resolvedList) {
				// console.timeEnd('Querying');
				// console.log(resolvedList);
				return modelReferences.map(function (modelRef,index) {
					var temp={};
					temp[modelRef.modelReference]={};
					resolvedList[index].forEach(function (resolved) {
						// console.log(resolved);
						resolved= _id2id(allModels[modelRef.modelName])(resolved);
						if(options && options.hasOwnProperty('toJSON') && modelRef.toJSON && typeof(modelRef.toJSON)==="function")
							temp[modelRef.modelReference][resolved.id]=modelRef.toJSON(resolved);
						else
							temp[modelRef.modelReference][resolved.id]=resolved;
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
						// console.log(objVal,refName);
						if(objVal.hasOwnProperty(refName))
						{
							if(model.schema.reference[refName].hasOwnProperty('multi') && model.schema.reference[refName].multi==true)
							{
								// console.log(objVal[refName]);
								if(!Array.isArray(objVal[refName]))
									objVal[refName]=[objVal[refName]];

								objVal[refName]=objVal[refName].map(function (id) {
									if(resolvedList[refName].hasOwnProperty(id))
									{
											return resolvedList[refName][id];
									}
									else
									{
										return null;
									}
								})
							}
							else
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
							
						}
					})
				});

				// console.timeEnd('Total');
				if(isObject)
					return obj[0];
				else
					return obj;
			});
		}

	return input;
}


var getModelReferences= function (model,obj,fields,allModels) {
	
	return Object.keys(model.schema.reference)
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
					{
						if(model.schema.reference[modelReference].hasOwnProperty('multi') && model.schema.reference[modelReference].multi==true)
						{
							if(Array.isArray(objVal[modelReference]))
								return objVal[modelReference].map(queryHelper.toObjectId);
							else
								return queryHelper.toObjectId(objVal[modelReference]);
						}
						else
							return queryHelper.toObjectId(objVal[modelReference]);

					}
				}).filter(x=>{if(x)return x;});

				// console.log('Here',modelReference,ids,[].concat.apply([],ids));
				return {
					modelReference:modelReference,
					ids:[].concat.apply([],ids), // would choke if ids array length is much higher
					modelName:model.schema.reference[modelReference].model,
					toJSON:allModels[model.schema.reference[modelReference].model].schema.toJSON
				};
			});
}


var getQueryList= function (modelReferences,allModels) {
	return modelReferences
			.map(function (modelReferenceFind) {
				return getDb().then(function (db) {
					return find(db,allModels[modelReferenceFind.modelName].modelName,{_id:{$in:modelReferenceFind.ids}},{}).toArray();
				});
			})
}