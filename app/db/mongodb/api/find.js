var _id2id= require('../utils/_id2id');
var id2_id= require('../utils/id2_id');
//dbCore
var find= require('../core/find');
//Projection utility
var projectionUtil= require('../utils/projectUtil');
var getDb= require('../getDb');

module.exports= function (input) {
	var model= input.model;

	var findApiFunc= function (query,projection) {

		this._query= getDb()
		.then(function (db) {
			return Promise.resolve(find(db,model.modelName,query,projectionUtil(model,projection)));
		});
	};

	findApiFunc.prototype.sort = function(sortArgs) {
		if(sortArgs.hasOwnProperty('id'))
		{
			sortArgs['_id']=sortArgs.id;
			delete sortArgs['id'];
		}
		this._query=this._query.then((q)=>{return Promise.resolve(q.sort(sortArgs))});
		return this;
	};

	findApiFunc.prototype.skip = function(skipArgs) {
		this._query=this._query.then((q)=>{return Promise.resolve(q.skip(skipArgs))});
		return this;
	};

	findApiFunc.prototype.limit = function(limitArgs) {
		this._query=this._query.then((q)=>{return Promise.resolve(q.limit(limitArgs))});
		return this;
	};

	findApiFunc.prototype.count = function() {
		this._query=this._query.then((q)=>{return q.count()});
		return this._query;
	};

	findApiFunc.prototype.toArray = function() {
		this._query=this._query
		.then((q)=>{return q.toArray()})
		.then(function (results) {
			return Promise.resolve(_id2id(model)(results));
		});
		
		return this._query;
	};

	input.model.find= function (query,projection) {
		return new findApiFunc(id2_id(model)(query),projection);
	};

	return input;
}