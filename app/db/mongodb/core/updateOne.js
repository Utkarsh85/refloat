var findOne= require('./findOne');
var queryHelper= require('./utils/queryHelper');

module.exports= function (db,modelName,selector,obj,findProjection) {

	var filter;

	if(!selector)
			selector={};

	var selectObj= queryHelper._id(selector);

	return findOne(db,modelName,selector,{_id: 1})
	.then(function (matchingId) {
		if(matchingId)
		{
			filter= {_id: {$in: [matchingId._id]}};
			return db.collection( modelName )
			.updateOne(filter,{'$set':obj})
		}
		else
			return {result:{ok:1,nModified:0}};
	})
	.then(function (docs) {
		if(docs.result.ok && docs.result.nModified>=1)
			return findOne(db,modelName,filter,findProjection);
		else
			return null;
	})
	.then(function (docs) {
		return docs;
	});
}