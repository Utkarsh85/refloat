var queryHelper= require('./utils/queryHelper');
var mongoProject= require('mongo-project');
module.exports= function (db,modelName,query,projection) {
	
	var fullQuery;
	
	if(!query)
		query={};

	var queryObj= queryHelper._id(query);

	if(projection)
	{
		fullQuery= db.collection( modelName ).findOne(queryObj,projection).then(obj=>{ return mongoProject(obj, projection)});
	}
	else
	{
		fullQuery= db.collection( modelName ).findOne(queryObj);
	}

	return fullQuery;
}