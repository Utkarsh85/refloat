var clearRequire = require('clear-require');
var expect= require('chai').expect;
var ObjectID = require('mongodb').ObjectID;

describe('Testing id2_id library',function () {

	it('Should return _id in place of id',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:'507f1f77bcf86cd799439011',password:0});
		expect(obj).to.have.property('_id');
		expect(obj._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj).to.have.property('password',0);
		done();
	});

	it('Should work with references too',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc({id:'507f1f77bcf86cd799439011',user:'507f1f77bcf86cd799439011',password:'507f1f77bcf86cd799439011'});
		expect(obj).to.have.property('_id');
		expect(obj._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj).to.have.property('user');
		expect(obj.user.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj).to.have.property('password','507f1f77bcf86cd799439011');
		done();
	});

	it('Should work when obj is null',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc(null);
		expect(obj).to.equal(null);
		done();
	});

	it('Should work for arrays too',function (done) {
		var id2_id=require('../../app/db/mongodb/utils/id2_id');
		var id2_idFunc=id2_id({schema:{reference: {user:{model:'User'}}}});
		var obj= id2_idFunc([{id:'507f1f77bcf86cd799439011',password:0},{id:'507f1f77bcf86cd799439011',password:0}]);
		expect(obj[0]).to.have.property('_id');
		expect(obj[0]._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj[0]).to.have.property('password',0);
		expect(obj[1]).to.have.property('_id');
		expect(obj[1]._id.toHexString()).to.equal('507f1f77bcf86cd799439011');
		expect(obj[1]).to.have.property('password',0);
		done();
	});
});