var controllers={};

try
{
	controllers= require('require-all')({
		dirname     :  require("path").resolve('./api/controllers'),
		filter      :  /(.+Controller)\.js$/,
		excludeDirs :  /^\.(git|svn)$/,
		recursive   : true
	});
}
catch(err)
{

}

module.exports= controllers;