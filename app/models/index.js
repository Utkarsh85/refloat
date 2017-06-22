var models={};
var modelConfiguration={modelNameScheme:'lowercase'};

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

}


var jsUcfirst=function (string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports=Object.keys(models)
.map(function (key) {
	var obj={schema: models[key]};
	obj.modelName=key;
	obj.fileName=key;
	return obj;
})
.reduce(function (modelObj,model) {
	modelObj[model.modelName]= model;

	var key= modelObj[model.modelName]['modelName'];

	if(modelConfiguration.modelNameScheme=='lowercase')
		modelObj[model.modelName]['modelName']=key.toLowerCase();
	else if(modelConfiguration.modelNameScheme=='uppercase')
		modelObj[model.modelName]['modelName']=key.toUpperCase();
	else if(modelConfiguration.modelNameScheme=='capitalize')
		modelObj[model.modelName]['modelName']=jsUcfirst(key);

	return modelObj;
},{});

