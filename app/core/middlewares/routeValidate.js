var Ajv = require('ajv');
var ObjectId= require('mongodb').ObjectId;
var addAdditionalSchema = require('../../validation/additionalSchema');

var validationConfig={};
try
{
	validationConfig= require(require('path').resolve('./config/validation'));
}
catch(err)
{

}

if(!validationConfig.rules)
	validationConfig.rules={};

validationConfig.rules.useDefaults= false; //Don't useDefaults

var v = new Ajv(validationConfig.rules);
v=addAdditionalSchema(v,validationConfig);

v.addFormat('ObjectId', function (id) {
	if(ObjectId.isValid(id))
		return true
	else
		return false;
}, ['string']);

module.exports= function (req,res,next) {
	
	req.validate= function (schema,Required,obj) {


		var buildSchema={
			type:"object",
		};

		var required=[];
		for(var key in schema)
		{
			required.push(key);
		}

		//If required is defined then work accordingly, or by defualt the required is set to true
		if(Required && Array.isArray(Required) && Required.length>0)
			buildSchema.required= Required;

		else if(Required === 'all')
			buildSchema.required= required;

		else if (typeof(Required) === "undefined")
			buildSchema.required= required;


		buildSchema.properties= schema;

		if(obj)
			var isValid = v.validate(buildSchema,obj);
		else			
			var isValid = v.validate(buildSchema,req.Params);

		if(!isValid)
			throw v.errors;
	}

	return next();
}