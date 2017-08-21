var acl= require('./utils/acl');
var defaults= acl.defaults();

var token= require('../../token');

module.exports=function () {
	return function (req,res,next) {

		//has authorization header
		if(req.headers.hasOwnProperty('authorization'))
		{
			var bearerToken=req.headers['authorization'].split('Bearer ')[1];

			if(!token.verify(bearerToken))
				return res.status(401).json({msg:"Malformed token supplied",code:4300,status:401});

		    var decoded= token.payload(bearerToken);

		    var authName=defaults['authenticated_default'];
		    if(decoded.hasOwnProperty('auth'))
		    	authName=decoded.auth;

		    if( acl.verify({auth:authName,controller:req.options.controller, action:req.options.action}) )
		    {
				req.user={};
				req.user.id=decoded.base;
				req.user.auth=authName;
				return next();
		    }
		    else
		    	return res.status(401).json({msg:"Unauthorized Access",code:4301,status:401});
		}

		//No authorization header
		else
		{
			if( acl.verify({auth:defaults['not_authenticated_default'],controller:req.options.controller, action:req.options.action}) )
		    {
				return next();
		    }
		    else if(req.method==="OPTIONS")
		    {
		    	return next();
		    }
		    else
		    	return res.status(401).json({msg:"Unauthorized Access",code:4302,status:401});
		}

	}
} 
