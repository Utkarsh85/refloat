var fs= require('fs');
var path= require('path');
var chain= require('frontle-chain');
var routeValidate= require('../../app/core/middlewares/routeValidate');
var clearRequire = require('clear-require');

var expect= require('chai').expect;

describe('Testing core.routeValidate',function () {
	
	after(function (done) {
		try
		{
			fs.unlinkSync(path.resolve('./config/validation.js'));
			
		}
		catch(err){ console.log(err) }
		done();
	})

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

	it('Should use rules from validationConfig',function (done) {
		clearRequire.all();

		fs.writeFileSync(path.resolve('./config/validation.js'),'module.exports={rules:{coerceTypes: true}}','utf8');
		
		var routeValidateAfterValidationConfigDefined= require('../../app/core/middlewares/routeValidate');

		chain({Params:{id:'59196db9ccf6b84a447b7ad5',password:123}},[function (ctx,next) {
			routeValidateAfterValidationConfigDefined(ctx,null,next);
		},function (ctx,next) {
			try
			{
				ctx.validate({
					id:
					{
						type:'string',
						format:'ObjectId'
					},
					password:
					{
						type:'string'
					},
					defaulted:
					{
						type:'string',
						default:'34'
					}
				},['id','password'])

				done();
			}
			catch(err)
			{
				console.log(err);
			}
		}]);
	});

	it('Should use rules from validationConfig but not useDefaults',function (done) {
		clearRequire.all();

		fs.writeFileSync(path.resolve('./config/validation.js'),'module.exports={rules:{useDefaults:true,coerceTypes:true}}','utf8');
		
		var routeValidateAfterValidationConfigDefined= require('../../app/core/middlewares/routeValidate');

		chain({Params:{id:'59196db9ccf6b84a447b7ad5',password:123}},[function (ctx,next) {
			routeValidateAfterValidationConfigDefined(ctx,null,next);
		},function (ctx,next) {
			try
			{
				ctx.validate({
					id:
					{
						type:'string',
						format:'ObjectId'
					},
					password:
					{
						type:'string'
					},
					defaulted:
					{
						type:'string',
						default:'34'
					}
				},['id','password'])

				expect(ctx).to.not.have.property('defaulted');
				done();
			}
			catch(err)
			{
				console.log(err);
			}
		}]);
	});

})