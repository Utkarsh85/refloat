const arrayDiffer = require('array-differ');

module.exports= function (app,models,controllers) {

	var allSupportedActions= ['find','findOne','create','update','destroy'];
	
	Object.keys(controllers)
	.map(function (val) {
		return {controller:val,routes:arrayDiffer( Object.keys(controllers[val]),allSupportedActions )}
	})
	.map(function (val) {
		val.routes.forEach(function (route) {
			// console.log('Controller = ',val.controller,' Route = ',route);
			var controller= val.controller.toLowerCase().split('controller')[0];
			app['head']('/'+controller+'/'+route,controllers[val.controller][route]);
			app['get']('/'+controller+'/'+route,controllers[val.controller][route]);
			app['post']('/'+controller+'/'+route,controllers[val.controller][route]);
			app['put']('/'+controller+'/'+route,controllers[val.controller][route]);
			app['options']('/'+controller+'/'+route,controllers[val.controller][route]);
			app['delete']('/'+controller+'/'+route,controllers[val.controller][route]);
		});
	})

	return app;
}