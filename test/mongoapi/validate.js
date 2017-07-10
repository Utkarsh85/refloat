var getDb= require('../../app/db/mongodb/getDb');
var fs= require('fs');
var path= require('path');
var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing mongoapi.validate_model_schema',function () {

	before(function (done) {
		fs.writeFileSync(path.resolve('./api/models/User.js'),'module.exports={attributes:{properties:{name:{type:\'string\'}}}, index:[{key:{name:1},unique:true,sparse:true}] }','utf8');	
		done();
	});

	after(function (done) {
		fs.unlinkSync(path.resolve('./api/models/User.js'));
		done();
	});

	it('Should validate the model',function (done) {
		var Api=require('../../app/db/mongodb')();

		Api.User.validate({name:'Hello'})
		.then(function (result) {
			expect(result).to.have.property('name','Hello');
			done();
		})
		.catch(function (err) {
			console.log(err);
		});
	});

	it('Should show validation error on false data',function (done) {
		var Api=require('../../app/db/mongodb')();

		Api.User.validate({name:34})
		.then(function (result) {
		})
		.catch(function (err) {
			expect(err).to.not.be.empty;
			done();
		});
	});
})