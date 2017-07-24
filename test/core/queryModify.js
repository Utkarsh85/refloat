var chain= require('frontle-chain');
var fs= require('fs');
var path= require('path');
var expect= require('chai').expect;
var clearRequire = require('clear-require');

describe('Testing core.queryModify',function () {

	before(function (done) {
		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{properties:{name:{type:\'string\'}}},queryModify:{name:function(req,val){if(!req.user||req.user.auth!=\'admin\')return true; else return false;},email:{admin:false,authenticated:true,not_authenticated:true},password:true}}','utf8');	
		done();
	});

	after(function (done) {
		fs.unlinkSync(path.resolve('./api/models/User.js'));
		done();
	});

	it('Should not reveal name when auth is not admin',function (done) {

		clearRequire.all();
		var queryModify= require('../../app/core/middlewares/queryModify');
		chain({
			query:{name:'Hello World',where:{name:'hello'}},
			Params:{name:'Hello World',where:{name:'hello'}},
			options:{action:'find',controller:'User'}
		},[function (ctx,next) {
			queryModify()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('query');
			expect(ctx.query).to.not.have.property('name');
			expect(ctx.query).to.have.property('where').to.not.have.property('name');
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.not.have.property('name');
			expect(ctx.Params).to.have.property('where').to.not.have.property('name');
			done();
		}]);
	});

	it('Should reveal name when auth is admin',function (done) {

		clearRequire.all();
		var queryModify= require('../../app/core/middlewares/queryModify');
		chain({
			query:{name:'Hello World',where:{name:'hello'}},
			Params:{name:'Hello World',where:{name:'hello'}},
			options:{action:'find',controller:'User'},
			user:{auth:'admin'}
		},[function (ctx,next) {
			queryModify()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('query');
			expect(ctx.query).to.have.property('name','Hello World');
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.have.property('name','Hello World');
			done();
		}]);
	});

	it('Should not reveal email when auth is not admin but is authenticated',function (done) {

		clearRequire.all();
		var queryModify= require('../../app/core/middlewares/queryModify');
		chain({
			query:{email:'abcd@gmail.com',where:{email:'abcd@gmail.com'}},
			Params:{email:'abcd@gmail.com',where:{email:'abcd@gmail.com'}},
			options:{action:'find',controller:'User'},
			user:{id:3}
		},[function (ctx,next) {
			queryModify()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('query');
			expect(ctx.query).to.not.have.property('email');
			expect(ctx.query).to.have.property('where').to.not.have.property('email');
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.not.have.property('email');
			expect(ctx.Params).to.have.property('where').to.not.have.property('email');
			done();
		}]);
	});

	it('Should not reveal email when auth is not admin but is not_authenticated',function (done) {

		clearRequire.all();
		var queryModify= require('../../app/core/middlewares/queryModify');
		chain({
			query:{email:'abcd@gmail.com',where:{email:'abcd@gmail.com'}},
			Params:{email:'abcd@gmail.com',where:{email:'abcd@gmail.com'}},
			options:{action:'find',controller:'User'},
		},[function (ctx,next) {
			queryModify()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('query');
			expect(ctx.query).to.not.have.property('email');
			expect(ctx.query).to.have.property('where').to.not.have.property('email');
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.not.have.property('email');
			expect(ctx.Params).to.have.property('where').to.not.have.property('email');
			done();
		}]);
	});

	it('Should reveal email when auth is admin',function (done) {

		clearRequire.all();
		var queryModify= require('../../app/core/middlewares/queryModify');
		chain({
			query:{email:'abcd@gmail.com',where:{email:'abcd@gmail.com'}},
			Params:{email:'abcd@gmail.com',where:{email:'abcd@gmail.com'}},
			options:{action:'find',controller:'User'},
			user:{auth:'admin'}
		},[function (ctx,next) {
			queryModify()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('query');
			expect(ctx.query).to.have.property('email','abcd@gmail.com');
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.have.property('email','abcd@gmail.com');
			done();
		}]);
	});

	it('Should not reveal password',function (done) {

		clearRequire.all();
		var queryModify= require('../../app/core/middlewares/queryModify');
		chain({
			query:{password:'1234',where:{password:'1234'}},
			Params:{password:'1234',where:{password:'1234'}},
			options:{action:'find',controller:'User'},
		},[function (ctx,next) {
			queryModify()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('query');
			expect(ctx.query).to.not.have.property('password');
			expect(ctx.query).to.have.property('where').to.not.have.property('password');
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.not.have.property('password');
			expect(ctx.Params).to.have.property('where').to.not.have.property('password');
			done();
		}]);
	});
})