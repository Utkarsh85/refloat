var MongoClient = require( 'mongodb' ).MongoClient;

var _db=null;

var connectionConfig={};
try
{
	var connectionConfig= require(require('path').resolve('./config/connection'));
}
catch(err)
{

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

		    MongoClient.connect( connectionString, function( err, db ) {
		    	if(err)
		    		return reject(err);
		    	else
		    	{
					_db = db;
		    		return resolve(_db);
		    	}
		    });
		}
	})
}