var find= require('./find');
var queryHelper= require('./utils/queryHelper');

module.exports= function (db,modelName,selector,obj,findProjection) {

	var filter;

	if(!selector)
			selector={};

	var selectObj= queryHelper._id(selector);

	return find(db,modelName,selector,{_id: 1}).toArray()
	.then(function (matchingIds) {
		filter= {_id: {$in: matchingIds.map(doc=>doc._id)}};

		return db.collection( modelName )
		.updateMany(filter,{'$set':obj});
	})
	.then(function (docs) {
		if(docs.result.ok && docs.result.nModified>=1)
			return find(db,modelName,filter,findProjection).toArray();
		else
			return [];
	})
	.then(function (docs) {
		return docs;
	});
}