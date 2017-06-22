module.exports= function (app,models,controllers) {
	for(var model in models)
	{
		var lowerCaseModel= model.toLowerCase();
		var controllerName= model+'Controller';

		if(controllers[controllerName] && controllers[controllerName].hasOwnProperty('find'))
		{
			// console.log('\nRegistering find route for '+lowerCaseModel+' using '+controllerName+' .find');
			app['get']('/'+lowerCaseModel,controllers[controllerName].find);
		}
		// else
		// 	app['get']('/'+lowerCaseModel,find);
	}

	return app;
}