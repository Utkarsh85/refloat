module.exports= function (app,models,controllers) {
	for(var model in models)
	{
		var lowerCaseModel= model.toLowerCase();
		var controllerName= model+'Controller';

		if(controllers[controllerName] && controllers[controllerName].hasOwnProperty('create'))
			app['post']('/'+lowerCaseModel,controllers[controllerName].create);
		// else
		// 	app['post']('/'+lowerCaseModel,create);
	}

	return app;
}