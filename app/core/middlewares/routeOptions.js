var pathToRegexp= require('path-to-regexp');
var routeMap= require('./utils/routeMap');
var capitalize= require('./utils/capitalize');

var testUrl= pathToRegexp('/:model/:id?',[]);
var url= require('url');

var allSupportedActions= ['find','findOne','create','update','destroy'];

const arrayDiffer = require('array-differ');
var controllers= require('../../controllers');

module.exports= function () {
	return function (req,res,next) {
		var test= testUrl.exec(url.parse(req.url).pathname);
		var options= {
			method: req.method,
			controller: undefined,
			action: undefined
		};

		if(test)
		{
			options['controller']=capitalize(test[1]);

			var allAdditionalRoutesInController;
			if(controllers[capitalize(test[1])+'Controller'])
			{
				allAdditionalRoutesInController=Object.keys(controllers[capitalize(test[1])+'Controller']);
				allAdditionalRoutesInController=arrayDiffer(allAdditionalRoutesInController, allSupportedActions);
			}

			if(allAdditionalRoutesInController && allAdditionalRoutesInController.indexOf(test[2])>=0)
			{
				options['action']=test[2];
			}
			else if(allSupportedActions.indexOf(test[2])>=0 )
			{
				options['action']=undefined;
			}
			else
			{
				options['action']=routeMap(req.method,test[2]);
			}
		}

		req.options=options;

		// console.log(options);
		return next();
	}
} 
