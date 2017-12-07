var models={};
var modelConfiguration={modelNameScheme:'lowercase'};
var dateFieldSearch= require('./dateFieldSearch');

try
{
	modelConfiguration= require(require('path').resolve('./config/models'));
}
catch(err)
{

}

try
{
	models= require('require-all')({
		dirname     :  require("path").resolve('./api/models'),
		excludeDirs :  /^\.(git|svn)$/,
		recursive   : true
	});
}
catch(err)
{
	throw(err);
}


var jsUcfirst=function (string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports=Object.keys(models)
.map(function (key) {
	var obj={schema: models[key]};
	obj.dateFields= Object.assign({},dateFieldSearch(models[key]),{createdAt:true,updatedAt:true});
	obj.modelName=key;
	obj.fileName=key;
	return obj;
})
.reduce(function (modelObj,model) {
	modelObj[model.modelName]= model;

	var key= modelObj[model.modelName]['modelName'];

	if(modelObj[model.modelName].schema.hasOwnProperty('collectionName'))
	{
		modelObj[model.modelName]['modelName']=modelObj[model.modelName].schema['collectionName'];
	}
	else
	{
		if(modelConfiguration.modelNameScheme=='lowercase')
			modelObj[model.modelName]['modelName']=key.toLowerCase();
		else if(modelConfiguration.modelNameScheme=='uppercase')
			modelObj[model.modelName]['modelName']=key.toUpperCase();
		else if(modelConfiguration.modelNameScheme=='capitalize')
			modelObj[model.modelName]['modelName']=jsUcfirst(key);
	}

	return modelObj;
},{});

