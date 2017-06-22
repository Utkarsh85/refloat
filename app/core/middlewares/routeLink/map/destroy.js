var paramsConvertMiddleware= require('./utils/paramsConvertMiddleware');

module.exports= function (app,models,controllers) {
	for(var model in models)
	{
		var lowerCaseModel= model.toLowerCase();
		var controllerName= model+'Controller';

		if(controllers[controllerName] && controllers[controllerName].hasOwnProperty('destroy'))
			app['delete']('/'+lowerCaseModel+'/:id',[paramsConvertMiddleware,controllers[controllerName].destroy]);
		// else
		// 	app['delete']('/'+lowerCaseModel+'/:id',destroy);
	}

	return app;
}