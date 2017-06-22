module.exports= function (db,modelName,obj) {

	return db.collection( modelName ).insertMany(obj)
	.then(function (docs) {
		return docs.ops;
	});
	
}