var ObjectId= require('mongodb').ObjectId;

var addAdditionalSchema = require('./additionalSchema');
var validationConfig={};
try
{
	validationConfig= require(require('path').resolve('./config/validation'));
}
catch(err)
{

}

var Ajv = require('ajv');
var ajv = new Ajv(validationConfig.rules);
ajv=addAdditionalSchema(ajv,validationConfig); //add additional schema keywords and formats

ajv.addFormat('ObjectId', function (id) {
	if(ObjectId.isValid(id))
		return true
	else
		return false;
}, ['string']);

module.exports= function (schema,instance) {

	//make measure for the references
	if(schema.hasOwnProperty('reference'))
	{
		for(var ref in schema.reference)
		{
			schema.attributes.properties[ref]= {type:"string",format:'ObjectId'};
		}
	}

	if(Array.isArray(instance))
	{
		return Promise.all(instance.map(function (singleInstance) {
			return new Promise(function (resolve,reject) {

				var isValid = ajv.validate(schema.attributes, singleInstance);

				if(isValid)
				{
					resolve(singleInstance);
				}
				else
				{
					reject(ajv.errors);
				}

			});
		}));
	}
	else
	{
		return new Promise(function (resolve,reject) {
					
			var isValid = ajv.validate(schema.attributes, instance);

			if(isValid)
			{
				resolve(instance);
			}
			else
			{
				reject(ajv.errors);
			}

		});
	}
}
