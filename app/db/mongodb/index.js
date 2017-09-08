var ObjectID = require('mongodb').ObjectID;

var getDb= require('./getDb');
// var initialize= require('./initialize');

var api= require('require-all')({
  dirname     :  __dirname+'/api',
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});

module.exports = function () {

	var models= require('../../models');

	var modelApi= Object.keys(models)
	.map(function (key) {
		return {model:models[key]};
	})
	.map(api.modelFunctions)
	.map(api.find)
	.map(api.findOne)
	.map(api.create)
	.map(api.updateMany)
	.map(api.update)
	.map(api.destroyMany)
	.map(api.destroy)
	.map(api.native)
	.map(api.populate2)
	.map(api.validate)
	.reduce(function (modelObj,obj) {
		modelObj[obj.model.fileName]= obj.model; //fileName instead of modelName
		return modelObj;
	},{});

	//Api static methods
	modelApi.id2bson = function (id) {
		return new ObjectID(id);
	};

	modelApi.generateId = function () {
		return new ObjectID();
	};

	modelApi.ObjectID = function () {
		return ObjectID;
	};

	modelApi.db= function () {
		return getDb();
	};

	modelApi.feeder= function () {
		return api.feeder;
	};

	modelApi.ObjectID= ObjectID;

	return modelApi;
}