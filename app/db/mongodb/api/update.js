var autoUpdatedAt= require('../utils/autoUpdatedAt');
var id2_id= require('../utils/id2_id');
var _id2id= require('../utils/_id2id');

//dbCore
var updateOne= require('../core/updateOne');
//Projection utility
var projectionUtil= require('../utils/projectUtil');
var getDb= require('../getDb');
var validate= require('../../../validation');

module.exports= function (input) {
	var model= input.model;
	input.model.update= function (selector,obj) {
		// obj= id2_id(model)(obj);
		delete obj.id;
		delete obj._id;

		return validate(model.schema,obj)
		.then(id2_id(model))
		.then(autoUpdatedAt(model))
		.then(function (obj) {
			return Promise.all([getDb(),obj]);
		})
		.then(function (obj) {
			return updateOne(obj[0],model.modelName,id2_id(model)(selector),obj[1],projectionUtil(model,{}));
		})
		.then(function (response) {
			return _id2id(model)(response);
		});
	};

	return input;
}