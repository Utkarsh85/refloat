//Projection utility
var validate= require('../../../validation');

module.exports= function (input) {
	var model= input.model;
	input.model.validate= function (obj) {
		delete obj._id;

		return validate(model.schema,obj);
	};

	return input;
}