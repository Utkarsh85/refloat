var ObjectID = require('mongodb').ObjectID;

var queryHelper= {
	_id: function (id) {
		var queryObj={};
		if(id == null)
		{
			return null;
		}
		if( ObjectID.isValid(id) && typeof(id)!='number')
		{
			queryObj._id= new ObjectID(id);
			return queryObj;
		}
		else if (typeof(id)==="string") {
			queryObj._id=id;
			return queryObj;
		}
		else if(id && typeof(id)==="object")
		{
			if(id.hasOwnProperty('_id') && ObjectID.isValid(id._id) && typeof(id._id)!='number')
				id._id= new ObjectID(id._id);
			// else if(id.hasOwnProperty('_id') && typeof(id._id)==="string")

			return id;
		}
		else
		{
			queryObj._id=id;
			return queryObj;
		}
	},

	toObjectId: function (id) {
		if( ObjectID.isValid(id) && typeof(id)!='number')
			return new ObjectID(id);
		else
			return id;
	},

	toStringId: function (id) {
		if( ObjectID.isValid(id) && typeof(id)!='number')
			return new ObjectID(id).toHexString();
		else
			return id;
	},

	checkObjectId: function (id) {
		if( ObjectID.isValid(id) && typeof(id)!='number')
			return true;
		else
			return false;
	}
};

module.exports= queryHelper;