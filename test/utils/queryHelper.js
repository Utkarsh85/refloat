var expect= require('chai').expect;

describe('Testing queryHelper library',function () {

	it('Should return _id as an ObjectId if _id is passed as a string to the function',function (done) {
		var queryHelper=require('../../app/db/mongodb/core/utils/queryHelper');
		var idObj=queryHelper._id('507f1f77bcf86cd799439011');
		expect(idObj).to.have.property('_id');
		expect(idObj._id.toHexString()).to.have.equal('507f1f77bcf86cd799439011');
		done();
	});

	it('Should return _id as an string if _id is passed as a string to the function',function (done) {
		var queryHelper=require('../../app/db/mongodb/core/utils/queryHelper');
		var idObj=queryHelper._id('1');
		expect(idObj).to.have.property('_id');
		expect(idObj._id).to.have.equal('1');
		done();
	});

	it('Should return _id as an ObjectId if _id is passed as a object with property _id to the function',function (done) {
		var queryHelper=require('../../app/db/mongodb/core/utils/queryHelper');
		var idObj=queryHelper._id({_id:'507f1f77bcf86cd799439011'});
		expect(idObj).to.have.property('_id');
		expect(idObj._id.toHexString()).to.have.equal('507f1f77bcf86cd799439011');
		done();
	});
});