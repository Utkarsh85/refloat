var _id2id= require('../utils/_id2id');
var id2_id= require('../utils/id2_id');
//dbCore
var findOne= require('../core/findOne');
//Projection utility
var projectionUtil= require('../utils/projectUtil');
var getDb= require('../getDb');

module.exports= function (input) {
	var model= input.model;
	input.model.findOne= function (query,projection) {
		if(!query)
		{
			query={};
		}
		if(projection && typeof(projection)!=="object")
		{
			throw 'Projection should be an object';
		}
		
		return getDb()
		.then(function (db) {
			return findOne(db,model.modelName,id2_id(model)(query),projectionUtil(model,projection))
			.then(function (obj) {
				return _id2id(model)(obj);
			});
		});
	};

	return input;
}