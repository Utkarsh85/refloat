var express= require('express');
var app;

module.exports= function (predefinedApp) {
	if(!predefinedApp)
		app = express();
	else
		app=predefinedApp;

	var middlewares= require('require-all')({
	  dirname     :  __dirname+'/middlewares',
	  excludeDirs :  /^\.(git|svn)$/,
	  recursive   : true
	});



	middlewares.cors(app); //cors on the top
	middlewares.bodyParser(app);

	app.use(middlewares.busboy);
	app.use(middlewares.aggregateParams);

	app.use(middlewares.routeValidate);
	app.use(middlewares.routeOptions());

	app.use(middlewares.token());
	app.use(middlewares.queryModify());
	app.use(middlewares.safeAttributes());

	middlewares.routeLink.index(app);

	return app;
};