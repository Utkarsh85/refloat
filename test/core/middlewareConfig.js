var chain= require('frontle-chain');
var fs= require('fs');
var path= require('path');
var expect= require('chai').expect;
var clearRequire = require('clear-require');

var responseClass= function () {
	this.res={};
}

responseClass.prototype.status = function(status) {
	this.res.status=status;
	return this;
};

responseClass.prototype.json = function(json) {
	this.res.json=json;
	return this;
};

responseClass.prototype.value = function() {
	return this.res;
};

describe('Testing core.middlewareConfig',function () {

	after(function (done) {
		fs.unlinkSync(path.resolve('./config/acl.js'));
		fs.unlinkSync(path.resolve('./config/middleware.js'));
		fs.unlinkSync(path.resolve('./config/token.js'));
		done();
	});

	it('Should behave as usual if no middlewareConfig defined',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={routes:{authenticated:{User:{create:true}}}}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		var tokenLib=require('../../app/token');

		chain({
			headers:{authorization:'Bearer '+tokenLib.create('2')},
			options:{action:'create',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();
			token()(ctx,responseInst,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('user').to.have.property('id','2');
			done();
		}]);
	});

	it('Should behave as usual if middlewareConfig defined but tokenMiddleware not set to true',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/middleware.js'),'module.exports={}','utf8');
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={routes:{authenticated:{User:{create:true}}}}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		var tokenLib=require('../../app/token');

		chain({
			headers:{authorization:'Bearer '+tokenLib.create('2')},
			options:{action:'create',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();
			token()(ctx,responseInst,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('user').to.have.property('id','2');
			done();
		}]);
	});


	it('Should behave as usual if middlewareConfig defined but tokenMiddleware set to true',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/middleware.js'),'module.exports={tokenMiddleware:true}','utf8');
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={routes:{authenticated:{User:{create:true}}}}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		var tokenLib=require('../../app/token');

		chain({
			headers:{authorization:'Bearer '+tokenLib.create('2')},
			options:{action:'create',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();
			token()(ctx,responseInst,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('user').to.have.property('id','2');
			done();
		}]);
	});

	it('Should pass to the next middleware if middlewareConfig defines tokenMiddleware as false',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/middleware.js'),'module.exports={tokenMiddleware:false}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		var tokenLib=require('../../app/token');

		chain({
			// headers:{authorization:'Bearer '+tokenLib.create('2',{auth:'admin'})},
			// options:{action:'create',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();
			token()(ctx,responseInst,next);
		},function (ctx,next) {
			done();
		}]);
	});

})