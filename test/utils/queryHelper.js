var expect= require('chai').expect;
var ObjectID = require('mongodb').ObjectID;

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

	it('Should return _id as an number if _id is passed as a number to the function',function (done) {
		var queryHelper=require('../../app/db/mongodb/core/utils/queryHelper');
		var idObj=queryHelper._id(1);
		expect(idObj).to.have.property('_id');
		expect(idObj._id).to.have.equal(1);
		done();
	});

	it('Should return _id as an number if _id is passed as a number within an object to the function',function (done) {
		var queryHelper=require('../../app/db/mongodb/core/utils/queryHelper');
		var idObj=queryHelper._id({_id:1});
		expect(idObj).to.have.property('_id');
		expect(idObj._id).to.have.equal(1);
		done();
	});

	it('Should return _id as an ObjectId if _id is passed as a object with property _id to the function',function (done) {
		var queryHelper=require('../../app/db/mongodb/core/utils/queryHelper');
		var idObj=queryHelper._id({_id:'507f1f77bcf86cd799439011'});
		expect(idObj).to.have.property('_id');
		expect(idObj._id.toHexString()).to.have.equal('507f1f77bcf86cd799439011');
		done();
	});

	//Test for toObjectId

	it('Should return ObjectId for string id inputs',function (done) {
		var queryHelper=require('../../app/db/mongodb/core/utils/queryHelper');
		var objectId=queryHelper.toObjectId('507f1f77bcf86cd799439011');
		var nuemralId=queryHelper.toObjectId(2);
		var stringId=queryHelper.toObjectId('2');
		expect(objectId.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(nuemralId).to.equal(2);
		expect(stringId).to.equal('2');
		done();
	});

	//Test for toStringId

	it('Should return string id for ObjectId inputs',function (done) {
		var queryHelper=require('../../app/db/mongodb/core/utils/queryHelper');
		var objectId=queryHelper.toStringId(ObjectID('507f1f77bcf86cd799439011'));
		var nuemralId=queryHelper.toStringId(2);
		var stringId=queryHelper.toStringId('2');
		expect(objectId).to.equal('507f1f77bcf86cd799439011');
		expect(nuemralId).to.equal(2);
		expect(stringId).to.equal('2');
		done();
	});
});