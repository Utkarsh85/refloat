var jwt = require('jsonwebtoken');
var moment= require('moment');
var tokenConfig={};

try
{
	tokenConfig= require(require('path').resolve('./config/token.js'));
}
catch(err)
{
	throw new Error({msg:'Token config file not created at config/token.js, please add a token secret.',status:500});
}

if(!tokenConfig.secret)
	throw new Error({msg:'Token Secret Required',status:500});

var secret= tokenConfig.secret;
var algorithm= tokenConfig.algorithm || 'HS512';
var validity= tokenConfig.validity||14;


var token={};
token.create = function (id,obj,valid) {
	var daysToExpire= valid || validity;
	var payload = {
		base: id,
		iat: moment().unix(),
		exp: moment().add(daysToExpire, 'days').unix()
	};

	if(obj)
	{
		for(var key in obj)
		{
			if(['base','iat','exp'].indexOf(key) < 0)
			  	payload[key]=obj[key];
		}	
	}

	return jwt.sign(payload, secret,{algorithm: algorithm});
}

token.verify = function (token) {
	try
	{
		var decoded = jwt.verify(token,secret,{ algorithm: algorithm});
	}
	
	catch(err)
	{
		return false;
	}

	if(decoded.exp> moment().unix())
		return true;
	else
		return false;
}

token.payload = function (token) {
	return jwt.decode(token,secret,{algorithm: algorithm});
}

module.exports= token;
