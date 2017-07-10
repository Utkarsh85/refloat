var models= require('../../models');
var getDb= require('./getDb');
var createIndex= function (db) {
	return Object.keys(models)
	.filter(function (modelFileName) {
		if(models[modelFileName].schema.hasOwnProperty('index') && Array.isArray(models[modelFileName].schema.index))
			return true;
	})
	.map(function (modelFileName) {
		return db.collection(models[modelFileName].modelName).createIndexes(models[modelFileName].schema.index);
	});
}


module.exports= function () {

	return getDb()
	.then(function (db) {
		return Promise.all(createIndex(db));
	});
}