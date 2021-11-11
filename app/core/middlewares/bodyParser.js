var bodyParser = require('body-parser');

module.exports= function (app) {
	app.use(bodyParser.json({limit: '2mb'})); // for parsing application/json
	app.use(bodyParser.urlencoded({limit: '2mb', extended: true})); // for parsing application/x-www-form-urlencoded
}