var ObjectId= require('mongodb').ObjectId;
var _= require('lodash');

//dbCore
var find= require('../core/find');

//Projection utility
var projectionUtil= require('../utils/projectUtil');
var getDb= require('../getDb');
var allModels= require('../../../models');

module.exports= function (input) {
	var model= input.model;
	input.model.populate= function (obj,fields,options) {
		if(model.schema.hasOwnProperty('reference') && typeof(model.schema.reference)==="object")
		{
			var wasAnObject;
			if(!Array.isArray(obj))
			{
				wasAnObject= true;
				obj=[obj];
			}

			// if no fields defined just set it all the fields
			if(!fields || !Array.isArray(fields))
				fields=Object.keys(model.schema.reference);

			var allFields=Object.keys(model.schema.reference);
			var fields=_.difference(allFields,_.difference(allFields,fields));

			var allIds= fields.map(function (field) {
				return{
					referenceField: field,
					reference: model.schema.reference[field].model,
					referenceIds: _.uniq( obj
						.filter(x=> {if(x.hasOwnProperty(field)) return true;})
						.map(x=>x[field])
						).map( x => new ObjectId(x))
				}
			});


			var allIdsPromise= allIds.map(function (allId) {

				return getDb()
				.then(function (db) {
					return find(
						db,
						allId.reference,
						{_id:{$in:allId.referenceIds}},
						projectionUtil(allModels[allId.reference],{})
					).toArray();
				})
			});

			var PromiseResolved= Promise.all(allIdsPromise)
			.then(function (allResults) {
				return allResults.map(function(result){
					return result.map(function (x) {
						x._id= x._id.toString();
						return x;
					});
				})
			})
			.then(function (allResults) {
				if(options && options.hasOwnProperty('toJSON'))
				{
					allIds.map(function (allId,index) {
						var toJSON= allModels[allId.reference].schema.toJSON;
						if(toJSON && typeof(toJSON)==="function")
						{
							allResults[index]=allResults[index].map(toJSON);
						}
					});
					return allResults;
				}
				else
					return allResults;
			})
			.then(function (allResults) {
				return allResults.map(function(result){
					return _.groupBy(result,'_id');
				})
			})
			.then(function (allResults) {
				// console.log(JSON.stringify(allResults,null,2));
				var newObj;
				fields.map(function (field,ind) {
					newObj= obj.map(function (individual) {
						if(allResults[ind].hasOwnProperty(individual[field]) && Array.isArray(allResults[ind][ individual[field] ])  &&  allResults[ind][ individual[field] ].length==1)
						{
							individual[field]= allResults[ind][ individual[field] ][0]; //only the first element because _id is unique
						}
						else if(typeof(individual[field]) !="undefined" )
							individual[field]= null;
						return individual;
					});
				});

				// if toJSON is defined in model, than apply that, also check the options variable
				if(options && options.hasOwnProperty('toJSON') && model.schema.hasOwnProperty('toJSON'))
					newObj= newObj.map(model.schema.toJSON);
				
				if(wasAnObject)
					return newObj[0];
				else
					return newObj;
			});

			return PromiseResolved;
		}
		else
		{
			return new Promise(function (resolve,reject) {
				return resolve(obj);
			});
		}
	};

	return input;
}