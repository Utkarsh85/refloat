var chain= require('frontle-chain');
var fs= require('fs');
var path= require('path');
var expect= require('chai').expect;
var clearRequire = require('clear-require');

describe('Testing core.routeLinks.actions',function () {

	it('Should have all methods head,get,post,put,options,delete for an unsupported action name in the app object',function (done) {

		clearRequire.all();
		
		var models={User:{schema:{attributes:{properties:{name:{type:'string'}}}}}};
		var controllers={UserController:{count:function(req,res){}}};
		var app= require('express')();

		var modifiedApp= require('../../../app/core/middlewares/routeLink/map/actions')(app,models,controllers);

		var routes= modifiedApp._router.stack.filter((x)=>{if(x.route)return true;});

		expect(routes).to.have.length(6);
		expect(routes[0]).to.have.property('route').to.have.property('methods').to.have.property('head',true);
		expect(routes[1]).to.have.property('route').to.have.property('methods').to.have.property('get',true);
		expect(routes[2]).to.have.property('route').to.have.property('methods').to.have.property('post',true);
		expect(routes[3]).to.have.property('route').to.have.property('methods').to.have.property('put',true);
		expect(routes[4]).to.have.property('route').to.have.property('methods').to.have.property('options',true);
		expect(routes[5]).to.have.property('route').to.have.property('methods').to.have.property('delete',true);
		done();
	});

	it('Should have no methods head,get,post,put,options,delete for a supported action name in the app object if the corresponding model does not exist',function (done) {

		// The repurcussion of this spec is that it supported routes like find,findOne,create,update and destroy would never appear in the route name
		clearRequire.all();
		
		var models={Pet:{schema:{attributes:{properties:{name:{type:'string'}}}}}};
		var controllers={UserController:{find:function(req,res){}}};
		var app= require('express')();

		var modifiedApp= require('../../../app/core/middlewares/routeLink/map/actions')(app,models,controllers);
		expect(modifiedApp).to.not.have.property('_router');
		done();
	});
})