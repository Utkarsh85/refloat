module.exports= function (db,modelName,obj) {

	return db.collection( modelName ).insertOne(obj)
	.then(function (docs) {
		return docs.ops[0];
	});
	
}