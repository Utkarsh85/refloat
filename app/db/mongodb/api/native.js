var getDb= require('../getDb');

module.exports= function (input) {
	var model= input.model;
	input.model.native= function () {
		return getDb()
		.then(function (db) {
			return db.collection(model.modelName);
		});
	};

	return input;
}