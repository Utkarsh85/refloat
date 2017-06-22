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

describe('Testing core.acltoken',function () {

	after(function (done) {
		fs.unlinkSync(path.resolve('./config/acl.js'));
		fs.unlinkSync(path.resolve('./config/token.js'));
		done();
	});

	it('Should not pass through as non authenticated if acl says not ok',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		chain({
			headers:{},
			options:{action:'update',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();

			var res=token()(ctx,responseInst,next);
			expect(res.value()).to.have.property('status',401);
			expect(res.value()).to.have.property('json').to.have.property('status',4302);
			expect(res.value()).to.have.property('json').to.have.property('msg','Unauthorized Access');
			done();
		},function (ctx,next) {
			
		}]);
	});


	it('Should not pass through as non authenticated if acl does not have the property for the action under the same controller',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={not_authenticated:{User:{create:true}}}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		chain({
			headers:{},
			options:{action:'update',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();

			var res=token()(ctx,responseInst,next);
			expect(res.value()).to.have.property('status',401);
			expect(res.value()).to.have.property('json').to.have.property('status',4302);
			expect(res.value()).to.have.property('json').to.have.property('msg','Unauthorized Access');
			done();
		},function (ctx,next) {
			
		}]);
	});


	it('Should pass through as non authenticated if acl has a property for the action under the controller',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={routes:{not_authenticated:{User:{create:true}}}}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		chain({
			headers:{},
			options:{action:'create',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();

			var res=token()(ctx,responseInst,next);
			// console.log(res);
		},function (ctx,next) {
			done();			
		}]);
	});

	it('Should not pass through if token provided is malformed',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={routes:{authenticated:{User:{create:true}}}}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		chain({
			headers:{authorization:'Bearer not_a_token'},
			options:{action:'create',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();

			var res=token()(ctx,responseInst,next);
			expect(res.value()).to.have.property('status',401);
			expect(res.value()).to.have.property('json').to.have.property('status',4300);
			expect(res.value()).to.have.property('json').to.have.property('msg','Malformed token supplied');
			done();
		},function (ctx,next) {
		}]);
	});


	it('Should not pass through if token provided is okay but acl does not exist',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={routes:{manager:{User:{create:true}}}}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		var tokenLib=require('../../app/token');

		chain({
			headers:{authorization:'Bearer '+tokenLib.create('2',{auth:'admin'})},
			options:{action:'create',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();

			var res=token()(ctx,responseInst,next);
			expect(res.value()).to.have.property('status',401);
			expect(res.value()).to.have.property('json').to.have.property('status',4301);
			expect(res.value()).to.have.property('json').to.have.property('msg','Unauthorized Access');
			done();
		},function (ctx,next) {
		}]);
	});

	it('Should pass through if token provided is okay and acl exist',function (done) {

		clearRequire.all();
		fs.writeFileSync(path.resolve('./config/acl.js'),'module.exports={routes:{admin:{User:{create:true}}}}','utf8');
		fs.writeFileSync(path.resolve('./config/token.js'),'module.exports={secret:\'my secret\'}','utf8');
		var token= require('../../app/core/middlewares/token');
		var tokenLib=require('../../app/token');

		chain({
			headers:{authorization:'Bearer '+tokenLib.create('2',{auth:'admin'})},
			options:{action:'create',controller:'User'}
		},[function (ctx,next) {
			var responseInst= new responseClass();

			var res=token()(ctx,responseInst,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('user').to.have.property('id','2');
			expect(ctx).to.have.property('user').to.have.property('auth','admin');
			done();
		}]);
	});
})