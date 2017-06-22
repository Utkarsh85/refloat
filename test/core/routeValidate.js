var chain= require('frontle-chain');
var routeValidate= require('../../app/core/middlewares/routeValidate');

var expect= require('chai').expect;

describe('Testing core.routeValidate',function () {

	it('Should have validate var',function (done) {
		// expect()

		chain({},[function (ctx,next) {
			routeValidate(ctx,null,next);
		},function (ctx,next) {
			expect(ctx).to.have.property('validate');
			expect(typeof ctx.validate).to.be.equal('function');
			done();
		}]);
	});


	it('Should validate req.Params ',function (done) {
		// expect()

		chain({Params:{name:'Hey'}},[function (ctx,next) {
			routeValidate(ctx,null,next);
		},function (ctx,next) {
			try
			{
				ctx.validate({
					name:
					{
						type:'string'
					}
				})
				done();
			}
			catch(err)
			{
				
			}
		}]);
	});

	it('Should validate req.Params for failure',function (done) {
		// expect()

		chain({Params:{name:'Hey'}},[function (ctx,next) {
			routeValidate(ctx,null,next);
		},function (ctx,next) {
			try
			{
				ctx.validate({
					name:
					{
						type:'number'
					}
				})
			}
			catch(err)
			{
				done();
			}
		}]);
	});

	it('Should validate ObjectId from req.Params',function (done) {
		// expect()

		chain({Params:{id:'59196db9ccf6b84a447b7ad5'}},[function (ctx,next) {
			routeValidate(ctx,null,next);
		},function (ctx,next) {
			try
			{
				ctx.validate({
					id:
					{
						type:'string',
						format:'ObjectId'
					}
				})
				done();
			}
			catch(err)
			{
				
			}
		}]);
	});


})