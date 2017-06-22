var clearRequire = require('clear-require');
var expect= require('chai').expect;

describe('Testing autoUpdatedAt library',function () {

	it('Should add autoUpdatedAt if no autoUpdatedAt flag exist',function (done) {
		var autoUpdatedAt=require('../../app/db/mongodb/utils/autoUpdatedAt');
		var func=autoUpdatedAt({schema:{}});
		var obj=func({a:1});
		expect(obj).to.have.property('updatedAt');
		done();
	});

	it('Should add autoUpdatedAt if autoUpdatedAt flag is true',function (done) {
		var autoUpdatedAt=require('../../app/db/mongodb/utils/autoUpdatedAt');
		var func=autoUpdatedAt({schema:{autoUpdatedAt: true}});
		var obj=func({a:1});
		expect(obj).to.have.property('updatedAt');
		done();
	});

	it('Should not add autoUpdatedAt if autoUpdatedAt flag is false',function (done) {
		var autoUpdatedAt=require('../../app/db/mongodb/utils/autoUpdatedAt');
		var func=autoUpdatedAt({schema:{autoUpdatedAt: false}});
		var obj=func({a:1});
		expect(obj).to.not.have.property('updatedAt');
		done();
	});
})