var chain= require('frontle-chain');
var fs= require('fs');
var path= require('path');
var expect= require('chai').expect;
var clearRequire = require('clear-require');

describe('Testing core.routeLinks.create',function () {

	it('Should have create route in the app object',function (done) {

		clearRequire.all();
		
		var models={User:{schema:{attributes:{properties:{name:{type:'string'}}}}}};
		var controllers={UserController:{create:function(req,res){}}};
		var app= require('express')();

		var modifiedApp= require('../../../app/core/middlewares/routeLink/map/create')(app,models,controllers);

		var routes= modifiedApp._router.stack.filter((x)=>{if(x.route)return true;});

		expect(routes).to.have.length(1);
		expect(routes[0]).to.have.property('route').to.have.property('methods').to.have.property('post',true);
		done();
	});

	it('Should not have create route in the app object if the model is not defined but the controller',function (done) {

		clearRequire.all();
		
		var models={Pet:{schema:{attributes:{properties:{name:{type:'string'}}}}}};
		var controllers={UserController:{create:function(req,res){}}};
		var app= require('express')();

		var modifiedApp= require('../../../app/core/middlewares/routeLink/map/create')(app,models,controllers);

		expect(modifiedApp).to.not.have.property('_router');
		done();
	});

	it('Should not have create route in the app object if the model is defined but not the controller',function (done) {

		clearRequire.all();
		
		var models={User:{schema:{attributes:{properties:{name:{type:'string'}}}}}};
		var controllers={PetController:{create:function(req,res){}}};
		var app= require('express')();

		var modifiedApp= require('../../../app/core/middlewares/routeLink/map/create')(app,models,controllers);

		expect(modifiedApp).to.not.have.property('_router');
		done();
	});
})