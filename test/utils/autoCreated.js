var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing autoCreatedAt library',function () {

	it('Should add autoCreatedAt if no autoCreatedAt flag exist',function (done) {
		var autoCreatedAt=require('../../app/db/mongodb/utils/autoCreatedAt');
		var func=autoCreatedAt({schema:{}});
		var obj=func({a:1});
		expect(obj).to.have.property('createdAt');
		done();
	});

	it('Should add autoCreatedAt if autoCreatedAt flag is true',function (done) {
		var autoCreatedAt=require('../../app/db/mongodb/utils/autoCreatedAt');
		var func=autoCreatedAt({schema:{autoCreatedAt: true}});
		var obj=func({a:1});
		expect(obj).to.have.property('createdAt');
		done();
	});

	it('Should not add autoCreatedAt if autoCreatedAt flag is false',function (done) {
		var autoCreatedAt=require('../../app/db/mongodb/utils/autoCreatedAt');
		var func=autoCreatedAt({schema:{autoCreatedAt: false}});
		var obj=func({a:1});
		expect(obj).to.not.have.property('createdAt');
		done();
	});
})