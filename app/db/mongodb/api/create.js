var autoCreatedAt= require('../utils/autoCreatedAt');
var autoUpdatedAt= require('../utils/autoUpdatedAt');
var id2_id= require('../utils/id2_id');
var _id2id= require('../utils/_id2id');

//dbCore
var create= require('../core/create');
var createOne= require('../core/createOne');

var getDb= require('../getDb');
var validate= require('../../../validation');

module.exports= function (input) {
	var model= input.model;
	input.model.create= function (obj) {
		// obj= id2_id(model)(obj); // make obj to be ObjectId compliant

		if(Array.isArray(obj) )
		{
			obj=obj.map(function (val) {
				delete val._id; //would not allow to directly edit _id
				return val;
			});

			return validate(model.schema,obj)
			.then(id2_id(model))
			.then(autoCreatedAt(model))
			.then(autoUpdatedAt(model))
			.then(function (obj) {
				return Promise.all([getDb(),obj]);
			})
			.then(function (obj) {
				return create(obj[0],model.modelName,obj[1]);
			})
			.then(function (response) {
				return _id2id(model)(response);
			});
		}
		else
		{
			delete obj._id; //would not allow to directly edit _id

			return validate(model.schema,obj)
			.then(id2_id(model))
			.then(autoCreatedAt(model))
			.then(autoUpdatedAt(model))
			.then(function (obj) {
				return Promise.all([getDb(),obj]);
			})
			.then(function (obj) {
				return createOne(obj[0],model.modelName,obj[1]);
			})
			.then(function (response) {
				return _id2id(model)(response);
			});
		}
	};

	return input;
}