var analyticsConfig={};
try
{
	analyticsConfig= require(require('path').resolve('./config/analytics'));
}
catch(err)
{

}

module.exports= function (app) {

	app.use(function(req, res,next){

		req.routeAnalysis={id:+new Date(),options:req.options,time:process.hrtime()};
	    res.on('finish', function(){
	    	// console.log(res);
	        var diffTime= process.hrtime(req.routeAnalysis.time);
	        req.routeAnalysis.executionTime= diffTime[0]*1000+diffTime[1] / 1000000;

	        if(analyticsConfig.hasOwnProperty('receive') && typeof(analyticsConfig.receive) === 'function')
	        {
	        	analyticsConfig.receive(req.routeAnalysis);
	        }
	    });

	    res.on('end',function () {
	    	console.log('Header event fired',arguments);
	    })
	    next();
	});
}