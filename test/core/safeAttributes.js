var chain= require('frontle-chain');
var fs= require('fs');
var path= require('path');
var expect= require('chai').expect;
var clearRequire = require('clear-require');

describe('Testing core.safeAttributes',function () {

	before(function (done) {
		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{properties:{name:{type:\'string\'}}},safeAttributes:{name:function(req,val){if(!req.user||req.user.auth!=\'admin\')return true; else return false;}}}','utf8');	
		done();
	});

	after(function (done) {
		fs.unlinkSync(path.resolve('./api/models/User.js'));
		done();
	});

	it('Should not reveal name when auth is not admin',function (done) {

		clearRequire.all();
		var safeAttributes= require('../../app/core/middlewares/safeAttributes');
		chain({
			body:{name:'Hello World'},
			Params:{name:'Hello World'},
			options:{action:'update',controller:'User'}
		},[function (ctx,next) {
			safeAttributes()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('body');
			expect(ctx.body).to.not.have.property('name');
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.not.have.property('name');
			done();
		}]);
	});

	it('Should reveal name when auth is admin',function (done) {

		clearRequire.all();
		var safeAttributes= require('../../app/core/middlewares/safeAttributes');
		chain({
			body:{name:'Hello World'},
			Params:{name:'Hello World'},
			options:{action:'update',controller:'User'},
			user:{auth:'admin'}
		},[function (ctx,next) {
			safeAttributes()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('body');
			expect(ctx.body).to.have.property('name','Hello World');
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.have.property('name','Hello World');
			done();
		}]);
	});
})