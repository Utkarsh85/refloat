var chain= require('frontle-chain');
var aggregateParams= require('../../app/core/middlewares/aggregateParams');

var expect= require('chai').expect;

describe('Testing core.aggregateParams',function () {

	it('Should reveal ctx.body in ctx.Params',function (done) {
		// expect()

		chain({body:{a:1}},[function (ctx,next) {
			aggregateParams(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.have.property('a',1);
			done();
		}]);
	});


	it('Should reveal ctx.params in ctx.Params',function (done) {
		// expect()

		chain({params:{a:1}},[function (ctx,next) {
			aggregateParams(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.have.property('a',1);
			done();
		}]);
	});

	it('Should reveal ctx.query in ctx.Params',function (done) {
		// expect()

		chain({query:{a:1}},[function (ctx,next) {
			aggregateParams(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.have.property('a',1);
			done();
		}]);
	});

	it('Should merge ctx.body ctx.params ctx.query in ctx.Params',function (done) {
		// expect()

		chain({query:{a:1},params:{b:1},body:{c:1}},[function (ctx,next) {
			aggregateParams(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.have.property('a',1);
			expect(ctx.Params).to.have.property('b',1);
			expect(ctx.Params).to.have.property('c',1);
			done();
		}]);
	});


	it('Should deepmerge ctx.body ctx.params ctx.query in ctx.Params',function (done) {
		// expect()

		chain({query:{q:{a:1}},params:{q:{b:1}},body:{q:{c:1}}},[function (ctx,next) {
			aggregateParams(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('Params');
			expect(ctx.Params).to.have.property('q');
			expect(ctx.Params.q).to.have.property('a',1);
			expect(ctx.Params.q).to.have.property('b',1);
			expect(ctx.Params.q).to.have.property('c',1);
			done();
		}]);
	});
})