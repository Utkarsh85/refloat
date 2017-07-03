var chain= require('frontle-chain');
var routeOptions;

var expect= require('chai').expect;

describe('Testing core.routeOptions',function () {

	before(function (done) {
		routeOptions= require('../../app/core/middlewares/routeOptions');
		done();
	});

	it('Should pass the test for find',function (done) {
		// expect()
		
		chain({url:'/user',method:'GET'},[function (ctx,next) {
			routeOptions()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('options');
			expect(ctx.options).to.have.property('controller','User');
			expect(ctx.options).to.have.property('action','find');
			done();
		}]);
	});


	it('Should pass the test for findOne',function (done) {
		// expect()

		chain({url:'/user/djkhdj3jk3jkj3',method:'GET'},[function (ctx,next) {
			routeOptions()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('options');
			expect(ctx.options).to.have.property('controller','User');
			expect(ctx.options).to.have.property('action','findOne');
			done();
		}]);
	});

	it('Should pass the test for create',function (done) {
		// expect()

		chain({url:'/user',method:'POST'},[function (ctx,next) {
			routeOptions()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('options');
			expect(ctx.options).to.have.property('controller','User');
			expect(ctx.options).to.have.property('action','create');
			done();
		}]);
	});

	it('Should pass the test for update',function (done) {
		// expect()

		chain({url:'/user/djkhdj3jk3jkj3',method:'PUT'},[function (ctx,next) {
			routeOptions()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('options');
			expect(ctx.options).to.have.property('controller','User');
			expect(ctx.options).to.have.property('action','update');
			done();
		}]);
	});

	it('Should pass the test for destroy',function (done) {
		// expect()

		chain({url:'/user/djkhdj3jk3jkj3',method:'DELETE'},[function (ctx,next) {
			routeOptions()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('options');
			expect(ctx.options).to.have.property('controller','User');
			expect(ctx.options).to.have.property('action','destroy');
			done();
		}]);
	});

	// it('Should pass the test for destroy on OPTIONS verb',function (done) {
	// 	// expect()

	// 	chain({url:'/user/djkhdj3jk3jkj3',method:'OPTION'},[function (ctx,next) {
	// 		routeOptions()(ctx,null,next);
	// 	},function (ctx,next) {
	// 		console.log(ctx.options);
	// 		expect(ctx).to.have.property('options');
	// 		expect(ctx.options).to.have.property('controller','User');
	// 		expect(ctx.options).to.have.property('action','destroy');
	// 		done();
	// 	}]);
	// });

	it('Should not result in update if nothing after last slash',function (done) {
		// expect()

		chain({url:'/user',method:'PUT'},[function (ctx,next) {
			routeOptions()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('options');
			expect(ctx.options).to.have.property('controller','User');
			expect(ctx.options).to.have.property('action').to.be.empty;
			done();
		}]);
	});

	it('Should not result in destroy if nothing after last slash',function (done) {
		// expect()

		chain({url:'/user',method:'DELETE'},[function (ctx,next) {
			routeOptions()(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('options');
			expect(ctx.options).to.have.property('controller','User');
			expect(ctx.options).to.have.property('action').to.be.empty;
			done();
		}]);
	});




})