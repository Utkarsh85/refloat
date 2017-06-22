var ObjectID = require('mongodb').ObjectID;

module.exports= {
	_id: function (id) {
		var queryObj={};
		
		if( ObjectID.isValid(id) )
		{
			queryObj._id= new ObjectID(id);
			return queryObj;
		}
		else if (typeof(id)==="string") {
			queryObj._id=id;
			return queryObj;
		}
		else if(typeof(id)==="object")
		{
			if(id.hasOwnProperty('_id') && ObjectID.isValid(id._id))
				id._id= new ObjectID(id._id);
			// else if(id.hasOwnProperty('_id') && typeof(id._id)==="string")

			return id;
		}
	}
}