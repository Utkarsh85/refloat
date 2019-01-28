var MongoClient = require( 'mongodb' ).MongoClient;

var _db=null;

var connectionConfig={};
try
{
	var connectionConfig= require(require('path').resolve('./config/connection'));
}
catch(err)
{
	// console.log(err);
}

module.exports= function () {

	return new Promise(function (resolve,reject) {
		if(_db)
		{
			return resolve(_db);
		}
		else
		{
			var connectionString= connectionConfig.connectionString || 'mongodb://localhost:27017/test';

		    MongoClient.connect( connectionString,{useNewUrlParser: true}, function( err, client ) {
		    	if(err)
		    		return reject(err);
		    	else
		    	{
					_db = client.db();
		    		return resolve(_db);
		    	}
		    });
		}
	})
}