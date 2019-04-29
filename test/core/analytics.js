var express= require('express');
var app= new express();
var request= require('request');
var fs= require('fs');
var path= require('path');

var expect= require('chai').expect;

describe('Testing core.analytics',function () {

	before(function (done) {
		fs.writeFileSync(path.resolve('./config/analytics.js'),'module.exports={receive: function(obj){console.log("Writing => ",obj)}}','utf8');	
		done();
	});

	after(function (done) {
		fs.unlinkSync(path.resolve('./config/analytics.js'));
		done();
	});

	it.only('Should contain the routeAnalysis object in the req',function (done) {
		
		var analytics= require('../../app/core/middlewares/analytics');

		analytics(app);

		app.get('/',function (req,res,next) {
			res.status(400).json({msg:'Hello World',status:200});
		});

		app.listen(1497,function () {
			request('http://127.0.0.1:1497/',function (err,response,body) {
				done();
			});		
		});
	})

});