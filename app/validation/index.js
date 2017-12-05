var ObjectId= require('mongodb').ObjectId;
var omitDeep = require('omit-deep');

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

ajv.addKeyword('convertToObject',{
	type: 'string',
	compile: function(sch,parentSchema) {
		// console.log(sch,parentSchema);
		return (parentSchema.format === 'date-time' || parentSchema.instanceof === 'Date') && sch ? function(value,objectKey,object,key) {

			// Update date-time string to Date object
			object[key] = new Date(value);
			return true;
		} : function() {
			return true;
		}
	}
})

module.exports= function (schema,instance,removeDefaults) {


	//removeDefaults if removeDefaults= true
	if(removeDefaults === true)
	{
		schema.attributes= omitDeep(schema.attributes,['default']);
	}

	//make measure for the references
	if(schema.hasOwnProperty('reference'))
	{
		for(var ref in schema.reference)
		{
			if(schema.reference[ref].hasOwnProperty('multi') && schema.reference[ref].multi==true)
				schema.attributes.properties[ref]= {type:"array",items:{type:'string',format:'ObjectId'}};
			else
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
