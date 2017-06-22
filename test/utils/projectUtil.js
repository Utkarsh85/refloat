var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing projectUtil library',function () {

	it('Should extend projection as defined in the model',function (done) {
		var projectUtil=require('../../app/db/mongodb/utils/projectUtil');
		var obj=projectUtil({schema:{projection: {name:0}}},{password:0});
		expect(obj).to.have.property('name',0);
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should work with projection param if projection not defined in the model',function (done) {
		var projectUtil=require('../../app/db/mongodb/utils/projectUtil');
		var obj=projectUtil({schema:{}},{password:0});
		expect(obj).to.have.property('password',0);
		done();
	});
});