var find= require('./find');
var queryHelper= require('./utils/queryHelper');

module.exports= function (db,modelName,selector,findProjection) {
	var TobeDeleted;

	if(!selector)
			selector={};

	var selectObj= queryHelper._id(selector);

	return find(db,modelName,selector,findProjection)
	.toArray()
	.then(function (docs) {
		TobeDeleted=docs;
		return db.collection( modelName ).deleteMany(selectObj);
	})
	.then(function (docs) {
		if(docs.result.ok && docs.result.n>=1)
			return TobeDeleted;
		else
			return [];
	});
}