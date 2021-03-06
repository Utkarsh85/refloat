var id2_id= require('../utils/id2_id');
var _id2id= require('../utils/_id2id');
//dbCore
var destroyMany= require('../core/destroy');
//Projection utility
var projectionUtil= require('../utils/projectUtil');
var getDb= require('../getDb');

module.exports= function (input) {
	var model= input.model;
	input.model.destroyMany= function (selector) {
		return getDb()
		.then(function (db) {
			return destroyMany(db,model.modelName,id2_id(model)(selector),projectionUtil(model,{}));
		})
		.then(function (response) {
			return _id2id(model)(response);
		});
	};

	return input;
}