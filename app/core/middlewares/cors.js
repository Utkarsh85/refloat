var cors= require('cors');

var corsConfig;
try
{
	corsConfig= require(require('path').resolve('./config/cors'));
}
catch(err)
{

}

module.exports= function (app) {

	if(corsConfig)
	{
		app.options('*', cors(corsConfig));
		app.use(cors(corsConfig));
	}
	
	return app;
}