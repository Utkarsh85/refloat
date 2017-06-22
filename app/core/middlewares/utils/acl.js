AclVerify={};

var acl= {};
try
{
	acl=require(require('path').resolve('./config/acl'));
}
catch(err)
{

}


AclVerify.verify= function (options) {
	
	if(!acl)
		throw {msg:"Please configure your acl file at config/acl.js"};

	try
	{
		
		if(acl.routes[options.auth][options.controller][options.action])
			return true;
		else
			return false;

	}

	catch(err)
	{
		return false;
	}
}

AclVerify.defaults= function () {
	var obj={};
	
	if(acl.hasOwnProperty('authenticated_default'))
		obj['authenticated_default']= acl['authenticated_default'];
	else
		obj['authenticated_default']= 'authenticated';

	if(acl.hasOwnProperty('not_authenticated_default'))
		obj['not_authenticated_default']= acl['not_authenticated_default'];
	else
		obj['not_authenticated_default']= 'not_authenticated';

	return obj;
}

module.exports= AclVerify;