var express= require('express');

var middlewares= require('require-all')({
  dirname     :  __dirname+'/middlewares',
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : true
});


var app = express();

middlewares.cors(app); //cors on the top
middlewares.bodyParser(app);

app.use(middlewares.busboy);
app.use(middlewares.aggregateParams);

app.use(middlewares.routeValidate);
app.use(middlewares.routeOptions());

app.use(middlewares.token());
app.use(middlewares.safeAttributes());

middlewares.routeLink.index(app);

module.exports= app;