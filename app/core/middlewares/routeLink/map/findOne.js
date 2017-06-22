var paramsConvertMiddleware= require('./utils/paramsConvertMiddleware');

module.exports= function (app,models,controllers) {
	for(var model in models)
	{
		var lowerCaseModel= model.toLowerCase();
		var controllerName= model+'Controller';

		if(controllers[controllerName] && controllers[controllerName].hasOwnProperty('findOne'))
			app['get']('/'+lowerCaseModel+'/:id',[paramsConvertMiddleware,controllers[controllerName].findOne]);
		// else
		// 	app['get']('/'+lowerCaseModel+'/:id',findOne);
	}

	return app;
}